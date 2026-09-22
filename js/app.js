/**
 * Main Application Logic - Alima & Ashif Wedding Invitation
 */

document.addEventListener("DOMContentLoaded", () => {
  initCurtainOverlay();
  initCountdown();
  initCalendarButtons();
  initRsvpForm();
  initNavigation();
  initMusicController();
  populateConfigDetails();
});

// Populate any dynamic fields from WEDDING_CONFIG if available
function populateConfigDetails() {
  if (!window.WEDDING_CONFIG) return;
  const cfg = window.WEDDING_CONFIG;

  // Set any data-config elements
  document.querySelectorAll("[data-config]").forEach(el => {
    const key = el.getAttribute("data-config");
    const val = getNestedValue(cfg, key);
    if (val !== undefined && val !== null) {
      el.textContent = val;
    }
  });
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

/**
 * Curtain / Envelope Door Reveal
 */
function initCurtainOverlay() {
  const overlay = document.getElementById("curtain-overlay");
  const openBtn = document.getElementById("open-invitation-btn");
  const musicToggle = document.getElementById("floating-music");

  if (!overlay || !openBtn) return;

  function handleOpen() {
    // Start audio synthesis
    if (window.romanticAudio) {
      window.romanticAudio.play();
    }

    // Trigger curtain animations
    overlay.classList.add("opened");

    // Show floating music bar
    if (musicToggle) {
      musicToggle.classList.add("visible");
    }

    // Remove overlay from accessibility tree after transition
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.setAttribute("aria-hidden", "true");
    }, 1800);
  }

  openBtn.addEventListener("click", handleOpen);
  openBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  });
}

/**
 * Live Countdown Timer to November 08, 2026, 11:30 AM IST
 */
