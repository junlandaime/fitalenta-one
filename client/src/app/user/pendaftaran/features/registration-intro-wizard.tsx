"use client";

import { useState } from "react";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    BookOpen,
    Check,
    CheckCircle2,
    FileCheck2,
    Info,
    Layers,
    UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Program } from "@/types/program";
import { RegistrationWizard } from "./registration-wizard";

type WizardSlide = {
    stepNumber: 1 | 2 | 3 | 4;
    stepLabel: string;
    phase: "instruksi" | "catatan";
    badge: string;
    title: string;
    description: string;
    points: string[];
    noteTitle?: string;
    nextLabel: string;
};

const INTRO_SLIDES: WizardSlide[] = [
    // STEP 1
    {
        stepNumber: 1,
        stepLabel: "Biodata",
        phase: "instruksi",
        badge: "Step 1 dari 4 • Panduan Pengisian",
        title: "Isi biodata diri dengan lengkap & unggah foto profil",
        description:
            "Pada tahap pertama formulir pendaftaran, Anda diminta melengkapi seluruh identitas diri sesuai dokumen resmi:",
        points: [
            "Unggah foto profil terbaru dengan wajah terlihat jelas tanpa masker atau kacamata hitam (JPG/PNG/WEBP, maks. 5 MB).",
            "Lengkapi nama lengkap sesuai KTP, NIK (16 digit), tempat & tanggal lahir, jenis kelamin, serta pendidikan terakhir.",
            "Isi nomor WhatsApp aktif, kontak orang tua/wali, alamat sesuai KTP, dan alamat domisili saat ini.",
        ],
        nextLabel: "Next",
    },
    {
        stepNumber: 1,
        stepLabel: "Biodata",
        phase: "catatan",
        badge: "Step 1 dari 4 • Catatan Penting",
        title: "Catatan Penting Sebelum Mengisi Biodata",
        description:
            "Perhatikan hal-hal berikut agar proses verifikasi berkas Anda tidak terkendala:",
        noteTitle: "Catatan Penting Step 1",
        points: [
            "Nomor WhatsApp wajib aktif & benar karena jadwal interview seleksi awal dikirimkan melalui nomor tersebut.",
            "NIK dan nama lengkap wajib sama persis dengan KTP untuk keperluan administrasi pemberkasan.",
            "Isian formulir tersimpan otomatis di perangkat Anda sehingga aman apabila halaman tertutup.",
        ],
        nextLabel: "Mengerti",
    },

    // STEP 2
    {
        stepNumber: 2,
        stepLabel: "Program",
        phase: "instruksi",
        badge: "Step 2 dari 4 • Panduan Pengisian",
        title: "Pilih jalur program yang sesuai kebutuhan Anda",
        description:
            "Pada tahap kedua, Anda akan melihat daftar program pelatihan FITALENTA yang tersedia beserta rinciannya:",
        points: [
            "Bandingkan kuota tersedia, durasi pelatihan, jadwal belajar, dan lokasi kelas (Reguler, Asrama, atau Hybrid).",
            "Periksa rincian biaya pelatihan, biaya keberangkatan, uang muka (DP), serta skema cicilan tiap program.",
            "Klik salah satu kartu program pilihan Anda hingga muncul tanda terpilih.",
        ],
        nextLabel: "Next",
    },
    {
        stepNumber: 2,
        stepLabel: "Program",
        phase: "catatan",
        badge: "Step 2 dari 4 • Catatan Penting",
        title: "Catatan Penting Pemilihan Program",
        description:
            "Pastikan pilihan jalur Anda sudah matang sebelum lanjut ke tahap berikutnya:",
        noteTitle: "Catatan Penting Step 2",
        points: [
            "Tidak perlu terburu-buru memilih—sesuaikan program dengan kesiapan waktu, lokasi, dan rencana biaya Anda.",
            "Pemula yang belum memiliki dasar bahasa Jepang disarankan memilih Program Reguler atau Program Asrama.",
            "Program yang berstatus Kuota penuh tidak dapat dipilih.",
        ],
        nextLabel: "Mengerti",
    },

    // STEP 3
    {
        stepNumber: 3,
        stepLabel: "Konfirmasi",
        phase: "instruksi",
        badge: "Step 3 dari 4 • Panduan Pengisian",
        title: "Periksa ulang ringkasan data & kirim pendaftaran",
        description:
            "Pada tahap ketiga, sistem menampilkan seluruh ringkasan isian Anda untuk pengecekan akhir:",
        points: [
            "Cek kembali ringkasan biodata, pendidikan, kontak orang tua/wali, alamat, dan program yang dipilih.",
            "Klik tombol 'Ubah' pada bagian terkait jika menemukan penulisan yang keliru.",
            "Centang kotak pernyataan kebenaran data, lalu tekan tombol 'Kirim pendaftaran'.",
        ],
        nextLabel: "Next",
    },
    {
        stepNumber: 3,
        stepLabel: "Konfirmasi",
        phase: "catatan",
        badge: "Step 3 dari 4 • Catatan Penting",
        title: "Catatan Penting Sebelum Mengirim Formulir",
        description:
            "Mohon teliti setiap kolom sebelum menekan tombol kirim:",
        noteTitle: "Catatan Penting Step 3",
        points: [
            "Data yang sudah dikirim tidak dapat diubah secara mandiri dan langsung masuk ke antrean seleksi tim FITALENTA.",
            "Formulir hanya bisa dikirim apabila kotak pernyataan kebenaran data sudah dicentang.",
        ],
        nextLabel: "Mengerti",
    },

    // STEP 4
    {
        stepNumber: 4,
        stepLabel: "Kode FTL",
        phase: "instruksi",
        badge: "Step 4 dari 4 • Terdaftar Resmi",
        title: "Dapatkan nomor pendaftaran resmi FTL",
        description:
            "Setelah formulir berhasil dikirim, layar konfirmasi akan menerbitkan kode pendaftaran Anda:",
        points: [
            "Sistem menampilkan Kode Pendaftaran resmi dengan format seperti FTL-2026-0001.",
            "Kode tersebut menjadi bukti sah bahwa Anda telah terdaftar pada program FITALENTA.",
            "Anda dapat menekan tombol 'Lihat status pendaftaran' untuk memantau progres di Dashboard.",
        ],
        nextLabel: "Next",
    },
    {
        stepNumber: 4,
        stepLabel: "Kode FTL",
        phase: "catatan",
        badge: "Step 4 dari 4 • Catatan Penting",
        title: "Catatan Penting Setelah Nomor Pendaftaran Terbit",
        description:
            "Simpan bukti pendaftaran Anda dan ikuti langkah lanjutan berikut:",
        noteTitle: "Catatan Penting Step 4",
        points: [
            "Simpan atau tangkap layar (screenshot) kode FTL Anda sebagai identitas saat berkomunikasi dengan admin.",
            "Tunggu pesan WhatsApp dari tim FITALENTA untuk informasi verifikasi data dan jadwal interview seleksi awal.",
            "Pendaftaran belum dianggap selesai sebelum kode FTL muncul di layar.",
        ],
        nextLabel: "Mengerti, Mulai Isi Form",
    },
];

