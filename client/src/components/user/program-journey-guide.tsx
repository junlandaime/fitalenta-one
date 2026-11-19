"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    FileCheck2,
    GraduationCap,
    MessageCircle,
    Pause,
    Plane,
    Play,
    Sparkles,
    Video,
} from "lucide-react";

type JourneyStage = {
    stageNumber: number;
    shortTitle: string;
    durationLabel: string;
    badge: string;
    title: string;
    description: string;
    highlights: string[];
    highlightNote: string;
};

const JOURNEY_STAGES: JourneyStage[] = [
    {
        stageNumber: 1,
        shortTitle: "Registrasi",
        durationLabel: "Langkah Awal",
        badge: "Tahap 1 • Registrasi Online",
        title: "Lengkapi formulir pendaftaran hingga kode FTL terbit",
        description:
            "Membuat akun saja belum terdaftar program. Isi biodata lengkap sesuai KTP, pilih jalur pelatihan, dan kirim formulir untuk mendapatkan nomor pendaftaran resmi:",
        highlights: [
            "Unggah foto profil terbaru yang jelas serta lengkapi NIK (16 digit) dan nomor WhatsApp aktif.",
            "Pilih jalur program sesuai kebutuhan (Reguler, Asrama, Hybrid, atau program khusus).",
            "Kirim formulir hingga muncul Nomor Pendaftaran resmi (contoh: FTL-2026-****).",
        ],
        highlightNote:
            "Wajib diselesaikan sekarang agar data Anda masuk ke antrean seleksi tim FITALENTA.",
    },
    {
        stageNumber: 2,
        shortTitle: "Interview WA",
        durationLabel: "1–3 Hari Kerja",
        badge: "Tahap 2 • Seleksi Awal",
        title: "Verifikasi berkas & interview awal via WhatsApp",
        description:
            "Setelah kode FTL terbit, tim rekrutmen FITALENTA akan menghubungi nomor WhatsApp Anda untuk konfirmasi data dan wawancara awal:",
        highlights: [
            "Pastikan nomor WhatsApp selalu aktif dan dapat menerima pesan maupun panggilan.",
            "Konfirmasi kesiapan mengikuti program, jadwal belajar, serta kelengkapan dokumen dasar.",
            "Sesi tanya jawab langsung mengenai alur pelatihan hingga penempatan kerja.",
        ],
        highlightNote:
            "Seluruh undangan jadwal interview dikirimkan resmi melalui nomor WhatsApp terdaftar.",
    },
    {
        stageNumber: 3,
        shortTitle: "Diklat ± 6 Bln",
        durationLabel: "± 6 Bulan",
        badge: "Tahap 3 • Masa Pelatihan",
        title: "Pendidikan bahasa Jepang, budaya kerja & keterampilan",
        description:
            "Peserta mengikuti pelatihan terstruktur bersama instruktur berpengalaman untuk mencapai standar kelayakan kerja di Jepang:",
        highlights: [
            "Pembelajaran bahasa Jepang intensif (target JLPT N4 / JFT-Basic A2) dan keterampilan kerja.",
            "Pembinaan fisik, kedisiplinan, serta etos budaya kerja Jepang (Hou-Ren-So).",
            "Evaluasi berkala dan simulasi wawancara sebelum menghadapi perusahaan penerima.",
        ],
        highlightNote:
            "Tersedia pilihan kelas Reguler, Asrama intensif, maupun Hybrid sesuai program pilihan.",
    },
    {
        stageNumber: 4,
        shortTitle: "Mensetsu",
        durationLabel: "Seleksi User",
        badge: "Tahap 4 • Wawancara Perusahaan Jepang",
        title: "Mensetsu (interview) langsung dengan user Jepang",
        description:
            "Peserta yang siap secara bahasa dan mental akan dijadwalkan mengikuti wawancara kerja langsung dengan pihak perusahaan Jepang:",
        highlights: [
            "Pendampingan penuh persiapan jikoshoukai (perkenalan diri) oleh tim pengajar.",
            "Wawancara dilakukan secara daring (Zoom) atau tatap muka bersama user Jepang.",
            "Peserta yang dinyatakan lolos langsung mendapatkan kontrak kerja resmi.",
        ],
        highlightNote:
            "Tim FITALENTA mendampingi peserta selama proses pencocokan perusahaan hingga lolos.",
    },
    {
        stageNumber: 5,
        shortTitle: "Visa & Berkas",
        durationLabel: "Proses Legalitas",
        badge: "Tahap 5 • Pemberkasan & Visa",
        title: "Pengurusan dokumen CoE hingga visa kerja resmi",
        description:
            "Setelah lolos mensetsu, seluruh dokumen keberangkatan diproses secara legal dan transparan hingga visa terbit:",
        highlights: [
            "Pemeriksaan kesehatan menyeluruh (Medical Check-Up / MCU) dan pengurusan paspor.",
            "Pengajuan Certificate of Eligibility (CoE) melalui pihak imigrasi Jepang.",
            "Penerbitan Visa Kerja Jepang serta pembekalan akhir sebelum keberangkatan.",
        ],
        highlightNote:
            "Seluruh tahapan administrasi dipandu langkah demi langkah oleh tim dokumen FITALENTA.",
    },
    {
        stageNumber: 6,
        shortTitle: "Take Off",
        durationLabel: "Berangkat",
        badge: "Tahap 6 • Keberangkatan ke Jepang",
        title: "Terbang ke Jepang & mulai berkarier secara resmi",
        description:
            "Seluruh tahapan selesai—peserta diberangkatkan menuju Jepang dan disambut oleh pihak penerima untuk mulai bekerja:",
        highlights: [
            "Pelepasan resmi peserta di bandara keberangkatan bersama tim FITALENTA.",
            "Penjemputan di bandara Jepang serta orientasi tempat tinggal dan lingkungan kerja.",
            "Pendampingan adaptasi awal agar peserta nyaman dan sukses berkarier di Jepang.",
        ],
        highlightNote:
            "Mulai langkah pertama perjalanan Anda sekarang dengan menyelesaikan Tahap 1.",
    },
];

