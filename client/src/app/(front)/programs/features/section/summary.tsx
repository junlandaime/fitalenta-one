import { totalEstimate } from "@/helpers/program-helper";
import { formatIDR } from "@/lib/utils";
import { Program } from "@/types/program";
import { Calculator, LucideIcon, Plane, Wallet } from "lucide-react";

function SummaryItem({ icon: Icon, label, value, animClass }: { icon: LucideIcon; label: string; value: string; animClass?: string }) {
    return (
        // 1. Tambahkan efek animasi sweep-to-bottom di sini
        <div className="group relative z-0 flex flex-col items-center gap-3 overflow-hidden rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:ring-primary before:absolute before:inset-0 before:z-0 before:origin-top before:scale-y-0 before:bg-primary before:transition-transform before:duration-500 before:ease-in-out hover:before:scale-y-100">
            
            {/* 2. Ikon diperbesar ke size-10 dan dibuat berubah jadi putih saat hover */}
            <Icon 
                className={`relative z-10 size-10 text-primary transition-colors duration-300 group-hover:text-white ${animClass || ''}`} 
                strokeWidth={1.5} 
                aria-hidden 
            />
            
            {/* 3. Label berubah jadi putih transparan saat hover */}
            <p className="relative z-10 text-sm font-medium text-slate-500 transition-colors duration-300 group-hover:text-slate-100">
                {label}
            </p>
            
            {/* 4. Teks Nilai (Rupiah) diperbesar drastis (text-2xl & text-3xl) dan berubah jadi putih saat hover */}
            <p className="relative z-10 text-2xl font-black tracking-tight text-primary transition-colors duration-300 md:text-3xl group-hover:text-white">
                {value}
            </p>
        </div>
    );
}

export function SummarySection({ program: p }: { program: Program }) {
    return (
        <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
            <div className="border-b bg-slate-50 px-6 py-6 text-center text-2xl font-extrabold uppercase tracking-wide text-primary md:text-3xl">
                Ringkasan Biaya &amp; Pembayaran
            </div>
            <div className="grid gap-6 p-6 sm:grid-cols-3">
                <SummaryItem icon={Wallet} label="Biaya Pelatihan" value={formatIDR(p.trainingCost)} animClass="icon-wallet" />
                <SummaryItem icon={Plane} label="Keberangkatan" value={formatIDR(p.departureCost)} animClass="icon-fly" />
                <SummaryItem icon={Calculator} label="Total Estimasi" value={formatIDR(totalEstimate(p))} animClass="icon-calc" />
            </div>
        </section>
    );
}