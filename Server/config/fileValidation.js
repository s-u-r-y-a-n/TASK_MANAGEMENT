const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".jpg",
  ".jpeg",
  ".xls",
  ".xlsx",
  ".csv",
  ".ppt",
  ".pptx",
];

export const FILE_UPLOAD_RULES = {
  maxSize: {
    bytes: 10 * 1024 * 1024,
    message: "File size cannot exceed 10 MB.",
  },

  allowedExtensions: {
    extensions: ALLOWED_EXTENSIONS,
    message: `File type is not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}`,
  },
};
