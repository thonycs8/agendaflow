import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate the user from JWT token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization header required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a client with the user's token to validate their identity
    const userClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use the authenticated user's ID instead of trusting the request body
    const authenticatedUserId = user.id;

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { action, appointmentId, eventData } = await req.json();

    console.log(`[google-calendar-sync] Action: ${action}, User: ${authenticatedUserId}`);

    // Get user's Google Calendar integration
    const { data: integration } = await supabase
      .from("calendar_integrations")
      .select("*")
      .eq("user_id", authenticatedUserId)
      .eq("provider", "google")
      .single();

    if (!integration) {
      return new Response(JSON.stringify({ error: "No Google Calendar integration found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if token needs refresh
    let accessToken = integration.access_token;
    if (new Date(integration.expires_at) < new Date()) {
      console.log(`[google-calendar-sync] Token expired, refreshing...`);
      
      // Call google-calendar-auth to refresh token
      const refreshResponse = await fetch(`${SUPABASE_URL}/functions/v1/google-calendar-auth`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": authHeader,
        },
        body: JSON.stringify({ action: "refreshToken" }),
      });
      
      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh token");
      }
      
      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;
    }

    const calendarId = "primary";
    const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

    if (action === "create") {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: eventData.title,
          description: eventData.description,
          start: { dateTime: eventData.startTime, timeZone: "Europe/Lisbon" },
          end: { dateTime: eventData.endTime, timeZone: "Europe/Lisbon" },
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 1440 },
              { method: "popup", minutes: 30 },
            ],
          },
        }),
      });

      const event = await response.json();

      if (event.error) {
        console.error("Google Calendar API error:", event.error);
        throw new Error(event.error.message || "Failed to create calendar event");
      }

      // Store the Google event ID with the appointment
      if (appointmentId) {
        await supabase
          .from("appointments")
          .update({ google_event_id: event.id })
          .eq("id", appointmentId);
      }

      console.log(`[google-calendar-sync] Created event: ${event.id}`);

      return new Response(JSON.stringify({ success: true, eventId: event.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      const { data: appointment } = await supabase
        .from("appointments")
        .select("google_event_id")
        .eq("id", appointmentId)
        .single();

      if (!appointment?.google_event_id) {
        // If no Google event exists, create one
        console.log(`[google-calendar-sync] No existing event, creating new one`);
        const createResponse = await fetch(baseUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: eventData.title,
            description: eventData.description,
            start: { dateTime: eventData.startTime, timeZone: "Europe/Lisbon" },
            end: { dateTime: eventData.endTime, timeZone: "Europe/Lisbon" },
          }),
        });

        const event = await createResponse.json();
        
        if (appointmentId && event.id) {
          await supabase
            .from("appointments")
            .update({ google_event_id: event.id })
            .eq("id", appointmentId);
        }

        return new Response(JSON.stringify({ success: true, eventId: event.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await fetch(`${baseUrl}/${appointment.google_event_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: eventData.title,
          description: eventData.description,
          start: { dateTime: eventData.startTime, timeZone: "Europe/Lisbon" },
          end: { dateTime: eventData.endTime, timeZone: "Europe/Lisbon" },
        }),
      });

      console.log(`[google-calendar-sync] Updated event: ${appointment.google_event_id}`);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const { data: appointment } = await supabase
        .from("appointments")
        .select("google_event_id")
        .eq("id", appointmentId)
        .single();

      if (appointment?.google_event_id) {
        await fetch(`${baseUrl}/${appointment.google_event_id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log(`[google-calendar-sync] Deleted event: ${appointment.google_event_id}`);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list") {
      const timeMin = eventData?.timeMin || new Date().toISOString();
      const timeMax = eventData?.timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const response = await fetch(
        `${baseUrl}?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const events = await response.json();

      console.log(`[google-calendar-sync] Listed ${events.items?.length || 0} events`);

      return new Response(JSON.stringify({ events: events.items || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
