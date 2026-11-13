import Link from "next/link";
import { ArrowRight, Calendar, Clock, CreditCard, MapPin, Tag, Users, type LucideIcon } from "lucide-react";
import type { Program } from "@/types/program";
import { installmentLabel, isFull, quotaLabel, quotaPercent } from "@/helpers/program-helper";
import { formatIDR } from "@/lib/utils";

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: string | null }) {
    return (
        <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-primary transition-colors duration-300 group-hover:bg-white/10 group-hover:text-secondary">
                <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
                <dt className="text-xs text-slate-500 transition-colors duration-300 group-hover:text-slate-300">{label}</dt>
                <dd className="text-sm font-semibold text-primary transition-colors duration-300 group-hover:text-white">{value || "-"}</dd>
            </div>
        </div>
    );
}

function CostBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100 transition-all duration-300 group-hover:bg-white/10 group-hover:ring-white/20">
            <p className="text-xs text-slate-500 transition-colors duration-300 group-hover:text-slate-300">{label}</p>
            <p className="mt-1 text-sm font-bold text-primary transition-colors duration-300 group-hover:text-white">{value}</p>
        </div>
    );
}

export function ProgramCard({ program }: { program: Program }) {
    const full = isFull(program);
    const percent = quotaPercent(program);

    let bgImage = "";
    const fullText = `${program.category?.name || ""} ${program.name || ""} ${program.description || ""}`.toLowerCase();
    
    if (fullText.includes("gijinkoku") || fullText.includes("gijingoku") || fullText.includes("engineer")) {
        bgImage = "url(/cardgijingoku.png)";
    } 
    else if (fullText.includes("korea")) {
        bgImage = "url(/cardkorea.png)";
    } 
    else if (
        fullText.includes("jepang") || 
        fullText.includes("tokutei") || 
        fullText.includes("jlpt") ||
        fullText.includes("ssw")
    ) {
        bgImage = "url(/cardjepang.png)";
    }

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-500 hover:scale-[1.03] hover:shadow-xl z-0 hover:z-10 before:absolute before:inset-0 before:-z-10 before:origin-top before:scale-y-0 before:bg-primary before:transition-transform before:duration-500 before:ease-out hover:before:scale-y-100 hover:ring-primary/50">
            
            <header 
                className={`relative z-10 overflow-hidden p-6 text-white bg-cover bg-center h-[9.75rem] ${
                    !bgImage ? "bg-linear-to-br from-primary to-[#0e4a8f]" : ""
                }`}
                style={bgImage ? { backgroundImage: bgImage } : {}}
            >
                {bgImage && <div className="absolute inset-0 bg-black/40" />}
                {!bgImage && <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-white/10" />}
                
                {program.category && (
                    <span className="relative z-10 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary transition-colors duration-300 group-hover:bg-secondary group-hover:text-white shadow-sm">
                        {program.category.name}
                    </span>
                )}
                
                <h2 className="relative z-10 mt-4 text-xl font-bold leading-snug line-clamp-2" title={program.name}>
                    {program.name}
                </h2>
                
                {program.programFormat && (
                    <p className="relative z-10 mt-2 text-xs text-white/75">
                        Format Program <span className="font-semibold text-white">{program.programFormat}</span>
                    </p>
                )}
            </header>

            <div className="relative z-10 flex flex-1 flex-col gap-5 p-6">
                <div className="min-h-[5rem]">
                    {program.description ? (
                        <p className="line-clamp-4 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-200">
                            {program.description}
                        </p>
                    ) : (
                        <p className="text-sm text-transparent select-none">-</p> 
                    )}
                </div>

                <dl className="space-y-3">
                    <InfoRow icon={Calendar} label="Jadwal" value={program.schedule} />
                    <InfoRow icon={Clock} label="Durasi" value={program.duration} />
                    <InfoRow icon={MapPin} label="Lokasi" value={program.location} />
                </dl>

                <div className="mt-auto flex flex-col gap-5">
                    <div className="border-t border-slate-100 pt-4 transition-colors duration-300 group-hover:border-white/20">
                        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-secondary group-hover:text-white">
                            <Tag className="size-4" aria-hidden /> Informasi Biaya
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <CostBox label="Biaya Pelatihan" value={formatIDR(program.trainingCost)} />
                            <CostBox label="Biaya Keberangkatan" value={formatIDR(program.departureCost)} />
                        </div>
                        {/* Kotak Skema Pembayaran */}
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/5 p-3 transition-colors duration-300 group-hover:bg-white/10">
                            <div>
                                <p className="text-xs text-slate-500 transition-colors duration-300 group-hover:text-slate-300">Skema Pembayaran</p>
                                <p className="mt-1 text-sm font-bold text-primary transition-colors duration-300 group-hover:text-white">{installmentLabel(program.installmentPlan)}</p>
                            </div>
                            <CreditCard className="size-5 text-primary transition-colors duration-300 group-hover:text-secondary" aria-hidden />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-500 transition-colors duration-300 group-hover:text-slate-300">
                                <Users className="size-4" aria-hidden /> Kuota
                            </span>
                            <span className="font-semibold text-primary transition-colors duration-300 group-hover:text-white">{quotaLabel(program)}</span>
                        </div>
                        {percent !== undefined && (
                            <div
                                role="progressbar"
                                aria-valuenow={percent}
                                className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 transition-colors duration-300 group-hover:bg-white/20"
                            >
                                <div className="h-full rounded-full bg-secondary" style={{ width: `${percent}%` }} />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/programs/${program.id}`}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary px-3 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/5 group-hover:border-white group-hover:text-white group-hover:hover:bg-white/20"
                        >
                            Detail Program <ArrowRight className="size-4" aria-hidden />
                        </Link>
                        {full ? (
                            <span className="flex flex-1 cursor-not-allowed items-center justify-center rounded-lg bg-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors duration-300 group-hover:bg-white/30 group-hover:text-white">
                                Kuota Penuh
                            </span>
                        ) : (
                            <Link
                                href={"/user/pendaftaran"}
                                className="flex flex-1 items-center justify-center rounded-lg bg-secondary px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 shadow-sm group-hover:bg-white group-hover:text-primary group-hover:hover:bg-slate-100"
                            >
                                Daftar Sekarang
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}