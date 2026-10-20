import { AppError } from "../utils/app-error";

export const FinancialReportErrors = {
  fileRequired: () =>
    new AppError("FILE_REQUIRED", 400, "File Excel wajib dipilih", [{ field: "file", message: "File Excel wajib dipilih" }]),
  unreadableFile: () =>
    new AppError("INVALID_SPREADSHEET", 400, "File tidak dapat dibaca, pastikan formatnya .xlsx yang valid"),
  emptySheet: () => new AppError("EMPTY_SPREADSHEET", 400, "File tidak berisi data untuk diimpor"),
  missingColumns: (columns: string[]) =>
    new AppError("MISSING_COLUMNS", 400, `Kolom wajib tidak ditemukan: ${columns.join(", ")}`),
  tooManyRows: (max: number) =>
    new AppError("TOO_MANY_ROWS", 400, `Jumlah baris melebihi batas maksimal ${max} baris per impor`),
  invalidDateRange: () =>
    new AppError("INVALID_DATE_RANGE", 400, "Tanggal awal tidak boleh lebih besar dari tanggal akhir", [
      { field: "dateFrom", message: "Tanggal awal tidak boleh lebih besar dari tanggal akhir" },
    ]),
  tooManyExportRows: (max: number) =>
    new AppError("EXPORT_TOO_LARGE", 400, `Data melebihi ${max} baris, persempit filter tanggal sebelum mengekspor`),
};