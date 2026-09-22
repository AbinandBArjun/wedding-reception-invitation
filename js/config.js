/**
 * Wedding Invitation Configuration - Alima & Ashif
 * Easily customize any details, dates, venues, contacts, or photos here!
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
    phones: ["+91 9447361154", "+91 9074292061"],
    whatsapp: "919447361154"
  },
  assets: {
    coupleIllustration: "assets/images/couple_illustration.png",
    cardCouple: "assets/images/card_couple.png",
    cardDetails: "assets/images/card_details.png"
  }
};

window.WEDDING_CONFIG = WEDDING_CONFIG;
