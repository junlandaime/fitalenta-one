import Link from "next/link";
import { ArrowRight, Calendar, Clock, CreditCard, MapPin, Tag, Users, type LucideIcon } from "lucide-react";
import type { Program } from "@/types/program";
import { installmentLabel, isFull, quotaLabel, quotaPercent } from "@/helpers/program-helper";
import { formatIDR } from "@/lib/utils";

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: string | null }) {
    return (
        <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-primary">
                <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="text-sm font-semibold text-primary">{value || "-"}</dd>
            </div>
        </div>
    );
}

function CostBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-bold text-primary">{value}</p>
        </div>
    );
}

export function ProgramCard({ program }: { program: Program }) {
    const full = isFull(program);
    const percent = quotaPercent(program);

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
            <header className="relative overflow-hidden bg-linear-to-br from-primary to-[#0e4a8f] p-6 text-white">
                <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-white/10" />
                {program.category && (
                    <span className="relative inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">
                        {program.category.name}
                    </span>
                )}
                <h2 className="relative mt-4 text-xl font-bold leading-snug">{program.name}</h2>
                {program.programFormat && (
                    <p className="relative mt-2 text-xs text-white/75">
                        Format Program <span className="font-semibold text-white">{program.programFormat}</span>
                    </p>
                )}
            </header>

            <div className="flex flex-1 flex-col gap-5 p-6">
                {program.description && (
                    <p className="line-clamp-4 text-sm leading-relaxed text-slate-600">{program.description}</p>
                )}

                <dl className="space-y-3">
                    <InfoRow icon={Calendar} label="Jadwal" value={program.schedule} />
                    <InfoRow icon={Clock} label="Durasi" value={program.duration} />
                    <InfoRow icon={MapPin} label="Lokasi" value={program.location} />
                </dl>

                <div className="border-t border-slate-100 pt-4">
                    <p className="mb-3 flex items-center gap-2 text-sm font-bold text-secondary">
                        <Tag className="size-4" aria-hidden /> Informasi Biaya
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <CostBox label="Biaya Pelatihan" value={formatIDR(program.trainingCost)} />
                        <CostBox label="Biaya Keberangkatan" value={formatIDR(program.departureCost)} />
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/5 p-3">
                        <div>
                            <p className="text-xs text-slate-500">Skema Pembayaran</p>
                            <p className="mt-1 text-sm font-bold text-primary">{installmentLabel(program.installmentPlan)}</p>
                        </div>
                        <CreditCard className="size-5 text-primary" aria-hidden />
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-500">
                            <Users className="size-4" aria-hidden /> Kuota
                        </span>
                        <span className="font-semibold text-primary">{quotaLabel(program)}</span>
                    </div>
                    {percent !== undefined && (
                        <div
                            role="progressbar"
                            aria-valuenow={percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Kuota terisi"
                            className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"
                        >
                            <div className="h-full rounded-full bg-secondary" style={{ width: `${percent}%` }} />
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <Link
                        href={`/programs/${program.id}`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary px-3 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
                    >
                        Detail Program <ArrowRight className="size-4" aria-hidden />
                    </Link>
                    {full ? (
                        <span className="flex flex-1 cursor-not-allowed items-center justify-center rounded-lg bg-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-500">
                            Kuota Penuh
                        </span>
                    ) : (
                        <Link
                            href={"/user/pendaftaran"}
                            className="flex flex-1 items-center justify-center rounded-lg bg-secondary px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                            Daftar Sekarang
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}