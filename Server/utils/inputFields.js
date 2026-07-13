export const normalizeEmail = (email) => {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
};

export const normalizeText = (value) => {
  return typeof value === "string" ? value.trim() : "";
};
