// scripts/uniblog/links.mjs
//
// Pure helpers for check-links.mjs: pull external links out of a blog post and
// decide whether a fetch result means the link is dead.

const REASONS = { 404: 'Not found (404)', 410: 'Gone (410)' };

/**
 * Returns a short reason when the link is dead, or null when it works or we
 * can't tell (bot blocks like 403/429 and server errors are not flagged).
 */
export function classifyLink({ status, error, url, finalUrl }) {
  // Oversized headers (YouTube) are a limit of Node's fetch, not a dead page
  if (error === 'UND_ERR_HEADERS_OVERFLOW') return null;
  if (error) return `Site unreachable (${error})`;
  if (REASONS[status]) return REASONS[status];
  if (status >= 200 && status < 300) {
    const path = (u) => new URL(u).pathname.replace(/\/+$/, '');
    if (path(url) && !path(finalUrl)) return 'Redirects to homepage';
  }
  return null;
}

/** External http(s) links in a post: Markdown links plus video placeholder hrefs. */
export function extractLinks(md) {
  const found = [];
  for (const m of md.matchAll(/\]\((https?:\/\/[^)\s]+)\)|<a class="video-embed"[^>]*href="(https?:\/\/[^"]+)"/g)) {
    found.push(m[1] ?? m[2]);
  }
  return [...new Set(found)];
}
