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
          is_super_admin: boolean
        }
        Insert: {
          created_at?: string
          email: string
          is_super_admin?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          is_super_admin?: boolean
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          props: Json | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          props?: Json | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          props?: Json | null
          session_id?: string | null
        }
        Relationships: []
      }
      assessment_progress: {
        Row: {
          class_id: string | null
          completed_at: string | null
          consent_given: boolean
          guest_identifier: string | null
          hexaco_answers: Json
          hexaco_index: number
          id: string
          sds_answers: Json
          sds_section: number
          stage: string
          started_at: string
          student_profile: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          class_id?: string | null
          completed_at?: string | null
          consent_given?: boolean
          guest_identifier?: string | null
          hexaco_answers?: Json
          hexaco_index?: number
          id?: string
          sds_answers?: Json
          sds_section?: number
          stage?: string
          started_at?: string
          student_profile?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          class_id?: string | null
          completed_at?: string | null
          consent_given?: boolean
          guest_identifier?: string | null
          hexaco_answers?: Json
          hexaco_index?: number
          id?: string
          sds_answers?: Json
          sds_section?: number
          stage?: string
          started_at?: string
          student_profile?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_progress_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_results: {
        Row: {
          all_matches: Json
          aspiration: string | null
          class_id: string | null
          completed_at: string | null
          email_requested: boolean
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
          parent_consent: boolean
          parent_name: string | null
          parent_phone: string | null
          projection: string | null
          province: string | null
          school_name: string | null
          scores: Json
          selected_pathways: Json | null
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
          email_requested?: boolean
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
          parent_consent?: boolean
          parent_name?: string | null
          parent_phone?: string | null
          projection?: string | null
          province?: string | null
          school_name?: string | null
          scores: Json
          selected_pathways?: Json | null
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
          email_requested?: boolean
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
          parent_consent?: boolean
          parent_name?: string | null
          parent_phone?: string | null
          projection?: string | null
          province?: string | null
          school_name?: string | null
          scores?: Json
          selected_pathways?: Json | null
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
      bridge_requests: {
        Row: {
          created_at: string
          id: string
          matched_lm_id: string | null
          province: string | null
          question_text: string
          role_text: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          matched_lm_id?: string | null
          province?: string | null
          question_text: string
          role_text: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          matched_lm_id?: string | null
          province?: string | null
          question_text?: string
          role_text?: string
          status?: string
          user_id?: string
        }
        Relationships: []
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
      kenali_dirimu_sessions: {
        Row: {
          ai_narrative: string | null
          completed: boolean
          created_at: string
          id: string
          odyssey_plans: Json | null
          possible_selves: Json | null
          session_id: string
          updated_at: string
          values_sorted: string[] | null
          wa_number: string | null
        }
        Insert: {
          ai_narrative?: string | null
          completed?: boolean
          created_at?: string
          id?: string
          odyssey_plans?: Json | null
          possible_selves?: Json | null
          session_id: string
          updated_at?: string
          values_sorted?: string[] | null
          wa_number?: string | null
        }
        Update: {
          ai_narrative?: string | null
          completed?: boolean
          created_at?: string
          id?: string
          odyssey_plans?: Json | null
          possible_selves?: Json | null
          session_id?: string
          updated_at?: string
          values_sorted?: string[] | null
          wa_number?: string | null
        }
        Relationships: []
      }
      lm_narasumber: {
        Row: {
          aktif: boolean
          created_at: string
          id: string
          nama: string
          profesi: string
          provinsi: string | null
          wa_contact: string
        }
        Insert: {
          aktif?: boolean
          created_at?: string
          id?: string
          nama: string
          profesi: string
          provinsi?: string | null
          wa_contact: string
        }
        Update: {
          aktif?: boolean
          created_at?: string
          id?: string
          nama?: string
          profesi?: string
          provinsi?: string | null
          wa_contact?: string
        }
        Relationships: []
      }
      phase_2a_inventory: {
        Row: {
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      phase_2b_skills: {
        Row: {
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      phase_3_jalan_bakti: {
        Row: {
          created_at: string
          data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      phase_4_sintesis: {
        Row: {
          data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      phase_5_action_plan: {
        Row: {
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
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
          data_verified: boolean
          data_year: number | null
          economic_sectors: string[] | null
          fardhu_kifayah_gaps: string[] | null
          id: string
          iou_program_relevance: string | null
          key_questions: string[] | null
          narrative_hooks: string[] | null
          opportunities_2030: string | null
          primary_sources: string[] | null
          province: string
          social_context: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_verified?: boolean
          data_year?: number | null
          economic_sectors?: string[] | null
          fardhu_kifayah_gaps?: string[] | null
          id?: string
          iou_program_relevance?: string | null
          key_questions?: string[] | null
          narrative_hooks?: string[] | null
          opportunities_2030?: string | null
          primary_sources?: string[] | null
          province: string
          social_context?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_verified?: boolean
          data_year?: number | null
          economic_sectors?: string[] | null
          fardhu_kifayah_gaps?: string[] | null
          id?: string
          iou_program_relevance?: string | null
          key_questions?: string[] | null
          narrative_hooks?: string[] | null
          opportunities_2030?: string | null
          primary_sources?: string[] | null
          province?: string
          social_context?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: Json
          slug: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content: Json
          slug: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          slug?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      sulu_alarm_laju: {
        Row: {
          aksi: string
          dicatat_pada: string
          id: number
          jendela: string
          jumlah: number
        }
        Insert: {
          aksi: string
          dicatat_pada?: string
          id?: number
          jendela: string
          jumlah: number
        }
        Update: {
          aksi?: string
          dicatat_pada?: string
          id?: number
          jendela?: string
          jumlah?: number
        }
        Relationships: []
      }
      sulu_batas_laju: {
        Row: {
          aksi: string
          jendela: string
          jumlah: number
          kunci: string
        }
        Insert: {
          aksi: string
          jendela: string
          jumlah?: number
          kunci: string
        }
        Update: {
          aksi?: string
          jendela?: string
          jumlah?: number
          kunci?: string
        }
        Relationships: []
      }
      sulu_hitung_kelas: {
        Row: {
          class_id: string
          jenis: string
          jumlah: number
          tanggal: string
        }
        Insert: {
          class_id: string
          jenis: string
          jumlah?: number
          tanggal: string
        }
        Update: {
          class_id?: string
          jenis?: string
          jumlah?: number
          tanggal?: string
        }
        Relationships: [
          {
            foreignKeyName: "sulu_hitung_kelas_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      sulu_ip_mitra: {
        Row: {
          catatan: string | null
          ip: string
          pengali: number
        }
        Insert: {
          catatan?: string | null
          ip: string
          pengali?: number
        }
        Update: {
          catatan?: string | null
          ip?: string
          pengali?: number
        }
        Relationships: []
      }
      sulu_izin: {
        Row: {
          diberikan_pada: string
          dicabut_pada: string | null
          id: string
          menyatakan_18_plus: boolean
          pemberi: string
          result_id: string
          teks_versi: string
          tujuan: string
          user_id: string | null
        }
        Insert: {
          diberikan_pada?: string
          dicabut_pada?: string | null
          id?: string
          menyatakan_18_plus?: boolean
          pemberi: string
          result_id: string
          teks_versi: string
          tujuan: string
          user_id?: string | null
        }
        Update: {
          diberikan_pada?: string
          dicabut_pada?: string | null
          id?: string
          menyatakan_18_plus?: boolean
          pemberi?: string
          result_id?: string
          teks_versi?: string
          tujuan?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sulu_izin_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "assessment_results"
            referencedColumns: ["id"]
          },
        ]
      }
      sulu_pengaturan: {
        Row: {
          kunci: string
          nilai: string | null
        }
        Insert: {
          kunci: string
          nilai?: string | null
        }
        Update: {
          kunci?: string
          nilai?: string | null
        }
        Relationships: []
      }
      sulu_permintaan_buka_kunci: {
        Row: {
          dibuat_pada: string
          ditangani_oleh: string | null
          ditangani_pada: string | null
          id: string
          user_id: string
        }
        Insert: {
          dibuat_pada?: string
          ditangani_oleh?: string | null
          ditangani_pada?: string | null
          id?: string
          user_id: string
        }
        Update: {
          dibuat_pada?: string
          ditangani_oleh?: string | null
          ditangani_pada?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      sulu_peserta: {
        Row: {
          class_id: string
          diaktifkan_pada: string | null
          dibuat_pada: string
          dicabut_pada: string | null
          dicatat_oleh: string
          id: string
          izin_asesmen_ai: boolean
          izin_dihubungi_kuliah: boolean
          izin_hasil_untuk_tawaran: boolean
          kode_hmac: string
          kunci_versi: number
          nama_orang_tua: string
          nama_panggilan: string
          pin_hmac: string | null
          pin_salah: number
          tanggal_formulir: string
          user_id_aktif: string | null
        }
        Insert: {
          class_id: string
          diaktifkan_pada?: string | null
          dibuat_pada?: string
          dicabut_pada?: string | null
          dicatat_oleh: string
          id?: string
          izin_asesmen_ai?: boolean
          izin_dihubungi_kuliah?: boolean
          izin_hasil_untuk_tawaran?: boolean
          kode_hmac: string
          kunci_versi?: number
          nama_orang_tua: string
          nama_panggilan: string
          pin_hmac?: string | null
          pin_salah?: number
          tanggal_formulir: string
          user_id_aktif?: string | null
        }
        Update: {
          class_id?: string
          diaktifkan_pada?: string | null
          dibuat_pada?: string
          dicabut_pada?: string | null
          dicatat_oleh?: string
          id?: string
          izin_asesmen_ai?: boolean
          izin_dihubungi_kuliah?: boolean
          izin_hasil_untuk_tawaran?: boolean
          kode_hmac?: string
          kunci_versi?: number
          nama_orang_tua?: string
          nama_panggilan?: string
          pin_hmac?: string | null
          pin_salah?: number
          tanggal_formulir?: string
          user_id_aktif?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sulu_peserta_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      sulu_token_peserta: {
        Row: {
          berlaku_sampai: string
          peserta_id: string
          sidik: string
        }
        Insert: {
          berlaku_sampai: string
          peserta_id: string
          sidik: string
        }
        Update: {
          berlaku_sampai?: string
          peserta_id?: string
          sidik?: string
        }
        Relationships: [
          {
            foreignKeyName: "sulu_token_peserta_peserta_id_fkey"
            columns: ["peserta_id"]
            isOneToOne: false
            referencedRelation: "sulu_peserta"
            referencedColumns: ["id"]
          },
        ]
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
      waitlist_sulu: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          persona: string | null
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          persona?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          persona?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      boleh_simpan: { Args: { p_uid: string }; Returns: boolean }
      cari_kelas_dari_kode: {
        Args: { p_kode: string }
        Returns: {
          id: string
          name: string
          school_name: string
          session_closed: boolean
        }[]
      }
      get_public_result: {
        Args: { result_id: string }
        Returns: {
          all_matches: Json
          id: string
          layer1_text: string
          match_percentage: number
          scores: Json
          selected_pathways: Json
          student_name: string
          submitted_at: string
          top_pathway_id: string
          top_pathway_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      izin_peserta_aktif: { Args: { p_peserta: string }; Returns: boolean }
      sulu_bersihkan_laju: { Args: never; Returns: undefined }
      sulu_boleh_tanya: { Args: { p_uid: string }; Returns: boolean }
      sulu_catat_peristiwa: {
        Args: { p_nama: string; p_props: Json; p_sesi: string }
        Returns: undefined
      }
      sulu_daftar_tunggu: {
        Args: {
          p_email: string
          p_nama: string
          p_persona: string
          p_whatsapp: string
        }
        Returns: undefined
      }
      sulu_dewasa: { Args: { p_uid: string }; Returns: boolean }
      sulu_hapus_data_anak_lama: { Args: never; Returns: number }
      sulu_hapus_data_sendiri: { Args: never; Returns: undefined }
      sulu_hitung_laju: {
        Args: { p_aksi: string; p_batas: number; p_kunci: string }
        Returns: boolean
      }
      sulu_hitung_skor: {
        Args: { r: Database["public"]["Tables"]["assessment_results"]["Row"] }
        Returns: number
      }
      sulu_ip_pemanggil: { Args: never; Returns: string }
      sulu_isi_kontak: {
        Args: {
          p_hp: string
          p_kelas: string
          p_minta_surel?: boolean
          p_nama: string
          p_provinsi: string
          p_result_id: string
          p_sekolah: string
          p_surel: string
        }
        Returns: boolean
      }
      sulu_kode_acak: { Args: { p_panjang: number }; Returns: string }
      sulu_kode_kelas_baru: { Args: never; Returns: string }
      sulu_laju_ok: {
        Args: { p_aksi: string; p_batas_ip: number; p_tambahan?: string }
        Returns: boolean
      }
      sulu_laju_ok_ip: {
        Args: {
          p_aksi: string
          p_batas_ip: number
          p_ip: string
          p_tambahan?: string
        }
        Returns: boolean
      }
      sulu_naikkan_hitung: {
        Args: { p_class: string; p_jenis: string }
        Returns: undefined
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
