
const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const openBtn = document.getElementById("openPage2");

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

// ========================================
// PAGE NAVIGATION
// ========================================

function openPageTwo() {
  page1.classList.add("hidden");
  page2.classList.remove("hidden");
}

if (openBtn) {
  openBtn.addEventListener("click", openPageTwo);

  openBtn.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPageTwo();
    }
  });
}

function goBack() {
  closeModal();
  page2.classList.add("hidden");
  page1.classList.remove("hidden");
}

// ========================================
// MUSIC PLAYER
// ========================================

const songs = [
  {
    title: "I Do",
    artist: "AYA cover",
    src: "song.mp3",
    cover: "cover1.png"
  },
  {
    title: "I Need You",
    artist: "AYA cover",
    src: "song2.mp3",
    cover: "cover2.png"
  },
  {
    title: "Mahal Ka Sa Akin",
    artist: "AYA cover",
    src: "song3.mp3",
    cover: "cover3.png"
  }
];

let currentSong = 0;
const audio = new Audio();

audio.addEventListener("ended", nextSong);

audio.addEventListener("play", () => {
  const btn = document.getElementById("playBtn");
  if (btn) btn.textContent = "⏸";
});

audio.addEventListener("pause", () => {
  const btn = document.getElementById("playBtn");
  if (btn) btn.textContent = "▶";
});

