"use client";

import { ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    AVIONICS_CV_TEMPLATE_URL,
    AVIONICS_EDUCATION_LEVELS,
    COLOR_BLIND_OPTIONS,
    GENDERS,
} from "@/constants/registration-constant";
import { cn } from "@/lib/utils";
import { useRegistrationStore } from "@/store/registration-store";
import { DocumentUpload } from "./document-upload";
import { CONTROL_CLASS, FieldShell, SelectField, TextField, fieldA11y } from "./form-field";
import { FIELD_GRID, FormSection } from "./form-section";
import { PhotoUpload } from "./photo-upload";

function AvionicsGenderField() {
    const value = useRegistrationStore((state) => state.draft.gender);
    const error = useRegistrationStore((state) => state.errors.gender);
    const setField = useRegistrationStore((state) => state.setField);

    return (
        <FieldShell id="gender" label="Jenis kelamin" required error={error}>
            <RadioGroup
                id="gender"
                value={value}
                onValueChange={(next) => setField("gender", next)}
                aria-labelledby="gender-label"
                className="grid-cols-2"
                {...fieldA11y("gender", error)}
            >
                {GENDERS.map((gender) => (
                    <Label
                        key={gender.value}
                        htmlFor={`avionics-gender-${gender.value}`}
                        className={cn(
                            CONTROL_CLASS,
                            "cursor-pointer rounded-lg border border-input px-3 font-normal",
                            "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5",
                        )}
                    >
                        <RadioGroupItem id={`avionics-gender-${gender.value}`} value={gender.value} />
                        {gender.label}
                    </Label>
                ))}
            </RadioGroup>
        </FieldShell>
    );
}

function ColorBlindField() {
    const value = useRegistrationStore((state) => state.draft.colorBlindStatus);
    const error = useRegistrationStore((state) => state.errors.colorBlindStatus);
    const setField = useRegistrationStore((state) => state.setField);

    return (
        <FieldShell id="colorBlindStatus" label="Apakah Anda memiliki kondisi buta warna?" required error={error}>
            <RadioGroup
                id="colorBlindStatus"
                value={value}
                onValueChange={(next) => setField("colorBlindStatus", next)}
                className="grid gap-2 sm:grid-cols-3"
                {...fieldA11y("colorBlindStatus", error)}
            >
                {COLOR_BLIND_OPTIONS.map((option) => (
                    <Label
                        key={option}
                        htmlFor={`colorblind-${option}`}
                        className={cn(
                            CONTROL_CLASS,
                            "cursor-pointer rounded-lg border border-input px-3 font-normal",
                            "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5",
                        )}
                    >
                        <RadioGroupItem id={`colorblind-${option}`} value={option} />
                        {option}
                    </Label>
                ))}
            </RadioGroup>
        </FieldShell>
    );
}

