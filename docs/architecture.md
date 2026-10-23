# Arsitektur EduCore LMS Platform

## 1. Ikhtisar Sistem
EduCore LMS adalah Learning Management System (LMS) modern yang menggabungkan manajemen akademik terpadu dan sistem Computer-Based Testing (CBT) dengan pengawasan anti-kecurangan real-time.

Aplikasi dibangun berdasarkan standar rekayasa ketat dalam `AGENTS.md` dengan pemisahan tanggung jawab frontend dan backend:
- **Frontend**: Next.js App Router (React 19, TypeScript strict mode, Tailwind CSS v4, Lucide Icons, tipografi Google Fonts `Plus Jakarta Sans`, `Inter`, dan `Geist`).
- **Backend**: Next.js Route Handlers, Service Layer, dan Repository Layer yang diisolasi di `src/server/`.
- **Database & Auth**: PostgreSQL dan Supabase Auth dengan Row Level Security (RLS) di setiap tabel.
- **Validasi Data**: Zod schemas di server-side untuk memastikan setiap request terverifikasi sebelum diproses.

## 2. Struktur Modul & Tanggung Jawab
- `src/app/(admin)/`: Antarmuka dashboard dan manajemen pengguna untuk peran Administrator.
- `src/app/(teacher)/`: Ruang kerja pendidik dan ruang monitoring CBT live untuk peran Guru.
- `src/app/(student)/`: Dashboard progres belajar dan antarmuka pengerjaan ujian CBT untuk Siswa.
- `src/app/api/v1/`: Endpoint REST API terproteksi otorisasi server-side.
- `src/server/services/`: Logika bisnis mandiri (misal: mesin penilaian ujian, deteksi anomali, manajemen akun).
- `src/server/authorization/`: Verifikasi RBAC (Role-Based Access Control).
- `src/lib/supabase/`: Client Supabase (browser, SSR server, dan admin service role dengan `server-only`).