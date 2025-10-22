# 💸 FinanceID - Manajer Keuangan Pribadi

Aplikasi web modern untuk mengatur keuangan pribadi dengan design inspirasi GoPay dan Mandiri Livin'. Dibuat dengan teknologi web modern dan PWA support.

🌐 **Live Demo**: [https://belindaasn.github.io/finance-manager/]

## ✨ Fitur Utama

### 🎯 **Limit Pengeluaran**
- Atur batas pengeluaran harian/mingguan/bulanan/tahunan
- Kategori custom sesuai kebutuhan pribadi
- Peringatan otomatis ketika mendekati/melampaui limit

### 🔄 **Reset Otomatis**
- **Harian**: Reset setiap hari pukul 00:00
- **Mingguan**: Reset setiap Senin pagi  
- **Bulanan**: Reset setiap tanggal 1
- **Tahunan**: Reset setiap 1 Januari

### 📊 **Visual Progress**
- Progress bar warna-warni dengan sistem warning
- 🟢 **Hijau** - Masih aman (di bawah 80%)
- 🟡 **Kuning** - Hampir habis (80-100%)
- 🔴 **Merah** - Melebihi limit (lebih dari 100%)

### 📱 **Modern Experience**
- **PWA Support** - Bisa diinstall seperti aplikasi native
- **Responsive Design** - Optimal di mobile & desktop
- **Offline Capability** - Tetap bisa buka tanpa internet
- **Real-time Updates** - Perubahan langsung terlihat

## 🚀 Cara Menggunakan

### 1. **Setup Limit Pertama Kali**

**Step 1: Pilih Periode**
```
Pilih salah satu:
- Harian   → Cocok untuk daily expense tracking
- Mingguan → Ideal untuk uang jajan mingguan  
- Bulanan  → Recommended untuk gaji bulanan
- Tahunan  → Untuk budget besar/tahunan
```

**Step 2: Set Total Limit**
```
Contoh: Rp 500.000 (maksimal pengeluaran bulanan)
```

**Step 3: Tambah Kategori**
```
Klik "+ Tambah Kategori" untuk membuat kategori:
- Makan & Minum    : Rp 200.000
- Transportasi     : Rp 100.000
- Hiburan          : Rp 100.000
- Belanja          : Rp 100.000
```

**Step 4: Klik "Atur Limit Pengeluaran"**

### 2. **Menambah Transaksi**

**Untuk Pemasukan:**
```
Keterangan: "Gaji Bulanan", "Freelance", "Hadiah"
Jumlah    : Rp 2.500.000
Kategori  : Pilih kategori pemasukan
Jenis     : Pemasukan (Income)
```

**Untuk Pengeluaran:**
```
Keterangan: "Makan Siang", "Bensin Motor", "Nonton Bioskop"
Jumlah    : Rp 50.000
Kategori  : Pilih kategori yang sesuai
Jenis     : Pengeluaran (Expense)
```

### 3. **Memantau Progress**

**Di Budget Display:**
- **Total Limit** = Batas maksimal pengeluaran
- **Total Terpakai** = Sudah berapa yang dikeluarkan
- **Sisa Limit** = Berapa lagi yang bisa dipakai
- **Reset berikutnya** = Countdown sampai reset otomatis

**Sistem Peringatan:**
- 💡 **Notifikasi** ketika limit hampir habis
- ⚠️ **Peringatan** ketika melebihi limit
- 🔔 **Popup alert** untuk transaksi berisiko

## 🎯 Filosofi Aplikasi

### 💡 **Mindful Spending**
Aplikasi ini didesain untuk membantu kamu:
- **Sadar** dengan pola pengeluaran
- **Kontrol** impuls belanja
- **Plan** keuangan dengan baik
- **Achieve** goals finansial

### 🛡️ **Safety Features**
- **Data lokal** - Privasi terjaga, data tidak dikirim ke server
- **No registration** - Langsung pakai, tidak perlu daftar
- **Offline-first** - Tetap bekerja tanpa internet

## 📱 Cara Install sebagai App

### Android (Chrome):
1. Buka website di Chrome
2. Tunggu popup "Install app" 
3. Klik "Install" atau "Add to Home Screen"
4. Selesai! 🎉

### iPhone (Safari):
1. Buka di Safari
2. Klik tombol share (⎗)
3. Pilih "Add to Home Screen"
4. Klik "Add"

### Windows/Mac:
1. Buka di Chrome/Edge
2. Klik icon install di address bar
3. Klik "Install"

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Structure dan semantic markup
- **CSS3** - Modern styling dengan CSS variables
- **JavaScript ES6+** - Logic dan state management
- **Local Storage** - Client-side data persistence
- **PWA** - Progressive Web App capabilities
- **GitHub Pages** - Free hosting dan deployment

## 🐛 Troubleshooting

### ❌ Tidak bisa install sebagai app
**Solution**: 
- Pastikan buka di Chrome/Safari
- Tunggu beberapa detik untuk PWA detection
- Cek menu browser → "Add to Home Screen"

### ❌ Data hilang setelah refresh
**Solution**: 
- Data tersimpan di local storage browser
- Jangan clear browser cache/cookies
- Gunakan browser yang sama

### ❌ Reset tidak bekerja
**Solution**:
- Aplikasi cek reset berdasarkan waktu device
- Pastikan timezone dan waktu device benar
- Reset manual: Hapus dan buat budget plan baru

### ❌ Progress bar tidak update
**Solution**:
- Refresh halaman
- Pastikan transaksi masuk kategori yang benar
- Cek console untuk error (F12)

## 🔧 Untuk Developer

### File Structure:
```
finance-manager/
├── index.html          # Main application
├── style.css           # Modern fintech styling
├── script.js           # Business logic & state management
├── manifest.json       # PWA configuration
├── sw.js              # Service worker (offline support)
├── icon-192.png       # App icon small
├── icon-512.png       # App icon large
└── README.md          # Documentation
```

### Local Development:
```bash
# Clone repository
git clone https://github.com/your-username/finance-manager.git

# Buka di browser
open index.html

# Atau gunakan local server
python -m http.server 8000
# lalu buka http://localhost:8000
```

## 📞 Support & Kontribusi

### Melaporkan Bug:
1. Cek section troubleshooting di atas
2. Buka Issues di GitHub repository
3. Jelaskan masalah dengan detail:
   - Device dan browser
   - Steps to reproduce
   - Screenshot (jika ada)

### Request Fitur:
1. Buka Issues di GitHub
2. Label dengan "enhancement"
3. Jelaskan use case dan manfaat

## 👨‍💻 Tentang Project

**Dibuat sebagai project sekolah** untuk mata pelajaran **Teknologi Informasi dan Komunikasi**.

### 🎓 Learning Outcomes:
- ✅ Modern web development
- ✅ PWA implementation
- ✅ Responsive design principles
- ✅ Local storage management
- ✅ Real-world problem solving
- ✅ UI/UX design thinking

### 🌟 Highlights untuk Presentasi:
- **Teknologi modern** (PWA, ES6+, CSS Grid/Flexbox)
- **Real-world application** (financial management)
- **User-centered design** (mobile-first, intuitive)
- **Production ready** (bug-free, polished UI)

---

## 🚀 Quick Start

1. **Visit** your GitHub Pages URL
2. **Set limits** untuk periode pertama
3. **Start tracking** pengeluaran
4. **Install** sebagai app untuk experience terbaik
5. **Achieve** financial goals! 🎯

**Selamat menggunakan FinanceID!** 💚

---

*"Financial freedom is available to those who learn about it and work for it."* - Robert Kiyosaki

**Note**: Ganti `your-username` pada demo URL dengan username GitHub kamu yang sebenarnya!
