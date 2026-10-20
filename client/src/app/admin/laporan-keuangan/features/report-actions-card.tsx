import { Download, FileDown, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
    exporting: boolean;
    downloadingTemplate: boolean;
    exportDisabled: boolean;
    onExport: () => void;
    onTemplate: () => void;
    onImport: () => void;
};

export function ReportActionsCard({ exporting, downloadingTemplate, exportDisabled, onExport, onTemplate, onImport }: Props) {
    return (
        <Card className="gap-0 p-0 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Download className="size-4" aria-hidden />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
                            Export &amp; Import
                        </p>
                        <h3 className="text-lg leading-tight font-bold">Dokumen Laporan</h3>
                        <p className="text-xs text-muted-foreground">
                            Unduh laporan sesuai filter aktif, atau import data transaksi dari file Excel.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" onClick={onTemplate} disabled={downloadingTemplate}>
                        {downloadingTemplate ? (
                            <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                        ) : (
                            <FileDown data-icon="inline-start" aria-hidden />
                        )}
                        Template import
                    </Button>
                    <Button variant="outline" onClick={onImport}>
                        <Upload data-icon="inline-start" aria-hidden />
                        Import Excel
                    </Button>
                    <Button onClick={onExport} disabled={exporting || exportDisabled}>
                        {exporting ? (
                            <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                        ) : (
                            <FileSpreadsheet data-icon="inline-start" aria-hidden />
                        )}
                        {exporting ? "Menyiapkan..." : "Export Excel"}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
