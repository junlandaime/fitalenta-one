"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { CircleAlert, CircleCheck, FileDown, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IMPORT_ACCEPT } from "@/constants/admin/financial-report-constant";
import { useImportFinancialReport } from "@/hooks/admin/use-admin-financial-report";
import type { ImportResult } from "@/types/admin/financial-report";

function formatSize(bytes: number) {
    return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function Figure({ label, value }: { label: string; value: number }) {
    return (
        <div className="space-y-0.5 rounded-lg border bg-muted/30 p-3">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold tabular-nums">{value.toLocaleString("id-ID")}</p>
        </div>
    );
}

function CheckResult({ result }: { result: ImportResult }) {
    const failed = result.errorCount > 0;

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
                <Figure label="Total baris" value={result.totalRows} />
                <Figure label="Akan dibuat" value={result.toCreate} />
                <Figure label="Akan diperbarui" value={result.toUpdate} />
            </div>

            {failed ? (
                <>
                    <Alert variant="destructive">
                        <CircleAlert aria-hidden />
                        <AlertTitle>{result.errorCount.toLocaleString("id-ID")} kesalahan ditemukan</AlertTitle>
                        <AlertDescription>
                            Tidak ada data yang diimport. Perbaiki file lalu periksa kembali.
                        </AlertDescription>
                    </Alert>

                    <div className="max-h-72 overflow-auto rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/40 text-[10px] tracking-wider uppercase">
                                    <TableHead className="w-16 pl-3">Baris</TableHead>
                                    <TableHead className="w-32">Kolom</TableHead>
                                    <TableHead>Keterangan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.errors.map((error, index) => (
                                    <TableRow key={`${error.row}-${error.field}-${index}`}>
                                        <TableCell className="pl-3 font-mono text-xs">{error.row}</TableCell>
                                        <TableCell className="text-xs">{error.field ?? "-"}</TableCell>
                                        <TableCell className="text-xs whitespace-normal">{error.message}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {result.errors.length < result.errorCount && (
                        <p className="text-xs text-muted-foreground">
                            Menampilkan {result.errors.length} dari {result.errorCount} kesalahan pertama.
                        </p>
                    )}
                </>
            ) : (
                <Alert>
                    <CircleCheck aria-hidden />
                    <AlertTitle>File valid dan siap diimpor</AlertTitle>
                    <AlertDescription>
                        Periksa jumlah di atas, lalu pilih &ldquo;Import sekarang&rdquo; untuk menyimpan.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}

type Props = {
    downloadingTemplate: boolean;
    onDownloadTemplate: () => void;
    onClose: () => void;
    onImported: (result: ImportResult) => void;
};

export function ImportReportSheet({ downloadingTemplate, onDownloadTemplate, onClose, onImported }: Props) {
    const importer = useImportFinancialReport();
    const inputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [fileError, setFileError] = useState<string>();

    const checking = importer.isPending && importer.variables?.dryRun === true;
    const committing = importer.isPending && importer.variables?.dryRun === false;
    const canCommit = Boolean(file && result && result.errorCount === 0 && result.totalRows > 0);

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const next = event.target.files?.[0] ?? null;
        event.target.value = "";
        if (!next) return;

        importer.reset();
        setResult(null);

        if (!next.name.toLowerCase().endsWith(IMPORT_ACCEPT)) {
            setFile(null);
            setFileError("File harus berformat Excel (.xlsx).");
            return;
        }
        setFileError(undefined);
        setFile(next);
    }

    function check() {
        if (!file) return;
        importer.mutate({ file, dryRun: true }, { onSuccess: setResult });
    }

    function commit() {
        if (!file) return;
        importer.mutate(
            { file, dryRun: false },
            { onSuccess: (data) => (data.committed ? onImported(data) : setResult(data)) },
        );
    }

    return (
        <Sheet open onOpenChange={(open) => !open && !importer.isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-xl!">
                <SheetHeader className="border-b">
                    <SheetTitle>Impor transaksi dari Excel</SheetTitle>
                    <SheetDescription>
                        Tambahkan atau perbarui tagihan secara massal. Gunakan template agar kolom sesuai.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 space-y-5 overflow-y-auto p-4">
                    <Alert>
                        <CircleAlert aria-hidden />
                        <AlertTitle>Semua atau tidak sama sekali</AlertTitle>
                        <AlertDescription>
                            Jika satu baris tidak valid, seluruh impor dibatalkan. Baris dengan nomor invoice yang sudah
                            ada akan memperbarui tagihan tersebut.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium">File Excel</p>
                            <Button variant="ghost" size="sm" onClick={onDownloadTemplate} disabled={downloadingTemplate}>
                                {downloadingTemplate ? (
                                    <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                                ) : (
                                    <FileDown data-icon="inline-start" aria-hidden />
                                )}
                                Unduh template
                            </Button>
                        </div>

                        <input
                            ref={inputRef}
                            type="file"
                            accept={IMPORT_ACCEPT}
                            className="sr-only"
                            aria-label="Pilih file Excel"
                            onChange={handleFileChange}
                            disabled={importer.isPending}
                        />
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={importer.isPending}
                            className="flex w-full items-center gap-3 rounded-lg border border-dashed p-4 text-left transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
                        >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                                <FileSpreadsheet className="size-5" aria-hidden />
                            </span>
                            <span className="min-w-0">
                                {file ? (
                                    <>
                                        <span className="block truncate text-sm font-medium">{file.name}</span>
                                        <span className="block text-xs text-muted-foreground">
                                            {formatSize(file.size)} · klik untuk mengganti file
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="block text-sm font-medium">Pilih file .xlsx</span>
                                        <span className="block text-xs text-muted-foreground">
                                            Klik untuk memilih file dari komputer
                                        </span>
                                    </>
                                )}
                            </span>
                        </button>
                        {fileError && (
                            <p role="alert" className="text-sm text-destructive">
                                {fileError}
                            </p>
                        )}
                    </div>

                    {result && <CheckResult result={result} />}

                    {importer.isError && (
                        <Alert variant="destructive">
                            <CircleAlert aria-hidden />
                            <AlertTitle>{committing ? "Impor gagal" : "File gagal diperiksa"}</AlertTitle>
                            <AlertDescription>{importer.error.message}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <SheetFooter className="border-t sm:flex-row sm:justify-end">
                    <Button variant="outline" onClick={onClose} disabled={importer.isPending}>
                        Batal
                    </Button>
                    <Button variant="outline" onClick={check} disabled={!file || importer.isPending}>
                        {checking && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
                        {checking ? "Memeriksa..." : result ? "Periksa ulang" : "Periksa file"}
                    </Button>
                    <Button onClick={commit} disabled={!canCommit || importer.isPending}>
                        {committing ? (
                            <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                        ) : (
                            <Upload data-icon="inline-start" aria-hidden />
                        )}
                        {committing ? "Mengimport..." : "Import sekarang"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
