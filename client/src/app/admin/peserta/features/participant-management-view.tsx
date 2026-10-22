"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, Download, FileDown, FileSpreadsheet, Loader2, Upload, Users, X } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDownloadParticipantTemplate, useExportParticipants } from "@/hooks/admin/use-admin-participants";
import { saveFile } from "@/lib/file-download";
import type { ParticipantExportFilters, ParticipantImportResult } from "@/types/admin/admin-participant";
import { ImportParticipantSheet } from "./import-participant-sheet";
import { ParticipantList } from "./participant-list";

type RegistrationStatusFilter = "all" | "menunggu" | "lolos" | "tidak_lolos";
type Notice = { tone: "success" | "error"; message: string };

export function ParticipantManagementView() {
    const [importOpen, setImportOpen] = useState(false);
    const [notice, setNotice] = useState<Notice | null>(null);

    const [filters, setFilters] = useState<{
        search: string;
        registrationStatus: RegistrationStatusFilter;
    }>({
        search: "",
        registrationStatus: "all",
    });

    const exporter = useExportParticipants();
    const templateDownloader = useDownloadParticipantTemplate();

    function handleExport() {
        setNotice(null);
        const exportFilters: ParticipantExportFilters = {
            search: filters.search || undefined,
            registrationStatus: filters.registrationStatus === "all" ? undefined : filters.registrationStatus,
        };

        exporter.mutate(exportFilters, {
            onSuccess: (file) => {
                saveFile(file);
                setNotice({ tone: "success", message: "Data peserta berhasil diekspor." });
            },
            onError: (error) => setNotice({ tone: "error", message: error.message }),
        });
    }

    function handleDownloadTemplate() {
        setNotice(null);
        templateDownloader.mutate(undefined, {
            onSuccess: (file) => {
                saveFile(file);
                setNotice({ tone: "success", message: "Template berhasil diunduh." });
            },
            onError: (error) => setNotice({ tone: "error", message: error.message }),
        });
    }

    function handleImported(result: ParticipantImportResult) {
        setImportOpen(false);
        setNotice({
            tone: "success",
            message: `Import berhasil: ${result.success} data peserta berhasil diperbarui.`,
        });
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
                    <Users className="size-3" aria-hidden />
                    Data Peserta
                </p>
                <h2 className="text-3xl font-bold tracking-tight">Export &amp; Import Data Peserta</h2>
                <p className="max-w-2xl text-sm text-muted-foreground">
                    Unduh data lengkap peserta dalam format Excel, atau perbarui data peserta secara massal melalui import file.
                </p>
            </div>

            <ParticipantList />

            {notice && (
                <Alert variant={notice.tone === "error" ? "destructive" : "default"}>
                    {notice.tone === "error" ? <CircleAlert aria-hidden /> : <CircleCheck aria-hidden />}
                    <AlertTitle className="pr-8">{notice.message}</AlertTitle>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-2 right-2"
                        aria-label="Tutup pemberitahuan"
                        onClick={() => setNotice(null)}
                    >
                        <X aria-hidden />
                    </Button>
                </Alert>
            )}

            {/* Export Card */}
            <Card className="gap-0 p-0 shadow-xs">
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Download className="size-4" aria-hidden />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
                                Export Data
                            </p>
                            <h3 className="text-lg leading-tight font-bold">Unduh Data Peserta</h3>
                            <p className="text-xs text-muted-foreground">
                                Unduh data peserta beserta informasi seleksi dan penempatan dalam format Excel.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="search-export">Cari peserta</Label>
                            <Input
                                id="search-export"
                                placeholder="Nama, email, atau kode registrasi..."
                                value={filters.search}
                                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status-filter">Status registrasi</Label>
                            <Select
                                value={filters.registrationStatus}
                                onValueChange={(value) =>
                                    setFilters((f) => ({ ...f, registrationStatus: value as RegistrationStatusFilter }))
                                }
                            >
                                <SelectTrigger id="status-filter">
                                    <SelectValue placeholder="Semua status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua status</SelectItem>
                                    <SelectItem value="menunggu">Menunggu</SelectItem>
                                    <SelectItem value="lolos">Lolos</SelectItem>
                                    <SelectItem value="tidak_lolos">Tidak Lolos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleExport} disabled={exporter.isPending}>
                            {exporter.isPending ? (
                                <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                            ) : (
                                <FileSpreadsheet data-icon="inline-start" aria-hidden />
                            )}
                            {exporter.isPending ? "Menyiapkan..." : "Export Excel"}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Import Card */}
            <Card className="gap-0 p-0 shadow-xs">
                <div className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Upload className="size-4" aria-hidden />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold tracking-wider text-green-600 uppercase">
                                    Import Data
                                </p>
                                <h3 className="text-lg leading-tight font-bold">Perbarui Data Massal</h3>
                                <p className="text-xs text-muted-foreground">
                                    Upload file Excel untuk memperbarui data profil peserta secara massal.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={handleDownloadTemplate}
                                disabled={templateDownloader.isPending}
                            >
                                {templateDownloader.isPending ? (
                                    <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                                ) : (
                                    <FileDown data-icon="inline-start" aria-hidden />
                                )}
                                Template import
                            </Button>
                            <Button onClick={() => setImportOpen(true)}>
                                <Upload data-icon="inline-start" aria-hidden />
                                Import Excel
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {importOpen && (
                <ImportParticipantSheet
                    downloadingTemplate={templateDownloader.isPending}
                    onDownloadTemplate={handleDownloadTemplate}
                    onClose={() => setImportOpen(false)}
                    onImported={handleImported}
                />
            )}
        </div>
    );
}
