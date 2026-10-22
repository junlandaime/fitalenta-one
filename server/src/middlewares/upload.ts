import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../utils/app-error";
import { TEAM_MEMBER_UPLOAD_FOLDER } from "../config/team.config";
import {
  REGISTRATION_ALLOWED_MIME_TYPES,
  REGISTRATION_FILES,
  REGISTRATION_UPLOAD_FOLDER,
} from "../config/registration.config";
import { IMPORT_LIMITS, XLSX_MIME } from "../config/financial-report.config";
import { PAYMENT_PROOF_UPLOAD_FOLDER } from "../config/payment.config";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface UploaderOptions {
  allowedMimeTypes?: string[];
  invalidTypeMessage?: string;
  maxFileSizeMB?: number;
}

function createUploader(folder: string, options: UploaderOptions = {}) {
  const {
    allowedMimeTypes = IMAGE_MIME_TYPES,
    invalidTypeMessage = "Format gambar tidak didukung (hanya JPG, PNG, WEBP, GIF)",
    maxFileSizeMB = 5,
  } = options;

  const uploadPath = path.join(process.cwd(), "uploads", folder);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  });

  return multer({
    storage,
    limits: { fileSize: maxFileSizeMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
      else cb(new AppError("INVALID_FILE_TYPE", 400, invalidTypeMessage));
    },
  });
}

export const uploadEventImage = createUploader("events");
export const uploadArticleImage = createUploader("articles");
export const uploadGalleryImage = createUploader("gallery");
export const uploadTestimonialImage = createUploader("testimonials");
export const uploadTeamMemberImage = createUploader(TEAM_MEMBER_UPLOAD_FOLDER);
export const uploadPaymentProof = createUploader(PAYMENT_PROOF_UPLOAD_FOLDER);
export const uploadRegistrationFiles = createUploader(REGISTRATION_UPLOAD_FOLDER, {
  allowedMimeTypes: REGISTRATION_ALLOWED_MIME_TYPES,
  invalidTypeMessage: "Format file tidak didukung (hanya JPG, PNG, WEBP, PDF)",
}).fields(REGISTRATION_FILES.map(({ field }) => ({ name: field, maxCount: 1 })));
const SPREADSHEET_MIME_TYPES = [XLSX_MIME, "application/octet-stream"];

export const uploadReportSpreadsheet = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: IMPORT_LIMITS.maxFileSizeMB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const isXlsx =
      path.extname(file.originalname).toLowerCase() === ".xlsx" && SPREADSHEET_MIME_TYPES.includes(file.mimetype);
    if (isXlsx) cb(null, true);
    else cb(new AppError("INVALID_FILE_TYPE", 400, "Format file harus Excel (.xlsx)"));
  },
});

export const uploadParticipantSpreadsheet = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const isXlsx =
      path.extname(file.originalname).toLowerCase() === ".xlsx" && SPREADSHEET_MIME_TYPES.includes(file.mimetype);
    if (isXlsx) cb(null, true);
    else cb(new AppError("INVALID_FILE_TYPE", 400, "Format file harus Excel (.xlsx)"));
  },
});
