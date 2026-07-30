const STORE_VERSION = 1;
const PREFIX = "dwell-signal:";

interface StoredValue<T> {
  version: number;
  data: T;
}

function storageKey(key: string): string {
  return `${PREFIX}${key}`;
}

export function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(storageKey(key));
    if (!value) return fallback;
    const stored = JSON.parse(value) as StoredValue<T>;
    return stored.version === STORE_VERSION ? stored.data : fallback;
  } catch {
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T): void {
  try {
    const stored: StoredValue<T> = { version: STORE_VERSION, data: value };
    localStorage.setItem(storageKey(key), JSON.stringify(stored));
  } catch {
    // The app still works when storage is blocked or full.
  }
}

export function clearStored(): void {
  try {
    const keys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter(
      (key): key is string => Boolean(key?.startsWith(PREFIX)),
    );
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Reset is best-effort when a browser blocks storage.
  }
}
