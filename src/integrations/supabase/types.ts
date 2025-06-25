export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      watches: {
        Row: {
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
          strap: string | null
          style: string | null
          trusted: boolean | null
          updated_at: string
          year: number | null
        }
        Insert: {
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
          strap?: string | null
          style?: string | null
          trusted?: boolean | null
          updated_at?: string
          year?: number | null
        }
        Update: {
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
          strap?: string | null
          style?: string | null
          trusted?: boolean | null
          updated_at?: string
          year?: number | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
