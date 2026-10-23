"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  RefreshCw, 
  RotateCcw,
  Ban, 
  AlertCircle
} from "lucide-react";
import { LiveStudentSession } from "@/types/lms";

function LiveMonitoringContent() {
  const params = useParams();
  const examId = params.examId as string;

  const [examTitle, setExamTitle] = useState("Ujian CBT: Penilaian Tengah Semester Fisika Terpadu");
  const [sessions, setSessions] = useState<LiveStudentSession[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<LiveStudentSession | null>(null);
  const [filterAnomalyOnly, setFilterAnomalyOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLive() {
      try {
        const res = await fetch(`/api/v1/teacher/exams/${examId}/live`);
        const data = await res.json();
        if (isMounted && data.success) {
          setExamTitle(data.data.examTitle);
          setSessions(data.data.sessions);
          setSelectedStudent((prev) => {
            if (prev) return prev;
            const fajar = data.data.sessions.find((s: LiveStudentSession) => s.studentName.includes("Fajar"));
            return fajar || data.data.sessions[0] || null;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadLive();
    const interval = setInterval(loadLive, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [examId]);

  const handleTeacherAction = async (action: "warning" | "force_submit" | "reset_session") => {
    if (!selectedStudent) return;
    try {
      const res = await fetch(`/api/v1/teacher/exams/${examId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.studentId,
          action,
          message: action === "warning" ? "Peringatan pengawas: Terdeteksi perpindahan tab. Harap fokus pada soal ujian Anda." : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(data.message);
        const refRes = await fetch(`/api/v1/teacher/exams/${examId}/live`);
        const refData = await refRes.json();
        if (refData.success) setSessions(refData.data.sessions);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (filterAnomalyOnly && s.anomalyCount === 0) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.studentName.toLowerCase().includes(q) || s.nisn.includes(q);
    }
    return true;
  });

  const activeCount = sessions.filter((s) => s.status === "in_progress").length;
  const submittedCount = sessions.filter((s) => s.status === "submitted" || s.status === "force_submitted").length;
  const anomalyCount = sessions.filter((s) => s.anomalyCount > 0).length;

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] flex flex-col">
      <Navbar activeRole="teacher" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Live Proctoring Room
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--on-surface)] mt-1">
              Monitoring CBT Live - {examTitle}
            </h1>
            <p className="text-sm text-[var(--on-surface-variant)]">
              Pemantauan aktivitas peserta ujian, integritas layar, dan deteksi anomali kecurangan secara real-time.
            </p>
          </div>

          <button
            onClick={() => {
              fetch(`/api/v1/teacher/exams/${examId}/live`)
                .then((r) => r.json())
                .then((d) => d.success && setSessions(d.data.sessions));
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--surface-container)] text-xs font-semibold text-[var(--on-surface)] hover:bg-[var(--surface-container-high)] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Data
          </button>
        </div>

        {actionNotice && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 rounded-xl text-xs flex items-center justify-between">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="font-bold hover:underline">
              Tutup
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs">
            <span className="text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wide">
              Peserta Terdaftar
            </span>
            <div className="text-2xl font-bold text-[var(--on-surface)] mt-2">32 Siswa</div>
            <span className="text-[11px] text-[var(--on-surface-variant)] mt-1 block">Kelas 10 MIPA 1</span>
          </div>

          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Sedang Mengerjakan
            </span>
            <div className="text-2xl font-bold text-blue-600 mt-2">{activeCount} Siswa</div>
            <span className="text-[11px] text-[var(--on-surface-variant)] mt-1 block">Sesi aktif terkoneksi</span>
          </div>

          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              Selesai Dikumpulkan
            </span>
            <div className="text-2xl font-bold text-emerald-600 mt-2">{submittedCount} Siswa</div>
            <span className="text-[11px] text-[var(--on-surface-variant)] mt-1 block">Jawaban terverifikasi server</span>
          </div>

          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-red-500/30 bg-red-500/5 shadow-xs">
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wide flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Terdeteksi Anomali
            </span>
            <div className="text-2xl font-bold text-red-600 mt-2">{anomalyCount} Siswa</div>
            <span className="text-[11px] text-red-700/80 mt-1 block">Pelanggaran tab / layar penuh</span>
          </div>
        </div>

        <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-[var(--on-surface)] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Grafik Distribusi Anomali Sesi Ujian
            </h3>
            <p className="text-xs text-[var(--on-surface-variant)]">
              Sensor live browser menangkap perpindahan jendela aktif dan status fullscreen.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Pindah Tab (62%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Keluar Layar Penuh (24%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Idle Timeout (14%)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[var(--surface-container-lowest)] rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs overflow-hidden space-y-4 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterAnomalyOnly(false)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    !filterAnomalyOnly
                      ? "bg-[var(--primary)] text-white shadow-xs"
                      : "bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
                  }`}
                >
                  Semua Siswa ({sessions.length})
                </button>
                <button
                  onClick={() => setFilterAnomalyOnly(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filterAnomalyOnly
                      ? "bg-red-600 text-white shadow-xs"
                      : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                  }`}
                >
                  Hanya Anomali ({anomalyCount})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--outline)]" />
                <input
                  type="text"
                  placeholder="Cari nama atau NISN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[var(--surface-container)] border border-[var(--outline-variant)]/30 text-[var(--on-surface)]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]/20 text-[var(--on-surface-variant)] font-semibold">
                    <th className="py-3 px-3">Siswa</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Progress Soal</th>
                    <th className="py-3 px-3">Sisa Waktu</th>
                    <th className="py-3 px-3">Anomali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--outline-variant)]/10">
                  {filteredSessions.map((s) => {
                    const isSelected = selectedStudent?.studentId === s.studentId;
                    return (
                      <tr
                        key={s.studentId}
                        onClick={() => setSelectedStudent(s)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[var(--primary-container)]/10"
                            : "hover:bg-[var(--surface-container)]/50"
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[var(--on-surface)]">{s.studentName}</div>
                          <div className="text-[10px] font-mono-data text-[var(--on-surface-variant)]">{s.nisn}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === "in_progress"
                              ? "bg-blue-500/10 text-blue-700"
                              : s.status === "force_submitted"
                              ? "bg-red-500/10 text-red-700"
                              : "bg-emerald-500/10 text-emerald-700"
                          }`}>
                            {s.status === "in_progress" ? "Mengerjakan" : s.status === "force_submitted" ? "Dipaksa Selesai" : "Selesai"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-[var(--surface-container)] rounded-full overflow-hidden">
                              <div
                                style={{ width: `${(s.answeredCount / s.totalQuestions) * 100}%` }}
                                className="h-full bg-[var(--primary)] rounded-full"
                              />
                            </div>
                            <span className="font-mono-data text-[11px] text-[var(--on-surface)]">
                              {s.answeredCount}/{s.totalQuestions}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono-data text-[var(--on-surface-variant)]">
                          {Math.floor(s.remainingSeconds / 60)} mnt
                        </td>
                        <td className="py-3 px-3">
                          {s.anomalyCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/10 text-red-600 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" />
                              {s.anomalyCount} Anomali
                            </span>
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-medium">Normal</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {selectedStudent && (
            <div className="bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--outline-variant)]/20 pb-4">
                <div>
                  <h3 className="font-bold text-base text-[var(--on-surface)]">{selectedStudent.studentName}</h3>
                  <span className="text-xs font-mono-data text-[var(--on-surface-variant)]">NISN: {selectedStudent.nisn}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedStudent.anomalyCount > 0 ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-700"
                }`}>
                  {selectedStudent.anomalyCount > 0 ? `${selectedStudent.anomalyCount} Anomali` : "Aktivitas Bersih"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--surface-container-low)]">
                  <span className="text-[10px] text-[var(--on-surface-variant)] block">Soal Terjawab</span>
                  <span className="font-bold text-base text-[var(--on-surface)] font-mono-data">
                    {selectedStudent.answeredCount} / {selectedStudent.totalQuestions}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-container-low)]">
                  <span className="text-[10px] text-[var(--on-surface-variant)] block">Sisa Waktu</span>
                  <span className="font-bold text-base text-[var(--primary)] font-mono-data">
                    {Math.floor(selectedStudent.remainingSeconds / 60)}:00
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--on-surface)] block">
                  Log Riwayat Anomali Live
                </span>
                {selectedStudent.anomalyCount > 0 ? (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-800">
                      <div className="flex items-center justify-between font-bold">
                        <span>Pindah Tab Browser</span>
                        <span className="text-[10px] font-mono-data">08:44:05 WIB</span>
                      </div>
                      <p className="text-[11px] mt-0.5">Siswa meninggalkan halaman ujian selama 18 detik.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800">
                      <div className="flex items-center justify-between font-bold">
                        <span>Keluar Layar Penuh</span>
                        <span className="text-[10px] font-mono-data">08:49:12 WIB</span>
                      </div>
                      <p className="text-[11px] mt-0.5">Siswa menekan tombol escape dari mode fullscreen.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[var(--surface-container-low)] text-center text-xs text-[var(--on-surface-variant)]">
                    Tidak ada catatan kecurangan atau anomali terdeteksi untuk siswa ini.
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--outline-variant)]/20 space-y-2">
                <button
                  onClick={() => handleTeacherAction("warning")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-xs"
                >
                  <AlertCircle className="w-4 h-4" />
                  Kirim Peringatan ke Layar Siswa
                </button>

                <button
                  onClick={() => handleTeacherAction("force_submit")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
                >
                  <Ban className="w-4 h-4" />
                  Paksa Selesai Ujian (Force Submit)
                </button>

                <button
                  onClick={() => handleTeacherAction("reset_session")}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[var(--outline-variant)]/40 text-xs font-semibold text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Sesi &amp; Waktu
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function LiveCBTMonitoringPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--surface)] text-xs font-semibold text-[var(--on-surface-variant)]">Memuat monitoring live...</div>}>
      <LiveMonitoringContent />
    </Suspense>
  );
}
