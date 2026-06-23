export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: "user" | "admin";
  subscription?: Subscription;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  original_image_url: string;
  processed_image_url?: string;
  template_url?: string;
  status: "pending" | "processing" | "completed" | "failed";
  style: ArtStyle;
  palette_size: number;
  created_at: string;
  updated_at: string;
}

export type ArtStyle = "classic" | "modern" | "impressionist" | "minimal" | "detailed";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "INR" | "USD";
  type: "digital" | "canvas_kit" | "framed" | "subscription";
  features: string[];
  popular?: boolean;
  cta: string;
}

export interface Order {
  id: string;
  user_id: string;
  project_id: string;
  product: Product;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_id?: string;
  shipping_address?: Address;
  created_at: string;
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: "creative_club";
  status: "active" | "cancelled" | "past_due";
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  original_url: string;
  transformed_url: string;
  author: string;
  likes: number;
  featured: boolean;
}

export type GalleryCategory = "weddings" | "pets" | "travel" | "homes" | "family" | "nature" | "custom";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  project_type: string;
  verified: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: BlogAuthor;
  category: string;
  tags: string[];
  published_at: string;
  read_time: number;
  featured: boolean;
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  badge?: string;
}

export interface Metric {
  label: string;
  value: string;
  suffix?: string;
  description?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order: number;
  max_uses: number;
  used_count: number;
  expires_at: string;
  active: boolean;
}

export type Theme = "light" | "dark" | "system";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
