import { Info, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvoiceEmpty() {
    return (
        <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="relative">
                <span className="grid size-24 place-items-center rounded-3xl bg-indigo-50 ring-1 ring-indigo-100">
                    <Receipt className="size-10 text-indigo-600" strokeWidth={1.5} aria-hidden />
                </span>
                <span aria-hidden className="absolute -top-2 -right-3 size-7 rounded-full bg-indigo-100" />
                <span aria-hidden className="absolute -bottom-2 -left-3 size-4 rounded-full bg-indigo-100" />
            </div>

            <span className="mt-8 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Belum ada invoice
            </span>
            <h3 className="mt-3 text-xl font-bold text-primary">Belum ada pembayaran</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Setelah Anda mendaftar program dan dinyatakan lolos interview, invoice pembayaran akan muncul
                secara otomatis di halaman ini.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs text-slate-500">
                <Info className="size-3.5" aria-hidden />
                Tidak ada tindakan yang perlu dilakukan saat ini.
            </p>
        </div>
    );
}

export function InvoiceFilteredEmpty({ onReset }: { onReset: () => void }) {
    return (
        <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <p className="text-sm text-muted-foreground">Tidak ada invoice dengan status yang dipilih.</p>
            <Button variant="outline" onClick={onReset}>
                Tampilkan semua invoice
            </Button>
        </div>
    );
}
