# Canvasify — Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** 2026-06-22  
**Status:** In Development

---

## 1. Overview

Canvasify is an AI-powered platform where users upload personal photos and receive personalized paint-by-number kits (digital or physical). The MVP covers the full conversion funnel: upload → AI processing → preview → purchase → delivery tracking.

---

## 2. User Personas

### Persona A: Gifter Priya (Primary)
- 28F, Bangalore, product manager
- Wants to gift her mother a custom painting for her birthday
- Pain: doesn't know where to find something unique and affordable
- Goal: order in under 10 minutes, delivered within a week

### Persona B: Corporate Rahul (Secondary)
- 35M, HR manager at a 500-person tech company
- Needs 50 employee appreciation gifts for Diwali
- Pain: bulk custom gifting is complicated and expensive
- Goal: one order, bulk discount, custom packaging, delivered reliably

### Persona C: Hobbyist Meera (Tertiary)
- 52F, homemaker, paints on weekends
- Bored of generic kits, wants to paint her dog Max
- Pain: custom art is too expensive or too complicated
- Goal: upload photo, get kit, start painting this weekend

---

## 3. Core User Journeys

### Journey 1: Guest → Buyer (No account required for preview)
1. Lands on homepage
2. Uploads photo in Hero section
3. Sees AI preview (5-second simulation)
4. Clicks "Order This" → directed to `/create`
5. Selects palette size + canvas size
6. Chooses product (Digital/Canvas/Framed)
7. Creates account or guest checkout
8. Pays via Razorpay
9. Receives confirmation email
10. For digital: instant download link
11. For physical: tracking updates via email

### Journey 2: Registered User → Dashboard
1. Logs in → `/dashboard`
2. Sees all past projects + order statuses
3. Can re-order or download previous templates
4. Manages subscription (Creative Club)

### Journey 3: Corporate Buyer
1. Lands on homepage → clicks "For Businesses"
2. Fills corporate inquiry form
3. Sales team follows up within 2 hours
4. Custom quote + bulk order flow

---

## 4. Feature Requirements

### 4.1 Authentication
| Feature | Priority | Status |
|---|---|---|
| Email + password signup | P0 | ✅ Done |
| Email confirmation | P0 | ✅ Done |
| Login with email/password | P0 | ✅ Done |
| Forgot password / reset | P0 | ✅ Done |
| Google OAuth | P1 | ⬜ Pending |
| Session persistence (middleware) | P0 | ✅ Done |
| Protected routes (/dashboard, /admin) | P0 | ✅ Done |

### 4.2 Create Flow (Core MVP)
| Feature | Priority | Status |
|---|---|---|
| Photo upload (drag & drop) | P0 | ✅ UI Done |
| File validation (type, size, resolution) | P0 | ✅ Done |
| Upload to Supabase Storage | P0 | ⬜ Pending |
| AI processing API call | P0 | ⬜ Pending |
| Real PBN preview generation | P0 | ⬜ Pending |
| Palette size selection (12/24/36) | P0 | ✅ UI Done |
| Canvas size selection | P0 | ✅ UI Done |
| Side-by-side original vs PBN preview | P0 | ✅ UI Done |
| Download preview as PNG | P1 | ✅ Done |
| Save project to DB | P0 | ⬜ Pending |
| Checkout flow | P0 | ✅ UI Done |
| Coupon code validation | P1 | ⬜ Pending |

### 4.3 Payments
| Feature | Priority | Status |
|---|---|---|
| Razorpay order creation | P0 | ⬜ Pending |
| Razorpay checkout widget | P0 | ⬜ Pending |
| Payment verification (signature) | P0 | ⬜ Pending |
| Order saved to DB post-payment | P0 | ⬜ Pending |
| Success page + email confirmation | P0 | ⬜ Pending |
| Refund handling | P1 | ⬜ Pending |

### 4.4 User Dashboard
| Feature | Priority | Status |
|---|---|---|
| Projects list | P0 | ✅ UI Done |
| Order history | P0 | ✅ UI Done |
| Download digital files | P0 | ⬜ Pending |
| Order tracking | P1 | ⬜ Pending |
| Subscription management | P1 | ⬜ Pending |
| Profile settings | P1 | ⬜ Pending |

### 4.5 Admin Panel
| Feature | Priority | Status |
|---|---|---|
| Dashboard metrics | P0 | ✅ UI Done |
| Orders list + search | P0 | ✅ UI Done |
| Update order status | P0 | ⬜ Pending |
| Users list | P1 | ✅ UI Done |
| Gallery management | P1 | ⬜ Pending |
| Coupon management | P1 | ⬜ Pending |

### 4.6 Marketing Pages
| Feature | Priority | Status |
|---|---|---|
| Homepage (15 sections) | P0 | ✅ Done |
| Gallery page | P0 | ✅ Done |
| Pricing page | P0 | ✅ Done |
| About page | P0 | ✅ Done |
| Blog (list + posts) | P1 | ✅ Done |
| Contact page | P0 | ✅ Done |
| FAQ page | P0 | ✅ Done |
| Legal pages (Terms/Privacy/Refund) | P0 | ✅ Done |
| 404 page | P0 | ✅ Done |

### 4.7 Emails (via Resend)
| Feature | Priority | Status |
|---|---|---|
| Welcome email on signup | P0 | ⬜ Pending |
| Order confirmation | P0 | ⬜ Pending |
| Digital download delivery | P0 | ⬜ Pending |
| Shipping notification | P1 | ⬜ Pending |
| Password reset | P0 | ✅ (Supabase native) |
| Newsletter | P2 | ⬜ Pending |

---

## 5. Out of Scope (MVP)

- Mobile app (iOS/Android)
- Video tutorials / painting guides
- Community features (comments, follows)
- Multiple photos per project
- Custom color palette override
- AR preview (paint on virtual canvas)
- International shipping
- Stripe (India focus = Razorpay only for now)

---

## 6. Acceptance Criteria (MVP Launch)

- [ ] User can register, confirm email, log in, reset password
- [ ] User can upload a photo and see a real AI-generated PBN preview
- [ ] User can complete a purchase via Razorpay
- [ ] Digital orders deliver a downloadable PDF instantly after payment
- [ ] User can see all orders in their dashboard
- [ ] Admin can view all orders and update their status
- [ ] All pages load in under 3 seconds on 4G
- [ ] Zero critical TypeScript errors in production build
- [ ] RLS policies prevent users from accessing other users' data

---

## 7. Success Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|---|---|---|
| Signups | 200 | 1,000 |
| Upload → Preview rate | >70% | >80% |
| Preview → Order rate | >15% | >20% |
| Orders | 50 | 300 |
| NPS Score | >50 | >65 |
| Avg order value | ₹1,200 | ₹1,400 |
