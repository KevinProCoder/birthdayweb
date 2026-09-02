const CONFIG = {
  // Ganti PIN di sini.
  SECRET_PIN: "2205",

  loadingMs: 1800,

  popupDelayMs: 3500,

  /*
  =====================================================
  PHOTO MEMORIES

  POLAROID 1 = PHOTO 01 - 10
  POLAROID 2 = PHOTO 11 - 20
  POLAROID 3 = PHOTO 21 - 30
  POLAROID 4 = PHOTO 31 - 40
  POLAROID 5 = PHOTO 41 - 50
  =====================================================
  */

  albums: [
    {
      title: "Our Little Moments",
      cover: "assets/photos/photo-1.jpg",
      photos: Array.from(
        { length: 10 },
        (_, i) => `assets/photos/photo-${i + 1}.jpg`,
      ),
    },

    {
      title: "Beautiful Memories",
      cover: "assets/photos/photo-11.jpg",
      photos: Array.from(
        { length: 10 },
        (_, i) => `assets/photos/photo-${i + 11}.jpg`,
      ),
    },

    {
      title: "Moments Together",
      cover: "assets/photos/photo-21.jpg",
      photos: Array.from(
        { length: 10 },
        (_, i) => `assets/photos/photo-${i + 21}.jpg`,
      ),
    },

    {
      title: "Sweet Memories",
      cover: "assets/photos/photo-31.jpg",
      photos: Array.from(
        { length: 10 },
        (_, i) => `assets/photos/photo-${i + 31}.jpg`,
      ),
    },

    {
      title: "Forever Memories",
      cover: "assets/photos/photo-41.jpg",
      photos: Array.from(
        { length: 10 },
        (_, i) => `assets/photos/photo-${i + 41}.jpg`,
      ),
    },

    {
      title: "Another Beautiful Chapter",
      cover: "assets/photos/photo-51.jpg",
      photos: Array.from(
        { length: 10 },
        (_, i) => `assets/photos/photo-${i + 51}.jpg`,
      ),
    },
  ],

  /*
  =====================================================
  SONGS
  =====================================================
  */

  songs: [
    {
      title: "Shape of My Heart",
      artist: "The Backstreet Boys",
      src: "assets/music/song-01.mp3",
    },

    {
      title: "Beauty and the Beat",
      artist: "Justin Bieber ft Nicky Minaj",
      src: "assets/music/song-02.mp3",
    },

    {
      title: "Dunia Yang Nanti",
      artist: "Raim Laode",
      src: "assets/music/song-03.mp3",
    },

    {
      title: "Kota Ini Tak Sama Tanpamu",
      artist: "Nadhif Basalamah",
      src: "assets/music/song-04.mp3",
    },

    {
      title: "Iqro",
      artist: "Raim Laode",
      src: "assets/music/song-05.mp3",
    },

    {
      title: "Masa Ini, Nanti, dan Masa Indah Lainnya",
      artist: "Nuca",
      src: "assets/music/song-06.mp3",
    },
  ],

  /*
  =====================================================
  GRATITUDE
  =====================================================
  */

  gratitude: [
    "Kamu selalu bisa membuat hari yang biasa terasa sedikit lebih ringan.",

    "Terima kasih sudah menjadi seseorang yang membawa banyak cerita indah.",

    "Semoga setiap langkahmu dipertemukan dengan hal-hal baik.",

    "Semoga senyummu selalu punya alasan untuk hadir setiap hari.",

    "Aku bersyukur karena ada begitu banyak momen kecil yang layak dikenang bersamamu.",
  ],
};

/* =====================================================
   HELPER
===================================================== */

const $ = (s) => document.querySelector(s);

const $$ = (s) => [...document.querySelectorAll(s)];

/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let pin = "";

let noteIndex = 0;

let songIndex = 0;

let audioStarted = false;

/*
=====================================================
PHOTO MEMORY INDEX

Setiap polaroid punya index sendiri.

[0,0,0,0,0]

Artinya:

Polaroid 1 = foto 01
Polaroid 2 = foto 11
Polaroid 3 = foto 21
Polaroid 4 = foto 31
Polaroid 5 = foto 41
=====================================================
*/

