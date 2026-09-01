const CONFIG = {
  // Ganti PIN di sini.
  SECRET_PIN: "2205",

  loadingMs: 1800,

  popupDelayMs: 3500,

  photos: Array.from(
    { length: 10 },
    (_, i) => `assets/photos/photo-${String(i + 1).padStart(2, "0")}.svg`,
  ),

  captions: Array.from(
    { length: 10 },
    (_, i) => `Memory ${String(i + 1).padStart(2, "0")} 💗`,
  ),

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
  ],

  gratitude: [
    "Kamu selalu bisa membuat hari yang biasa terasa sedikit lebih ringan.",

    "Terima kasih sudah menjadi seseorang yang membawa banyak cerita indah.",

    "Semoga setiap langkahmu dipertemukan dengan hal-hal baik.",

    "Semoga senyummu selalu punya alasan untuk hadir setiap hari.",

    "Aku bersyukur karena ada begitu banyak momen kecil yang layak dikenang bersamamu.",
  ],
};

const $ = (s) => document.querySelector(s);

const $$ = (s) => [...document.querySelectorAll(s)];

let pin = "";

let photoIndex = 0;

let noteIndex = 0;

let songIndex = 0;

let audioStarted = false;

/* =========================================
   LOADING
========================================= */

window.addEventListener("load", () => {
  setTimeout(() => {
    $("#loadingScreen").classList.add("hidden");

    $("#pinScreen").classList.remove("hidden");
  }, CONFIG.loadingMs);
});

/* =========================================
   PIN
========================================= */

function updatePin() {
  $$("#pinDots i").forEach((dot, i) =>
    dot.classList.toggle("filled", i < pin.length),
  );

  $("#pinDisplay").textContent = pin ? "•".repeat(pin.length) : "";
}

