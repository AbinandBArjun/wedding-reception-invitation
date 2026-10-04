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
 * Live countdown to the configured event date in India Standard Time.
 */
function initCountdown() {
  const targetDate = new Date(window.WEDDING_CONFIG.event.dateISO).getTime();
  const targetDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(targetDate);

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
      if (statusTitle) {
        const today = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }).format(now);
        statusTitle.textContent = today === targetDay
          ? "Today is the Blessed Day!"
          : "Thank You for Celebrating with Us";
      }
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
  const config = window.WEDDING_CONFIG;
  const event = config.event;
  const start = new Date(event.dateISO);
  const end = new Date(event.endDateISO);
  const coupleNames = `${config.couple.bride.firstName} & ${config.couple.groom.firstName}`;

  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(
    `With great joy, you are invited to celebrate the Nikah and Wedding of ${coupleNames} at ${event.venueName}, ${event.venueAddress}.\n\nContacts: ${config.contacts.hostName} (${config.contacts.phones.join(", ")})`
  );
  const location = encodeURIComponent(`${event.venueName}, ${event.venueAddress}`);
  const dates = `${formatCalendarUtc(start)}/${formatCalendarUtc(end)}`;
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

  if (gcalBtn) {
    gcalBtn.href = gcalUrl;
    gcalBtn.target = "_blank";
    gcalBtn.rel = "noopener noreferrer";
  }

  if (icsBtn) {
    icsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadIcsFile(config, start, end);
    });
  }
}

function formatCalendarUtc(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(text) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function downloadIcsFile(config, start, end) {
  const event = config.event;
  const coupleNames = `${config.couple.bride.firstName} & ${config.couple.groom.firstName}`;
  const eventTitle = event.title;
  const contactDetails = `${config.contacts.hostName} (${config.contacts.phones.join(", ")})`;
  const venue = `${event.venueName}, ${event.venueAddress}`;
  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${escapeIcsText(eventTitle)}//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-${formatCalendarUtc(start).slice(0, 8)}@invitation`,
    `DTSTAMP:${formatCalendarUtc(new Date())}`,
    `DTSTART:${formatCalendarUtc(start)}`,
    `DTEND:${formatCalendarUtc(end)}`,
    `SUMMARY:${escapeIcsText(eventTitle)}`,
    `DESCRIPTION:${escapeIcsText(`You are cordially invited to celebrate the wedding of ${coupleNames} at ${venue}.\nContacts: ${contactDetails}`)}`,
    `LOCATION:${escapeIcsText(venue)}`,
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

  if (!form) return;

  // Guest Counter Stepper
  if (guestMinusBtn && guestPlusBtn && guestCountInput) {
    guestMinusBtn.addEventListener("click", () => {
      let count = parseInt(guestCountInput.value, 10) || 1;
      if (count > 1) guestCountInput.value = count - 1;
    });

    guestPlusBtn.addEventListener("click", () => {
      let count = parseInt(guestCountInput.value, 10) || 1;
      if (count < 10) guestCountInput.value = count + 1;
    });
  }

  // Check if previously RSVP'd
  let savedRsvp;
  try {
    savedRsvp = localStorage.getItem("alima_ashif_rsvp");
  } catch (err) {
    console.warn("Could not read the saved RSVP from this browser:", err);
  }
  if (savedRsvp) {
    try {
      const data = JSON.parse(savedRsvp);
      showRsvpConfirmation(data, false);
    } catch (err) {
      console.warn("The saved RSVP in this browser could not be read:", err);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name       = document.getElementById("rsvp-name")?.value.trim() || "";
    const country    = document.getElementById("rsvp-country")?.value || "+91";
    const phone      = document.getElementById("rsvp-phone")?.value.trim() || "";
    const attendance = form.querySelector('input[name="attendance"]:checked')?.value || "attending";
    const guests     = guestCountInput ? guestCountInput.value : "1";
    const message    = document.getElementById("rsvp-message")?.value.trim() || "";

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
      submittedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    };

    let localSaveSucceeded = false;
    try {
      localStorage.setItem("alima_ashif_rsvp", JSON.stringify(submission));
      localSaveSucceeded = true;
    } catch (err) {
      console.warn("Could not save the RSVP in this browser:", err);
    }

    // --- Show loading state on the submit button ---
    const submitBtn = form.querySelector("button[type='submit']");
    const originalLabel = submitBtn?.innerHTML;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>Sending…</span>";
    }

    // --- Send to Google Sheets ---
    // NOTE: Content-Type must be "text/plain" (not "application/json") to avoid
    // a CORS preflight request that Apps Script cannot respond to.
    // Apps Script still receives the JSON body via e.postData.contents.
    const SHEET_URL = window.WEDDING_CONFIG?.googleSheetUrl || "";
    let onlineSubmissionAttempted = false;

    if (SHEET_URL) {
      try {
        await fetch(SHEET_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(submission)
        });
        onlineSubmissionAttempted = true;
      } catch (err) {
        console.warn("Google Sheets submission failed:", err);
      }
    }

    // --- Restore button and show confirmation ---
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
    }

    let deliveryNote;
    if (onlineSubmissionAttempted) {
      deliveryNote = `${localSaveSucceeded ? "A copy is saved in this browser. " : ""}An online submission request was sent, but this page cannot confirm that the organizers received it. For confirmation, contact ${window.WEDDING_CONFIG.contacts.hostName} at ${window.WEDDING_CONFIG.contacts.phones.join(", ")}.`;
    } else if (localSaveSucceeded) {
      deliveryNote = "Your RSVP is saved in this browser only and has not been sent to the organizers. Please contact them directly to confirm your reply.";
    } else {
      deliveryNote = `This browser could not save your RSVP, and no online submission was confirmed. Please contact ${window.WEDDING_CONFIG.contacts.hostName} at ${window.WEDDING_CONFIG.contacts.phones.join(", ")} to confirm your reply.`;
    }
    showRsvpConfirmation(submission, true, deliveryNote);
  });
}

function showRsvpConfirmation(data, triggerConfetti = true, deliveryNote = "") {
  const formCard = document.getElementById("rsvp-form-container");
  const confirmedCard = document.getElementById("rsvp-confirmed-container");
  const confirmedName = document.getElementById("confirmed-guest-name");
  const confirmedStatus = document.getElementById("confirmed-status-text");
  const deliveryNoteElement = document.getElementById("rsvp-delivery-note");

  if (!formCard || !confirmedCard) return;

  formCard.style.display = "none";
  confirmedCard.style.display = "block";

  if (confirmedName) confirmedName.textContent = data.name;
  if (deliveryNoteElement) deliveryNoteElement.textContent = deliveryNote;
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