const memoryIndexes = [0, 0, 0, 0, 0, 0];

/* =====================================================
   LOADING
===================================================== */

window.addEventListener("load", () => {
  setTimeout(() => {
    $("#loadingScreen").classList.add("hidden");

    $("#pinScreen").classList.remove("hidden");
  }, CONFIG.loadingMs);
});

/* =====================================================
   PIN
===================================================== */

function updatePin() {
  $$("#pinDots i").forEach((dot, i) => {
    dot.classList.toggle("filled", i < pin.length);
  });

  $("#pinDisplay").textContent = pin ? "•".repeat(pin.length) : "";
}

function enterMain() {
  $("#pinScreen").classList.add("hidden");

  $("#giftScreen").classList.remove("hidden");

  /*
  Siapkan lagu pertama
  tetapi belum dimainkan.
  */

  selectSong(0, false);
}

$$(".keypad button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.key;

    if (key === "clear") {
      pin = "";
    } else if (key === "back") {
      pin = pin.slice(0, -1);
    } else if (pin.length < 4) {
      pin += key;
    }

    updatePin();

    if (pin.length === 4) {
      if (pin === CONFIG.SECRET_PIN) {
        $("#pinError").textContent = "";

        setTimeout(enterMain, 250);
      } else {
        $("#pinError").textContent = "Secret code belum tepat 💗";

        pin = "";

        setTimeout(updatePin, 200);
      }
    }
  });
});

/* =====================================================
   GIFT
===================================================== */

$("#giftBox").addEventListener("click", () => {
  /*
    Cegah gift diklik berkali-kali
    */

  if ($("#giftBox").classList.contains("opening")) {
    return;
  }

  $("#giftBox").classList.add("opening");

  /*
    Ledakan pertama
    */

  burstFlowers(70);

  /*
    Gelombang cahaya
    */

  createGiftShockwave();

  /*
    Ledakan kedua
    */

  setTimeout(() => {
    burstFlowers(35);
  }, 250);

  /*
    Ledakan ketiga
    */

  setTimeout(() => {
    burstFlowers(25);
  }, 500);

  /*
    Setelah animasi selesai,
    masuk ke halaman utama.
    */

  setTimeout(()=>{
  $("#giftScreen").classList.add("hidden");
  $("#mainContent").classList.remove("hidden");
  document.body.classList.add("unlocked");

  observeReveals();
  selectSong(0,true);

},1500);
});

/* =====================================================
   BIRTHDAY MODAL
===================================================== */

$("#closeBirthday").addEventListener("click", () => {
  $("#birthdayModal").classList.add("hidden");
});

$("#birthdayModal .modal-backdrop").addEventListener("click", () => {
  $("#birthdayModal").classList.add("hidden");
});

/* =====================================================
   FLOWERS
===================================================== */

$$(".flower").forEach((flower) => {
  flower.addEventListener("click", () => {
    $("#flowerMessage").textContent = flower.dataset.message;

    $("#flowerMessage").classList.remove("hidden");

    burstFlowers(6, true);
  });
});

/* =====================================================
   LETTER TYPING
===================================================== */

let typed = false;

const letterObserver = new IntersectionObserver(
  (entries) => {
    if (entries.some((entry) => entry.isIntersecting) && !typed) {
      typed = true;

      const target = $("#letter");

      const original = [...target.children].map((element) => element.outerHTML);

      target.innerHTML = "";

      original.forEach((html) => {
        const wrap = document.createElement("div");

        wrap.innerHTML = html;

        const p = wrap.firstElementChild;

        const text = p.textContent;

        p.textContent = "";

        target.appendChild(p);

        typeText(p, text, Math.min(18, Math.max(5, 700 / text.length)));
      });
    }
  },

  {
    threshold: 0.25,
  },
);

letterObserver.observe($("#letter"));

