// scripts/uniblog/links.mjs
//
// Pure helpers for check-links.mjs: pull external links out of a blog post and
// decide whether a fetch result means the link is dead.

const REASONS = { 404: 'Not found (404)', 410: 'Gone (410)' };

/**
 * Returns a short reason when the link is dead, or null when it works or we
 * can't tell (bot blocks like 403/429 and server errors are not flagged).
 */
export function classifyLink({ status, error, url, finalUrl, title = '' }) {
  // Oversized headers (YouTube) and dropped connections say nothing about the page itself
  if (['UND_ERR_HEADERS_OVERFLOW', 'UND_ERR_SOCKET', 'ECONNRESET'].includes(error)) return null;
  if (error) return `Site unreachable (${error})`;
  if (REASONS[status]) return REASONS[status];
  if (status >= 200 && status < 300) {
    const path = (u) => new URL(u).pathname.replace(/\/+$/, '');
    if (path(url) && !path(finalUrl)) return 'Redirects to homepage';
    if (/\bparked\b|\bfor sale\b|domain (?:is )?for sale/i.test(title)) return 'Parked domain';
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

const SOFT_ERRORS = ['UND_ERR_HEADERS_OVERFLOW', 'UND_ERR_SOCKET', 'ECONNRESET'];

/** True when a check says nothing either way (bot blocks, server errors, dropped connections). */
export function isInconclusive({ status, error }) {
  if (error) return SOFT_ERRORS.includes(error);
  return [401, 403, 406, 429].includes(status) || status >= 500;
}

/**
 * Combines a new run with the previous dead list. A link stays dead until a check clearly
 * succeeds, so a site that blocks one run (deviantART does) can't make it look fixed.
 * Links no longer in the posts drop out.
 */
export function mergeDead(previous, results) {
  const dead = {};
  for (const [url, r] of results) {
    if (r.dead) dead[url] = r.dead;
    else if (r.unknown && previous[url]) dead[url] = previous[url];
  }
  return dead;
}
