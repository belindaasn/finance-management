# 💸 Manajer Keuangan Pribadi

Aplikasi web modern untuk mengatur keuangan pribadi dalam Bahasa Indonesia. Dibuat dengan HTML, CSS, dan JavaScript.

🌐 **Demo**: [https://belindaasn.github.io/finance-management]
## ✨ Fitur Utama

- 📊 **Rencana Anggaran** - Atur budget harian/mingguan/bulanan/tahunan
- 🏷️ **Kategori Custom** - Buat kategori sesuai kebutuhan pribadi
- 🔄 **Reset Otomatis** - Budget reset otomatis sesuai periode
- 📈 **Progress Visual** - Lihat progress budget dengan grafik warna
- 💾 **Penyimpanan Lokal** - Data tersimpan di browser
- 📱 **PWA Support** - Bisa diinstall seperti aplikasi native
- 🌙 **Desain Modern** - Interface yang clean dan profesional

## 🚀 Cara Menggunakan

### 1. **Setup Budget Plan Pertama Kali**

**Step 1: Atur Periode Budget**
```
Pilih salah satu:
- Harian   → Reset setiap hari
- Mingguan → Reset setiap minggu  
- Bulanan  → Reset setiap bulan (recommended)
- Tahunan  → Reset setiap tahun
```

**Step 2: Set Total Budget**
```
Contoh: Rp 1.000.000 (uang jajan bulanan)
```

**Step 3: Tambah Kategori**
```
Klik "+ Tambah Kategori" untuk menambah kategori
Contoh kategori:
- Tabungan    : Rp 100.000
- Makan       : Rp 300.000  
- Transportasi: Rp 150.000
- Hiburan     : Rp 200.000
- Lain-lain   : Rp 250.000
```

**Step 4: Klik "Atur Rencana Anggaran"**

### 2. **Menambah Transaksi**

**Untuk Pemasukan (Income):**
```
Keterangan: "Gaji Bulanan", "Uang Jajan"
Jumlah    : Rp 1.000.000
Kategori  : Pilih "Pemasukan" 
Jenis     : Income
```

**Untuk Pengeluaran (Expense):**
```
Keterangan: "Makan Siang", "Bensin Motor", "Nonton Film"
Jumlah    : Rp 50.000
Kategori  : Pilih kategori yang sesuai
Jenis     : Expense
```

### 3. **Membaca Progress Budget**

**Warna Progress Bar:**
- 🟢 **Hijau** (On Track) - Masih di bawah 80% budget
- 🟡 **Kuning** (Near Limit) - Sudah 80-100% budget  
- 🔴 **Merah** (Over Budget) - Sudah melebihi budget

**Informasi di Budget Display:**
- **Total Anggaran** = Jumlah total budget periode ini
- **Total Terpakai** = Total yang sudah dikeluarkan
- **Sisa** = Sisa budget yang bisa dipakai
- **Reset Otomatis** = Waktu reset berikutnya

## 🎯 Penjelasan Fitur

### 💰 **Balance Section**
Menampilkan saldo saat ini (Total Pemasukan - Total Pengeluaran)

### 📋 **Budget Plan Section**
- **Periode Anggaran**: Pilih berapa lama budget berlaku
- **Total Anggaran**: Masukkan jumlah total uang yang tersedia
- **Kategori Custom**: Buat kategori pengeluaran sesuai kebutuhan

### 💳 **Transaction Form**
- **Keterangan**: Deskripsi transaksi (akan digunakan untuk auto-categorization)
- **Jumlah**: Nominal uang
- **Kategori**: Pilih dari kategori yang sudah dibuat
- **Jenis**: Pemasukan (uang masuk) atau Pengeluaran (uang keluar)

### 📝 **Transaction History**
Daftar semua transaksi yang pernah dilakukan, bisa dihapus jika ada kesalahan

### 📊 **Summary Cards**
- **Total Pemasukan**: Jumlah semua uang yang masuk
- **Total Pengeluaran**: Jumlah semua uang yang keluar

## 🔧 Tips & Trik

### 💡 **Best Practices**
1. **Input semua transaksi** - Jangan sampai ada yang terlewat
2. **Gunakan keterangan jelas** - Agar mudah dilacak
3. **Review mingguan** - Cek progress budget setiap minggu
4. **Adjust jika perlu** - Budget bisa diubah sesuai kebutuhan

### 🎨 **Customization**
- **Tambah/Kurangi Kategori** - Sesuaikan dengan kebutuhan
- **Ubah Periode** - Dari bulanan ke mingguan atau sebaliknya
- **Reset Manual** - Hapus transaksi untuk mulai baru

### 📱 **Mobile Usage**
- **Install sebagai app** - Buka di Chrome → Add to Home Screen
- **Offline capability** - Tetap bisa buka app tanpa internet
- **Touch-friendly** - Design optimized untuk mobile

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Structure aplikasi
- **CSS3** - Styling dan design modern
- **JavaScript (ES6)** - Logic dan functionality
- **Local Storage** - Penyimpanan data lokal
- **PWA** - Progressive Web App capabilities
- **GitHub Pages** - Hosting gratis

## 🐛 Troubleshooting

### ❌ Data hilang setelah refresh
**Solution**: Pastikan tidak membersihkan cache browser. Data tersimpan di local storage.

### ❌ Tidak bisa install sebagai app
**Solution**: 
- Buka di Chrome/Safari
- Tunggu beberapa detik
- Cek menu browser untuk "Add to Home Screen"

### ❌ Progress bar tidak update
**Solution**: Refresh halaman atau cek kategori transaksi

### ❌ Budget tidak reset otomatis
**Solution**: Aplikasi cek reset berdasarkan tanggal, pastikan device timezone benar

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek section troubleshooting di atas
2. Pastikan semua step diikuti dengan benar
3. Refresh halaman dan coba lagi

## 👨‍💻 Developer

Dibuat sebagai project sekolah untuk mata pelajaran **Teknologi Informasi dan Komunikasi**.

**Features untuk Guru:**
- ✅ Modern web technologies
- ✅ PWA capabilities  
- ✅ Responsive design
- ✅ Local storage implementation
- ✅ Real-time updates
- ✅ Professional UI/UX

---

**💡 Tips untuk Presentasi:**
1. Demo install sebagai app di HP
2. Tunjukkan auto-reset feature
3. Highlight progress visualizations
4. Jelaskan PWA advantages
5. Show responsive design di different devices

**Selamat menggunakan! 🎉**
