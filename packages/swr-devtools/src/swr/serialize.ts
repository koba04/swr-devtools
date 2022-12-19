// Taken from https://github.com/vercel/swr/blob/9ea4a45c1620b31fb3a5a09771e0809638f47974/_internal/utils/serialize.ts
import { stableHash } from "./hash";

const isFunction = (v: any) => typeof v === "function";

export const serialize = (key: any): string => {
  if (isFunction(key)) {
    try {
      key = key();
    } catch (err) {
      // dependencies not ready
      key = "";
    }
  }

  // If key is not falsy, or not an empty array, hash it.
  key =
    typeof key === "string"
      ? key
      : (Array.isArray(key) ? key.length : key)
      ? stableHash(key)
      : "";

  return key;
};
