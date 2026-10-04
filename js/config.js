/**
 * Wedding Invitation Configuration - Alima & Ashif
 * Primary source for event details used by the invitation's interactive features.
 */
const WEDDING_CONFIG = {
  couple: {
    groom: {
      firstName: "Ashif",
      fullName: "Ashif Abdul Azeez",
      parents: "Late P A Abdul Azeez & Rasheedha Beevi K A",
      grandparents: "Grandson of Late PM Abdul Rahman & Late Ayisha Beevi, and Late Kallolickal Alikutty Rawther & Salma Beevi",
      role: "Beloved Son"
    },
    bride: {
      firstName: "Alima",
      fullName: "Alima Rashi",
      parents: "Abdul Rashi A & Shemi B",
      role: "Beloved Daughter"
    },
    initials: "A & A",
    monogram: "A&A"
  },
  event: {
    title: "Wedding Reception of Ashif & Alima",
    invitationBy: "Rasheedha Beevi KA, wife of Late P A Abdul Azeez",
    dateFormatted: "Sunday, November 08, 2026",
    dateISO: "2026-11-08T18:00:00+05:30", // ISO format for 06:00 PM IST
    endDateISO: "2026-11-08T22:00:00+05:30",
    day: "SUNDAY",
    dayNum: "08",
    month: "NOV",
    year: "2026",
    time: "06:00 PM",
    ceremonyName: "WEDDING RECEPTION",
    venueName: "DMCC Convention Centre",
    venueAddress: "Thellakom, Kottayam, Kerala",
    mapQuery: "DMCC Convention Centre, Thellakom, Kottayam",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=DMCC+Convention+Centre+Thellakom+Kottayam",
  },
  cheeredBy: [
    "Shuraif A Azeez",
    "Cashif A Azeez",
    "Fathima Jabbar",
    "Shifana KD",
    "Eshaan Rahman",
    "Zayn Malik"
  ],
  contacts: {
    hostName: "Rasheedha Beevi KA & Family",
    phones: ["+91 9847472606", "+91 7510831048"],
    whatsapp: "919847472606"
  },
  assets: {
    coupleIllustration: "assets/images/couple_hero.jpg",
    weddingCard: "assets/images/card_details.png"
  },

  // ─── Google Sheets RSVP Integration ────────────────────────────────────────
  // Use the deployed Web App URL for apps-script/Code.gs. The browser can't
  // verify delivery because the request uses no-cors; it still saves locally.
  googleSheetUrl: "https://script.google.com/macros/s/AKfycbzAjG5ffc2m5a91kEtDTkn4Ut38XgrIp_LDucN1mAjmNFmEL1OlTduGgF_nGFppGMZMFQ/exec"
};

window.WEDDING_CONFIG = WEDDING_CONFIG;
