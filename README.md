# MLBB BETA WhatsApp Bot

Bot starter untuk WhatsApp **resmi** memakai Meta WhatsApp Cloud API. Bot membalas pesan teks dan mengenali:
- `menu` — menu utama
- `1` / `harga` — daftar harga
- `2` / `pembayaran` — metode pembayaran (tanpa pulsa)
- `3` / `request` — info request maksimal 10 cabang
- `4` / `admin` — tautan chat admin

Harga sudah diatur: 3 cabang Rp6.000, 6 cabang Rp12.000.
Nomor admin: 0857-9759-1577.

## Yang dibutuhkan
- Node.js 18 atau lebih baru
- Akun Meta for Developers dan aplikasi WhatsApp Cloud API
- WhatsApp Business Account / nomor yang disiapkan di Meta
- Hosting publik HTTPS agar Meta bisa mengakses webhook

## Menjalankan secara lokal
1. Pasang Node.js 18+.
2. Buka folder proyek di terminal.
3. Jalankan `npm install`.
4. Atur variabel lingkungan sesuai `.env.example` (jangan unggah token ke GitHub).
5. Jalankan `npm start`.

Webhook lokal belum dapat menerima pesan dari Meta sampai dipublikasikan melalui HTTPS (misalnya hosting atau tunnel untuk pengujian).

## Menghubungkan ke Meta
1. Buat aplikasi di Meta for Developers dan tambahkan produk WhatsApp.
2. Dari WhatsApp > API Setup, salin access token dan Phone Number ID.
3. Deploy proyek ini ke hosting yang menyediakan HTTPS.
4. Atur variabel `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, dan `VERIFY_TOKEN` di hosting.
5. Pada konfigurasi webhook Meta, masukkan URL `https://DOMAIN-KAMU/webhook` dan Verify Token yang sama dengan `VERIFY_TOKEN`.
6. Subscribe ke field webhook `messages`.
7. Uji menggunakan nomor uji Meta terlebih dahulu, lalu ikuti proses verifikasi/penyiapan nomor untuk produksi.

## Catatan penting
- File ini adalah kode starter; bot belum aktif hanya dengan mengunduhnya.
- Jangan membagikan access token, OTP, atau kredensial.
- Ikuti kebijakan WhatsApp/Meta. Pesan bisnis yang dimulai oleh bisnis di luar jendela layanan pelanggan mungkin memerlukan template pesan yang disetujui.
- `GRAPH_API_VERSION` bisa perlu diperbarui mengikuti versi Graph API yang didukung akun Meta Anda.
