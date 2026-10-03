/**
 * Romantic Wedding Audio Engine
 * Uses HTML5 Audio API to play local MP4 audio file
 * from 0:00 to 1:30 (90 seconds).
 */

class RomanticAudioEngine {
  constructor() {
    this.isPlaying = false;
    this.END_TIME = 90; // 1 minute 30 seconds
    this.endTimer = null;

    // Create hidden audio element
    this.audio = document.createElement("audio");
    this.audio.src = "Duppattawaali (From Odum Kuthira Chaadum Kuthira ).mp4";
    this.audio.preload = "auto";
    this.audio.volume = 0.4;
    this.audio.loop = true;  // native loop as fallback safety net
    this.audio.style.display = "none";
    document.body.appendChild(this.audio);

    // Loop: when reaching 1:30, jump back to 0:00 and keep playing
    this.audio.addEventListener("timeupdate", () => {
      if (this.audio.currentTime >= this.END_TIME) {
        this.audio.currentTime = 0;
      }
    });

    // On natural end (loop=true means this fires then restarts;
    // seek to 0 immediately so it restarts from beginning not mid-file)
    this.audio.addEventListener("seeking", () => {
      if (this.audio.currentTime >= this.END_TIME) {
        this.audio.currentTime = 0;
      }
    });
  }

  play() {
    // Reset to beginning if past end time
    if (this.audio.currentTime >= this.END_TIME) {
      this.audio.currentTime = 0;
    }

    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updateUI();
    }).catch((err) => {
      console.warn("Audio play failed:", err);
    });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    clearTimeout(this.endTimer);
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

window.romanticAudio = new RomanticAudioEngine();