function typeText(element, text, speed) {
  let i = 0;

  const timer = setInterval(() => {
    element.textContent = text.slice(0, ++i);

    if (i >= text.length) {
      clearInterval(timer);
    }
  }, speed);
}

/* =====================================================
   OUR PHOTO MEMORIES
===================================================== */

/*
=====================================================
Ambil semua 5 polaroid
dari HTML.
=====================================================
*/

const memoryPolaroids = $$(".memory-polaroid");

const memoryItems = $$(".memory-item");

/*
=====================================================
FUNGSI GANTI FOTO
=====================================================
*/

function changeMemoryPhoto(polaroid, groupIndex) {
  memoryIndexes[groupIndex]++;

  if (memoryIndexes[groupIndex] >= 10) {
    memoryIndexes[groupIndex] = 0;
  }

  const album = CONFIG.albums[groupIndex];
  const image = polaroid.querySelector(".memory-image");

  image.src = album.photos[memoryIndexes[groupIndex]];

  const number = memoryItems[groupIndex].querySelector(".memory-number span");

  number.textContent = String(memoryIndexes[groupIndex] + 1).padStart(2, "0");

  polaroid.classList.remove("photo-changing");
  void polaroid.offsetWidth;
  polaroid.classList.add("photo-changing");
}

/*
=====================================================
EVENT CLICK UNTUK 5 POLAROID
=====================================================
*/

memoryPolaroids.forEach((polaroid, groupIndex) => {
  polaroid.addEventListener("click", () => {
    changeMemoryPhoto(polaroid, groupIndex);
  });
});

/* =====================================================
   MEMORY SCROLL REVEAL
===================================================== */

/*
Polaroid hanya dianimasikan
ketika bagian gallery muncul.
*/

const memorySection = document.querySelector(".memories-section");

let memoryAnimated = false;

if (memorySection) {
  const memoryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !memoryAnimated) {
          memoryAnimated = true;

          /*
              Tambahkan class
              untuk menjalankan
              animasi 5 polaroid.
              */

          memorySection.classList.add("memories-visible");

          memoryObserver.unobserve(memorySection);
        }
      });
    },

    {
      threshold: 0.15,
    },
  );

  memoryObserver.observe(memorySection);
}

/* =====================================================
   AUDIO PLAYER
===================================================== */

const audio = $("#audio");

function renderSongs() {
  $("#songList").innerHTML = "";

  CONFIG.songs.forEach((song, i) => {
    const item = document.createElement("div");

    item.className = "song-item" + (i === songIndex ? " active" : "");

    item.innerHTML = `<span>♫ &nbsp; ${song.title}</span>
         <small>${song.artist}</small>`;

    item.onclick = () => selectSong(i, true);

    $("#songList").appendChild(item);
  });

  $("#songTitle").textContent = CONFIG.songs[songIndex].title;

  $("#songArtist").textContent = CONFIG.songs[songIndex].artist;
}

function selectSong(i, autoplay = false) {
  songIndex = i;

  audio.src = CONFIG.songs[i].src;

  renderSongs();

  if (autoplay) {
    audio.play().catch(() => {});
  }
}

renderSongs();

$("#playSong").onclick = () => {
  if (!audio.src) {
    selectSong(songIndex);
  }

  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
};

$("#nextSong").onclick = () => {
  selectSong((songIndex + 1) % CONFIG.songs.length, true);
};

$("#prevSong").onclick = () => {
  selectSong((songIndex - 1 + CONFIG.songs.length) % CONFIG.songs.length, true);
};

audio.addEventListener("play", () => {
  $("#playSong").textContent = "Ⅱ";
});

audio.addEventListener("pause", () => {
  $("#playSong").textContent = "▶";
});

audio.addEventListener("timeupdate", () => {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;

  $("#progressBar").style.width = pct + "%";

  $("#currentTime").textContent = formatTime(audio.currentTime);

  $("#duration").textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  $("#nextSong").click();
});

