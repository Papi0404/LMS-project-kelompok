"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Bell } from "lucide-react";

export function Navbar({ activeRole = "admin" }: { activeRole?: "admin" | "teacher" | "student" }) {
  const router = useRouter();
  const pathname = usePathname();
  

  const handleRoleChange = async (newRole: "admin" | "teacher" | "student") => {
    
    await fetch("/api/v1/auth/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    
    if (newRole === "admin") router.push("/admin/dashboard");
    else if (newRole === "teacher") router.push("/teacher/dashboard");
    else router.push("/student/dashboard");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--outline-variant)]/40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[var(--on-surface)] tracking-tight">EduCore</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[var(--primary-container)]/10 text-[var(--primary)]">
                LMS Platform
              </span>
            </div>
            <p className="text-[11px] text-[var(--on-surface-variant)] -mt-0.5">Sistem Akademik &amp; CBT Terpadu</p>
          </div>
        </div>

        {/* Center Quick Navigation based on role */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--surface-container)]/60 p-1 rounded-xl">
          <a
            href="/admin/dashboard"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pathname.includes("/admin/dashboard")
                ? "bg-white text-[var(--primary)] shadow-xs font-semibold"
                : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
            }`}
          >
            Admin Dashboard
          </a>
          <a
            href="/admin/users"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pathname.includes("/admin/users")
                ? "bg-white text-[var(--primary)] shadow-xs font-semibold"
                : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
            }`}
          >
            Manajemen Pengguna
          </a>
          <a
            href="/teacher/dashboard"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pathname.includes("/teacher/dashboard")
                ? "bg-white text-[var(--primary)] shadow-xs font-semibold"
                : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
            }`}
          >
            Dashboard Guru
          </a>
          <a
            href="/teacher/exams/e1111111-1111-1111-1111-111111111111/live"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pathname.includes("/live")
                ? "bg-white text-[var(--primary)] shadow-xs font-semibold"
                : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
            }`}
          >
            Monitoring CBT Live
          </a>
          <a
            href="/student/dashboard"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pathname.includes("/student/dashboard")
                ? "bg-white text-[var(--primary)] shadow-xs font-semibold"
                : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
            }`}
          >
            Dashboard Siswa
          </a>
          <a
            href="/student/exams/e1111111-1111-1111-1111-111111111111/take"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pathname.includes("/take")
                ? "bg-white text-[var(--primary)] shadow-xs font-semibold"
                : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
            }`}
          >
            Ujian CBT Siswa
          </a>
        </nav>

        {/* Right Tools & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Interactive Role Switcher Pill */}
          <div className="flex items-center bg-[var(--surface-container-high)] p-1 rounded-xl gap-1">
            <span className="text-[11px] font-semibold text-[var(--on-surface-variant)] px-2">Role:</span>
            <button
              onClick={() => handleRoleChange("admin")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeRole === "admin"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--on-surface-variant)] hover:bg-white/60"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => handleRoleChange("teacher")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeRole === "teacher"
                  ? "bg-[var(--secondary-container)] text-white shadow-xs"
                  : "text-[var(--on-surface-variant)] hover:bg-white/60"
              }`}
            >
              Guru
            </button>
            <button
              onClick={() => handleRoleChange("student")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeRole === "student"
                  ? "bg-[var(--tertiary)] text-white shadow-xs"
                  : "text-[var(--on-surface-variant)] hover:bg-white/60"
              }`}
            >
              Siswa
            </button>
          </div>

          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--surface-container)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)] transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--error)] animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
}