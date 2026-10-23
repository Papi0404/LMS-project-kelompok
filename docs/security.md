# Keamanan & Kebijakan Anti-Cheat EduCore LMS

## 1. Integritas Ujian CBT (Server-Side Enforcement)
- **Kerahasiaan Kunci Jawaban**: Endpoint pengiriman soal (`/api/v1/exams/[id]/take`) menyaring dan menghapus field `correctOptionId` dari response payload. Kunci jawaban tidak pernah sampai ke browser siswa.
- **Otoritas Waktu Ujian**: Countdown timer dihitung berdasarkan `endTime` yang ditetapkan server saat attempt dimulai. Request jawaban atau submit yang tiba melewati batas waktu otomatis ditolak server-side.
- **Penilaian Otomatis di Server**: Siswa hanya mengirimkan opsi yang dipilih (`selectedOptionId`). Perhitungan skor dilakukan murni di server dengan mencocokkan kunci jawaban.

## 2. Sensor Deteksi Anomali Live (Anti-Cheat Proctored)
- Sensor browser mendeteksi event `visibilitychange` (perpindahan tab) dan `fullscreenchange` (keluar dari layar penuh).
- Setiap anomali dikirim ke endpoint `/api/v1/exams/[id]/log-event` dan dicatat ke tabel `exam_audit_logs`.
- Guru atau pengawas dapat melihat timeline pelanggaran secara real-time pada halaman Monitoring CBT Live dan mengambil tindakan intervensi (kirim peringatan, force submit, atau reset sesi).

## 3. Otorisasi Berbasis Peran (RBAC) & Database RLS
- Peran didukung: `admin`, `teacher`, `student`.
- Siswa dibatasi hanya dapat membaca data kursus terdaftar dan hasil ujian miliknya sendiri.
- Guru dibatasi hanya dapat mengelola kursus yang diampunya dan siswa dalam kelasnya.
- Seluruh tabel database PostgreSQL mengaktifkan Row Level Security (RLS) dengan kebijakan least-privilege.
- Service Role Key diisolasi di `src/lib/supabase/admin.ts` dengan penanda `import 'server-only'`.