"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    CURRENT_ACTIVITIES,
    EDUCATION_LEVELS,
    GENDERS,
    GUARDIAN_RELATIONS,
    MARITAL_STATUSES,
} from "@/constants/registration-constant";
import { digitsOnly } from "@/helpers/user/registration-helper";
import { cn } from "@/lib/utils";
import { useRegistrationStore } from "@/store/registration-store";
import { CONTROL_CLASS, FieldShell, SelectField, TextField, fieldA11y } from "./form-field";
import { FIELD_GRID, FormSection } from "./form-section";
import { PhotoUpload } from "./photo-upload";
import { RegionFields } from "./region-fields";

function GenderField() {
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
                        htmlFor={`gender-${gender.value}`}
                        className={cn(
                            CONTROL_CLASS,
                            "cursor-pointer rounded-lg border border-input px-3 font-normal",
                            "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5",
                        )}
                    >
                        <RadioGroupItem id={`gender-${gender.value}`} value={gender.value} />
                        {gender.label}
                    </Label>
                ))}
            </RadioGroup>
        </FieldShell>
    );
}

function DomicileAddress() {
    const sameAsKtp = useRegistrationStore((state) => state.draft.sameAsKtp);
    const setSameAsKtp = useRegistrationStore((state) => state.setSameAsKtp);

    return (
        <FormSection
            title="Alamat domisili"
            description="Alamat tempat tinggal Anda saat ini."
            action={
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="same-as-ktp"
                        checked={sameAsKtp}
                        onCheckedChange={(checked) => setSameAsKtp(checked === true)}
                    />
                    <Label htmlFor="same-as-ktp" className="font-normal">
                        Sama dengan alamat KTP
                    </Label>
                </div>
            }
        >
            <RegionFields kind="domicile" disabled={sameAsKtp} />
        </FormSection>
    );
}

export function PersonalStep({ email }: { email?: string }) {
    return (
        <div className="space-y-6">
            <FormSection title="Foto profil" description="Gunakan foto terbaru dengan wajah terlihat jelas.">
                <PhotoUpload />
            </FormSection>

            <FormSection title="Informasi pribadi" description="Isi sesuai dengan dokumen resmi Anda.">
                <div className={FIELD_GRID}>
                    <TextField name="fullName" label="Nama lengkap" autoComplete="name" />
                    <TextField
                        name="nik"
                        label="NIK"
                        inputMode="numeric"
                        maxLength={16}
                        format={digitsOnly}
                        hint="16 digit, sesuai KTP."
                    />
                    <GenderField />
                    <FieldShell
                        id="email"
                        label="Email"
                        hint="Mengikuti email akun yang sedang login."
                    >
                        <Input
                            id="email"
                            type="email"
                            value={email ?? ""}
                            readOnly
                            disabled
                            className={CONTROL_CLASS}
                            {...fieldA11y("email", undefined, "hint")}
                        />
                    </FieldShell>
                    <TextField name="birthPlace" label="Tempat lahir" />
                    <TextField name="birthDate" label="Tanggal lahir" type="date" />
                    <TextField
                        name="phone"
                        label="Nomor handphone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        hint="Gunakan nomor WhatsApp yang aktif."
                    />
                    <SelectField name="lastEducation" label="Pendidikan terakhir" options={EDUCATION_LEVELS} />
                </div>
            </FormSection>

            <FormSection title="Pendidikan & aktivitas" description="Latar belakang pendidikan dan kegiatan Anda saat ini.">
                <div className={FIELD_GRID}>
                    <TextField name="major" label="Jurusan" />
                    <TextField name="institution" label="Asal institusi pendidikan" />
                    <SelectField name="currentActivity" label="Pekerjaan/aktivitas saat ini" options={CURRENT_ACTIVITIES} />
                    <SelectField name="maritalStatus" label="Status pernikahan" options={MARITAL_STATUSES} />
                </div>
            </FormSection>

            <FormSection title="Kontak orang tua/wali" description="Hanya dihubungi bila diperlukan selama proses program.">
                <div className={FIELD_GRID}>
                    <SelectField name="guardianRelation" label="Hubungan dengan orang tua/wali" options={GUARDIAN_RELATIONS} />
                    <TextField
                        name="guardianPhone"
                        label="Nomor handphone orang tua/wali"
                        type="tel"
                        inputMode="tel"
                    />
                </div>
            </FormSection>

            <FormSection title="Alamat sesuai KTP" description="Alamat yang tercantum pada identitas resmi Anda.">
                <RegionFields kind="ktp" />
            </FormSection>

            <DomicileAddress />
        </div>
    );
}
