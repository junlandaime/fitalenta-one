import { quotaLabel } from "@/helpers/program-helper";
import { Program } from "@/types/program";
import { Calendar, Clock, LucideIcon, MapPin, Users } from "lucide-react";

function OverviewCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
    return (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100 flex flex-col items-center gap-2 p-6 text-center">
            <Icon className="size-9 text-primary" strokeWidth={1.5} aria-hidden />
            <p className="mt-2 text-lg font-bold uppercase text-primary">{label}</p>
            <p className="text-sm text-slate-500">{value}</p>
        </div>
    );
}

export function OverviewSection({ program: p }: { program: Program }) {
    return (
        <section>
            <h2 className="mb-8 text-center text-3xl font-extrabold uppercase tracking-wide text-primary">Overview Program</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <OverviewCard icon={Calendar} label="Jadwal" value={p.schedule || "-"} />
                <OverviewCard icon={Clock} label="Durasi" value={p.duration || "-"} />
                <OverviewCard icon={MapPin} label="Lokasi" value={p.location || "-"} />
                <OverviewCard icon={Users} label="Kuota" value={p.capacity != null ? `${quotaLabel(p)}${p.currentParticipants != null ? " Peserta" : ""}` : "-"} />
            </div>
        </section>
    );
}