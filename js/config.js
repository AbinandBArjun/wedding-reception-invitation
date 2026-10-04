/**
 * Wedding Invitation Configuration - Alima & Ashif
 * Primary source for event details used by the invitation's interactive features.
 */
const WEDDING_CONFIG = {
  couple: {
    bride: {
      firstName: "Alima",
      fullName: "Alima Rashi",
      parents: "Abdul Rashi A & Shemy B",
      address: "Varmathy, Nooranad, Alappuzha",
      grandparents: "Late Abdul Azeez & Late Subaidammal, and Adv. Basheer Rawther & Nazeema Beevi",
      role: "Beloved Daughter"
    },
    groom: {
      firstName: "Ashif",
      fullName: "Ashif Abdul Azeez",
      parents: "Late P A Abdul Azeez & Rasheedha Beevi K A",
      address: "Noor Mahal, Perumbaikad PO, Kottayam",
      role: "Beloved Son"
    },
    initials: "A & A",
    monogram: "A&A"
  },
  event: {
    title: "The Wedding Celebration of Alima & Ashif",
    dateFormatted: "Sunday, November 08, 2026",
    dateISO: "2026-11-08T11:30:00+05:30", // ISO format for countdown timer
    endDateISO: "2026-11-08T14:00:00+05:30",
    day: "SUNDAY",
    dayNum: "08",
    month: "NOV",
    year: "2026",
    time: "11:30 AM - 12:00 NOON",
    ceremonyName: "NIKAH",
    venueName: "Green Valley Convention Centre",
    venueAddress: "TB Junction, Adoor, Kerala",
    mapQuery: "Green Valley Convention Centre, TB Junction, Adoor",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Green+Valley+Convention+Centre+TB+Junction+Adoor",
    importantNote: "We humbly inform you that there will be no function or reception of any kind at the bride's residence."
  },
  contacts: {
    hostName: "A Muhammed Alishan",
    phones: ["+91 9074292061"],
    whatsapp: "919074292061"
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
