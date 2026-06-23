-- =============================================
-- Canvasify Database Schema
-- Run this in your Supabase SQL editor
-- =============================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text not null,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Admins can view all users"
  on public.users for select
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- =============================================
-- PROJECTS TABLE
-- =============================================
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null default 'My Artwork',
  original_image_url text not null,
  original_image_path text,
  processed_image_url text,
  template_url text,
  pdf_url text,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed')),
  style text not null default 'classic'
    check (style in ('classic', 'modern', 'impressionist', 'minimal', 'detailed')),
  palette_size integer not null default 24 check (palette_size in (12, 24, 36)),
  canvas_size text not null default '40x50',
  palette_data jsonb,
  sections_count integer,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_id_idx on public.projects(user_id);
create index projects_status_idx on public.projects(status);

-- RLS
alter table public.projects enable row level security;

create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- =============================================
-- ORDERS TABLE
-- =============================================
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete restrict not null,
  project_id uuid references public.projects(id) on delete restrict not null,
  product_type text not null check (product_type in ('digital', 'canvas_kit', 'framed')),
  amount integer not null,
  original_amount integer not null,
  discount integer not null default 0,
  currency text not null default 'INR',
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_provider text check (payment_provider in ('razorpay', 'stripe')),
  payment_id text,
  razorpay_order_id text,
  stripe_session_id text,
  coupon_code text,
  shipping_name text,
  shipping_line1 text,
  shipping_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal_code text,
  shipping_country text default 'IN',
  shipping_phone text,
  tracking_number text,
  estimated_delivery timestamptz,
  delivered_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders(user_id);
create index orders_status_idx on public.orders(status);
create index orders_payment_id_idx on public.orders(payment_id);

-- RLS
alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade unique not null,
  plan text not null default 'creative_club',
  status text not null default 'active'
    check (status in ('active', 'cancelled', 'past_due', 'trialing')),
  provider text check (provider in ('razorpay', 'stripe')),
  provider_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  templates_used_this_month integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- =============================================
-- GALLERY TABLE
-- =============================================
create table public.gallery (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  category text not null
    check (category in ('weddings', 'pets', 'travel', 'family', 'homes', 'nature', 'custom')),
  original_url text not null,
  transformed_url text not null,
  likes_count integer not null default 0,
  views_count integer not null default 0,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index gallery_category_idx on public.gallery(category);
create index gallery_featured_idx on public.gallery(featured);

alter table public.gallery enable row level security;

create policy "Anyone can view published gallery"
  on public.gallery for select
  using (published = true);

-- =============================================
-- COUPONS TABLE
-- =============================================
create table public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value integer not null,
  min_order integer not null default 0,
  max_uses integer not null default 0,
  used_count integer not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =============================================
-- NEWSLETTER SUBSCRIBERS
-- =============================================
create table public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  subscribed boolean not null default true,
  created_at timestamptz not null default now()
);

-- =============================================
-- SUPPORT TICKETS
-- =============================================
create table public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id),
  email text not null,
  name text not null,
  subject text not null,
  message text not null,
  type text not null default 'general'
    check (type in ('general', 'support', 'corporate', 'education')),
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================
-- AUDIT LOGS
-- =============================================
create table public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id),
  action text not null,
  resource_type text,
  resource_id text,
  metadata jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index audit_logs_user_id_idx on public.audit_logs(user_id);
create index audit_logs_action_idx on public.audit_logs(action);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users
  for each row execute function update_updated_at();

create trigger projects_updated_at before update on public.projects
  for each row execute function update_updated_at();

create trigger orders_updated_at before update on public.orders
  for each row execute function update_updated_at();

create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function update_updated_at();

create trigger support_tickets_updated_at before update on public.support_tickets
  for each row execute function update_updated_at();

-- Create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
