import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  PlayCircle,
  Bell
} from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] flex flex-col">
      <Navbar activeRole="student" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              Semester Ganjil 2026/2027
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Semangat Belajar, Muhammad Rizky!
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              Kelas 10 MIPA 1 • NISN: 0078912345. Anda memiliki 1 Ujian CBT aktif dan 2 tugas akademik dengan tenggat waktu terdekat.
            </p>
          </div>

          <a
            href="/student/exams/e1111111-1111-1111-1111-111111111111/take"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white text-[var(--primary)] text-xs font-bold hover:bg-white/95 transition-all shadow-md shrink-0"
          >
            <PlayCircle className="w-5 h-5 text-emerald-600" />
            Mulai Ujian CBT Sekarang
          </a>
        </div>

        {/* 3 Quick Highlight Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wide">
                Jam Belajar Mingguan
              </span>
              <div className="text-2xl font-bold text-[var(--on-surface)] mt-1">18.5 Jam</div>
              <span className="text-xs font-semibold text-emerald-600">+3.2 jam dari target</span>
            </div>
            <div className="p-3 bg-[var(--primary-container)]/10 text-[var(--primary)] rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wide">
                Rata-rata Nilai CBT
              </span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">92.4 / 100</div>
              <span className="text-xs text-[var(--on-surface-variant)]">Predikat Sangat Memuaskan</span>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wide">
                Tugas Selesai
              </span>
              <div className="text-2xl font-bold text-[var(--on-surface)] mt-1">14 / 16</div>
              <span className="text-xs text-amber-600 font-semibold">2 Tugas Menunggu</span>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Enrolled Courses & Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses List (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--on-surface)]">Mata Pelajaran Terdaftar</h2>
              <span className="text-xs font-semibold text-[var(--on-surface-variant)]">3 Kursus Aktif</span>
            </div>

            <div className="space-y-4">
              <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary-container)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-sm">
                      FIS
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--on-surface)]">Fisika Teori &amp; Praktikum</h3>
                      <p className="text-xs text-[var(--on-surface-variant)]">Guru: Dra. Nurul Hidayati, M.Pd</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[var(--primary)]">88% Selesai</span>
                </div>

                <div className="h-2 w-full bg-[var(--surface-container)] rounded-full overflow-hidden">
                  <div style={{ width: "88%" }} className="h-full bg-[var(--primary)] rounded-full" />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[var(--on-surface-variant)]">1 Modul Tersisa • 1 Ujian CBT Tersedia</span>
                  <a
                    href="/student/exams/e1111111-1111-1111-1111-111111111111/take"
                    className="font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    Buka Ruang Ujian &rarr;
                  </a>
                </div>
              </div>

              <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                      BIN
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--on-surface)]">Bahasa Indonesia</h3>
                      <p className="text-xs text-[var(--on-surface-variant)]">Guru: Bambang Sudibyo, S.Pd</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">92% Selesai</span>
                </div>

                <div className="h-2 w-full bg-[var(--surface-container)] rounded-full overflow-hidden">
                  <div style={{ width: "92%" }} className="h-full bg-emerald-600 rounded-full" />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[var(--on-surface-variant)]">Tugas Resensi Buku sedang dinilai</span>
                  <span className="text-[var(--on-surface-variant)] font-medium">Nilai Terakhir: 90</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines & CBT (1 Col) */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[var(--on-surface)]">Tenggat Waktu &amp; CBT</h2>

            <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-4">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                    Ujian Aktif
                  </span>
                  <span className="text-[10px] font-mono-data text-red-700 font-bold">90 Menit</span>
                </div>
                <h4 className="font-bold text-xs text-red-950">
                  CBT Penilaian Tengah Semester Fisika
                </h4>
                <p className="text-[11px] text-red-800">Batas akhir pengerjaan hari ini pukul 23:59 WIB.</p>
                <a
                  href="/student/exams/e1111111-1111-1111-1111-111111111111/take"
                  className="block text-center py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors shadow-xs"
                >
                  Masuk Ruang Ujian &rarr;
                </a>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-container-low)] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--on-surface)]">Laporan Praktikum Fisika</span>
                  <span className="text-[10px] text-amber-600 font-semibold">24 Okt 2026</span>
                </div>
                <p className="text-[11px] text-[var(--on-surface-variant)]">Unggah format PDF hasil pengukuran percepatan gravitasi.</p>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-container-low)] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--on-surface)]">Resensi Buku Non-Fiksi</span>
                  <span className="text-[10px] text-[var(--on-surface-variant)] font-semibold">28 Okt 2026</span>
                </div>
                <p className="text-[11px] text-[var(--on-surface-variant)]">Mata pelajaran Bahasa Indonesia.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Feedback & Academic News */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[var(--on-surface)] flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--primary)]" />
              Umpan Balik Guru Terakhir
            </h2>
            <div className="p-4 rounded-xl bg-[var(--surface-container-low)] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--on-surface)]">Dra. Nurul Hidayati, M.Pd</span>
                <span className="font-bold text-emerald-600 text-sm">Nilai: 95</span>
              </div>
              <p className="text-[11px] text-[var(--on-surface-variant)] italic">
                &ldquo;Analisis gaya gesek pada modul 4 sudah sangat runtut dan detail. Pertahankan performa baik ini pada saat penilaian tengah semester!&rdquo;
              </p>
            </div>
          </div>

          <div className="bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[var(--on-surface)] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[var(--secondary)]" />
              Warta Akademik
            </h2>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[var(--surface-container-low)]">
                <div className="font-bold text-[var(--on-surface)]">Jadwal Kalender Penilaian Tengah Semester</div>
                <p className="text-[11px] text-[var(--on-surface-variant)] mt-0.5">
                  Pelaksanaan CBT berlangsung serentak secara daring dan terjadwal hingga akhir bulan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}