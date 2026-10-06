/**
 * Romantic Wedding Audio Engine
 * High-compatibility mobile and desktop audio player.
 * Plays the local audio track from 0:00 to 1:30 (90 seconds) and loops gracefully.
 */

class RomanticAudioEngine {
  constructor() {
    this.isPlaying = false;
    this.END_TIME = 90; // 1 minute 30 seconds
    this.userInteracted = false;

    // Use declarative audio element from DOM or fallback
    this.audio = document.getElementById("bg-music");
    if (!this.audio) {
      this.audio = document.createElement("audio");
      this.audio.id = "bg-music";
      this.audio.setAttribute("playsinline", "");
      this.audio.setAttribute("webkit-playsinline", "");
      this.audio.preload = "auto";
      this.audio.loop = true;
      this.audio.style.display = "none";

      const sourceMp3 = document.createElement("source");
      sourceMp3.src = "assets/audio.mp3";
      sourceMp3.type = "audio/mpeg";

      const sourceMpeg = document.createElement("source");
      sourceMpeg.src = "WhatsApp Audio 2026-10-05 at 9.49.08 PM.mpeg";
      sourceMpeg.type = "audio/mpeg";

      this.audio.appendChild(sourceMp3);
      this.audio.appendChild(sourceMpeg);
      document.body.appendChild(this.audio);
    }

    // Set mobile-friendly attributes
    this.audio.volume = 0.5;
    this.audio.setAttribute("playsinline", "");
    this.audio.setAttribute("webkit-playsinline", "");

    // Loop: when reaching 1:30, jump back to 0:00 and keep playing
    this.audio.addEventListener("timeupdate", () => {
      if (this.audio.currentTime >= this.END_TIME) {
        this.audio.currentTime = 0;
      }
    });

    this.audio.addEventListener("seeking", () => {
      if (this.audio.currentTime >= this.END_TIME) {
        this.audio.currentTime = 0;
      }
    });

    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.updateUI();
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.updateUI();
    });

    this.audio.addEventListener("ended", () => {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
    });

    // Mobile gesture unlock listener:
    // If the browser blocked initial autoplay or the user taps anywhere after opening,
    // ensure audio can start smoothly upon direct interaction.
    this.setupUnlockListeners();
  }

  setupUnlockListeners() {
    const unlock = () => {
      if (!this.audio) return;
      // Pre-load audio buffer on first real touch
      if (this.audio.paused && !this.userInteracted) {
        this.audio.load();
      }
      this.userInteracted = true;
      ["touchstart", "touchend", "pointerdown", "click"].forEach(evt => {
        document.removeEventListener(evt, unlock, { capture: true });
      });
    };

    ["touchstart", "touchend", "pointerdown", "click"].forEach(evt => {
      document.addEventListener(evt, unlock, { capture: true, once: true });
    });
  }

  play() {
    if (!this.audio) return Promise.reject(new Error("No audio element"));

    // Reset to beginning if past end time
    if (this.audio.currentTime >= this.END_TIME) {
      this.audio.currentTime = 0;
    }

    // Attempt playback immediately within the user gesture tick
    const playPromise = this.audio.play();

    if (playPromise !== undefined) {
      return playPromise
        .then(() => {
          this.isPlaying = true;
          this.updateUI();
        })
        .catch((err) => {
          console.warn("Audio playback delayed or blocked by mobile browser:", err);
          this.isPlaying = false;
          this.updateUI();

          // In case mobile browser requires another explicit touch, retry once on next tap
          const retryPlay = () => {
            this.audio.play().then(() => {
              this.isPlaying = true;
              this.updateUI();
            }).catch(() => {});
            document.removeEventListener("touchend", retryPlay);
            document.removeEventListener("click", retryPlay);
          };
          document.addEventListener("touchend", retryPlay, { once: true });
          document.addEventListener("click", retryPlay, { once: true });
        });
    }

    return Promise.resolve();
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.updateUI();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateUI() {
    const btn = document.getElementById("music-toggle-btn");
    const waves = document.getElementById("music-waves");
    const statusText = document.getElementById("music-status");
    if (!btn) return;

    if (this.isPlaying) {
      btn.classList.add("playing");
      btn.setAttribute("aria-label", "Pause romantic background music");
      if (statusText) statusText.textContent = "Music Playing";
      if (waves) waves.classList.remove("paused");
    } else {
      btn.classList.remove("playing");
      btn.setAttribute("aria-label", "Play romantic background music");
      if (statusText) statusText.textContent = "Play Music";
      if (waves) waves.classList.add("paused");
    }
  }
}

// Instantiate on window
window.romanticAudio = new RomanticAudioEngine();
