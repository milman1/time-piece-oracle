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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      affiliate_clicks: {
        Row: {
          clicked_at: string
          id: string
          ip_address: unknown | null
          referrer: string | null
          seller_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          watch_id: number | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          seller_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          watch_id?: number | null
        }
        Update: {
          clicked_at?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          seller_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          watch_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_clicks_watch_id_fkey"
            columns: ["watch_id"]
            isOneToOne: false
            referencedRelation: "watches"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      influencers: {
        Row: {
          created_at: string
          description: string
          handle: string
          id: string
          image_url: string | null
          platform: string
          profile_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          handle: string
          id?: string
          image_url?: string | null
          platform?: string
          profile_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          handle?: string
          id?: string
          image_url?: string | null
          platform?: string
          profile_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          brand: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          model: string
          target_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          brand: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          model: string
          target_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          model?: string
          target_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sellers: {
        Row: {
          affiliate_base_url: string | null
          commission_rate: number | null
          created_at: string
          id: string
          name: string
          trust_score: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          affiliate_base_url?: string | null
          commission_rate?: number | null
          created_at?: string
          id?: string
          name: string
          trust_score?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          affiliate_base_url?: string | null
          commission_rate?: number | null
          created_at?: string
          id?: string
          name?: string
          trust_score?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          author: string
          caption: string
          created_at: string
          id: string
          likes: number | null
          platform: string
          thumbnail: string
          updated_at: string
          url: string
          views: number | null
        }
        Insert: {
          author: string
          caption: string
          created_at?: string
          id?: string
          likes?: number | null
          platform: string
          thumbnail: string
          updated_at?: string
          url: string
          views?: number | null
        }
        Update: {
          author?: string
          caption?: string
          created_at?: string
          id?: string
          likes?: number | null
          platform?: string
          thumbnail?: string
          updated_at?: string
          url?: string
          views?: number | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_prices: {
        Row: {
          collected_at: string
          id: number
          price: number
          watch_id: number
        }
        Insert: {
          collected_at?: string
          id?: number
          price: number
          watch_id: number
        }
        Update: {
          collected_at?: string
          id?: number
          price?: number
          watch_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "watch_prices_watch_id_fkey"
            columns: ["watch_id"]
            isOneToOne: false
            referencedRelation: "watches"
            referencedColumns: ["id"]
          },
        ]
      }
      watches: {
        Row: {
          affiliate_url: string | null
          avg_price: number | null
          brand: string
          condition: string
          created_at: string
          description: string | null
          id: number
          image: string | null
          marketplace: string
          model: string
          movement: string | null
          original_price: number | null
          price: number
          rating: number | null
          reference: string
          reviews: number | null
          seller: string
          seller_id: string | null
          strap: string | null
          style: string | null
          trusted: boolean | null
          updated_at: string
          year: number | null
        }
        Insert: {
          affiliate_url?: string | null
          avg_price?: number | null
          brand: string
          condition: string
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          marketplace: string
          model: string
          movement?: string | null
          original_price?: number | null
          price: number
          rating?: number | null
          reference: string
          reviews?: number | null
          seller: string
          seller_id?: string | null
          strap?: string | null
          style?: string | null
          trusted?: boolean | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          affiliate_url?: string | null
          avg_price?: number | null
          brand?: string
          condition?: string
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          marketplace?: string
          model?: string
          movement?: string | null
          original_price?: number | null
          price?: number
          rating?: number | null
          reference?: string
          reviews?: number | null
          seller?: string
          seller_id?: string | null
          strap?: string | null
          style?: string | null
          trusted?: boolean | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "watches_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
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