export function AvionicsStep() {
    const lastEducation = useRegistrationStore((state) => state.draft.lastEducation);

    return (
        <div className="space-y-8">
            <FormSection
                title="Foto formal"
                description="Foto terbaru dengan 70% tampak wajah, background merah, dan resolusi minimal 2 MP."
            >
                <PhotoUpload />
            </FormSection>

            <FormSection title="Identitas & domisili" description="Data diri untuk proses seleksi Avionik GMF AeroAsia.">
                <div className={FIELD_GRID}>
                    <TextField
                        name="fullName"
                        label="Nama lengkap"
                        required
                        autoComplete="name"
                        placeholder="Nama lengkap sesuai KTP"
                    />
                    <AvionicsGenderField />
                    <TextField
                        name="birthDate"
                        label="Tanggal lahir"
                        type="date"
                        required
                        autoComplete="bday"
                    />
                    <TextField
                        name="phone"
                        label="Nomor WhatsApp aktif"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="081234567890"
                        hint="Contoh: 081234567890 atau +6281234567890"
                    />
                    <div className="sm:col-span-2">
                        <TextField
                            name="domicileCity"
                            label="Domisili sekarang"
                            required
                            placeholder="Contoh: Bandung, Medan, Jakarta"
                            hint="Nama kota/kabupaten tempat tinggal saat ini."
                        />
                    </div>
                </div>
            </FormSection>

            <FormSection title="Pendidikan & akademik" description="Informasi pendidikan terakhir dan IPK Anda.">
                <div className={FIELD_GRID}>
                    <SelectField
                        name="lastEducation"
                        label="Pendidikan"
                        required
                        options={AVIONICS_EDUCATION_LEVELS}
                        placeholder="Pilih jenjang pendidikan"
                    />
                    {lastEducation === "Lainnya" && (
                        <TextField
                            name="otherEducation"
                            label="Sebutkan pendidikan Anda"
                            required
                            placeholder="Contoh: SMK Penerbangan"
                        />
                    )}
                    <TextField
                        name="gpa"
                        label="IPK (Indeks Prestasi Komulatif)"
                        required
                        placeholder="Contoh: 3.50"
                        hint="Skala 0.00 - 4.00"
                    />
                    <TextField
                        name="major"
                        label="Program studi"
                        required
                        placeholder="Contoh: Teknik Penerbangan, Teknik Elektro"
                        hint="Tuliskan nama program studi secara lengkap tanpa singkatan."
                    />
                    <TextField
                        name="institution"
                        label="Perguruan tinggi"
                        required
                        placeholder="Contoh: Institut Teknologi Bandung, Telkom University"
                        hint="Tuliskan nama perguruan tinggi secara lengkap tanpa singkatan."
                    />
                </div>
            </FormSection>

            <FormSection title="Kondisi kesehatan">
                <ColorBlindField />
            </FormSection>

            <FormSection
                title="Dokumen persyaratan wajib"
                description="Unggah dokumen dengan jelas dalam format PDF atau gambar (maksimal 5 MB per file)."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <DocumentUpload name="ktpFile" label="KTP" required />
                    <DocumentUpload name="diplomaFile" label="Ijazah Pendidikan Terakhir" required />
                    <DocumentUpload name="transcriptFile" label="Transkrip Nilai Akademik" required />
                    <DocumentUpload
                        name="cvFile"
                        label="CV (Curriculum Vitae)"
                        required
                        extra={
                            <a
                                href={AVIONICS_CV_TEMPLATE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                                Unduh template CV
                                <ExternalLink className="size-3" aria-hidden />
                            </a>
                        }
                    />
                </div>
            </FormSection>

            <FormSection
                title="Dokumen pendukung & lanjutan (opsional)"
                description="Dokumen berikut dapat diunggah sekarang atau menyusul sesuai ketentuan seleksi."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <DocumentUpload
                        name="healthCertFile"
                        label="Surat Keterangan Sehat"
                        hint="Dapat menyusul. Maksimal 5 MB."
                    />
                    <DocumentUpload
                        name="colorBlindCertFile"
                        label="Surat Keterangan Tidak Buta Warna"
                        hint="Wajib diunggah setelah lolos seleksi wawancara bersama AMTO Tel-U ATC."
                    />
                    <DocumentUpload
                        name="drugFreeCertFile"
                        label="Surat Keterangan Bebas Narkoba"
                        hint="Wajib diunggah setelah lolos seleksi wawancara bersama AMTO Tel-U ATC."
                    />
                    <DocumentUpload
                        name="toeicCertFile"
                        label="Sertifikat Bahasa Inggris TOEIC"
                        hint="Maksimal 2 tahun setelah diterbitkan. Dapat dikirimkan menyusul."
                    />
                    <div className="sm:col-span-2">
                        <DocumentUpload
                            name="supportingDocsFile"
                            label="Sertifikat pendukung lainnya"
                            hint="Silakan gabungkan seluruh dokumen ke dalam satu file PDF (maksimal 5 MB)."
                        />
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
