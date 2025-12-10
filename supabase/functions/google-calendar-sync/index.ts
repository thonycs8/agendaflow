import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { action, userId, appointmentId, eventData } = await req.json();

    // Get user's Google Calendar integration
    const { data: integration } = await supabase
      .from("calendar_integrations")
      .select("*")
      .eq("user_id", userId)
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
      const refreshResponse = await fetch(`${SUPABASE_URL}/functions/v1/google-calendar-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refreshToken", userId }),
      });
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

      // Store the Google event ID with the appointment
      if (appointmentId) {
        await supabase
          .from("appointments")
          .update({ google_event_id: event.id })
          .eq("id", appointmentId);
      }

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
        return await fetch(req.url, {
          method: "POST",
          headers: req.headers,
          body: JSON.stringify({ ...await req.json(), action: "create" }),
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
