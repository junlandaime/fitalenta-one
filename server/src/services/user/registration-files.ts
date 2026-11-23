import {
  FormTemplate,
  REGISTRATION_FILES,
  REGISTRATION_UPLOAD_FOLDER,
  RegistrationFileColumn,
} from "../../config/registration.config";
import { RegistrationErrors } from "../../errors/registration.errors";
import { toPublicUploadPath } from "../../utils/file";

export type RegistrationFilePaths = Partial<Record<RegistrationFileColumn, string>>;

type FilesByField = Record<string, Express.Multer.File[]>;

export function mapUploadedFiles(files: unknown): RegistrationFilePaths {
  const byField = (files ?? {}) as FilesByField;
  const paths: RegistrationFilePaths = {};

  for (const { field, column } of REGISTRATION_FILES) {
    const file = byField[field]?.[0];
    if (file) paths[column] = toPublicUploadPath(REGISTRATION_UPLOAD_FOLDER, file.filename);
  }
  return paths;
}

export function assertRequiredFiles(paths: RegistrationFilePaths, template: FormTemplate = "default"): void {
  const missing = REGISTRATION_FILES
    .filter((file) => file.requiredFor.includes(template) && !paths[file.column])
    .map((file) => file.label);

  if (missing.length > 0) throw RegistrationErrors.missingFiles(missing);
}