function openMusic() {
  modalContent.innerHTML = `
    <div class="music-player">
      <img id="cover" class="cover" alt="Song cover">

      <p class="music-label">A LITTLE MUSIC FOR YOU ♡</p>
      <h2 id="title"></h2>
      <p id="artist"></p>

      <div class="controls">
        <button type="button" onclick="prevSong()"
                aria-label="Previous song">⏮</button>

        <button type="button" onclick="playPause()"
                id="playBtn" aria-label="Play or pause">▶</button>

        <button type="button" onclick="nextSong()"
                aria-label="Next song">⏭</button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  loadSong();
  playAudio();
}

function loadSong() {
  const song = songs[currentSong];

  document.getElementById("title").textContent = song.title;
  document.getElementById("artist").textContent = song.artist;
  document.getElementById("cover").src = song.cover;

  audio.src = song.src;
}

function playAudio() {
  audio.play().catch(() => {
    const btn = document.getElementById("playBtn");
    if (btn) btn.textContent = "▶";
  });
}

function playPause() {
  if (audio.paused) {
    playAudio();
  } else {
    audio.pause();
  }
}

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong();
  playAudio();
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong();
  playAudio();
}

// ========================================
// CAMERA: SIX CLICKABLE PHOTOS
// ========================================

const memories = [
  { src: "src/pic1.jpg", caption: "Cutie moment 💕" },
  { src: "src/pic2.jpg", caption: "Favorite day 🌸" },
  { src: "src/pic3.jpg", caption: "My happiness 🥺💖" },
  { src: "src/pic4.jpg", caption: "A memory to treasure ✨" },
  { src: "src/pic5.jpg", caption: "Forever a favorite 💗" },
  { src: "src/pic6.jpg", caption: "One more memory with you 🦋" }
];

function opencamera() {
  audio.pause();

  modalContent.innerHTML = `
    <div class="gallery-box">
      <p class="memory-kicker">LITTLE MOMENTS, BIG MEMORIES</p>

      <h2 class="gallery-title">Our Cute Memories 📸</h2>

      <p class="gallery-subtitle">
        A little collection of moments close to my heart.
      </p>

      <div class="hanging-gallery">
        <div class="gallery">
          ${memories.map((memory, index) => `
            <figure class="polaroid" style="--photo-index:${index}">
              <span class="clip" aria-hidden="true"></span>

              <img
                src="${memory.src}"
                alt="${memory.caption}"
                class="memory-photo"
                data-memory-index="${index}"
                loading="lazy"
              >

              <figcaption>${memory.caption}</figcaption>
            </figure>
          `).join("")}
        </div>
      </div>

      <p class="gallery-footer">
        ♡ Click any picture to see it bigger ♡
      </p>
    </div>
  `;

  // Make each photo clickable.
  modalContent.querySelectorAll(".memory-photo").forEach((photo) => {
    photo.addEventListener("click", () => {
      const index = Number(photo.dataset.memoryIndex);
      const memory = memories[index];

      if (memory) {
        viewPicture(memory.src, memory.caption);
      }
    });

    // Show a message if the photo file cannot be found.
    photo.addEventListener("error", () => {
      photo.alt = `Photo not found: ${photo.getAttribute("src")}`;
      photo.classList.add("photo-missing");
    });
  });

  modal.classList.remove("hidden");
}

// ========================================
// ENLARGED PICTURE VIEWER
// ========================================

function viewPicture(src, caption) {
  let viewer = document.getElementById("pictureViewer");

  // Create the viewer once.
  if (!viewer) {
    viewer = document.createElement("div");
    viewer.id = "pictureViewer";
    viewer.className = "picture-viewer";

    viewer.innerHTML = `
      <button
        type="button"
        class="picture-close"
        aria-label="Close picture"
      >&times;</button>

      <img id="viewerImage" alt="Expanded memory photo">

      <p id="viewerCaption"></p>

      <p class="viewer-hint">
        Click outside the photo to close ✨
      </p>
    `;

    // Close when the dark background is clicked.
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer) {
        closePictureViewer();
      }
    });

    // Close button.
    viewer.querySelector(".picture-close").addEventListener("click", () => {
      closePictureViewer();
    });

    // Prevent clicking the enlarged image from closing the viewer.
    viewer.querySelector("#viewerImage").addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.body.appendChild(viewer);
  }

  const viewerImage = document.getElementById("viewerImage");
  const viewerCaption = document.getElementById("viewerCaption");

  viewerImage.src = src;
  viewerCaption.textContent = caption;

  viewer.classList.add("show");
}

function closePictureViewer() {
  const viewer = document.getElementById("pictureViewer");

  if (viewer) {
    viewer.classList.remove("show");
  }
}

// ========================================
// BIRTHDAY LETTER
// ========================================

function openLetter() {
  audio.pause();

  modalContent.innerHTML = `
    <div class="birthday-letter-wrap">
      <article class="birthday-letter">

        <div class="letter-decoration">✿　♡　✿</div>

        <p class="letter-eyebrow">
          A LITTLE LETTER FOR SOMEONE SPECIAL
        </p>

        <h2>Happy Birthday, My Love 💌</h2>

        <div class="letter-divider"><span>♥</span></div>

        <p class="letter-greeting">My baby, 🎂💗</p>

        <p>
          From the moment you came into my life,
        everything became brighter and happier 🌸
        If I could give you one thing in this world,
          it would be the chance to see yourself through my eyes.
          Maybe then you'd understand just how special you are to me.
        </p>

        <p>
          Thank you for bringing so much happiness into my life,
          for your care, your laughter, and all the little things
          you do that make ordinary days feel beautiful. Thank you
          keng egana gana by. 🌷
        </p>

        <p>
          I hope this new chapter brings you countless reasons to smile,
          dreams that come true, and the kind of happiness you truly deserve.
          No matter how busy life gets, I hope you always remember
          how much you mean to me. I;m always proud of you tel. Balu mu yan.🥺💕
        </p>

        <p>
          Today is all about celebrating you and the wonderful person
          you are. Here's to more memories, more laughter,
          and many more beautiful moments to cherish. ✨
        </p>

        <p class="letter-last-line">
          You make my world a little brighter just by being in it. 💖
        </p>

        <div class="letter-signature">
          <span>With all my love,</span>
          <h3>Yours always ♡</h3>
        </div>

        <div class="letter-bottom-decoration">♡　✿　♡</div>
      </article>
    </div>
  `;

  modal.classList.remove("hidden");
}

// ========================================
// MODAL CONTROLS
// ========================================

function closeModal() {
  audio.pause();
  audio.currentTime = 0;

  closePictureViewer();

  modal.classList.add("hidden");
  modalContent.innerHTML = "";
}

// Close the surprise only when clicking the modal backdrop.
if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// Escape closes the picture viewer first.
// Press Escape again to close the entire surprise.
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const viewer = document.getElementById("pictureViewer");

  if (viewer && viewer.classList.contains("show")) {
    closePictureViewer();
    return;
  }

  if (modal && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
