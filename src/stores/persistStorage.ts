import type { PersistStorage, StateStorage, StorageValue } from "zustand/middleware";
import type { ZodType } from "zod";

export function createValidatedJSONStorage<S>(
  getStorage: () => StateStorage,
  stateSchema: ZodType<S>
): PersistStorage<S> | undefined {
  let storage: StateStorage;

  try {
    storage = getStorage();
  } catch {
    return undefined;
  }

  const removeInvalidItem = (name: string, reason: string) => {
    console.warn(`Invalid persisted store "${name}" was cleared: ${reason}`);
    storage.removeItem(name);
  };

  return {
    getItem: (name) => {
      const raw = storage.getItem(name);

      if (raw === null) {
        return null;
      }

      if (raw instanceof Promise) {
        return raw.then((value) => parseStorageValue(name, value, stateSchema, removeInvalidItem));
      }

      return parseStorageValue(name, raw, stateSchema, removeInvalidItem);
    },
    setItem: (name, value) => {
      storage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      storage.removeItem(name);
    },
  };
}

function parseStorageValue<S>(
  name: string,
  raw: string | null,
  stateSchema: ZodType<S>,
  removeInvalidItem: (name: string, reason: string) => void
): StorageValue<S> | null {
  if (raw === null) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    removeInvalidItem(name, "malformed JSON");
    return null;
  }

  if (!parsed || typeof parsed !== "object" || !("state" in parsed)) {
    removeInvalidItem(name, "missing persisted state");
    return null;
  }

  const storedValue = parsed as StorageValue<unknown>;
  const state = stateSchema.safeParse(storedValue.state);

  if (!state.success) {
    removeInvalidItem(name, "state schema mismatch");
    return null;
  }

  return {
    state: state.data,
    version: typeof storedValue.version === "number" ? storedValue.version : undefined,
  };
}
