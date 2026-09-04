import multer from "multer";
import { FILE_UPLOAD_RULES } from "../config/fileValidation.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: FILE_UPLOAD_RULES.maxSize.bytes },
  allowedTypes: FILE_UPLOAD_RULES.allowedExtensions.extensions,
});

export default upload;
