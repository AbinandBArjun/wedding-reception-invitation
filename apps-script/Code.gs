const SPREADSHEET_ID = "1-Ac4TV-TaB6Ug-GxMp0ZXLI3NC71pM2w_Y_Ip5lO8k4";
const RESPONSE_SHEET_NAME = "RSVPs";
const RESPONSE_HEADERS = [
  "Submitted At",
  "Name",
  "Country Code",
  "Phone",
  "Attendance",
  "Guests",
  "Message"
];

function doGet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    return jsonResponse({
      ok: true,
      spreadsheet: spreadsheet.getName(),
      sheet: RESPONSE_SHEET_NAME
    });
  } catch (error) {
    console.error("RSVP health check failed:", error);
    return jsonResponse({ ok: false, error: "Spreadsheet is not available." });
  }
}

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    if (!event || !event.postData || !event.postData.contents) {
      return jsonResponse({ ok: false, error: "Missing RSVP request body." });
    }

    const data = JSON.parse(event.postData.contents);
    const name = requiredText(data.name, "name", 150);
    const country = requiredText(data.country, "country code", 5);
    const phone = requiredText(data.phone, "phone", 30);
    const attendance = requiredText(data.attendance, "attendance", 20);
    const message = optionalText(data.message, 1000);
    const guests = Number(data.guests);

    if (!/^\+\d{1,4}$/.test(country)) {
      return jsonResponse({ ok: false, error: "Invalid country code." });
    }
    if (!/^[\d\s().-]{5,30}$/.test(phone)) {
      return jsonResponse({ ok: false, error: "Invalid phone number." });
    }
    if (attendance !== "attending" && attendance !== "declined") {
      return jsonResponse({ ok: false, error: "Invalid attendance value." });
    }
    if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
      return jsonResponse({ ok: false, error: "Guest count must be between 1 and 10." });
    }

    lock.waitLock(10000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(RESPONSE_SHEET_NAME)
      || spreadsheet.insertSheet(RESPONSE_SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(RESPONSE_HEADERS);
    }

    sheet.appendRow([
      new Date(),
      safeSheetText(name),
      safeSheetText(country),
      safeSheetText(phone),
      attendance,
      guests,
      safeSheetText(message)
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("RSVP submission failed:", error);
    return jsonResponse({ ok: false, error: "Could not save RSVP." });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function requiredText(value, field, maxLength) {
  const text = String(value || "").trim();
  if (!text || text.length > maxLength) {
    throw new Error(`Invalid ${field}.`);
  }
  return text;
}

function optionalText(value, maxLength) {
  const text = String(value || "").trim();
  if (text.length > maxLength) {
    throw new Error("Message is too long.");
  }
  return text;
}

function safeSheetText(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