const STEP_META = [
    { number: 1, label: "Step 1 • Biodata", Icon: UserCheck },
    { number: 2, label: "Step 2 • Program", Icon: Layers },
    { number: 3, label: "Step 3 • Konfirmasi", Icon: FileCheck2 },
    { number: 4, label: "Step 4 • Kode FTL", Icon: BadgeCheck },
] as const;

type RegistrationIntroWizardProps = {
    programs: Program[];
    initialProgramId?: number;
};

export function RegistrationIntroWizard({
    programs,
    initialProgramId,
}: RegistrationIntroWizardProps) {
    const [showIntro, setShowIntro] = useState(true);
    const [slideIndex, setSlideIndex] = useState(0);
    const [direction, setDirection] = useState<"forward" | "backward">("forward");

    const currentSlide = INTRO_SLIDES[slideIndex];
    const isFirstSlide = slideIndex === 0;
    const isLastSlide = slideIndex === INTRO_SLIDES.length - 1;
    const isNotePhase = currentSlide.phase === "catatan";

    function handleNext() {
        if (isLastSlide) {
            setShowIntro(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        setDirection("forward");
        setSlideIndex((prev) => prev + 1);
    }

    function handleBack() {
        if (isFirstSlide) return;
        setDirection("backward");
        setSlideIndex((prev) => prev - 1);
    }

    function handleSkip() {
        setShowIntro(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleReopenGuide() {
        setSlideIndex(0);
        setDirection("forward");
        setShowIntro(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (showIntro) {
        const activeMeta = STEP_META[currentSlide.stepNumber - 1];
        const StepIcon = activeMeta.Icon;

        return (
            <div className="mx-auto max-w-2xl py-2 sm:py-6">
                <Card className="overflow-hidden border-slate-200/90 shadow-lg">
                    {/* Bar Atas: Progress 4 Step + Tombol Lewati */}
                    <CardHeader className="space-y-4 border-b bg-slate-50/70 pb-5">
                        <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                                <BookOpen className="size-3.5" aria-hidden />
                                Panduan Alur Pendaftaran
                            </span>

                            <button
                                type="button"
                                onClick={handleSkip}
                                className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                Lewati panduan →
                            </button>
                        </div>

                        {/* Segmented Progress Bar (4 Step x 2 Fase) */}
                        <div className="grid grid-cols-4 gap-2">
                            {STEP_META.map((item) => {
                                const isCompleted = item.number < currentSlide.stepNumber;
                                const isCurrent = item.number === currentSlide.stepNumber;
                                const fillWidth = isCompleted
                                    ? "w-full"
                                    : isCurrent
                                      ? isNotePhase
                                          ? "w-full"
                                          : "w-1/2"
                                      : "w-0";

                                return (
                                    <div key={item.number} className="space-y-1.5">
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full bg-primary transition-all duration-300",
                                                    fillWidth,
                                                )}
                                            />
                                        </div>
                                        <p
                                            className={cn(
                                                "truncate text-[11px] font-medium",
                                                isCurrent
                                                    ? "font-semibold text-primary"
                                                    : isCompleted
                                                      ? "text-slate-700"
                                                      : "text-slate-400",
                                            )}
                                        >
                                            {item.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardHeader>

                    {/* Isi Kartu Wizard */}
                    <CardContent className="p-6 sm:p-8">
                        <div
                            key={`${slideIndex}-${direction}`}
                            className={cn(
                                "space-y-5 animate-in fade-in duration-300",
                                direction === "forward"
                                    ? "slide-in-from-right-4"
                                    : "slide-in-from-left-4",
                            )}
                        >
                            {/* Badge & Ikon Langkah */}
                            <div className="flex items-center justify-between gap-3">
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                                        isNotePhase
                                            ? "bg-amber-50 text-amber-800 ring-amber-200"
                                            : "bg-primary/10 text-primary ring-primary/20",
                                    )}
                                >
                                    {isNotePhase ? (
                                        <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                                    ) : (
                                        <Info className="size-3.5 shrink-0" aria-hidden />
                                    )}
                                    {currentSlide.badge}
                                </span>

                                <span
                                    className={cn(
                                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                                        isNotePhase
                                            ? "bg-amber-100/80 text-amber-700"
                                            : "bg-primary/10 text-primary",
                                    )}
                                >
                                    <StepIcon className="size-5" aria-hidden />
                                </span>
                            </div>

                            {/* Judul & Deskripsi */}
                            <div className="space-y-1.5">
                                <h2 className="text-xl leading-snug font-bold text-slate-900 sm:text-2xl">
                                    {currentSlide.title}
                                </h2>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {currentSlide.description}
                                </p>
                            </div>

                            {/* Daftar Poin Instruksi / Kotak Catatan Penting */}
                            {isNotePhase ? (
                                <div className="space-y-3 rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 sm:p-5">
                                    <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
                                        <AlertCircle
                                            className="size-4 shrink-0 text-amber-700"
                                            aria-hidden
                                        />
                                        <span>{currentSlide.noteTitle}</span>
                                    </div>
                                    <ul className="space-y-2.5">
                                        {currentSlide.points.map((point) => (
                                            <li
                                                key={point}
                                                className="flex items-start gap-2.5 text-xs leading-relaxed text-amber-950/90 sm:text-sm"
                                            >
                                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-600" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <ul className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5">
                                    {currentSlide.points.map((point) => (
                                        <li
                                            key={point}
                                            className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-700 sm:text-sm"
                                        >
                                            <CheckCircle2
                                                className="mt-0.5 size-4 shrink-0 text-emerald-600"
                                                aria-hidden
                                            />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </CardContent>

                    {/* Footer Navigasi: Back & Next / Mengerti */}
                    <CardFooter className="flex items-center justify-between gap-3 border-t bg-slate-50/50 px-6 py-4 sm:px-8">
                        <div>
                            {!isFirstSlide && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={handleBack}
                                >
                                    <ArrowLeft data-icon="inline-start" aria-hidden />
                                    Back
                                </Button>
                            )}
                        </div>

                        <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
                            {slideIndex + 1} / {INTRO_SLIDES.length}
                        </span>

                        <Button type="button" size="lg" onClick={handleNext}>
                            {isNotePhase && (
                                <Check data-icon="inline-start" aria-hidden />
                            )}
                            {currentSlide.nextLabel}
                            {!isNotePhase && (
                                <ArrowRight data-icon="inline-end" aria-hidden />
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
                        Pendaftaran Program
                    </h1>
                    <p className="max-w-2xl text-muted-foreground">
                        Lengkapi informasi berikut untuk mendaftar program FITALENTA. Prosesnya hanya
                        tiga langkah dan memakan waktu sekitar 5–10 menit.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReopenGuide}
                    className="shrink-0 self-start"
                >
                    <BookOpen data-icon="inline-start" aria-hidden />
                    Lihat panduan
                </Button>
            </header>

            <RegistrationWizard programs={programs} initialProgramId={initialProgramId} />
        </div>
    );
}