# Serenada — Penambahan Pengaturan Link Demo Web di Panel Admin & Tombol Demo di Katalog

Fitur baru untuk memungkinkan administrator mengatur dan memperbarui URL link demo web undangan yang sudah jadi untuk setiap template desain, serta menampilkan tombol "Lihat Demo" secara langsung pada kartu produk di katalog pengguna yang mengarahkan pembeli ke link demo yang telah diatur oleh admin.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan dan preferensi pengguna yang telah dikonfirmasi:
> - **Penempatan Tombol Demo**: Tombol "Lihat Demo" ditampilkan langsung pada setiap kartu katalog produk di samping tombol "Pilih & Edit" dengan tautan langsung (membuka tab baru `target="_blank"` atau pratinjau).
> - **Area Pengaturan Admin**: Disediakan sub-menu / tab khusus di Panel Admin bernama **"Pengaturan Link Demo"** yang menampilkan daftar seluruh template, input URL demo aktif, tombol "Uji Buka Link", serta tombol simpan cepat. Admin juga dapat memasukkan link demo saat menambah template baru.
> - **Logika Kondisional Link Kosong**: Jika template belum memiliki link demo khusus dari admin (string kosong atau `undefined`), tombol "Lihat Demo" otomatis **disembunyikan** dari kartu katalog sehingga tampilan tetap rapi tanpa ada tombol rusak/mati.

---

## 1. Overview & Core Concept

- **What It Does**: Memberi fleksibilitas bagi pemilik bisnis/admin undangan untuk menautkan URL website undangan asli yang sudah diproduksi (misalnya contoh undangan live dari klien terdahulu) ke template katalog terkait. Calon pengantin dapat langsung meninjau hasil jadi undangan sebenarnya sebelum memutuskan untuk melakukan pemesanan dan kustomisasi.
- **Target Audience**:
  - *Calon Pengantin*: Mendapatkan kepastian visual atas hasil jadi undangan digital dengan mengklik tombol "Lihat Demo".
  - *Admin*: Dapat dengan mudah memperbarui atau mengganti link demo kapan saja tanpa perlu mengubah kode sumber.
- **Key Value**: Meningkatkan kepercayaan dan tingkat konversi calon pengantin melalui pembuktian portofolio nyata (*real live sample*).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Alur Admin (Mengatur & Mengubah Link Demo)**:
   - Admin membuka tab **Admin Manajemen** $\to$ memilih sub-tab baru **"Link Demo Web"**.
   - Admin melihat daftar seluruh template undangan (foto cover, nama template, kategori).
   - Di samping tiap template, terdapat input field URL Demo (contoh: `https://undangan-alex-beatrice.serenada.id` atau URL web jadi lainnya).
   - Admin dapat mengklik tombol **"Tes Buka Link"** untuk memverifikasi apakah URL valid dan aktif.
   - Admin mengklik tombol **"Simpan Link"**; sistem memunculkan toast konfirmasi dan menyimpan perubahan ke state global serta `localStorage`.
   - Admin juga dapat mengisi kolom "Link Demo Jadi" saat menambahkan template baru via modal tambah desain.

2. **Alur Calon Pengantin (Menelusuri & Mengakses Demo)**:
   - Pengunjung membuka halaman **Katalog Desain**.
   - Pada kartu template yang telah memiliki URL demo, muncul tombol sekunder estetik: **"Lihat Demo"** dengan ikon external link.
   - Jika admin belum menyetel link demo pada template tertentu, kartu hanya menampilkan tombol utama "Pilih & Edit", menjaga kebersihan antarmuka (*zero broken affordances*).
   - Saat tombol "Lihat Demo" diklik, web demo langsung terbuka di tab baru secara mulus.

### Visual Styling

- Menggunakan tombol beroutline halus (`border border-stone-300 text-stone-700 hover:bg-[#FAF8F5]`) yang serasi dengan tombol primer hijau sage (`bg-[#2D4030] text-white`).
- Kolom input link di Admin dilengkapi ikon tautan (`Link2`), validasi URL, dan indikator status hijau jika link aktif terisi.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Tab Khusus "Link Demo Web" di Panel Admin**:
  - *Chosen Approach*: Menyediakan tab terdedikasi di samping "Daftar Pesanan" dan "Kelola Katalog" agar admin dapat meninjau dan mengedit semua link demo secara terpusat dalam satu layar tanpa harus masuk ke modal edit satu per satu.
  - *Why*: Sangat efisien bagi admin yang mengelola banyak template dan sering memperbarui contoh undangan terbaru.
- **Decision 2: Hide-if-Empty Conditional Display**:
  - *Chosen Approach*: Tombol hanya di-render jika `template.demoUrl && template.demoUrl.trim().length > 0`.
  - *Why*: Sesuai preferensi user, menghindari tombol tanpa aksi (*dead click*) dan menjaga estetika kartu produk.
- **Decision 3: Default Seed Demo Links**:
  - *Chosen Approach*: Menyertakan beberapa contoh link demo realistis pada data awal bawaan (seperti rute simulasi undangan atau tautan portofolio) sehingga fitur langsung terlihat dan dapat diuji seketika oleh pengguna.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Serenada Demo Link Architecture                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
┌──────────────────────────────────────────┐    ┌──────────────────────────────────────────┐
│             Admin Dashboard              │    │          Catalog Product Card            │
│  • Tab Baru: "Link Demo Web"             │    │  • Check: has demoUrl?                   │
│  • URL Input per template                │    │    ├── Yes: Render "Lihat Demo" Button   │
│  • Quick "Tes Buka Link" button          │    │    └── No:  Hidden cleanly               │
│  • Modal Tambah: Field "URL Demo"        │    │  • Action: window.open(demoUrl, '_blank')│
└──────────────────────────────────────────┘    └──────────────────────────────────────────┘
                    │                                         │
                    └─────────────────────┬───────────────────┘
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 Shared State Layer (AppStorage / Context)                   │
│  • WeddingTemplate.demoUrl?: string                                         │
│  • updateTemplateDemoUrl(templateId: string, url: string)                   │
│  • LocalStorage sync & reactive state propagation                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Model Updates

```typescript
// types/index.ts
export interface WeddingTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  price: number;
  originalPrice: number;
  coverImage: string;
  description: string;
  badge?: string;
  demoUrl?: string; // <-- URL Web Undangan yang sudah jadi
  palette: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    accent: string;
  };
  features: string[];
  isActive: boolean;
  salesCount: number;
}
```

### Component Modifications Plan

1. **`types/index.ts`**: Menambahkan properti opsional `demoUrl?: string` ke interface `WeddingTemplate`.
2. **`data/initialData.ts`**: Menyematkan contoh `demoUrl` realistis pada template bawaan.
3. **`context/AppContext.tsx`**: Menambahkan handler `updateTemplateDemoUrl(templateId: string, demoUrl: string)`.
4. **`components/CatalogSection.tsx`**: Menambahkan tombol "Lihat Demo" pada kartu template jika `template.demoUrl` terisi.
5. **`components/AdminDashboard.tsx`**:
   - Menambahkan sub-tab ke-3: **"Link Demo Web"** berisi tabel manajemen link demo untuk semua template, input URL, tombol uji link, dan tombol simpan.
   - Menambahkan field input "URL Demo Jadi" pada modal tambah template baru.
6. **Verifikasi**: Jalankan `compile_applet` dan `lint_applet` untuk memastikan tidak ada regresi build.
