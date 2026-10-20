import { BellOff, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationEmpty() {
    return (
        <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="grid size-20 place-items-center rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                <BellOff className="size-9 text-slate-400" strokeWidth={1.5} aria-hidden />
            </span>
            <h2 className="mt-6 text-lg font-bold text-primary">Belum ada notifikasi</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Pembaruan seleksi, penempatan, dan pembayaran program Anda akan muncul di sini.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs text-slate-500">
                <Info className="size-3.5" aria-hidden />
                Tidak ada tindakan yang perlu dilakukan saat ini.
            </p>
        </div>
    );
}

export function NotificationFilteredEmpty({ onReset }: { onReset: () => void }) {
    return (
        <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <p className="text-sm text-muted-foreground">Semua notifikasi sudah dibaca.</p>
            <Button variant="outline" onClick={onReset}>
                Tampilkan semua notifikasi
            </Button>
        </div>
    );
}
