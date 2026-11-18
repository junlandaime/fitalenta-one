import { quotaLabel } from "@/helpers/program-helper";
import { Program } from "@/types/program";
import { Calendar, Clock, LucideIcon, MapPin, Users } from "lucide-react";

function OverviewCard({ icon: Icon, label, value, delay }: { icon: LucideIcon; label: string; value: string; delay: string }) {
    return (
        // Efek sweep to bottom dan scale di sini
        <div className="group relative z-0 flex flex-col items-center gap-2 overflow-hidden rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:ring-primary before:absolute before:inset-0 before:z-0 before:origin-top before:scale-y-0 before:bg-primary before:transition-transform before:duration-500 before:ease-in-out hover:before:scale-y-100">
            {/* z-10 agar icon dan teks ada di atas background biru, dan group-hover untuk ubah jadi putih */}
            <Icon 
                className="icon-bounce relative z-10 size-9 text-primary transition-colors duration-300 group-hover:text-white" 
                strokeWidth={1.5} 
                aria-hidden 
                style={{ animationDelay: delay }} 
            />
            <p className="relative z-10 mt-2 text-lg font-bold uppercase text-primary transition-colors duration-300 group-hover:text-white">{label}</p>
            <p className="relative z-10 text-sm text-slate-500 transition-colors duration-300 group-hover:text-slate-100">{value}</p>
        </div>
    );
}

export function OverviewSection({ program: p }: { program: Program }) {
    return (
        <section>
            <h2 className="mb-8 text-center text-3xl font-extrabold uppercase tracking-wide text-primary">Overview Program</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <OverviewCard icon={Calendar} label="Jadwal" value={p.schedule || "-"} delay="0s" />
                <OverviewCard icon={Clock} label="Durasi" value={p.duration || "-"} delay="0.2s" />
                <OverviewCard icon={MapPin} label="Lokasi" value={p.location || "-"} delay="0.4s" />
                <OverviewCard icon={Users} label="Kuota" value={p.capacity != null ? `${quotaLabel(p)}${p.currentParticipants != null ? " Peserta" : ""}` : "-"} delay="0.6s" />
            </div>
        </section>
    );
}