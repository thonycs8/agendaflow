export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          business_id: string
          client_id: string
          created_at: string | null
          duration_minutes: number
          id: string
          notes: string | null
          payment_amount: number | null
          payment_method: string | null
          payment_status: string | null
          professional_id: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["appointment_status"] | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          business_id: string
          client_id: string
          created_at?: string | null
          duration_minutes: number
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          professional_id?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          business_id?: string
          client_id?: string
          created_at?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          professional_id?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_features: {
        Row: {
          business_id: string
          can_create_memberships: boolean | null
          can_create_promotions: boolean | null
          can_customize_branding: boolean | null
          can_export_reports: boolean | null
          can_manage_finances: boolean | null
          can_use_analytics: boolean | null
          can_use_api: boolean | null
          created_at: string | null
          custom_features: Json | null
          id: string
          max_professionals: number | null
          max_services: number | null
          plan_tier: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          can_create_memberships?: boolean | null
          can_create_promotions?: boolean | null
          can_customize_branding?: boolean | null
          can_export_reports?: boolean | null
          can_manage_finances?: boolean | null
          can_use_analytics?: boolean | null
          can_use_api?: boolean | null
          created_at?: string | null
          custom_features?: Json | null
          id?: string
          max_professionals?: number | null
          max_services?: number | null
          plan_tier?: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          can_create_memberships?: boolean | null
          can_create_promotions?: boolean | null
          can_customize_branding?: boolean | null
          can_export_reports?: boolean | null
          can_manage_finances?: boolean | null
          can_use_analytics?: boolean | null
          can_use_api?: boolean | null
          created_at?: string | null
          custom_features?: Json | null
          id?: string
          max_professionals?: number | null
          max_services?: number | null
          plan_tier?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_features_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_settings: {
        Row: {
          advance_booking_days: number | null
          booking_buffer_minutes: number | null
          business_id: string
          cancellation_hours: number | null
          created_at: string | null
          default_service_duration: number | null
          holidays: Json | null
          id: string
          opening_hours: Json | null
          updated_at: string | null
        }
        Insert: {
          advance_booking_days?: number | null
          booking_buffer_minutes?: number | null
          business_id: string
          cancellation_hours?: number | null
          created_at?: string | null
          default_service_duration?: number | null
          holidays?: Json | null
          id?: string
          opening_hours?: Json | null
          updated_at?: string | null
        }
        Update: {
          advance_booking_days?: number | null
          booking_buffer_minutes?: number | null
          business_id?: string
          cancellation_hours?: number | null
          created_at?: string | null
          default_service_duration?: number | null
          holidays?: Json | null
          id?: string
          opening_hours?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          category: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          owner_id: string
          phone: string | null
          rating: number | null
          show_membership_banner: boolean | null
          show_membership_plans: boolean | null
          show_promotions_banner: boolean | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          owner_id: string
          phone?: string | null
          rating?: number | null
          show_membership_banner?: boolean | null
          show_membership_plans?: boolean | null
          show_promotions_banner?: boolean | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          rating?: number | null
          show_membership_banner?: boolean | null
          show_membership_plans?: boolean | null
          show_promotions_banner?: boolean | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      client_memberships: {
        Row: {
          business_id: string
          client_id: string
          created_at: string | null
          end_date: string
          id: string
          max_usage: number | null
          plan_id: string | null
          start_date: string
          status: string | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          business_id: string
          client_id: string
          created_at?: string | null
          end_date: string
          id?: string
          max_usage?: number | null
          plan_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          business_id?: string
          client_id?: string
          created_at?: string | null
          end_date?: string
          id?: string
          max_usage?: number | null
          plan_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_memberships_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_memberships_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          appointment_id: string | null
          business_id: string
          category: string
          created_at: string | null
          description: string | null
          id: string
          professional_id: string | null
          transaction_date: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          business_id: string
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          professional_id?: string | null
          transaction_date?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          business_id?: string
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          professional_id?: string | null
          transaction_date?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          business_id: string
          created_at: string | null
          description: string | null
          duration_days: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          services_included: Json
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          services_included?: Json
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          services_included?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_plans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      ownership_transfers: {
        Row: {
          approved_by: string | null
          business_id: string
          completed_at: string | null
          current_owner_id: string
          id: string
          new_owner_id: string
          notes: string | null
          requested_at: string
          status: string
        }
        Insert: {
          approved_by?: string | null
          business_id: string
          completed_at?: string | null
          current_owner_id: string
          id?: string
          new_owner_id: string
          notes?: string | null
          requested_at?: string
          status?: string
        }
        Update: {
          approved_by?: string | null
          business_id?: string
          completed_at?: string | null
          current_owner_id?: string
          id?: string
          new_owner_id?: string
          notes?: string | null
          requested_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ownership_transfers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_approvals: {
        Row: {
          approval_type: string
          business_id: string | null
          id: string
          metadata: Json | null
          notes: string | null
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          approval_type: string
          business_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          approval_type?: string
          business_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pending_approvals_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          avatar_url: string | null
          bio: string | null
          business_id: string
          commission_percentage: number | null
          created_at: string | null
          created_by_id: string | null
          employment_type: string | null
          fixed_salary: number | null
          id: string
          is_active: boolean | null
          monthly_rent: number | null
          name: string
          promotion_active: boolean | null
          promotion_description: string | null
          promotion_discount: number | null
          promotion_end_date: string | null
          promotion_start_date: string | null
          promotion_title: string | null
          rating: number | null
          specialties: string[] | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          business_id: string
          commission_percentage?: number | null
          created_at?: string | null
          created_by_id?: string | null
          employment_type?: string | null
          fixed_salary?: number | null
          id?: string
          is_active?: boolean | null
          monthly_rent?: number | null
          name: string
          promotion_active?: boolean | null
          promotion_description?: string | null
          promotion_discount?: number | null
          promotion_end_date?: string | null
          promotion_start_date?: string | null
          promotion_title?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          business_id?: string
          commission_percentage?: number | null
          created_at?: string | null
          created_by_id?: string | null
          employment_type?: string | null
          fixed_salary?: number | null
          id?: string
          is_active?: boolean | null
          monthly_rent?: number | null
          name?: string
          promotion_active?: boolean | null
          promotion_description?: string | null
          promotion_discount?: number | null
          promotion_end_date?: string | null
          promotion_start_date?: string | null
          promotion_title?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          appointment_id: string | null
          business_id: string | null
          client_id: string
          comment: string | null
          created_at: string | null
          id: string
          professional_id: string | null
          rating: number
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          business_id?: string | null
          client_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          professional_id?: string | null
          rating: number
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          business_id?: string | null
          client_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          professional_id?: string | null
          rating?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_blocks: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          professional_id: string
          reason: string | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          professional_id: string
          reason?: string | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          professional_id?: string
          reason?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_blocks_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          business_id: string
          created_at: string | null
          created_by_id: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          created_by_id?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          created_by_id?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          business_id: string
          created_at: string | null
          end_date: string | null
          id: string
          max_professionals: number
          plan: Database["public"]["Enums"]["subscription_plan"]
          start_date: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          max_professionals: number
          plan: Database["public"]["Enums"]["subscription_plan"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          max_professionals?: number
          plan?: Database["public"]["Enums"]["subscription_plan"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "business_owner" | "professional" | "client"
      appointment_status: "pending" | "confirmed" | "completed" | "cancelled"
      subscription_plan: "starter" | "professional" | "business"
      subscription_status: "active" | "cancelled" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "business_owner", "professional", "client"],
      appointment_status: ["pending", "confirmed", "completed", "cancelled"],
      subscription_plan: ["starter", "professional", "business"],
      subscription_status: ["active", "cancelled", "expired"],
    },
  },
} as const