function formatTime(sec) {
  if (!Number.isFinite(sec)) {
    return "0:00";
  }

  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(
    2,
    "0",
  )}`;
}

/* =====================================================
   GRATITUDE JAR
===================================================== */

$("#jar").addEventListener("click", () => {
  $("#jar").classList.remove("shake");

  void $("#jar").offsetWidth;

  $("#jar").classList.add("shake");

  setTimeout(() => {
    noteIndex = Math.floor(Math.random() * CONFIG.gratitude.length);

    $("#noteNumber").textContent = "#" + (noteIndex + 1);

    $("#noteText").textContent = CONFIG.gratitude[noteIndex];

    $("#note").classList.remove("hidden");

    burstFlowers(10, true);
  }, 520);
});

/* =====================================================
   MUSIC FLOATING BUTTON
===================================================== */

$("#musicFab").addEventListener("click", () => {
  document.querySelector(".playlist-section").scrollIntoView({
    behavior: "smooth",
  });
});

/* =====================================================
   SCROLL REVEAL
===================================================== */

function observeReveals() {
  /*
  =====================================================
  SECTION REVEAL
  =====================================================
  */

  $$(".section").forEach((section) => {
    if (section.classList.contains("hero")) {
      return;
    }

    section.classList.add("reveal");
  });

  /*
  =====================================================
  SECTION OBSERVER
  =====================================================
  */

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },

    {
      threshold: 0.08,
    },
  );

  $$(".reveal").forEach((element) => {
    sectionObserver.observe(element);
  });

  /*
  =====================================================
  TIMELINE
  =====================================================
  */

  const timelineItems = $$(".timeline-item");

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          timelineObserver.unobserve(entry.target);
        }
      });
    },

    {
      threshold: 0.12,

      rootMargin: "0px 0px -40px 0px",
    },
  );

  timelineItems.forEach((item) => {
    timelineObserver.observe(item);
  });
}

/* =====================================================
   FLOWER RAIN CANVAS
===================================================== */

const canvas = $("#flowerCanvas");

const ctx = canvas.getContext("2d");

let W,
  H,
  flakes = [];

const chars = ["✿", "✽", "✿", "✾", "❀", "✽"];

function resizeCanvas() {
  W = canvas.width = innerWidth * devicePixelRatio;

  H = canvas.height = innerHeight * devicePixelRatio;

  canvas.style.width = innerWidth + "px";

  canvas.style.height = innerHeight + "px";

  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  /*
  Jumlah bunga tetap ringan.
  */

  const count = Math.min(55, Math.max(20, Math.floor(innerWidth / 8)));

  flakes = Array.from(
    {
      length: count,
    },
    () => newFlake(true),
  );
}

function newFlake(initial = false) {
  return {
    x: Math.random() * innerWidth,

    y: initial ? Math.random() * innerHeight : -25,

    size: 8 + Math.random() * 15,

    speed: 0.35 + Math.random() * 1.1,

    drift: (Math.random() - 0.5) * 0.45,

    rot: Math.random() * 6.28,

    spin: (Math.random() - 0.5) * 0.025,

    alpha: 0.25 + Math.random() * 0.45,

    char: chars[Math.floor(Math.random() * chars.length)],
  };
}

function drawFlowers() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  flakes.forEach((f, i) => {
    f.y += f.speed;

    f.x += f.drift + Math.sin(f.y * 0.008) * 0.18;

    f.rot += f.spin;

    if (f.y > innerHeight + 25) {
      flakes[i] = newFlake();
    }

    ctx.save();

    ctx.translate(f.x, f.y);

    ctx.rotate(f.rot);

    ctx.globalAlpha = f.alpha;

    ctx.fillStyle = "#ef8bd8";

    ctx.font = `${f.size}px serif`;

    ctx.fillText(f.char, -f.size / 2, f.size / 2);

    ctx.restore();
  });

  requestAnimationFrame(drawFlowers);
}

resizeCanvas();

addEventListener("resize", resizeCanvas);

drawFlowers();

/* =====================================================
   FLOWER BURST
===================================================== */

function burstFlowers(count = 20, small = false) {
  const particles = ["✿", "✽", "✾", "❀", "💗", "💕", "✨", "✦", "✧"];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");

    el.textContent = particles[Math.floor(Math.random() * particles.length)];

    el.style.position = "fixed";

    /*
    Posisi awal ledakan
    */

    el.style.left = 35 + Math.random() * 30 + "vw";

    el.style.top = 42 + Math.random() * 16 + "vh";

    el.style.zIndex = "120";

    el.style.pointerEvents = "none";

    el.style.fontSize =
      (small ? 10 : 12) + Math.random() * (small ? 14 : 25) + "px";

    el.style.color = Math.random() > 0.5 ? "#ef8bd8" : "#d7a7ff";

    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;

    const distance = (small ? 100 : 180) + Math.random() * 220;

    const x = Math.cos(angle) * distance;

    const y = Math.sin(angle) * distance;

    const rotation = Math.random() * 720 - 360;

    const duration = (small ? 700 : 1000) + Math.random() * 700;

    el.animate(
      [
        {
          transform: "translate(-50%,-50%) scale(.1) rotate(0deg)",

          opacity: 0,
        },

        {
          transform: "translate(-50%,-50%) scale(1.4) rotate(180deg)",

          opacity: 1,

          offset: 0.18,
        },

        {
          transform: `translate(
              calc(-50% + ${x}px),
              calc(-50% + ${y}px)
            )
            scale(1)
            rotate(${rotation}deg)`,

          opacity: 0.9,

          offset: 0.65,
        },

        {
          transform: `translate(
              calc(-50% + ${x * 1.25}px),
              calc(-50% + ${y * 1.25}px)
            )
            scale(.2)
            rotate(${rotation + 180}deg)`,

          opacity: 0,
        },
      ],

      {
        duration: duration,

        easing: "cubic-bezier(.15,.7,.25,1)",
      },
    ).onfinish = () => el.remove();
  }
}

/* =====================================================
   GIFT SHOCKWAVE
===================================================== */

function createGiftShockwave() {
  const wave = document.createElement("div");

  wave.className = "gift-shockwave";

  document.body.appendChild(wave);

  requestAnimationFrame(() => {
    wave.classList.add("active");
  });

  setTimeout(() => {
    wave.remove();
  }, 1200);
}

/* =====================================================
   A MOMENT FOR YOU - VIDEO
===================================================== */

const momentVideo = $("#momentVideo");
const momentPlay = $("#momentPlay");
const momentCard = $(".moment-video-card");

if (momentVideo && momentPlay && momentCard && audio) {

  momentPlay.addEventListener("click", () => {

    if (momentVideo.paused) {
      // Pause musik ketika video mulai
      if (!audio.paused) {
        audio.pause();
      }

      momentVideo.play();

    } else {
      // Pause video
      momentVideo.pause();
    }

  });

  // Ketika video mulai dimainkan
  momentVideo.addEventListener("play", () => {

    // Pastikan musik berhenti
    if (!audio.paused) {
      audio.pause();
    }

    momentPlay.textContent = "❚❚";
    momentCard.classList.add("video-playing");

  });

  // Ketika video di-pause
  momentVideo.addEventListener("pause", () => {

    momentPlay.textContent = "▶";
    momentCard.classList.remove("video-playing");

  });

  // Ketika video selesai
  momentVideo.addEventListener("ended", () => {

    momentPlay.textContent = "▶";
    momentCard.classList.remove("video-playing");

    // Lanjutkan musik dari posisi terakhir
    if (audioStarted) {
      audio.play().catch(() => {
        console.log("Browser memblokir autoplay audio.");
      });
    }

  });

}

let birthdayPopupShown = false;

window.addEventListener("scroll", () => {

  if (birthdayPopupShown) return;

  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;

  // Jarak toleransi 20px agar tetap terdeteksi
  if (scrollPosition >= pageHeight - 20) {

    birthdayPopupShown = true;

    setTimeout(() => {
      $("#birthdayModal").classList.remove("hidden");
    }, 500);

  }

});