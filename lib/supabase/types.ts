export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          role: "user" | "admin";
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          original_image_url: string;
          original_image_path: string | null;
          processed_image_url: string | null;
          template_url: string | null;
          pdf_url: string | null;
          status: "pending" | "processing" | "completed" | "failed";
          style: "classic" | "modern" | "impressionist" | "minimal" | "detailed";
          palette_size: 12 | 24 | 36;
          canvas_size: string;
          palette_data: Record<string, unknown> | null;
          sections_count: number | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          product_type: "digital" | "canvas_kit" | "framed";
          amount: number;
          original_amount: number;
          discount: number;
          currency: string;
          status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
          payment_provider: "razorpay" | "stripe" | null;
          payment_id: string | null;
          razorpay_order_id: string | null;
          stripe_session_id: string | null;
          coupon_code: string | null;
          shipping_name: string | null;
          shipping_line1: string | null;
          shipping_city: string | null;
          shipping_state: string | null;
          shipping_postal_code: string | null;
          shipping_country: string;
          shipping_phone: string | null;
          tracking_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: "creative_club";
          status: "active" | "cancelled" | "past_due" | "trialing";
          provider: "razorpay" | "stripe" | null;
          provider_subscription_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          templates_used_this_month: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["subscriptions"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      gallery: {
        Row: {
          id: string;
          project_id: string | null;
          user_id: string | null;
          title: string;
          category: "weddings" | "pets" | "travel" | "family" | "homes" | "nature" | "custom";
          original_url: string;
          transformed_url: string;
          likes_count: number;
          views_count: number;
          featured: boolean;
          published: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["gallery"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["gallery"]["Insert"]>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          subscribed: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["newsletter_subscribers"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string | null;
          email: string;
          name: string;
          subject: string;
          message: string;
          type: "general" | "support" | "corporate" | "education";
          status: "open" | "in_progress" | "resolved" | "closed";
          priority: "low" | "medium" | "high";
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["support_tickets"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["support_tickets"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
