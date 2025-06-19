# 🚀 Load Test with K6 – Renal Prahardis

Repositori ini berisi script **load testing** menggunakan [K6](https://k6.io/), sebagai bagian dari portofolio QA Engineer.

---

## 🎯 Tujuan Project
- Melakukan **load testing** dan **performance testing** menggunakan K6.
- Mengukur response time, throughput, dan error rate.
- Menyusun skenario uji untuk simulasi pengguna simultan.
- Menyediakan visualisasi hasil melalui HTML report.

---

## 📁 Struktur Folder

```
.
├── scripts/               # Script uji utama (group, check, metrics, dsb)
├── reports/               # Hasil output HTML atau file uji (jika ada)
├── README.md              # Dokumentasi project
```

---

## ⚙️ Cara Menjalankan Load Test

### 1. Jalankan script dasar
```bash
k6 run scripts/{{folderName}}/script.js
```

### 2. Jalankan dengan parameter virtual user dan durasi
```bash
k6 run --vus 50 --duration 30s scripts/login-test.js
```

### 3. Hasil dalam bentuk HTML report
Jika kamu menggunakan `k6-reporter`, jalankan:
```bash
k6 run scripts/{{folderName}}/test.js --out json=results.json
# kemudian generate laporan HTML
k6-reporter --input results.json --output report.html
```

---

## ✅ Metode & Fitur yang Digunakan

- [x] `http.get`, `http.post` untuk simulasi request
- [x] `check()` untuk validasi response
- [x] Grouping dan sleep time
- [x] UUID v4 untuk unique request
- [x] HTML report generation

---

## 📌 Author

**Renal Prahardis**  
Performance & Automation QA | Always Learning  

---

## 📝 Lisensi

Project ini dibuat untuk keperluan showcase dan pembelajaran pribadi.
