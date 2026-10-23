import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ShieldCheck, 
  BookOpen, 
  Users, 
  MonitorPlay, 
  GraduationCap, 
  FileCheck2, 
  ArrowRight, 
  Lock, 
  Server, 
  Activity,
  Layers
} from "lucide-react";

export default function HomePage() {
  const screens = [
    {
      title: "1. Admin Dashboard",
      desc: "Ringkasan eksekutif akademik, metrik KPI siswa, grafik lalu lintas mingguan, dan log aktivitas sistem.",
      path: "/admin/dashboard",
      role: "Admin",
      badgeColor: "bg-purple-500/10 text-purple-700",
      icon: Users,
    },
    {
      title: "2. Manajemen Pengguna",
      desc: "Pengelolaan direktori akun pengguna (Siswa, Guru, Admin), status akun, drawer biodata, dan reset sandi.",
      path: "/admin/users",
      role: "Admin",
      badgeColor: "bg-purple-500/10 text-purple-700",
      icon: ShieldCheck,
    },
    {
      title: "3. Ujian CBT Siswa",
      desc: "Antarmuka ujian CBT terproteksi anti-cheat dengan sinkronisasi waktu server, autosave, dan peta navigasi soal.",
      path: "/student/exams/e1111111-1111-1111-1111-111111111111/take",
      role: "Siswa",
      badgeColor: "bg-blue-500/10 text-blue-700",
      icon: FileCheck2,
    },
    {
      title: "4. Dashboard Guru",
      desc: "Ruang kerja pendidik dengan rekap tugas butuh penilaian, kelas aktif, jadwal harian, dan forum diskusi.",
      path: "/teacher/dashboard",
      role: "Guru",
      badgeColor: "bg-indigo-500/10 text-indigo-700",
      icon: GraduationCap,
    },
    {
      title: "5. Monitoring CBT Live",
      desc: "Pengawasan ujian real-time dengan sensor deteksi anomali (pindah tab, keluar layar penuh) dan force submit.",
      path: "/teacher/exams/e1111111-1111-1111-1111-111111111111/live",
      role: "Guru / Pengawas",
      badgeColor: "bg-red-500/10 text-red-700",
      icon: MonitorPlay,
    },
    {
      title: "6. Dashboard Siswa",
      desc: "Portal belajar siswa dengan progress mata pelajaran, jam belajar, tenggat tugas, dan umpan balik guru.",
      path: "/student/dashboard",
      role: "Siswa",
      badgeColor: "bg-emerald-500/10 text-emerald-700",
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] flex flex-col">
      <Navbar activeRole="admin" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--primary-container)]/10 text-[var(--primary)] text-xs font-bold tracking-wide">
            <Layers className="w-3.5 h-3.5" />
            EduCore LMS Platform • Desain Stitch &amp; Standar AGENTS.md
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--on-surface)]">
            Sistem Manajemen Pembelajaran &amp; Ujian CBT Terpadu
          </h1>
          <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">
            Implementasi penuh ke-6 layar antarmuka pengguna sesuai spesifikasi desain Stitch dengan pemisahan frontend dan backend, otentikasi berbasis peran (RBAC), Row Level Security (RLS), dan proteksi anti-kecurangan CBT di sisi server.
          </p>
        </div>

        {/* 6 Stitch Screens Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screens.map((s, idx) => {
            const Icon = s.icon;
            return (
              <a
                key={idx}
                href={s.path}
                className="group bg-[var(--surface-container-lowest)] p-6 rounded-3xl border border-[var(--outline-variant)]/30 hover:border-[var(--primary)]/60 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${s.badgeColor}`}>
                      {s.role}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[var(--surface-container)] flex items-center justify-center text-[var(--on-surface-variant)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--outline-variant)]/20 flex items-center justify-between text-xs font-bold text-[var(--primary)]">
                  <span>Buka Layar &rarr;</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Architecture & Security Highlights */}
        <div className="bg-[var(--surface-container-lowest)] p-8 rounded-3xl border border-[var(--outline-variant)]/30 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-[var(--on-surface)] flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            Kepatuhan Arsitektur &amp; Keamanan Sesuai AGENTS.md
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2 p-4 rounded-2xl bg-[var(--surface-container-low)]">
              <div className="flex items-center gap-2 font-bold text-[var(--on-surface)] text-sm">
                <Server className="w-4 h-4 text-emerald-600" />
                Pemisahan Bersih FE &amp; BE
              </div>
              <p className="text-[var(--on-surface-variant)] leading-relaxed">
                Frontend menangani render interaktif dan validasi usability. Akses basis data, perhitungan skor ujian, dan validasi wewenang diisolasi murni di Route Handlers &amp; Services backend.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[var(--surface-container-low)]">
              <div className="flex items-center gap-2 font-bold text-[var(--on-surface)] text-sm">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Integritas CBT di Server
              </div>
              <p className="text-[var(--on-surface-variant)] leading-relaxed">
                Kunci jawaban tidak pernah dikirim ke browser siswa. Timer ujian, batas akhir pengerjaan, dan penilaian otomatis dihitung secara otoritatif di sisi server.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[var(--surface-container-low)]">
              <div className="flex items-center gap-2 font-bold text-[var(--on-surface)] text-sm">
                <Activity className="w-4 h-4 text-red-600" />
                Live Anti-Cheat Auditing
              </div>
              <p className="text-[var(--on-surface-variant)] leading-relaxed">
                Sensor browser merekam deteksi perpindahan tab dan keluarnya mode fullscreen, lalu mengirim log audit secara asinkron ke server untuk ditampilkan pada layar live proctoring guru.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}