function StageAnimatedVisual({ stageIndex }: { stageIndex: number }) {
    const [subTick, setSubTick] = useState(0);

    useEffect(() => {
        const t1 = window.setTimeout(() => setSubTick(1), 450);
        const t2 = window.setTimeout(() => setSubTick(2), 1100);
        const t3 = window.setTimeout(() => setSubTick(3), 1800);
        return () => {
            window.clearTimeout(t1);
            window.clearTimeout(t2);
            window.clearTimeout(t3);
        };
    }, [stageIndex]);

    return (
        <div className="relative flex min-h-[285px] w-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-blue-50/70 p-4 shadow-inner sm:min-h-[310px] sm:p-5">
            {/* Dekorasi Cahaya Latar Halus */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-primary/10 blur-2xl animate-pulse"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-12 -left-12 size-36 rounded-full bg-orange-400/10 blur-2xl"
            />

            {/* Header Mini Window */}
            <div className="relative z-10 mb-3 flex items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
                <div className="flex shrink-0 items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-rose-400" />
                    <span className="size-2.5 rounded-full bg-amber-400" />
                    <span className="size-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="truncate rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 shadow-2xs ring-1 ring-slate-200/80 sm:text-[11px]">
                    Simulasi Tahap {stageIndex + 1} dari {JOURNEY_STAGES.length}
                </span>
            </div>

            {/* TAHAP 1: Kartu Kode Pendaftaran FTL */}
            {stageIndex === 0 && (
                <div className="relative z-10 my-auto space-y-3 animate-in fade-in zoom-in-95 duration-500">
                    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-white p-4 shadow-sm">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                            style={{ animation: "ftlShimmer 2.8s infinite" }}
                        />
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                                Kartu Peserta Resmi
                            </span>
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all duration-500 ${
                                    subTick >= 2
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-amber-100 text-amber-700"
                                }`}
                            >
                                <Sparkles className="size-3" />
                                {subTick >= 2 ? "KODE TERBIT" : "MEMPROSES..."}
                            </span>
                        </div>

                        <div className="mt-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 py-2.5 text-center">
                            <p className="text-[10px] font-medium text-slate-500">
                                Nomor Pendaftaran Anda
                            </p>
                            <p className="mt-0.5 font-mono text-lg font-extrabold tracking-widest text-primary sm:text-xl">
                                {subTick >= 1 ? "FTL-2026-****" : "FTL-2026-••••"}
                            </p>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                            {["Biodata KTP", "Pilih Jalur", "Kirim Form"].map((item, idx) => {
                                const done = subTick > idx;
                                return (
                                    <div
                                        key={item}
                                        className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-[10px] font-semibold transition-all duration-300 ${
                                            done
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : "border-slate-100 bg-slate-50 text-slate-400"
                                        }`}
                                    >
                                        <Check className="size-3 shrink-0" />
                                        <span className="truncate">{item}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* TAHAP 2: Simulasi Chat WhatsApp Interview */}
            {stageIndex === 1 && (
                <div className="relative z-10 my-auto space-y-2.5 animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-white shadow-xs">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20">
                            <MessageCircle className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold">Admin Seleksi FITALENTA</p>
                            <p className="text-[10px] text-emerald-100">Online • WhatsApp Resmi</p>
                        </div>
                    </div>

                    <div className="space-y-2 rounded-xl border border-slate-200/80 bg-white/90 p-3">
                        <div
                            className={`max-w-[88%] rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2 text-[11px] leading-relaxed text-slate-700 transition-all duration-500 ${
                                subTick >= 1
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-2 opacity-0"
                            }`}
                        >
                            Halo! Data pendaftaran <strong>FTL-2026-****</strong> sudah kami terima.
                        </div>

                        <div
                            className={`max-w-[90%] rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2 text-[11px] leading-relaxed text-slate-700 transition-all duration-500 ${
                                subTick >= 2
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-2 opacity-0"
                            }`}
                        >
                            Undangan <strong>Interview Awal via WA</strong> dijadwalkan besok pukul{" "}
                            <span className="font-semibold text-primary">10.00 WIB</span>.
                        </div>

                        <div
                            className={`ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-600 px-3 py-2 text-[11px] font-medium text-white shadow-2xs transition-all duration-500 ${
                                subTick >= 3
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-2 opacity-0"
                            }`}
                        >
                            Siap hadir Kak, terima kasih! ✓✓
                        </div>
                    </div>
                </div>
            )}

            {/* TAHAP 3: Progres Diklat ± 6 Bulan */}
            {stageIndex === 2 && (
                <div className="relative z-10 my-auto space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                        <div className="flex items-center gap-2.5">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <GraduationCap className="size-5" />
                            </span>
                            <div>
                                <p className="text-xs font-bold text-slate-900">
                                    Kurikulum Diklat ± 6 Bulan
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    Target Standar JLPT N4 / JFT-Basic
                                </p>
                            </div>
                        </div>
                        <span className="rounded-lg bg-orange-50 px-2 py-1 text-xs font-extrabold text-orange-700 ring-1 ring-orange-200">
                            日本語
                        </span>
                    </div>

                    <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                        {[
                            { label: "Bahasa Jepang (N4 / JFT)", pct: "90%", color: "bg-primary" },
                            { label: "Etos & Budaya Kerja Jepang", pct: "95%", color: "bg-emerald-500" },
                            { label: "Simulasi Wawancara User", pct: "85%", color: "bg-orange-500" },
                        ].map((skill) => (
                            <div key={skill.label} className="space-y-1">
                                <div className="flex justify-between text-[11px] font-semibold">
                                    <span className="text-slate-700">{skill.label}</span>
                                    <span className="text-primary">{subTick >= 1 ? skill.pct : "0%"}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full ${skill.color} transition-all duration-1000 ease-out`}
                                        style={{ width: subTick >= 1 ? skill.pct : "8%" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAHAP 4: Mensetsu / Interview Perusahaan Jepang */}
            {stageIndex === 3 && (
                <div className="relative z-10 my-auto space-y-3 animate-in fade-in zoom-in-95 duration-500">
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center shadow-2xs">
                            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                                ID
                            </span>
                            <p className="mt-2 text-xs font-bold text-slate-800">Peserta FITALENTA</p>
                            <p className="text-[10px] text-slate-500">Jikoshoukai Bahasa Jepang</p>
                        </div>

                        <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center shadow-2xs">
                            <span className="flex size-10 items-center justify-center rounded-full bg-rose-50 text-sm font-extrabold text-rose-600 ring-1 ring-rose-200">
                                JP
                            </span>
                            <p className="mt-2 text-xs font-bold text-slate-800">User Perusahaan</p>
                            <p className="text-[10px] text-slate-500">Pewawancara Jepang</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-2xs">
                        <div className="flex items-center gap-2">
                            <Video className="size-4 text-primary" />
                            <div className="flex items-end gap-0.5 h-3.5">
                                {[0, 1, 2, 3, 4].map((bar) => (
                                    <span
                                        key={bar}
                                        className="w-1 rounded-full bg-primary"
                                        style={{
                                            height: "100%",
                                            animation: `ftlEqualizer 0.9s ease-in-out ${bar * 0.14}s infinite alternate`,
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-[11px] font-medium text-slate-600">
                                Sesi Mensetsu
                            </span>
                        </div>

                        <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all duration-500 ${
                                subTick >= 2
                                    ? "scale-100 bg-emerald-100 text-emerald-700 opacity-100"
                                    : "scale-90 bg-slate-100 text-slate-400 opacity-70"
                            }`}
                        >
                            {subTick >= 2 ? "LOLOS MENSETSU ✓" : "BERLANGSUNG..."}
                        </span>
                    </div>
                </div>
            )}

            {/* TAHAP 5: Pemberkasan CoE & Visa Kerja */}
            {stageIndex === 4 && (
                <div className="relative z-10 my-auto space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
                    {[
                        { name: "Medical Check-Up (MCU) & Paspor", code: "Valid" },
                        { name: "Kontrak Kerja Perusahaan Jepang", code: "Ditandatangani" },
                        { name: "Certificate of Eligibility (CoE)", code: "Terbit" },
                        { name: "Visa Kerja Resmi Jepang", code: "Siap Terbang" },
                    ].map((doc, idx) => {
                        const verified = subTick > idx || idx === 0;
                        return (
                            <div
                                key={doc.name}
                                className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition-all duration-500 ${
                                    verified
                                        ? "border-emerald-200 bg-white shadow-2xs"
                                        : "border-slate-200/70 bg-white/60 opacity-65"
                                }`}
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <FileCheck2
                                        className={`size-4 shrink-0 ${
                                            verified ? "text-emerald-600" : "text-slate-400"
                                        }`}
                                    />
                                    <span className="truncate text-xs font-semibold text-slate-800">
                                        {doc.name}
                                    </span>
                                </div>
                                <span
                                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                        verified
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-slate-100 text-slate-400"
                                    }`}
                                >
                                    {verified ? `${doc.code} ✓` : "Proses"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* TAHAP 6: Take Off ke Jepang */}
            {stageIndex === 5 && (
                <div className="relative z-10 my-auto space-y-3 animate-in fade-in zoom-in-95 duration-500">
                    <div className="rounded-2xl border border-primary/20 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-center">
                            <div>
                                <p className="text-base font-extrabold text-slate-900">CGK</p>
                                <p className="text-[10px] font-medium text-slate-500">
                                    Indonesia 🇮🇩
                                </p>
                            </div>

                            <div className="relative mx-3 flex-1">
                                <div className="border-t-2 border-dashed border-primary/40" />
                                <span
                                    className="absolute -top-3.5 left-0 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-md"
                                    style={{ animation: "ftlPlaneFly 3.2s ease-in-out infinite" }}
                                >
                                    <Plane className="size-3.5" />
                                </span>
                            </div>

                            <div>
                                <p className="text-base font-extrabold text-primary">NRT / KIX</p>
                                <p className="text-[10px] font-medium text-slate-500">Jepang 🇯🇵</p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-center text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200/80">
                            Resmi Berangkat & Mulai Berkarier di Jepang!
                        </div>
                    </div>
                </div>
            )}

            {/* Bar Status Bawah Simulasi */}
            <div className="relative z-10 mt-3 flex items-center justify-between border-t border-slate-200/70 pt-2 text-[11px] text-slate-500">
                <span>Alur Resmi FITALENTA</span>
                <span className="font-semibold text-primary">
                    {JOURNEY_STAGES[stageIndex].durationLabel}
                </span>
            </div>
        </div>
    );
}

type RegistrationGuideProps = {
    ctaHref?: string;
    hasRegistration?: boolean;
};

const STAGE_DURATION_MS = 6500;

export function RegistrationGuide({
    ctaHref = "/user/pendaftaran",
    hasRegistration = false,
}: RegistrationGuideProps) {
    const [activeIndex, setActiveIndex] = useState(hasRegistration ? 1 : 0);
    const [isPaused, setIsPaused] = useState(false);

    const currentStage = JOURNEY_STAGES[activeIndex];

    useEffect(() => {
        if (isPaused) return;
        const timer = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % JOURNEY_STAGES.length);
        }, STAGE_DURATION_MS);
        return () => window.clearInterval(timer);
    }, [isPaused]);

    return (
        <section
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Alur Lengkap Peserta FITALENTA"
            className={`w-full max-w-full overflow-hidden rounded-2xl border bg-white shadow-sm ${
                hasRegistration ? "border-slate-200/90" : "border-amber-200/90"
            }`}
        >
            {/* Keyframes Animasi Kustom */}
            <style>{`
                @keyframes ftlShimmer {
                    0% { transform: translateX(-120%); }
                    100% { transform: translateX(260%); }
                }
                @keyframes ftlEqualizer {
                    0% { transform: scaleY(0.35); }
                    100% { transform: scaleY(1); }
                }
                @keyframes ftlPlaneFly {
                    0% { left: 4%; transform: translateY(0px) rotate(0deg); }
                    50% { left: 48%; transform: translateY(-4px) rotate(-4deg); }
                    100% { left: 84%; transform: translateY(0px) rotate(0deg); }
                }
            `}</style>

            {/* Strip Peringatan Paling Atas (Hanya tampil jika belum daftar) */}
            {!hasRegistration && (
                <div className="border-b border-amber-200/80 bg-amber-50/90 px-4 py-3.5 sm:px-6">
                    <div className="flex min-w-0 items-start gap-2.5 sm:items-center">
                        <AlertCircle
                            className="mt-0.5 size-5 shrink-0 text-amber-700 sm:mt-0"
                            aria-hidden
                        />
                        <p className="min-w-0 flex-1 text-xs leading-relaxed text-amber-950 sm:text-sm">
                            <strong>Pendaftaran belum selesai:</strong> Akun saja belum terdaftar
                            program. Selesaikan Tahap 1 di bawah sampai muncul kode{" "}
                            <span className="font-bold">FTL</span>.
                        </p>
                    </div>
                </div>
            )}

            {/* Header Alur Lengkap + Navigasi 6 Tahap */}
            <div className="space-y-4 border-b border-slate-100 bg-slate-50/60 px-4 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                        <h2 className="text-base font-bold text-primary sm:text-lg">
                            Alur Lengkap Peserta FITALENTA
                        </h2>
                        <p className="text-xs text-slate-500">
                            Perjalanan lengkap peserta mulai dari pendaftaran hingga berangkat ke
                            Jepang (6 tahap)
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsPaused((prev) => !prev)}
                        aria-label={
                            isPaused ? "Lanjutkan animasi otomatis" : "Jeda animasi otomatis"
                        }
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                    >
                        {isPaused ? (
                            <>
                                <Play className="size-3" />
                                Putar Otomatis
                            </>
                        ) : (
                            <>
                                <Pause className="size-3" />
                                Otomatis Aktif
                            </>
                        )}
                    </button>
                </div>

                {/* Stepper 6 Tahap Responsif */}
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
                    {JOURNEY_STAGES.map((stage, idx) => {
                        const active = idx === activeIndex;
                        const passed = idx < activeIndex || (hasRegistration && idx === 0);
                        return (
                            <button
                                key={stage.stageNumber}
                                type="button"
                                onClick={() => setActiveIndex(idx)}
                                className={`group flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all duration-300 ${
                                    active
                                        ? "scale-[1.01] border-primary bg-primary text-white shadow-xs"
                                        : passed
                                          ? "border-primary/25 bg-primary/10 text-primary hover:bg-primary/15"
                                          : "border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                <span
                                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                                        active
                                            ? "bg-white text-primary"
                                            : passed
                                              ? "bg-primary text-white"
                                              : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    {passed && !active ? (
                                        <Check className="size-3" />
                                    ) : (
                                        stage.stageNumber
                                    )}
                                </span>
                                <span className="min-w-0 flex-1 truncate text-xs font-semibold">
                                    {stage.shortTitle}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Konten Utama: Penjelasan Tahapan (Kiri) + Simulasi Animasi (Kanan) */}
            <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-12 lg:items-center">
                <div
                    key={`stage-info-${currentStage.stageNumber}`}
                    className="min-w-0 space-y-4 animate-in fade-in slide-in-from-left-3 duration-300 lg:col-span-6"
                >
                    <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200/70">
                        {currentStage.badge}
                    </span>

                    <h3 className="text-lg leading-snug font-bold text-slate-900 sm:text-xl">
                        {currentStage.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {currentStage.description}
                    </p>

                    <ul className="space-y-2">
                        {currentStage.highlights.map((point) => (
                            <li
                                key={point}
                                className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 sm:text-[13px]"
                            >
                                <CheckCircle2
                                    className="mt-0.5 size-4 shrink-0 text-emerald-600"
                                    aria-hidden
                                />
                                <span className="min-w-0 flex-1">{point}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="rounded-xl border border-primary/15 bg-primary/5 px-3.5 py-2.5 text-xs leading-relaxed text-primary">
                        <span className="font-semibold">Info tahap ini: </span>
                        {currentStage.highlightNote}
                    </div>

                    {/* Kontrol Navigasi Bawah + Tombol Utama Daftar Program (jika belum daftar) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveIndex(
                                        (prev) =>
                                            (prev - 1 + JOURNEY_STAGES.length) %
                                            JOURNEY_STAGES.length,
                                    )
                                }
                                aria-label="Tahap sebelumnya"
                                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:border-primary hover:text-primary"
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveIndex((prev) => (prev + 1) % JOURNEY_STAGES.length)
                                }
                                aria-label="Tahap berikutnya"
                                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:border-primary hover:text-primary"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                            <span className="pl-1 text-xs font-medium text-slate-400">
                                Tahap {activeIndex + 1} dari {JOURNEY_STAGES.length}
                            </span>
                        </div>

                        {!hasRegistration && (
                            <Link
                                href={ctaHref}
                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-primary/90 active:scale-95 sm:w-auto sm:text-sm"
                            >
                                Mulai Daftar Program
                                <ArrowRight className="size-4 shrink-0" aria-hidden />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Panel Kanan: Visual Animasi Interaktif */}
                <div className="min-w-0 lg:col-span-6">
                    <StageAnimatedVisual key={activeIndex} stageIndex={activeIndex} />
                </div>
            </div>
        </section>
    );
}