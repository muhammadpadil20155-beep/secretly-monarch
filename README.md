# SECRETLY Web (Vercel)
Landing, dashboard, API Gateway. Repo terpisah dari bot panel.
1. Supabase SQL Editor: jalankan `supabase/schema.sql`; aktifkan Google Auth.
2. Push ke GitHub, import di Vercel (Framework: Other), isi env dari `.env.example`.
3. Gateway: `POST /api/gateway` header `x-api-key`, body `{to,text}`.
