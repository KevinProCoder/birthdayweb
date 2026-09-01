# Feby Larasaty — Birthday Website

Website birthday interaktif bergaya dark pink/purple seperti referensi yang diberikan.

## Cara menjalankan
Tidak membutuhkan framework. Cukup buka `index.html` di browser.
Untuk hasil terbaik, jalankan melalui VS Code + Live Server.

## Yang perlu kamu ganti

### 1. PIN
Buka `script.js`, cari:
`SECRET_PIN: "1402"`
Lalu ganti dengan PIN yang kamu inginkan.

### 2. 10 foto
Masukkan foto kamu ke:
`assets/photos/`

Gunakan nama:
- photo-01.jpg
- photo-02.jpg
- ...
- photo-10.jpg

Lalu ubah `CONFIG.photos` di `script.js` menjadi `.jpg` jika diperlukan.

### 3. 3 lagu
Masukkan file MP3 ke:
`assets/music/`

Nama:
- song-01.mp3
- song-02.mp3
- song-03.mp3

Kemudian ubah judul dan artis di `CONFIG.songs`.

Catatan: browser biasanya memerlukan interaksi pengguna sebelum audio dapat diputar.

### 4. 5 pesan gratitude
Edit array `CONFIG.gratitude` di `script.js`.

## Fitur
- Loading "Loading your surprise..."
- Secret PIN keypad
- Gift box opening animation
- Birthday popup
- Flower rain particle canvas
- Interactive digital bouquet
- Typing letter
- 10-photo polaroid memory viewer
- Memories timeline
- 3-song playlist/player
- Shake jar + random gratitude notes
- Animated closing section
- Responsive mobile
- prefers-reduced-motion support
