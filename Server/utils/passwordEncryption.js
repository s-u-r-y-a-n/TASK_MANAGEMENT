import CryptoJS from "crypto-js";
import "dotenv/config";

const PASSWORD_ENCRYPTION_KEY = process.env.PASSWORD_ENCRYPTION_KEY;

export const decryptPassword = (encryptedPassword) => {
  if (!PASSWORD_ENCRYPTION_KEY) {
    throw new Error("PASSWORD_ENCRYPTION_KEY is not configured.");
  }

  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedPassword || "",
      PASSWORD_ENCRYPTION_KEY,
    );
    const password = bytes.toString(CryptoJS.enc.Utf8);

    return password;
  } catch {
    return "";
  }
};
