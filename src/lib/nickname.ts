const GHOST_NAMES = [
  "ผีขาเดียว",
  "วิญญาณเร่ร่อน",
  "เสียงกระซิบ",
  "เงาในกระจก",
  "ผีบ้านร้าง",
  "ผีหัวขาด",
  "ผีอำ",
  "ผีปอบ",
  "นางไม้",
  "ผีกระสือ",
];

const KEY = "gb_nickname";

// Anonymous per-browser chat identity — random ghost-themed name, no login,
// stable across a session so a reload doesn't reroll it mid-conversation.
export function getNickname(): string {
  if (typeof window === "undefined") return "";
  let name = sessionStorage.getItem(KEY);
  if (!name) {
    const base = GHOST_NAMES[Math.floor(Math.random() * GHOST_NAMES.length)];
    name = `${base}#${Math.floor(100 + Math.random() * 900)}`;
    sessionStorage.setItem(KEY, name);
  }
  return name;
}
