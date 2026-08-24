// MVP profanity filter — a real deployment should pull this list from a
// config table so it can be updated without a deploy, but a static list is
// enough to block the obvious cases at launch.
const PROFANITY_BLOCKLIST = [
  "เหี้ย",
  "สัส",
  "ควย",
  "fuck",
  "shit",
  "bitch",
];

// Gambling promotion is a common spam vector on anonymous, no-login text
// fields — block the common Thai/English gambling-site vocabulary so the
// form can't be used to advertise betting sites.
const GAMBLING_BLOCKLIST = [
  "พนัน",
  "บาคาร่า",
  "สล็อต",
  "คาสิโน",
  "แทงบอล",
  "หวยออนไลน์",
  "เว็บพนัน",
  "ยูฟ่าเบท",
  "ufabet",
  "casino",
  "gambling",
  "betting",
];

function includesAny(text: string, blocklist: string[]): boolean {
  const lower = text.toLowerCase();
  return blocklist.some((word) => lower.includes(word));
}

export function containsProfanity(text: string): boolean {
  return includesAny(text, PROFANITY_BLOCKLIST);
}

export function containsGamblingContent(text: string): boolean {
  return includesAny(text, GAMBLING_BLOCKLIST);
}

export function sanitizeMessage(text: string): string {
  return text.trim().slice(0, 200);
}

// Client-side spam throttle: minimum gap between messages from one browser.
export const MIN_MESSAGE_INTERVAL_MS = 2000;
