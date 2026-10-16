# Serenada — Redesign Tema Biru Muda & Putih, Autentikasi Multi-Role, Upload Foto Admin, dan Pembayaran Manual QRIS via WhatsApp

Pembaruan menyeluruh sistem Serenada dengan palet visual baru **Biru Muda & Putih Elegan (*Powder Sky Blue & Crisp White*)**, sistem gerbang **Login & Registrasi dengan pemisahan peran (*Role-Based Access Control*: Admin vs User/Pelanggan)** sebelum masuk ke aplikasi, fitur **Upload Foto langsung dari galeri perangkat HP/laptop** untuk template undangan di Panel Admin, serta integrasi **Pembayaran Manual QRIS dengan pengunggahan bukti bayar dan pengiriman pesan konfirmasi otomatis langsung ke WhatsApp Admin**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan dan preferensi pengguna yang telah dikonfirmasi:
> - **Sistem Login & Pemisahan Role**: Gerbang login sebelum masuk web menggunakan form email dan password standar, lengkap dengan tab/modal registrasi akun baru. Terdapat dua role utama:
>   - **Role User (Calon Pengantin)**: Mengakses Katalog Undangan, Live Studio Kustomisasi Nama, Checkout & Pembayaran, serta Simulasi Undangan Tamu. Menu Admin disembunyikan.
>   - **Role Admin (Pemilik Bisnis)**: Mengakses penuh Dashboard Admin (Manajemen Pesanan, Tambah & Edit Katalog, Upload Foto, Pengaturan QRIS Manual, Pengaturan Link Demo) serta bebas berpindah ke tampilan pengguna.
>   - Disediakan kredensial demo cepat (*one-click fill demo*) untuk akun Admin (`admin@serenada.id`) dan akun User (`user@serenada.id`) agar pengujian instan dan mudah.
> - **Kirim Bukti Pembayaran ke WhatsApp Admin**: Pada opsi pembayaran manual QRIS, pelanggan dapat mengunggah foto bukti transfer/struk bayar, lalu mengklik tombol **"Kirim Bukti Bayar ke WhatsApp Admin"** yang otomatis membuka tautan WhatsApp (`https://wa.me/[NoAdmin]?text=...`) dengan pesan template terstruktur rapi (No Order, Nama Pemesan, Nama Pengantin, Nominal, dan Waktu Bayar). Nomor WA admin dapat diatur fleksibel di Panel Admin.
> - **Mekanisme Upload Foto di Admin**: Admin dapat mengunggah file foto cover template secara langsung dari penyimpanan HP atau laptop (menggunakan *file reader base64* tersimpan di browser) atau memasukkan URL gambar eksternal, lengkap dengan pratinjau gambar instan.
> - **Transformasi Tema Warna (Biru Muda & Putih)**: Seluruh rona sage digantikan dengan palet mewah *Serene Powder Blue & Cloud White*: latar belakang biru muda salju (`#F0F7FD` / `#E8F3FC`), kartu putih bersih (`#FFFFFF`), aksen biru laut kerajaan (`#1E3A8A` / `#2563EB`), serta border halus biru es (`#D4E5F5`).

---

## 1. Overview & Core Concept

- **What It Does**:
  1. Menyediakan *Authentication Gate* (Login & Registrasi) sebelum pengunjung dapat mengakses fitur aplikasi, menyaring akses antara Pelanggan (User) dan Pengelola (Admin).
  2. Mengganti tema visual keseluruhan menjadi biru muda lembut (*baby/powder blue*) berpadu putih bersih yang memberikan kesan suci, tenang, dan modern untuk tema pernikahan.
  3. Memungkinkan Admin mengunggah file foto template undangan langsung dari galeri lokal perangkat (HP/laptop) dengan live preview sebelum disimpan ke katalog.
  4. Menyediakan alur pembayaran manual QRIS bagi pelanggan dengan upload bukti pembayaran dan integrasi instan *Direct WhatsApp* ke nomor admin untuk verifikasi cepat.
