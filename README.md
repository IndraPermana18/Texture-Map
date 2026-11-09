# MISI TEXTURE MAP — MPI Blender (SMK DKV)
## Menjalankan
Buka `index.html` di Chrome/Edge (klik dua kali). Tidak perlu instalasi/internet. Opsional: `python3 -m http.server 8000` lalu buka http://localhost:8000.
Klik **AKTIFKAN AUDIO** sekali di awal (aturan autoplay browser).
## Struktur
index.html · css/style.css · js/data.js (materi, kuis, narasi) · js/render.js (render material PBR) · js/audio.js (backsound + voice over + antrean) · js/app.js (scene, penguncian, progres, praktik, kuis, nilai) · assets/ (karakter Raka & Bu Maya)
## Audio
- Backsound: dibangkitkan langsung oleh WebAudio (5 suasana: opening, belajar, praktik, kuis, hasil) — tidak ada file mp3.
- Voice over: Web Speech API bahasa Indonesia (id-ID) milik browser/OS, suara Bu Maya & Raka dibedakan. Kualitas bergantung suara id-ID di perangkat (Chrome/Edge Windows & Android umumnya tersedia). File mp3 TTS belum dibuat.
## Uji otomatis
`python3 tests/test.py` (butuh Playwright) menelusuri seluruh alur.
