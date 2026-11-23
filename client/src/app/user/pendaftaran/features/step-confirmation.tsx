"use client";

import { TriangleAlert, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { GENDERS } from "@/constants/registration-constant";
import { quotaLabel } from "@/helpers/program-helper";
import { getProgramFacts } from "@/helpers/user/registration-helper";
import { formatDate } from "@/lib/utils";
import { useRegistrationStore } from "@/store/registration-store";
import type { Program } from "@/types/program";
import type { RegistrationAddress } from "@/types/user/registration";
import { ReviewItem, ReviewSection } from "./review-section";

const formatAddress = ({ detail, cityName, provinceName }: RegistrationAddress) =>
    [detail, cityName, provinceName].filter(Boolean).join(", ");

type ConfirmationStepProps = {
    programs: Program[];
    email?: string;
};

export function ConfirmationStep({ programs, email }: ConfirmationStepProps) {
    const draft = useRegistrationStore((state) => state.draft);
    const photoPreview = useRegistrationStore((state) => state.photoPreview);
    const agreedError = useRegistrationStore((state) => state.errors.agreed);
    const setField = useRegistrationStore((state) => state.setField);
    const goToStep = useRegistrationStore((state) => state.goToStep);

    const program = programs.find((item) => item.id === draft.programId);
    const isAvionics = program?.formTemplate === "avionics";
    const gender = GENDERS.find((item) => item.value === draft.gender)?.label;
    const educationLabel =
        isAvionics && draft.lastEducation === "Lainnya" ? draft.otherEducation : draft.lastEducation;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-muted/40 p-4">
                <Avatar className="size-16">
                    <AvatarImage src={photoPreview ?? undefined} alt={`Foto ${draft.fullName}`} />
                    <AvatarFallback>
                        <User className="size-6" aria-hidden />
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold">{draft.fullName}</p>
                    <p className="truncate text-sm text-muted-foreground">{email}</p>
                </div>
                {program && <Badge variant="secondary">{program.name}</Badge>}
            </div>

            {isAvionics ? (
                <>
                    <ReviewSection title="Identitas & domisili" onEdit={() => goToStep(2)}>
                        <ReviewItem label="Nama lengkap" value={draft.fullName} />
                        <ReviewItem label="Jenis kelamin" value={gender} />
                        <ReviewItem label="Tanggal lahir" value={formatDate(draft.birthDate, "id-ID")} />
                        <ReviewItem label="Email" value={email} />
                        <ReviewItem label="Nomor WhatsApp aktif" value={draft.phone} />
                        <ReviewItem label="Domisili sekarang" value={draft.domicileCity} />
                    </ReviewSection>

                    <ReviewSection title="Pendidikan & kesehatan" onEdit={() => goToStep(2)}>
                        <ReviewItem label="Pendidikan" value={educationLabel} />
                        <ReviewItem label="Program studi" value={draft.major} />
                        <ReviewItem label="Perguruan tinggi" value={draft.institution} />
                        <ReviewItem label="IPK" value={draft.gpa} />
                        <ReviewItem label="Kondisi buta warna" value={draft.colorBlindStatus} />
                    </ReviewSection>

                    <ReviewSection title="Dokumen yang diunggah" onEdit={() => goToStep(2)}>
                        <ReviewItem label="Foto formal" value={draft.photo?.name} />
                        <ReviewItem label="KTP" value={draft.ktpFile?.name} />
                        <ReviewItem label="Ijazah pendidikan terakhir" value={draft.diplomaFile?.name} />
                        <ReviewItem label="Transkrip nilai akademik" value={draft.transcriptFile?.name} />
                        <ReviewItem label="CV (Curriculum Vitae)" value={draft.cvFile?.name} />
                        <ReviewItem label="Surat keterangan sehat" value={draft.healthCertFile?.name ?? "Belum diunggah"} />
                        <ReviewItem label="Surat tidak buta warna" value={draft.colorBlindCertFile?.name ?? "Belum diunggah"} />
                        <ReviewItem label="Surat bebas narkoba" value={draft.drugFreeCertFile?.name ?? "Belum diunggah"} />
                        <ReviewItem label="Sertifikat TOEIC" value={draft.toeicCertFile?.name ?? "Belum diunggah"} />
                        <ReviewItem label="Sertifikat pendukung" value={draft.supportingDocsFile?.name ?? "Belum diunggah"} />
                    </ReviewSection>
                </>
            ) : (
                <>
                    <ReviewSection title="Data diri" onEdit={() => goToStep(2)}>
                        <ReviewItem label="Nama lengkap" value={draft.fullName} />
                        <ReviewItem label="NIK" value={draft.nik} />
                        <ReviewItem label="Jenis kelamin" value={gender} />
                        <ReviewItem
                            label="Tempat, tanggal lahir"
                            value={`${draft.birthPlace}, ${formatDate(draft.birthDate, "id-ID")}`}
                        />
                        <ReviewItem label="Email" value={email} />
                        <ReviewItem label="Nomor handphone" value={draft.phone} />
                    </ReviewSection>

                    <ReviewSection title="Pendidikan & aktivitas" onEdit={() => goToStep(2)}>
                        <ReviewItem label="Pendidikan terakhir" value={draft.lastEducation} />
                        <ReviewItem label="Jurusan" value={draft.major} />
                        <ReviewItem label="Asal institusi pendidikan" value={draft.institution} />
                        <ReviewItem label="Pekerjaan/aktivitas saat ini" value={draft.currentActivity} />
                        <ReviewItem label="Status pernikahan" value={draft.maritalStatus} />
                    </ReviewSection>

                    <ReviewSection title="Kontak orang tua/wali" onEdit={() => goToStep(2)}>
                        <ReviewItem label="Hubungan" value={draft.guardianRelation} />
                        <ReviewItem label="Nomor handphone" value={draft.guardianPhone} />
                    </ReviewSection>

                    <ReviewSection title="Alamat" onEdit={() => goToStep(2)}>
                        <ReviewItem label="Alamat sesuai KTP" value={formatAddress(draft.ktp)} wide />
                        <ReviewItem
                            label="Alamat domisili"
                            value={draft.sameAsKtp ? "Sama dengan alamat KTP" : formatAddress(draft.domicile)}
                            wide
                        />
                    </ReviewSection>
                </>
            )}

            <ReviewSection title="Program yang dipilih" onEdit={() => goToStep(1)}>
                <ReviewItem label="Program" value={program?.name} wide />
                {program && (
                    <>
                        <ReviewItem label="Kuota" value={quotaLabel(program)} />
                        {getProgramFacts(program).map((fact) => (
                            <ReviewItem key={fact.label} label={fact.label} value={fact.value} />
                        ))}
                    </>
                )}
            </ReviewSection>

            <section className="space-y-4 border-t pt-6">
                <div className="flex items-start gap-3 rounded-xl border p-4">
                    <Checkbox
                        id="agreed"
                        checked={draft.agreed}
                        onCheckedChange={(checked) => setField("agreed", checked === true)}
                        aria-invalid={Boolean(agreedError)}
                        aria-describedby="agreed-description"
                        className="mt-0.5"
                    />
                    <div className="space-y-1">
                        <Label htmlFor="agreed" className="leading-snug">
                            Saya memastikan data yang saya berikan benar
                        </Label>
                        <p id="agreed-description" className="text-sm text-muted-foreground">
                            Saya menyatakan seluruh data yang tercantum di atas adalah benar dan valid, serta
                            telah membaca, memahami, dan menyetujui Syarat dan Ketentuan Program FITALENTA.
                        </p>
                        {agreedError && (
                            <p role="alert" className="text-sm text-destructive">
                                {agreedError}
                            </p>
                        )}
                    </div>
                </div>

                <Alert>
                    <TriangleAlert aria-hidden />
                    <AlertTitle>Periksa sekali lagi sebelum mengirim</AlertTitle>
                    <AlertDescription>
                        Data yang telah dikirim tidak dapat diubah. Setelah formulir terkirim, Anda akan
                        masuk ke proses seleksi.
                    </AlertDescription>
                </Alert>
            </section>
        </div>
    );
}
