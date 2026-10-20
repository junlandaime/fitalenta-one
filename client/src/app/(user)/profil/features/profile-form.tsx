"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, Loader2, UserRound } from "lucide-react";
import { CONTROL_CLASS, FieldShell, fieldA11y } from "@/app/(user)/pendaftaran/features/form-field";
import { FIELD_GRID } from "@/app/(user)/pendaftaran/features/form-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PROFILE_LIMITS } from "@/constants/user/user-profile-constant";
import {
    buildProfilePayload,
    normalizeProfileValues,
    toProfileFormValues,
    validateClearedFields,
} from "@/helpers/user/user-profile-helper";
import { useUpdateMyProfile } from "@/hooks/user/use-user-profile";
import { cn } from "@/lib/utils";
import { getTodayISO, profileSchema, type ProfileFormValues } from "@/schemas/user/user-profile";
import type { MyProfile } from "@/types/user/user-profile";

type FieldName = keyof ProfileFormValues;
type FieldErrors = Partial<Record<FieldName, string>>;

export function ProfileForm({ profile }: { profile: MyProfile }) {
    const update = useUpdateMyProfile();

    const [values, setValues] = useState<ProfileFormValues>(() => toProfileFormValues(profile));
    const [errors, setErrors] = useState<FieldErrors>({});
    const [saved, setSaved] = useState(false);

    const dirty = Object.keys(buildProfilePayload(profile, normalizeProfileValues(values))).length > 0;

    function setValue(name: FieldName, value: string) {
        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
        setSaved(false);
        if (update.isError) update.reset();
    }

    function handleReset() {
        setValues(toProfileFormValues(profile));
        setErrors({});
        setSaved(false);
        update.reset();
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = profileSchema.safeParse(values);
        if (!result.success) {
            const next: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as FieldName;
                next[key] ??= issue.message;
            }
            setErrors(next);
            return;
        }

        const cleared = validateClearedFields(profile, result.data);
        if (Object.keys(cleared).length > 0) {
            setErrors(cleared);
            return;
        }

        const payload = buildProfilePayload(profile, result.data);
        if (Object.keys(payload).length === 0) return;

        update.mutate(payload, {
            onSuccess: (updated) => {
                setValues(toProfileFormValues(updated));
                setSaved(true);
            },
        });
    }

    const busy = update.isPending;

    return (
        <Card className="gap-0 overflow-hidden rounded-3xl py-0 shadow-xs">
            <div className="flex items-center gap-3 border-b p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                    <UserRound className="size-5" aria-hidden />
                </span>
                <div>
                    <h2 className="text-xl font-bold text-primary">Informasi Pribadi</h2>
                    <p className="text-sm text-muted-foreground">Perbarui data diri yang tampil pada akun Anda.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-5 p-6">
                    {saved && (
                        <Alert role="status">
                            <CircleCheck aria-hidden />
                            <AlertTitle>Profil berhasil diperbarui.</AlertTitle>
                        </Alert>
                    )}
                    {update.isError && (
                        <Alert variant="destructive">
                            <CircleAlert aria-hidden />
                            <AlertTitle>Profil gagal disimpan</AlertTitle>
                            <AlertDescription>{update.error.message}</AlertDescription>
                        </Alert>
                    )}

                    <div className={FIELD_GRID}>
                        <FieldShell id="name" label="Nama lengkap" required error={errors.name} className="sm:col-span-2">
                            <Input
                                id="name"
                                value={values.name}
                                onChange={(event) => setValue("name", event.target.value)}
                                autoComplete="name"
                                disabled={busy}
                                className={CONTROL_CLASS}
                                {...fieldA11y("name", errors.name)}
                            />
                        </FieldShell>

                        <FieldShell
                            id="email"
                            label="Email"
                            hint="Email digunakan untuk login dan tidak dapat diubah."
                        >
                            <Input
                                id="email"
                                type="email"
                                value={profile.email}
                                readOnly
                                disabled
                                className={CONTROL_CLASS}
                                {...fieldA11y("email", undefined, "Email digunakan untuk login dan tidak dapat diubah.")}
                            />
                        </FieldShell>

                        <FieldShell id="phone" label="Nomor telepon" error={errors.phone} hint="Contoh: 081234567890">
                            <Input
                                id="phone"
                                type="tel"
                                inputMode="tel"
                                value={values.phone}
                                onChange={(event) => setValue("phone", event.target.value)}
                                autoComplete="tel"
                                disabled={busy}
                                className={CONTROL_CLASS}
                                {...fieldA11y("phone", errors.phone, "Contoh: 081234567890")}
                            />
                        </FieldShell>

                        <FieldShell id="birthPlace" label="Tempat lahir" error={errors.birthPlace}>
                            <Input
                                id="birthPlace"
                                value={values.birthPlace}
                                onChange={(event) => setValue("birthPlace", event.target.value)}
                                disabled={busy}
                                className={CONTROL_CLASS}
                                {...fieldA11y("birthPlace", errors.birthPlace)}
                            />
                        </FieldShell>

                        <FieldShell id="birthDate" label="Tanggal lahir" error={errors.birthDate}>
                            <Input
                                id="birthDate"
                                type="date"
                                max={getTodayISO()}
                                value={values.birthDate}
                                onChange={(event) => setValue("birthDate", event.target.value)}
                                autoComplete="bday"
                                disabled={busy}
                                className={CONTROL_CLASS}
                                {...fieldA11y("birthDate", errors.birthDate)}
                            />
                        </FieldShell>

                        <FieldShell
                            id="address"
                            label="Alamat"
                            error={errors.address}
                            hint={`${values.address.length}/${PROFILE_LIMITS.addressMax} karakter`}
                            className="sm:col-span-2"
                        >
                            <Textarea
                                id="address"
                                rows={3}
                                value={values.address}
                                onChange={(event) => setValue("address", event.target.value)}
                                autoComplete="street-address"
                                disabled={busy}
                                {...fieldA11y("address", errors.address, `${values.address.length}/${PROFILE_LIMITS.addressMax} karakter`)}
                            />
                        </FieldShell>
                    </div>
                </div>

                <div className={cn("flex flex-wrap items-center justify-end gap-2 border-t bg-muted/30 px-6 py-4")}>
                    <Button type="button" variant="outline" size="lg" onClick={handleReset} disabled={!dirty || busy}>
                        Batalkan perubahan
                    </Button>
                    <Button type="submit" size="lg" disabled={!dirty || busy}>
                        {busy && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
                        {busy ? "Menyimpan..." : "Simpan perubahan"}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