function initCountdown() {
  // Target: Nov 08, 2026 11:30:00 GMT+0530 (Indian Standard Time)
  const targetDate = new Date("2026-11-08T11:30:00+05:30").getTime();

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      const statusTitle = document.getElementById("countdown-title");
      if (statusTitle) statusTitle.textContent = "Today is the Blessed Day!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/**
 * Calendar Integration (Google Calendar + Apple/Outlook .ics file)
 */
function initCalendarButtons() {
  const gcalBtn = document.getElementById("btn-add-gcal");
  const icsBtn = document.getElementById("btn-add-ics");

  // Event Details
  const title = encodeURIComponent("Nikah Wedding Ceremony: Alima & Ashif");
  const details = encodeURIComponent(
    "With great joy, you are invited to celebrate the Nikah and Wedding of Alima & Ashif at Green Valley Convention Centre, Adoor.\n\nContacts: A Muhammed Alishan (+91 9447361154, +91 9074292061)"
  );
  const location = encodeURIComponent("Green Valley Convention Centre, TB Junction, Adoor, Kerala");
  // 2026-11-08 11:30 AM IST (06:00 UTC) to 14:00 IST (08:30 UTC)
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261108T060000Z/20261108T083000Z&details=${details}&location=${location}`;

  if (gcalBtn) {
    gcalBtn.href = gcalUrl;
    gcalBtn.target = "_blank";
    gcalBtn.rel = "noopener noreferrer";
  }

  if (icsBtn) {
    icsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadIcsFile();
    });
  }
}

function downloadIcsFile() {
  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Alima and Ashif Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:wedding-alima-ashif-20261108@invitation",
    "DTSTAMP:20260101T000000Z",
    "DTSTART:20261108T060000Z",
    "DTEND:20261108T083000Z",
    "SUMMARY:Nikah Wedding Ceremony: Alima & Ashif",
    "DESCRIPTION:You are cordially invited to celebrate the wedding of Alima & Ashif at Green Valley Convention Centre\\, TB Junction\\, Adoor.\\nContacts: +91 9447361154\\, +91 9074292061",
    "LOCATION:Green Valley Convention Centre\\, TB Junction\\, Adoor\\, Kerala",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Alima_Ashif_Wedding.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Interactive RSVP Form Handling
 */
function initRsvpForm() {
  const form = document.getElementById("rsvp-form");
  const guestMinusBtn = document.getElementById("guest-minus");
  const guestPlusBtn = document.getElementById("guest-plus");
  const guestCountInput = document.getElementById("guest-count");
  const rsvpSuccessModal = document.getElementById("rsvp-success-toast");

  if (!form) return;

  // Guest Counter Stepper
  if (guestMinusBtn && guestPlusBtn && guestCountInput) {
    guestMinusBtn.addEventListener("click", () => {
      let count = parseInt(guestCountInput.value, 10) || 1;
      if (count > 1) {
        guestCountInput.value = count - 1;
      }
    });

    guestPlusBtn.addEventListener("click", () => {
      let count = parseInt(guestCountInput.value, 10) || 1;
      if (count < 10) {
        guestCountInput.value = count + 1;
      }
    });
  }

  // Check if previously RSVP'd
  const savedRsvp = localStorage.getItem("alima_ashif_rsvp");
  if (savedRsvp) {
    try {
      const data = JSON.parse(savedRsvp);
      showRsvpConfirmation(data, false);
    } catch (e) {}
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("rsvp-name")?.value.trim() || "";
    const country = document.getElementById("rsvp-country")?.value || "+91";
    const phone = document.getElementById("rsvp-phone")?.value.trim() || "";
    const attendance = form.querySelector('input[name="attendance"]:checked')?.value || "attending";
    const guests = guestCountInput ? guestCountInput.value : "1";
    const message = document.getElementById("rsvp-message")?.value.trim() || "";

    if (!name || !phone) {
      alert("Please fill in your name and contact phone number.");
      return;
    }

    const submission = {
      name,
      country,
      phone,
      attendance,
      guests,
      message,
      submittedAt: new Date().toISOString()
    };

    localStorage.setItem("alima_ashif_rsvp", JSON.stringify(submission));

    // Show celebratory confetti and confirmation card
    showRsvpConfirmation(submission, true);
  });
}

function showRsvpConfirmation(data, triggerConfetti = true) {
  const formCard = document.getElementById("rsvp-form-container");
  const confirmedCard = document.getElementById("rsvp-confirmed-container");
  const confirmedName = document.getElementById("confirmed-guest-name");
  const confirmedStatus = document.getElementById("confirmed-status-text");

  if (!formCard || !confirmedCard) return;

  formCard.style.display = "none";
  confirmedCard.style.display = "block";

  if (confirmedName) confirmedName.textContent = data.name;
  if (confirmedStatus) {
    if (data.attendance === "attending") {
      confirmedStatus.textContent = `Joyfully attending (${data.guests} ${parseInt(data.guests) > 1 ? "guests" : "guest"}). We eagerly look forward to seeing you!`;
    } else {
      confirmedStatus.textContent = `Regretfully unable to attend. Thank you for your warm prayers and blessings!`;
    }
  }

  if (triggerConfetti) {
    spawnCelebrationConfetti();
  }
}

// Allow user to edit RSVP again if desired
window.editRsvpAgain = function() {
  const formCard = document.getElementById("rsvp-form-container");
  const confirmedCard = document.getElementById("rsvp-confirmed-container");
  if (formCard && confirmedCard) {
    confirmedCard.style.display = "none";
    formCard.style.display = "block";
  }
};

/**
 * Micro Confetti Animation on RSVP Submit
 */
function spawnCelebrationConfetti() {
  const colors = ["#C7A24B", "#D8BE84", "#6E2434", "#A94A57", "#FFF"];
  const container = document.body;

  for (let i = 0; i < 40; i++) {
    const flake = document.createElement("div");
    flake.className = "confetti-flake";
    flake.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    flake.style.left = Math.random() * 100 + "vw";
    flake.style.top = "-20px";
    flake.style.width = Math.random() * 10 + 6 + "px";
    flake.style.height = Math.random() * 12 + 6 + "px";
    flake.style.position = "fixed";
    flake.style.zIndex = "9999";
    flake.style.pointerEvents = "none";
    flake.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    flake.style.transform = `rotate(${Math.random() * 360}deg)`;
    flake.style.transition = `transform ${Math.random() * 2 + 1.8}s ease-out, top ${Math.random() * 2 + 1.8}s cubic-bezier(.25,1,.5,1), opacity 0.8s ease-in ${Math.random() * 1.5 + 1.5}s`;

    container.appendChild(flake);

    requestAnimationFrame(() => {
      flake.style.top = Math.random() * 70 + 30 + "vh";
      flake.style.transform = `translate(${Math.random() * 100 - 50}px, 0) rotate(${Math.random() * 720}deg)`;
      flake.style.opacity = "0";
    });

    setTimeout(() => flake.remove(), 4000);
  }
}

/**
 * Music Controller
 */
function initMusicController() {
  const btn = document.getElementById("music-toggle-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (window.romanticAudio) {
      window.romanticAudio.toggle();
    }
  });
}

/**
 * Smooth Navigation & Active Link Highlight
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('header nav a, nav.mobile-bottom-nav a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPos = window.scrollY + 180;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }, { passive: true });
}