function enterMain() {
  $("#pinScreen").classList.add("hidden");
  $("#giftScreen").classList.remove("hidden");

  // Siapkan lagu pertama
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

/* =========================================
   GIFT
========================================= */

$("#giftBox").addEventListener("click", () => {
  // Cegah gift diklik berkali-kali
  if ($("#giftBox").classList.contains("opening")) return;

  $("#giftBox").classList.add("opening");

  // Ledakan pertama
  burstFlowers(70);

  // Gelombang cahaya
  createGiftShockwave();

  // Ledakan kedua sedikit terlambat
  setTimeout(() => {
    burstFlowers(35);
  }, 250);

  // Ledakan ketiga
  setTimeout(() => {
    burstFlowers(25);
  }, 500);

  /*
    Setelah animasi selesai,
    pindah ke halaman utama
  */
  setTimeout(() => {
    $("#giftScreen").classList.add("hidden");

    $("#mainContent").classList.remove("hidden");

    document.body.classList.add("unlocked");

    observeReveals();

    // 🎵 Putar lagu pertama
    selectSong(0, true);

    setTimeout(() => {
      $("#birthdayModal").classList.remove("hidden");
    }, CONFIG.popupDelayMs);
  }, 1500);
});

/* =========================================
   BIRTHDAY MODAL
========================================= */

$("#closeBirthday").addEventListener("click", () =>
  $("#birthdayModal").classList.add("hidden"),
);

$("#birthdayModal .modal-backdrop").addEventListener("click", () =>
  $("#birthdayModal").classList.add("hidden"),
);

/* =========================================
   FLOWERS
========================================= */

$$(".flower").forEach((f) => {
  f.addEventListener("click", () => {
    $("#flowerMessage").textContent = f.dataset.message;

    $("#flowerMessage").classList.remove("hidden");

    burstFlowers(6, true);
  });
});

/* =========================================
   LETTER TYPING
========================================= */

const letterText = [...$("#letter").children].map((p) => p.textContent);

let typed = false;

const letterObserver = new IntersectionObserver(
  (entries) => {
    if (entries.some((e) => e.isIntersecting) && !typed) {
      typed = true;

      const target = $("#letter");

      const original = [...target.children].map((x) => x.outerHTML);

      target.innerHTML = "";

      let delay = 0;

      original.forEach((html, i) => {
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

function typeText(el, text, speed) {
  let i = 0;

  const timer = setInterval(() => {
    el.textContent = text.slice(0, ++i);

    if (i >= text.length) {
      clearInterval(timer);
    }
  }, speed);
}

/* =========================================
   PHOTO MEMORY
========================================= */

$("#photoCard").addEventListener("click", () => {
  photoIndex = (photoIndex + 1) % CONFIG.photos.length;

  $("#memoryImage").src = CONFIG.photos[photoIndex];

  $("#memoryCaption").textContent = CONFIG.captions[photoIndex];

  $("#photoNumber").textContent = photoIndex + 1;

  $("#photoCard").animate(
    [
      {
        transform: "rotate(2deg) scale(.96)",
      },

      {
        transform: "rotate(-2deg) scale(1)",
      },
    ],

    {
      duration: 450,
      easing: "cubic-bezier(.2,.8,.2,1)",
    },
  );
});

/* =========================================
   AUDIO PLAYER
========================================= */

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

$("#nextSong").onclick = () =>
  selectSong((songIndex + 1) % CONFIG.songs.length, true);

$("#prevSong").onclick = () =>
  selectSong((songIndex - 1 + CONFIG.songs.length) % CONFIG.songs.length, true);

audio.addEventListener("play", () => ($("#playSong").textContent = "Ⅱ"));

audio.addEventListener("pause", () => ($("#playSong").textContent = "▶"));

audio.addEventListener("timeupdate", () => {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;

  $("#progressBar").style.width = pct + "%";

  $("#currentTime").textContent = formatTime(audio.currentTime);

  $("#duration").textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => $("#nextSong").click());

function formatTime(sec) {
  if (!Number.isFinite(sec)) return "0:00";

  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(
    2,
    "0",
  )}`;
}

/* =========================================
   GRATITUDE JAR
========================================= */

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

/* =========================================
   MUSIC FLOATING BUTTON
========================================= */

$("#musicFab").addEventListener("click", () => {
  document.querySelector(".playlist-section").scrollIntoView({
    behavior: "smooth",
  });
});

/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function observeReveals() {
  /*
    ------------------------------------------
    BAGIAN 1
    ------------------------------------------
    Reveal untuk setiap section seperti
    sistem yang sebelumnya sudah kamu punya.
  */

  $$(".section").forEach((section) => {
    if (section.classList.contains("hero")) {
      return;
    }

    section.classList.add("reveal");
  });

  /*
    ------------------------------------------
    BAGIAN 2
    ------------------------------------------
    Observer untuk section.
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

  $$(".reveal").forEach((element) => sectionObserver.observe(element));

  /*
    =====================================================
    BAGIAN 3
    =====================================================
    TIMELINE ITEM SATU PER SATU
    =====================================================
  */

  const timelineItems = $$(".timeline-item");

  /*
    Observer khusus timeline.
  */

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          /*
              Setelah tampil, observer
              tidak perlu mengawasi item
              tersebut lagi.

              Jadi animasi tidak akan
              berulang ketika scroll naik/turun.
            */

          timelineObserver.unobserve(entry.target);
        }
      });
    },

    {
      /*
          Item mulai muncul ketika
          sekitar 12% bagiannya terlihat.
        */

      threshold: 0.12,

      /*
          Membuat trigger sedikit lebih
          natural ketika scrolling.
        */

      rootMargin: "0px 0px -40px 0px",
    },
  );

  /*
    Mulai mengawasi setiap timeline item.
  */

  timelineItems.forEach((item) => timelineObserver.observe(item));
}

/* =========================================
   FLOWER RAIN CANVAS
========================================= */

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

  const count = Math.min(55, Math.max(20, Math.floor(innerWidth / 8)));

  flakes = Array.from({ length: count }, () => newFlake(true));
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

/* =========================================
   FLOWER BURST
========================================= */

function burstFlowers(count = 20, small = false) {
  const particles = ["✿", "✽", "✾", "❀", "💗", "💕", "✨", "✦", "✧"];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");

    el.textContent = particles[Math.floor(Math.random() * particles.length)];

    el.style.position = "fixed";

    /*
      Posisi ledakan sedikit lebih lebar
      supaya memenuhi layar
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

    /*
      Jarak ledakan
    */
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

/* =================================
   A MOMENT FOR YOU - VIDEO
================================= */

const momentVideo = $("#momentVideo");
const momentPlay = $("#momentPlay");
const momentCard = document.querySelector(".moment-video-card");

momentPlay.addEventListener("click", () => {
  if (momentVideo.paused) {
    momentVideo.play().catch(() => {});

    momentCard.classList.add("playing");
  } else {
    momentVideo.pause();

    momentCard.classList.remove("playing");
  }
});

/* Ketika video selesai */

momentVideo.addEventListener("ended", () => {
  momentCard.classList.remove("playing");
});

/* Kalau video di-pause */

momentVideo.addEventListener("pause", () => {
  if (!momentVideo.ended) {
    momentCard.classList.remove("playing");
  }
});

/* Kalau video dimainkan */

momentVideo.addEventListener("play", () => {
  momentCard.classList.add("playing");
});
