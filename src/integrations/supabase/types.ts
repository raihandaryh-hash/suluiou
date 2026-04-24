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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      assessment_results: {
        Row: {
          all_matches: Json
          aspiration: string | null
          class_id: string | null
          completed_at: string | null
          family_background: string | null
          follow_up_status: string
          guest_identifier: string | null
          id: string
          layer1_text: string | null
          lead_score: number
          lm_id: string | null
          lm_name: string | null
          match_percentage: number
          notes: string | null
          projection: string | null
          province: string | null
          school_name: string | null
          scores: Json
          student_class: string | null
          student_email: string | null
          student_name: string | null
          student_phone: string | null
          student_province: string | null
          submitted_at: string
          top_pathway_id: string
          top_pathway_name: string
          user_id: string | null
        }
        Insert: {
          all_matches: Json
          aspiration?: string | null
          class_id?: string | null
          completed_at?: string | null
          family_background?: string | null
          follow_up_status?: string
          guest_identifier?: string | null
          id?: string
          layer1_text?: string | null
          lead_score?: number
          lm_id?: string | null
          lm_name?: string | null
          match_percentage: number
          notes?: string | null
          projection?: string | null
          province?: string | null
          school_name?: string | null
          scores: Json
          student_class?: string | null
          student_email?: string | null
          student_name?: string | null
          student_phone?: string | null
          student_province?: string | null
          submitted_at?: string
          top_pathway_id: string
          top_pathway_name: string
          user_id?: string | null
        }
        Update: {
          all_matches?: Json
          aspiration?: string | null
          class_id?: string | null
          completed_at?: string | null
          family_background?: string | null
          follow_up_status?: string
          guest_identifier?: string | null
          id?: string
          layer1_text?: string | null
          lead_score?: number
          lm_id?: string | null
          lm_name?: string | null
          match_percentage?: number
          notes?: string | null
          projection?: string | null
          province?: string | null
          school_name?: string | null
          scores?: Json
          student_class?: string | null
          student_email?: string | null
          student_name?: string | null
          student_phone?: string | null
          student_province?: string | null
          submitted_at?: string
          top_pathway_id?: string
          top_pathway_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_enrollments: {
        Row: {
          class_id: string
          enrolled_at: string
          guest_identifier: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          class_id: string
          enrolled_at?: string
          guest_identifier?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          class_id?: string
          enrolled_at?: string
          guest_identifier?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_insights: {
        Row: {
          class_id: string
          generated_at: string
          insight_text: string
        }
        Insert: {
          class_id: string
          generated_at?: string
          insight_text: string
        }
        Update: {
          class_id?: string
          generated_at?: string
          insight_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_insights_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: true
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          join_code: string
          name: string
          school_name: string | null
          session_closed: boolean
          session_closed_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          join_code: string
          name: string
          school_name?: string | null
          session_closed?: boolean
          session_closed_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          join_code?: string
          name?: string
          school_name?: string | null
          session_closed?: boolean
          session_closed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      province_contexts: {
        Row: {
          created_at: string | null
          economic_sectors: string[] | null
          id: string
          narrative_hooks: string[] | null
          opportunities_2030: string | null
          province: string
          social_context: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          economic_sectors?: string[] | null
          id?: string
          narrative_hooks?: string[] | null
          opportunities_2030?: string | null
          province: string
          social_context?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          economic_sectors?: string[] | null
          id?: string
          narrative_hooks?: string[] | null
          opportunities_2030?: string | null
          province?: string
          social_context?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