- **Target Audience / Persona**:
  - *Admin/Owner*: Mengatur katalog, foto template, verifikasi pesanan, nomor WhatsApp tujuan bukti bayar, dan link demo.
  - *Calon Pengantin (User)*: Memilih desain berpenampilan biru muda segar, menyesuaikan nama mempelai, membayar via QRIS otomatis atau QRIS manual dengan konfirmasi ke WhatsApp Admin.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Alur Login & Registrasi (Authentication Gate)**:
   - Pengunjung pertama kali diarahkan ke halaman Login yang elegan bertema biru muda dan putih.
   - Pilihan: Masuk dengan Email & Password, atau beralih ke tab Registrasi Akun Baru (Nama, Email, Password, Pilihan Peran: Calon Pengantin / Admin Bisnis).
   - Disediakan tombol jalan pintas demo (*Quick Demo Login*: "Masuk sebagai Admin" & "Masuk sebagai User") untuk kenyamanan uji coba.
   - Setelah login berhasil, User diarahkan ke Katalog, sedangkan Admin diarahkan langsung ke Dashboard Manajemen (atau Katalog dengan akses penuh ke Admin Panel).
   - Di navbar pojok kanan atas terdapat info profil pengguna yang aktif beserta tombol Logout.

2. **Alur Upload Foto di Panel Admin**:
   - Di tab **Kelola Katalog**, tombol "+ Tambah Template Baru" kini menyediakan dua opsi upload gambar cover:
     - **Tab File Gambar**: Drag-and-drop atau klik untuk memilih file JPG/PNG dari galeri HP/laptop dengan *instant file preview thumbnail*.
     - **Tab URL**: Opsi manual memasukkan link gambar web.
   - Begitu file dipilih, sistem membaca data secara lokal dan me-render kartu template baru secara instan di katalog.

3. **Alur Pembayaran Manual QRIS & Kirim Bukti ke WhatsApp Admin**:
   - Pada halaman Checkout Pembayaran, terdapat opsi **"QRIS Manual & Konfirmasi WA"** di samping QRIS Otomatis dan Virtual Account.
   - Pelanggan melihat kode QRIS toko, nominal unik pembayaran, dan kotak drop-zone **"Upload Bukti Transfer / Struk"**.
   - Setelah memilih foto bukti transfer dari perangkat, muncul tombol utama berwarna hijau WhatsApp: **"Kirim Bukti Pembayaran ke WhatsApp Admin"**.
   - Saat diklik, sistem membuka WhatsApp Web atau aplikasi WA dengan nomor admin yang telah dikonfigurasi (default: `6281234567890`), menyertakan draf pesan otomatis:
     ```
     Halo Admin Serenada, saya ingin konfirmasi pembayaran undangan pernikahan:
     • No. Pesanan: #SRN-84291
     • Nama Pemesan: Dimas Prasetyo
     • Mempelai: Dimas & Sarah
     • Template: Botanical Serenade
     • Total Bayar: Rp 349.000
     Mohon diverifikasi pesanan saya. Terima kasih!
     ```
   - Di Panel Admin, pesanan ini masuk dengan status `MENUNGGU VERIFIKASI BUKTI BAYAR`, dan admin dapat melihat pratinjau bukti bayar yang diupload serta langsung mengklik "Tandai Lunas".

### Visual Identity & Theme (Biru Muda & Putih)

- **60% Canvas**: Latar belakang bernuansa biru muda lembut dan tenang (`#F0F7FD` & `#EBF4FA`).
- **30% Structural**: Kartu putih bersih (`#FFFFFF`), border biru es halus (`#D4E5F5`), aksen biru safir berkelas (`#1E3A8A`, `#2563EB`), dan teks slate gelap (`#0F172A`).
- **10% Accent**: *Baby Blue Soft Highlights* (`#60A5FA` / `#38BDF8`) dan *Emerald Green* untuk tombol konfirmasi WhatsApp.
- **Typography**: `Playfair Display` untuk judul romantis dan monogram pengantin; `Plus Jakarta Sans` untuk legibilitas antarmuka login dan formulir; `JetBrains Mono` untuk kode order dan harga.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Persistent Role Authentication**:
  - *Chosen Approach*: Otentikasi berbasis session state tersimpan di `localStorage` dengan akun demo bawaan Admin (`admin@serenada.id`) dan User (`user@serenada.id`), serta form registrasi dinamis.
  - *Why*: Menghadirkan gerbang login nyata dan pembatasan peran tanpa latensi server atau kegagalan koneksi pihak ketiga, memungkinkan pengujian multi-role secara instan.
