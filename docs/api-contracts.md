# Kontrak API EduCore LMS (v1)

## 1. Administrasi Pengguna
- `GET /api/v1/admin/users`: Mengambil daftar pengguna (Admin only, mendukung filter `role`, `status`, dan `q`).
- `PATCH /api/v1/admin/users`: Mengubah status akun (`active`, `pending`, `suspended`) atau mengirim tautan reset sandi.

## 2. Ujian CBT Siswa
- `GET /api/v1/exams/[examId]/take`: Mengambil soal ujian aman tanpa kunci jawaban beserta timer server (Student only).
- `POST /api/v1/exams/[examId]/answer`: Menyimpan jawaban siswa sementara dengan validasi batas waktu (Student only).
- `POST /api/v1/exams/[examId]/submit`: Mengakhiri ujian dan menghitung skor akhir di server (Student only).
- `POST /api/v1/exams/[examId]/log-event`: Mencatat anomali browser anti-cheat (pindah tab, exit fullscreen).

## 3. Pengawasan Ujian Guru
- `GET /api/v1/teacher/exams/[examId]/live`: Mengambil status real-time seluruh peserta ujian dan statistik anomali (Teacher/Admin only).
- `POST /api/v1/teacher/exams/[examId]/action`: Mengirim pesan peringatan, force submit, atau reset sesi siswa (Teacher/Admin only).