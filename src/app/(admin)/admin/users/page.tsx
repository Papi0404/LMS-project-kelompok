/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  KeyRound, 
  Ban, 
  CheckCircle
} from "lucide-react";
import { Profile, UserStatus } from "@/types/lms";

function UsersManagementContent() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<"biodata" | "courses" | "cbt">("biodata");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadUsers() {
      try {
        const params = new URLSearchParams();
        if (selectedRole !== "all") params.append("role", selectedRole);
        if (selectedStatus !== "all") params.append("status", selectedStatus);
        if (searchQuery) params.append("q", searchQuery);

        const res = await fetch(`/api/v1/admin/users?${params.toString()}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setUsers(data.data);
          setSelectedUser((prev) => prev || data.data[0] || null);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadUsers();
    return () => {
      isMounted = false;
    };
  }, [selectedRole, selectedStatus, searchQuery]);

  const handleUpdateStatus = async (userId: string, newStatus: UserStatus) => {
    const res = await fetch("/api/v1/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      setActionMessage(`Status pengguna berhasil diperbarui menjadi ${newStatus}.`);
      const refRes = await fetch("/api/v1/admin/users");
      const refData = await refRes.json();
      if (refData.success) setUsers(refData.data);
    }
  };

  const handleResetPassword = async (userId: string) => {
    const res = await fetch("/api/v1/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "reset_password" }),
    });
    const data = await res.json();
    if (data.success) {
      setActionMessage(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] flex flex-col">
      <Navbar activeRole="admin" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--on-surface)]">
              Manajemen Pengguna
            </h1>
            <p className="text-sm text-[var(--on-surface-variant)] mt-1">
              Kelola akun administrator, tenaga pengajar (guru), dan peserta didik (siswa).
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[var(--primary-container)] transition-all shadow-sm">
            <UserPlus className="w-4 h-4" />
            Tambah Pengguna Baru
          </button>
        </div>

        {actionMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-xl text-xs flex items-center justify-between">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage(null)} className="font-bold hover:underline">
              Tutup
            </button>
          </div>
        )}

        <div className="bg-[var(--surface-container-lowest)] p-4 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0">
            {["all", "student", "teacher", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  selectedRole === r
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"
                }`}
              >
                {r === "all" ? "Semua Peran" : r === "student" ? "Siswa" : r === "teacher" ? "Guru" : "Admin"}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--surface-container)] border border-[var(--outline-variant)]/30 text-[var(--on-surface)]"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="pending">Pending</option>
              <option value="suspended">Ditangguhkan</option>
            </select>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--outline)]" />
              <input
                type="text"
                placeholder="Cari nama, email, NIP/NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[var(--surface-container)] border border-[var(--outline-variant)]/30 text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[var(--surface-container-lowest)] rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]/20 text-[var(--on-surface-variant)] font-semibold">
                    <th className="py-3 px-4">Pengguna</th>
                    <th className="py-3 px-4">Identifier</th>
                    <th className="py-3 px-4">Peran</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--outline-variant)]/10">
                  {users.map((u) => {
                    const isSelected = selectedUser?.id === u.id;
                    return (
                      <tr
                        key={u.id}
                        onClick={() => setSelectedUser(u)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[var(--primary-container)]/10"
                            : "hover:bg-[var(--surface-container)]/50"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"}
                              alt={u.fullName}
                              className="w-8 h-8 rounded-full object-cover border border-[var(--outline-variant)]/40"
                            />
                            <div>
                              <div className="font-semibold text-[var(--on-surface)]">{u.fullName}</div>
                              <div className="text-[11px] text-[var(--on-surface-variant)]">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-[var(--on-surface-variant)]">
                          {u.identifierNumber || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              u.role === "admin"
                                ? "bg-purple-500/10 text-purple-700"
                                : u.role === "teacher"
                                ? "bg-[var(--secondary-container)]/10 text-[var(--secondary)]"
                                : "bg-[var(--primary-container)]/10 text-[var(--primary)]"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              u.status === "active"
                                ? "bg-emerald-500/10 text-emerald-700"
                                : u.status === "pending"
                                ? "bg-amber-500/10 text-amber-700"
                                : "bg-red-500/10 text-red-700"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(u);
                            }}
                            className="p-1 rounded-lg hover:bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {selectedUser && (
            <div className="bg-[var(--surface-container-lowest)] p-6 rounded-2xl border border-[var(--outline-variant)]/30 shadow-xs space-y-5">
              <div className="flex items-center gap-4 border-b border-[var(--outline-variant)]/20 pb-4">
                <img
                  src={selectedUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"}
                  alt={selectedUser.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[var(--primary-container)]/30"
                />
                <div>
                  <h3 className="font-bold text-base text-[var(--on-surface)]">{selectedUser.fullName}</h3>
                  <p className="text-xs text-[var(--on-surface-variant)]">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--primary-container)]/10 text-[var(--primary)] capitalize">
                      {selectedUser.role}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 capitalize">
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex border-b border-[var(--outline-variant)]/20 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("biodata")}
                  className={`pb-2 px-3 border-b-2 transition-all ${
                    activeTab === "biodata"
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-[var(--on-surface-variant)]"
                  }`}
                >
                  Biodata
                </button>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`pb-2 px-3 border-b-2 transition-all ${
                    activeTab === "courses"
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-[var(--on-surface-variant)]"
                  }`}
                >
                  Kursus (3)
                </button>
                <button
                  onClick={() => setActiveTab("cbt")}
                  className={`pb-2 px-3 border-b-2 transition-all ${
                    activeTab === "cbt"
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-[var(--on-surface-variant)]"
                  }`}
                >
                  Log CBT
                </button>
              </div>

              {activeTab === "biodata" && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[var(--outline-variant)]/10">
                    <span className="text-[var(--on-surface-variant)]">NIP / NISN</span>
                    <span className="font-mono-data font-semibold text-[var(--on-surface)]">
                      {selectedUser.identifierNumber || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--outline-variant)]/10">
                    <span className="text-[var(--on-surface-variant)]">No. Telepon</span>
                    <span className="text-[var(--on-surface)] font-medium">{selectedUser.phone || "-"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--outline-variant)]/10">
                    <span className="text-[var(--on-surface-variant)]">Terdaftar Sejak</span>
                    <span className="text-[var(--on-surface)] font-medium">12 Jan 2026</span>
                  </div>
                </div>
              )}

              {activeTab === "courses" && (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[var(--surface-container-low)]">
                    <div className="font-semibold text-[var(--on-surface)]">Fisika Teori &amp; Praktikum</div>
                    <div className="text-[11px] text-[var(--on-surface-variant)]">Kelas 10 MIPA 1 • 88% Selesai</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--surface-container-low)]">
                    <div className="font-semibold text-[var(--on-surface)]">Bahasa Indonesia</div>
                    <div className="text-[11px] text-[var(--on-surface-variant)]">Kelas 10 MIPA 1 • 92% Selesai</div>
                  </div>
                </div>
              )}

              {activeTab === "cbt" && (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[var(--surface-container-low)] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[var(--on-surface)]">PTS Fisika Terpadu</div>
                      <div className="text-[11px] text-[var(--on-surface-variant)]">Skor: 100 / 100</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">Lulus</span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[var(--outline-variant)]/20 space-y-2">
                <button
                  onClick={() => handleResetPassword(selectedUser.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[var(--outline-variant)]/40 text-xs font-semibold text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Kirim Tautan Sandi
                </button>

                {selectedUser.status === "active" ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedUser.id, "suspended")}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 text-red-600 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Tangguhkan Pengguna
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedUser.id, "active")}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 text-emerald-700 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Aktifkan Kembali Akun
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function UsersManagementPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--surface)] text-xs font-semibold text-[var(--on-surface-variant)]">Memuat manajemen pengguna...</div>}>
      <UsersManagementContent />
    </Suspense>
  );
}
