import { AppError } from "../utils/app-error";

export const ProgramCategoryErrors = {
  notFound: () => new AppError("PROGRAM_CATEGORY_NOT_FOUND", 404, "Kategori program tidak ditemukan"),
  nameAlreadyExists: () =>
    new AppError("VALIDATION_ERROR", 400, "Data yang dikirim tidak valid", [
      { field: "name", message: "Nama kategori sudah digunakan" },
    ]),
  hasPrograms: () =>
    new AppError(
      "PROGRAM_CATEGORY_HAS_PROGRAMS",
      409,
      "Kategori tidak dapat dihapus karena masih memiliki program yang terkait"
    ),
};
