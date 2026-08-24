// Thai-aware slug: keeps Thai script and latin letters/numbers, replaces the rest with hyphens.
export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{Script=Thai}a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function storyPath(slug: string, id: string): string {
  return `/story/${slug}-${id}`;
}

// Supabase ids are UUIDs (fixed 36 chars), so the id is always the final 36
// characters of the "[slug]-[id]" route param — safe even though both the
// slug and the UUID itself contain hyphens.
export function idFromParam(param: string): string {
  return param.slice(-36);
}
