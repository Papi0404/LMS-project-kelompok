"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert 
} from "lucide-react";
import { ExamQuestionSafe, ExamAnswer } from "@/types/lms";

function ExamTakeContent() {
  const params = useParams();
  const examId = params.examId as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [examTitle, setExamTitle] = useState("");
  const [attemptId, setAttemptId] = useState("");
  const [questions, setQuestions] = useState<ExamQuestionSafe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selectedOptionId: string | null; isFlagged: boolean }>>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(5400); // 90 mins
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [examResult, setExamResult] = useState<{ score: number; totalCorrect: number; totalQuestions: number } | null>(null);
  const [warningAlert, setWarningAlert] = useState<string | null>(null);

  const handleAutoSubmit = useCallback(async () => {
    if (!attemptId) return;
    try {
      const res = await fetch(`/api/v1/exams/${examId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      });
      const data = await res.json();
      if (data.score !== undefined) {
        setExamResult(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, [attemptId, examId]);

  const autoSubmitRef = useRef(handleAutoSubmit);
  useEffect(() => {
    autoSubmitRef.current = handleAutoSubmit;
  }, [handleAutoSubmit]);

  useEffect(() => {
    async function loadExam() {
      try {
        const res = await fetch(`/api/v1/exams/${examId}/take`);
        const data = await res.json();
        if (data.success) {
          setExamTitle(data.data.exam.title);
          setAttemptId(data.data.attempt.id);
          setQuestions(data.data.questions);
          setRemainingSeconds(data.data.attempt.remainingSeconds);

          const ansMap: Record<string, { selectedOptionId: string | null; isFlagged: boolean }> = {};
          data.data.answers.forEach((a: ExamAnswer) => {
            ansMap[a.questionId] = { selectedOptionId: a.selectedOptionId, isFlagged: a.isFlagged };
          });
          setAnswers(ansMap);
        } else if (data.error?.code === "EXAM_EXPIRED") {
          alert("Batas waktu ujian telah berakhir.");
          router.push("/student/dashboard");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [examId, router]);

  useEffect(() => {
    if (remainingSeconds <= 0 || examResult) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          autoSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingSeconds, examResult]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && attemptId && !examResult) {
        setWarningAlert("Peringatan: Perpindahan tab terdeteksi oleh pengawas CBT!");
        await fetch(`/api/v1/exams/${examId}/log-event`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attemptId,
            eventType: "tab_switch",
            severity: "high",
            metadata: { timestamp: new Date().toISOString() },
          }),
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [attemptId, examId, examResult]);

  const handleSelectOption = async (optionId: string) => {
    if (!currentQuestion || examResult) return;

    const currentAnswer = answers[currentQuestion.id] || { selectedOptionId: null, isFlagged: false };
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: { ...currentAnswer, selectedOptionId: optionId },
    };
    setAnswers(newAnswers);

    setIsSyncing(true);
    try {
      await fetch(`/api/v1/exams/${examId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          questionId: currentQuestion.id,
          selectedOptionId: optionId,
          isFlagged: currentAnswer.isFlagged,
        }),
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleFlag = async () => {
    if (!currentQuestion || examResult) return;

    const currentAnswer = answers[currentQuestion.id] || { selectedOptionId: null, isFlagged: false };
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: { ...currentAnswer, isFlagged: !currentAnswer.isFlagged },
    };
    setAnswers(newAnswers);

    try {
      await fetch(`/api/v1/exams/${examId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          questionId: currentQuestion.id,
          selectedOptionId: currentAnswer.selectedOptionId,
          isFlagged: !currentAnswer.isFlagged,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const currentQuestion = questions[currentIndex];

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)] text-[var(--on-surface-variant)] text-xs font-semibold">
        Sinkronisasi ruang ujian CBT...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] pb-12">
      {/* Sticky Top Exam HUD */}
      <header className="sticky top-0 z-30 bg-[var(--surface-container-lowest)]/95 backdrop-blur-md border-b border-[var(--outline-variant)]/40 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h1 className="text-sm font-bold text-[var(--on-surface)] flex items-center gap-2">
                {examTitle || "Ujian Berlangsung"}
                <span className="text-[10px] uppercase font-mono-data tracking-wider px-2 py-0.5 rounded-md bg-[var(--surface-container-high)] text-[var(--primary)] font-bold">
                  Sesi Terenkripsi
                </span>
              </h1>
              <p className="text-[11px] text-[var(--on-surface-variant)]">
                Soal #{currentIndex + 1} dari {questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {isSyncing && (
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Tersimpan
              </span>
            )}

            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono-data text-xs font-bold ${
              remainingSeconds < 300 
                ? "bg-rose-500/15 text-rose-600 border border-rose-500/30 animate-pulse" 
                : "bg-[var(--surface-container-high)] text-[var(--on-surface)]"
            }`}>
              <Clock className="w-4 h-4 text-[var(--primary)]" />
              <span>{formatTimer(remainingSeconds)}</span>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={Boolean(examResult)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-container)] transition-colors shadow-xs"
            >
              Kumpulkan Ujian
            </button>
          </div>
        </div>
      </header>

      {warningAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{warningAlert}</span>
            </div>
            <button
              onClick={() => setWarningAlert(null)}
              className="text-[10px] uppercase tracking-wider underline hover:text-rose-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {currentQuestion && (
            <div className="bg-[var(--surface-container-lowest)] p-6 sm:p-8 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-xs font-bold text-[var(--primary)] px-2.5 py-1 rounded-lg bg-[var(--primary-container)]/15">
                  PERTANYAAN NO. {currentQuestion.questionNumber}
                </span>
                <span className="text-xs text-[var(--on-surface-variant)]">Bobot: {currentQuestion.points} Poin</span>
              </div>

              <div className="text-sm sm:text-base font-medium text-[var(--on-surface)] leading-relaxed">
                {currentQuestion.questionText}
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id]?.selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={Boolean(examResult)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 group ${
                        isSelected
                          ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--on-surface)] shadow-xs"
                          : "bg-[var(--surface-container-low)]/60 border-[var(--outline-variant)]/30 hover:border-[var(--primary)]/50 text-[var(--on-surface)]"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg font-mono-data text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] group-hover:bg-[var(--primary-container)]/20"
                        }`}
                      >
                        {opt.id.toUpperCase()}
                      </div>
                      <span className="text-xs sm:text-sm pt-0.5 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Question Footer Actions */}
              <div className="pt-6 border-t border-[var(--outline-variant)]/20 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleToggleFlag}
                  disabled={Boolean(examResult)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    answers[currentQuestion.id]?.isFlagged
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {answers[currentQuestion.id]?.isFlagged ? "Ditandai Ragu-Ragu" : "Tandai Ragu"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-container)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Sebelumnya
                  </button>

                  <button
                    disabled={currentIndex === questions.length - 1}
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-container)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--surface-container-lowest)] p-5 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-[var(--on-surface)] flex items-center justify-between">
              <span>Peta Soal Ujian</span>
              <span className="text-xs font-normal text-[var(--on-surface-variant)]">
                {Object.values(answers).filter((a) => a.selectedOptionId).length} / {questions.length} Terjawab
              </span>
            </h2>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isAnswered = ans && ans.selectedOptionId !== null;
                const isFlagged = ans && ans.isFlagged;
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl font-mono-data text-xs font-bold transition-all flex items-center justify-center relative ${
                      isCurrent ? "ring-2 ring-offset-2 ring-[var(--primary)]" : ""
                    } ${
                      isFlagged
                        ? "bg-amber-400 text-amber-950 font-black"
                        : isAnswered
                        ? "bg-emerald-600 text-white"
                        : "bg-[var(--surface-container)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)]"
                    }`}
                  >
                    {q.questionNumber}
                    {isAnswered && !isFlagged && (
                      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-white/80" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[var(--outline-variant)]/20 space-y-1.5 text-[11px] text-[var(--on-surface-variant)]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-md bg-emerald-600" />
                <span>Sudah dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-md bg-amber-400" />
                <span>Ragu-ragu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-md bg-[var(--surface-container)]" />
                <span>Belum dijawab</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface-container-lowest)] max-w-md w-full p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-[var(--on-surface)]">Konfirmasi Selesai Ujian</h3>
            <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
              Anda telah menjawab <strong>{Object.values(answers).filter((a) => a.selectedOptionId).length}</strong> dari <strong>{questions.length}</strong> soal yang tersedia. Apakah Anda yakin ingin mengakhiri sesi ujian CBT ini?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-container)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Kembali Periksa
              </button>
              <button
                onClick={async () => {
                  setShowConfirmModal(false);
                  await handleAutoSubmit();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-container)] transition-colors"
              >
                Ya, Kumpulkan Jawaban
              </button>
            </div>
          </div>
        </div>
      )}

      {examResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface-container-lowest)] max-w-md w-full p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-[var(--on-surface)]">Ujian Berhasil Dikumpulkan!</h3>
            <p className="text-xs text-[var(--on-surface-variant)]">
              Jawaban Anda telah diverifikasi dan dinilai secara aman oleh server EduCore.
            </p>
            <div className="p-4 rounded-xl bg-[var(--surface-container-low)] space-y-1">
              <span className="text-xs text-[var(--on-surface-variant)] font-semibold">Skor Akhir Anda</span>
              <div className="text-4xl font-extrabold text-[var(--primary)] font-mono-data">
                {examResult.score} / 100
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold">
                {examResult.totalCorrect} dari {examResult.totalQuestions} soal terjawab dengan benar
              </p>
            </div>
            <button
              onClick={() => router.push("/student/dashboard")}
              className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[var(--primary-container)] transition-colors"
            >
              Kembali ke Dashboard Siswa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentExamTakePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--surface)] text-xs font-semibold text-[var(--on-surface-variant)]">Memuat ruang ujian...</div>}>
      <ExamTakeContent />
    </Suspense>
  );
}
