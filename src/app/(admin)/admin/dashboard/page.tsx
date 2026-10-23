import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Activity,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] flex flex-col">
      <Navbar activeRole="admin" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--on-surface)]">
              Ringkasan Eksekutif Akademik
            </h1>
            <p className="text-sm text-[var(--on-surface-variant)] mt-1">
              Selamat datang kembali, Dr. Hendra Gunawan. Sistem berjalan optimal tanpa gangguan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/admin/users"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[var(--primary-container)] transition-all shadow-sm shadow-indigo-500/20"
            >
              <Users className="w-4 h-4" />
              Kelola Pengguna
            </a>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs">
            <div className="flex items-center justify-between text-[var(--on-surface-variant)]">
              <span className="text-xs font-semibold tracking-wide uppercase">Total Siswa Terdaftar</span>
              <div className="p-2 bg-[var(--primary-container)]/10 text-[var(--primary)] rounded-xl">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[var(--on-surface)]">1.284</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +12%
              </span>
            </div>
            <p className="text-xs text-[var(--on-surface-variant)] mt-1">Aktif di 36 kelas akademik</p>
          </div>

          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs">
            <div className="flex items-center justify-between text-[var(--on-surface-variant)]">
              <span className="text-xs font-semibold tracking-wide uppercase">Guru &amp; Tenaga Pengajar</span>
              <div className="p-2 bg-[var(--secondary-container)]/10 text-[var(--secondary)] rounded-xl">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[var(--on-surface)]">86</span>
              <span className="text-xs font-semibold text-emerald-600">100% Terverifikasi</span>
            </div>
            <p className="text-xs text-[var(--on-surface-variant)] mt-1">12 mata pelajaran pokok</p>
          </div>

          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs">
            <div className="flex items-center justify-between text-[var(--on-surface-variant)]">
              <span className="text-xs font-semibold tracking-wide uppercase">Kursus &amp; Modul Aktif</span>
              <div className="p-2 bg-[var(--tertiary-container)]/10 text-[var(--tertiary)] rounded-xl">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[var(--on-surface)]">142</span>
              <span className="text-xs font-semibold text-[var(--on-surface-variant)]">Semester Ganjil</span>
            </div>
            <p className="text-xs text-[var(--on-surface-variant)] mt-1">89% materi terunggah</p>
          </div>

          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs">
            <div className="flex items-center justify-between text-[var(--on-surface-variant)]">
              <span className="text-xs font-semibold tracking-wide uppercase">Tingkat Kelulusan CBT</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[var(--on-surface)]">94.8%</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +2.4%
              </span>
            </div>
            <p className="text-xs text-[var(--on-surface-variant)] mt-1">Rata-rata skor 82.5 / 100</p>
          </div>
        </div>

        {/* Middle Section: Chart & Urgent Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Activity Chart Card */}
          <div className="lg:col-span-2 bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[var(--on-surface)]">
                  Aktivitas Belajar &amp; Akses LMS Mingguan
                </h2>
                <p className="text-xs text-[var(--on-surface-variant)]">
                  Distribusi lalu lintas siswa dan guru (Senin - Minggu)
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--surface-container)] text-[var(--primary)]">
                Puncak: 09:30 WIB
              </span>
            </div>

            {/* Visual Bar Chart Simulator */}
            <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-2 px-2 border-b border-[var(--outline-variant)]/20">
              {[
                { day: "Sen", val: 88, users: "1.120" },
                { day: "Sel", val: 95, users: "1.210" },
                { day: "Rab", val: 92, users: "1.180" },
                { day: "Kam", val: 86, users: "1.090" },
                { day: "Jum", val: 78, users: "980" },
                { day: "Sab", val: 45, users: "540" },
                { day: "Min", val: 32, users: "390" },
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="text-[10px] font-semibold text-[var(--on-surface-variant)] opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.users}
                  </div>
                  <div
                    style={{ height: `${item.val}%` }}
                    className="w-full max-w-[42px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary-container)] rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-xs"
                  />
                  <span className="text-xs font-semibold text-[var(--on-surface-variant)]">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--on-surface-variant)] pt-1">
              <span>Kecepatan rata-rata respon server: <strong>48ms</strong></span>
              <span>Uptime server: <strong>99.98%</strong></span>
            </div>
          </div>

          {/* Urgent Action Tasks */}
          <div className="bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--on-surface)] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Tugas Mendesak
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">3 Perlu Tindakan</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/20 hover:border-[var(--primary)] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--on-surface)]">Permohonan Akun Guru Baru</span>
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">Pending</span>
                </div>
                <p className="text-[11px] text-[var(--on-surface-variant)] mt-1">2 guru baru memerlukan verifikasi NIP dan penugasan kelas.</p>
                <a href="/admin/users?status=pending" className="inline-block mt-2 text-xs font-semibold text-[var(--primary)] hover:underline">
                  Verifikasi Sekarang &rarr;
                </a>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/20 hover:border-[var(--primary)] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--on-surface)]">Audit Bank Soal CBT Fisika</span>
                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded">Review</span>
                </div>
                <p className="text-[11px] text-[var(--on-surface-variant)] mt-1">Soal Ujian Tengah Semester siap dirilis ke 180 siswa.</p>
                <a href="/teacher/exams/e1111111-1111-1111-1111-111111111111/live" className="inline-block mt-2 text-xs font-semibold text-[var(--primary)] hover:underline">
                  Buka Monitoring CBT &rarr;
                </a>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/20 hover:border-[var(--primary)] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--on-surface)]">Laporan Backup Database</span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">Selesai</span>
                </div>
                <p className="text-[11px] text-[var(--on-surface-variant)] mt-1">Snapshot harian PostgreSQL tersimpan otomatis pukul 02:00 WIB.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Course Status & System Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Courses Progress */}
          <div className="bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[var(--on-surface)]">Status Kursus &amp; Modul Terkini</h2>
            <div className="space-y-4">
              {[
                { title: "Fisika Teori & Praktikum (Kelas 10 MIPA 1)", teacher: "Dra. Nurul Hidayati", progress: 88, active: true },
                { title: "Fisika Modern & Kuantum (Kelas 11 MIPA 2)", teacher: "Dra. Nurul Hidayati", progress: 74, active: true },
                { title: "Bahasa Indonesia (Kelas 10 MIPA 1)", teacher: "Bambang Sudibyo, S.Pd", progress: 92, active: true },
              ].map((c, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[var(--on-surface)]">{c.title}</span>
                    <span className="text-[var(--primary)]">{c.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--surface-container)] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${c.progress}%` }}
                      className="h-full bg-[var(--primary)] rounded-full"
                    />
                  </div>
                  <span className="text-[11px] text-[var(--on-surface-variant)]">Pengajar: {c.teacher}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Audit Log */}
          <div className="bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--on-surface)] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--primary)]" />
                Log Aktivitas Sistem
              </h2>
              <span className="text-xs text-[var(--on-surface-variant)]">Live feed</span>
            </div>

            <div className="space-y-3 font-mono-data text-xs">
              {[
                { time: "08:52:10", action: "User session authenticated", user: "guru.nurul@educore.ac.id", status: "OK" },
                { time: "08:49:22", action: "Exam attempt started (PTS-FIS)", user: "rizky.pratama@siswa", status: "INFO" },
                { time: "08:44:05", action: "CBT live anomaly detected (Tab Switch)", user: "fajar.nugraha@siswa", status: "WARN" },
                { time: "08:30:00", action: "Automated exam window opened", user: "system_scheduler", status: "SYS" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-container-low)]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[var(--on-surface-variant)] text-[10px]">{log.time}</span>
                    <span className="text-[var(--on-surface)] font-medium truncate">{log.action}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    log.status === "WARN" ? "bg-amber-500/10 text-amber-600" :
                    log.status === "INFO" ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}