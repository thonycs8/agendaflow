import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface EventData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export function useCalendarSync() {
  const { user } = useAuth();

  const syncToGoogleCalendar = useCallback(
    async (action: "create" | "update" | "delete", appointmentId: string, eventData?: EventData) => {
      if (!user) return;

      try {
        const { data: integration } = await supabase
          .from("calendar_integrations")
          .select("*")
          .eq("user_id", user.id)
          .eq("provider", "google")
          .maybeSingle();

        if (!integration) {
          // User doesn't have Google Calendar connected, skip sync
          return;
        }

        const { error } = await supabase.functions.invoke("google-calendar-sync", {
          body: {
            action,
            userId: user.id,
            appointmentId,
            eventData,
          },
        });

        if (error) {
          console.error("Google Calendar sync error:", error);
          // Don't show error toast for sync failures - it's a background operation
        }
      } catch (error) {
        console.error("Calendar sync error:", error);
      }
    },
    [user]
  );

  const createAppointmentWithSync = useCallback(
    async (appointmentData: {
      business_id: string;
      professional_id?: string;
      client_id: string;
      service_id?: string;
      appointment_date: string;
      duration_minutes: number;
      notes?: string;
      serviceName?: string;
      clientName?: string;
    }) => {
      const { serviceName, clientName, ...dbData } = appointmentData;

      const { data, error } = await supabase
        .from("appointments")
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;

      // Sync to Google Calendar
      const endTime = new Date(new Date(appointmentData.appointment_date).getTime() + appointmentData.duration_minutes * 60000);
      
      await syncToGoogleCalendar("create", data.id, {
        title: serviceName || "Agendamento",
        description: `Cliente: ${clientName || "N/A"}\n${appointmentData.notes || ""}`,
        startTime: appointmentData.appointment_date,
        endTime: endTime.toISOString(),
      });

      return data;
    },
    [syncToGoogleCalendar]
  );

  const updateAppointmentWithSync = useCallback(
    async (
      appointmentId: string,
      updates: {
        appointment_date?: string;
        duration_minutes?: number;
        status?: "pending" | "confirmed" | "completed" | "cancelled";
        notes?: string;
      },
      eventData?: EventData
    ) => {
      const { error } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", appointmentId);

      if (error) throw error;

      if (eventData) {
        await syncToGoogleCalendar("update", appointmentId, eventData);
      }
    },
    [syncToGoogleCalendar]
  );

  const cancelAppointmentWithSync = useCallback(
    async (appointmentId: string) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);

      if (error) throw error;

      await syncToGoogleCalendar("delete", appointmentId);
    },
    [syncToGoogleCalendar]
  );

  return {
    syncToGoogleCalendar,
    createAppointmentWithSync,
    updateAppointmentWithSync,
    cancelAppointmentWithSync,
  };
}
