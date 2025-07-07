export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      daily_progress: {
        Row: {
          badge_claimed: boolean
          created_at: string
          current_streak: number
          id: string
          last_completion_date: string | null
          project_id: string
          total_completions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          badge_claimed?: boolean
          created_at?: string
          current_streak?: number
          id?: string
          last_completion_date?: string | null
          project_id: string
          total_completions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          badge_claimed?: boolean
          created_at?: string
          current_streak?: number
          id?: string
          last_completion_date?: string | null
          project_id?: string
          total_completions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          project_id: string
          streak_count: number
          task_type: string
          user_id: string
          verification_data: Json | null
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          project_id: string
          streak_count?: number
          task_type: string
          user_id: string
          verification_data?: Json | null
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          project_id?: string
          streak_count?: number
          task_type?: string
          user_id?: string
          verification_data?: Json | null
        }
        Relationships: []
      }
      proposals_draft: {
        Row: {
          created_at: string
          creator: string
          description: string
          id: string
          media_url: string | null
          status: string
          title: string
          updated_at: string
          voting_end_time: string | null
          voting_start_time: string | null
        }
        Insert: {
          created_at?: string
          creator: string
          description: string
          id?: string
          media_url?: string | null
          status?: string
          title: string
          updated_at?: string
          voting_end_time?: string | null
          voting_start_time?: string | null
        }
        Update: {
          created_at?: string
          creator?: string
          description?: string
          id?: string
          media_url?: string | null
          status?: string
          title?: string
          updated_at?: string
          voting_end_time?: string | null
          voting_start_time?: string | null
        }
        Relationships: []
      }
      proposals_live: {
        Row: {
          contract_id: number
          created_at: string
          creator: string
          deadline: string
          description: string
          draft_proposal_id: string | null
          id: number
          media_url: string | null
          title: string
        }
        Insert: {
          contract_id: number
          created_at?: string
          creator: string
          deadline: string
          description: string
          draft_proposal_id?: string | null
          id?: number
          media_url?: string | null
          title: string
        }
        Update: {
          contract_id?: number
          created_at?: string
          creator?: string
          deadline?: string
          description?: string
          draft_proposal_id?: string | null
          id?: number
          media_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_live_draft_proposal_id_fkey"
            columns: ["draft_proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals_draft"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
