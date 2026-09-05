import CryptoJS from "crypto-js";

const PASSWORD_ENCRYPTION_KEY = import.meta.env.VITE_PASSWORD_ENCRYPTION_KEY;

export const encryptPassword = (password) => {
  if (!PASSWORD_ENCRYPTION_KEY) {
    throw new Error("VITE_PASSWORD_ENCRYPTION_KEY is not configured.");
  }

  return CryptoJS.AES.encrypt(password, PASSWORD_ENCRYPTION_KEY).toString();
};
