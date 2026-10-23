import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { 
  AlertCircle, 
  Users, 
  Calendar, 
  MessageSquare, 
  MonitorPlay
} from "lucide-react";

export default function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] flex flex-col">
      <Navbar activeRole="teacher" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Greeting & Monitoring CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--on-surface)]">
              Ruang Kerja Pendidik
            </h1>
            <p className="text-sm text-[var(--on-surface-variant)] mt-1">
              Selamat datang, Dra. Nurul Hidayati, M.Pd • Guru Pengampu Fisika
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/teacher/exams/e1111111-1111-1111-1111-111111111111/live"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
            >
              <MonitorPlay className="w-4 h-4" />
              Buka Monitoring CBT Live
            </a>
          </div>
        </div>

        {/* Assessment Urgent Actions */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-700 rounded-xl mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--on-surface)]">
                Tugas &amp; Asesmen Butuh Tindakan Segera
              </h3>
              <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">
                Terdapat <strong>18 laporan praktikum</strong> Fisika Newton yang belum dinilai dan 1 sesi ujian CBT sedang berlangsung.
              </p>
            </div>
          </div>
          <a
            href="/teacher/exams/e1111111-1111-1111-1111-111111111111/live"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface-container-lowest)] text-[var(--primary)] text-xs font-bold hover:bg-white transition-colors shrink-0 shadow-xs"
          >
            Pantau Peserta Ujian Live &rarr;
          </a>
        </div>

        {/* Courses & Active Classes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--on-surface)]">
              Daftar Kelas &amp; Mata Pelajaran Aktif
            </h2>
            <span className="text-xs font-semibold text-[var(--on-surface-variant)]">2 Kelas Utama</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--primary-container)]/10 text-[var(--primary)]">
                    FIS-101 • Kelas 10 MIPA 1
                  </span>
                  <h3 className="text-base font-bold text-[var(--on-surface)] mt-2">
                    Fisika Teori &amp; Praktikum
                  </h3>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">
                    Mekanika Klasik, Gerak Melingkar, dan Hukum Kekekalan Energi.
                  </p>
                </div>
                <div className="p-3 bg-[var(--surface-container)] rounded-xl text-[var(--on-surface-variant)]">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--outline-variant)]/20 text-center">
                <div className="p-2 rounded-xl bg-[var(--surface-container-low)]">
                  <span className="text-[10px] text-[var(--on-surface-variant)] block">Siswa</span>
                  <span className="font-bold text-sm text-[var(--on-surface)]">36</span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface-container-low)]">
                  <span className="text-[10px] text-[var(--on-surface-variant)] block">Modul</span>
                  <span className="font-bold text-sm text-[var(--on-surface)]">12 Bab</span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface-container-low)]">
                  <span className="text-[10px] text-[var(--on-surface-variant)] block">Rata-rata Nilai</span>
                  <span className="font-bold text-sm text-emerald-600">84.5</span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--secondary-container)]/10 text-[var(--secondary)]">
                    FIS-201 • Kelas 11 MIPA 2
                  </span>
                  <h3 className="text-base font-bold text-[var(--on-surface)] mt-2">
                    Fisika Modern &amp; Kuantum
                  </h3>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">
                    Teori Relativitas Khusus, Efek Fotolistrik, dan Teori Atom Bohr.
                  </p>
                </div>
                <div className="p-3 bg-[var(--surface-container)] rounded-xl text-[var(--on-surface-variant)]">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--outline-variant)]/20 text-center">
                <div className="p-2 rounded-xl bg-[var(--surface-container-low)]">
                  <span className="text-[10px] text-[var(--on-surface-variant)] block">Siswa</span>
                  <span className="font-bold text-sm text-[var(--on-surface)]">34</span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface-container-low)]">
                  <span className="text-[10px] text-[var(--on-surface-variant)] block">Modul</span>
                  <span className="font-bold text-sm text-[var(--on-surface)]">8 Bab</span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface-container-low)]">
                  <span className="text-[10px] text-[var(--on-surface-variant)] block">Rata-rata Nilai</span>
                  <span className="font-bold text-sm text-emerald-600">79.2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Q&A Discussions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Teaching Schedule */}
          <div className="bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[var(--on-surface)] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--primary)]" />
              Jadwal Mengajar Hari Ini
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--surface-container-low)] border-l-4 border-[var(--primary)] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[var(--on-surface)]">Fisika Teori - Kelas 10 MIPA 1</div>
                  <div className="text-[11px] text-[var(--on-surface-variant)] mt-0.5">Ruang Lab Fisika Utama</div>
                </div>
                <div className="font-mono-data font-semibold text-[var(--primary)]">07:30 - 09:30 WIB</div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-container-low)] border-l-4 border-[var(--secondary)] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[var(--on-surface)]">Praktikum Kinematika Gerak</div>
                  <div className="text-[11px] text-[var(--on-surface-variant)] mt-0.5">Lab Komputer &amp; Simulasi 2</div>
                </div>
                <div className="font-mono-data font-semibold text-[var(--secondary)]">10:00 - 11:30 WIB</div>
              </div>
            </div>
          </div>

          {/* Student Questions */}
          <div className="bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[var(--on-surface)] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--tertiary)]" />
              Tanya Jawab &amp; Diskusi Siswa
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--surface-container-low)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--on-surface)]">Muhammad Rizky Pratama</span>
                  <span className="text-[10px] text-[var(--on-surface-variant)]">15 mnt lalu</span>
                </div>
                <p className="text-[11px] text-[var(--on-surface-variant)]">
                  &ldquo;Bu Nurul, untuk soal no 3 mengenai resultan gaya pada bidang miring, koefisien gesek kinetisnya apakah selalu konstan?&rdquo;
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Tulis balasan langsung..."
                    className="flex-1 px-3 py-1 text-xs rounded-lg bg-white border border-[var(--outline-variant)]/30 text-[var(--on-surface)]"
                  />
                  <button className="px-3 py-1 bg-[var(--primary)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--primary-container)]">
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}