- **Decision 2: Local File Upload via FileReader Base64**:
  - *Chosen Approach*: Menggunakan API `FileReader.readAsDataURL()` pada browser.
  - *Why*: Pengguna dapat mengunggah foto apa pun dari galeri smartphone atau laptop tanpa memerlukan server penyimpanan cloud eksternal (S3/Cloudinary), dan foto langsung tampil di katalog dan studio.
- **Decision 3: WhatsApp Click-to-Chat Integration**:
  - *Chosen Approach*: URL standard `https://wa.me/{phone}?text={encodedText}` dengan nomor WhatsApp admin yang dapat diedit langsung dari panel admin.
  - *Why*: Sangat ramah pengguna di Indonesia, membuka aplikasi WhatsApp langsung di smartphone pelanggan atau WhatsApp Web di desktop.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Serenada Multi-Role System Architecture               │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│           Auth Gate (Login)           │   │             Session Store             │
│  • Email & Password Form              │──▶│  • currentUser: User | null           │
│  • Register New Account               │   │  • role: 'admin' | 'user'             │
│  • Quick One-Click Demo Logins        │   │  • isAuthenticated: boolean           │
└───────────────────────────────────────┘   └───────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼ (If Role === 'user')                                ▼ (If Role === 'admin')
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│            User Experience            │   │            Admin Experience           │
│  • New Soft Baby Blue & White Theme   │   │  • Full Admin Dashboard & Analytics   │
│  • Catalog & Live Studio Customizer   │   │  • Upload Foto Template dari Perangkat│
│  • QRIS Manual & Kirim Bukti ke WA    │   │  • Kelola Nomor WhatsApp Admin        │
│  • Live Guest Invitation Simulation   │   │  • Verifikasi Bukti Pembayaran Manual │
│  • Hidden Admin Access                │   │  • Switch to User View Seamlessly     │
└───────────────────────────────────────┘   └───────────────────────────────────────┘
```

### Data Model Updates

```typescript
// types/index.ts
export type UserRole = 'admin' | 'user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export type PaymentMethodType = 'qris' | 'qris_manual' | 'va_bca' | 'va_mandiri' | 'va_bri' | 'va_bni';

export interface Order {
  // ... existing fields
  paymentProofImage?: string; // Base64 / URL bukti transfer manual
  waConfirmationSent?: boolean;
}
```

### Step-by-Step Implementation Sequence

1. **`types/index.ts`**: Menambahkan interface `UserAccount`, `UserRole`, dan opsi pembayaran `qris_manual` serta `paymentProofImage`.
2. **`context/AppContext.tsx`**:
   - Menambahkan state `currentUser`, `loginUser`, `registerUser`, `logoutUser`, `adminWhatsAppNumber`, `updateAdminWhatsApp`.
   - Menambahkan akun bawaan admin (`admin@serenada.id`) dan user (`user@serenada.id`).
3. **`components/AuthGate.tsx`**:
   - Tampilan login & registrasi bertema biru muda & putih lembut dengan tombol uji coba cepat (*Quick Demo Login*).
4. **`components/Navbar.tsx`**:
   - Restyle warna ke biru muda & putih; kondisional menyembunyikan menu "Admin Manajemen" jika role adalah `user`; menambahkan info avatar & tombol Logout.
5. **`components/CatalogSection.tsx` & `components/HeroSection.tsx`**:
   - Restyle warna dari hijau sage ke biru muda lembut (`#F0F7FD`, `#1E3A8A`, `#2563EB`, `#FFFFFF`).
6. **`components/PaymentCheckout.tsx`**:
   - Restyle tema ke biru muda & putih.
   - Menambahkan metode **"QRIS Manual & Konfirmasi WA"**: upload gambar bukti struk dan tombol `Kirim Bukti Pembayaran ke WhatsApp Admin`.
7. **`components/AdminDashboard.tsx`**:
   - Fitur **Upload Foto** langsung dari galeri HP/laptop (file input dengan FileReader) pada form penambahan template baru.
   - Pengaturan nomor WhatsApp Admin tujuan pengiriman bukti transfer.
   - Tinjauan foto bukti transfer pada modal detail pesanan.
8. **Verifikasi**: Uji build dengan `lint_applet` dan `compile_applet`.
