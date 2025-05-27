import CryptoJS from "crypto-js";
const ENCRYPTION_KEY = "m8s3W6fG/9YPlJrPwA7ZkV5l9KJc0d3DdfmW0m0YPmU=";

function getCryptoKey(key: string): string {
  return CryptoJS.HmacSHA256(key, ENCRYPTION_KEY).toString(CryptoJS.enc.Hex);
}

function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

function decrypt(data: string): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(data, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData || null;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

interface StorageInterface {
  get<T>(key: string): T | string | null;
  set(key: string, value: unknown): void;
  remove(key: string): void;
  clear(): void;
}

const storage: StorageInterface = {
  get<T>(key: string): T | string | null {
    const storageKey = getCryptoKey(key);
    let value = sessionStorage.getItem(storageKey);

    if (value !== null) {
      const decryptedValue = decrypt(value);
      if (decryptedValue !== null) {
        try {
          return JSON.parse(decryptedValue);
        } catch {
          return decryptedValue;
        }
      }
    }

    value = sessionStorage.getItem(key);
    if (value === null) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },

  set(key: string, value: unknown): void {
    const storageKey = getCryptoKey(key);
    const stringValue = JSON.stringify(value);
    const encryptedValue = encrypt(stringValue);
    sessionStorage.setItem(storageKey, encryptedValue);
  },

  remove(key: string): void {
    const storageKey = getCryptoKey(key);
    sessionStorage.removeItem(storageKey);
    sessionStorage.removeItem(key);
  },

  clear(): void {
    sessionStorage.clear();
  },
};

export default storage;
