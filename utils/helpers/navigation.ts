import { router, type Href } from "expo-router";

const locks = new Set<string>();

function hrefKey(href: Href): string {
  return typeof href === "string" ? href : JSON.stringify(href);
}

export function clearPushLock(href: Href) {
  locks.delete(hrefKey(href));
}

export function pushOnce(href: Href, lockMs = 500) {
  const key = hrefKey(href);
  if (locks.has(key)) return;

  locks.add(key);
  try {
    router.push(href);
  } finally {
    setTimeout(() => locks.delete(key), lockMs);
  }
}
