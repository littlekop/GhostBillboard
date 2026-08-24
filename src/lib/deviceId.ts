const KEY = "gb_device_id";

// Anonymous per-browser id used to dedupe votes (unique(story_id, device_id)
// at the DB level does the actual enforcement — this is just the client's
// stable identifier, no login required per the project brief).
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
