"use client";

import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { INSTALLMENT_PLANS, PROGRAM_STATUS_OPTIONS } from "@/constants/admin/admin-program-constant";
import { createEmptyProgramForm, toProgramFormValues } from "@/helpers/admin/admin-program-helper";
import { installmentLabel } from "@/helpers/program-helper";
import { focusFirstInvalidField } from "@/helpers/user/registration-helper";
import { useSaveAdminProgram } from "@/hooks/admin/use-admin-programs";
import { useProgramForm, type ProgramFormErrors } from "@/hooks/use-program-form";
import { buildProgramSchema, type ProgramFormValues } from "@/schemas/admin/admin-program";
import type { AdminProgramDetail, AdminProgramOptions } from "@/types/admin/admin-program";
import { CheckboxField, NumberField, SelectField, TextareaField, TextField } from "./program-form-fields";

const PAIR = "grid gap-4 sm:grid-cols-2";
const FORMAT_LIST_ID = "program-format-options";

function FormCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
}

type ProgramFormProps = {
    program?: AdminProgramDetail;
    options: AdminProgramOptions;
};

export function ProgramForm({ program, options }: ProgramFormProps) {
    const router = useRouter();
    const save = useSaveAdminProgram();
    const form = useProgramForm(program ? toProgramFormValues(program) : createEmptyProgramForm());

    const categoryOptions = options.categories.map((category) => ({
        value: String(category.id),
        label: category.name,
    }));

    const installmentOptions = [...new Set([...INSTALLMENT_PLANS, form.values.installmentPlan])].map((plan) => ({
        value: plan,
        label: installmentLabel(plan),
    }));

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = buildProgramSchema(program?.currentParticipants ?? 0).safeParse(form.values);
        if (!result.success) {
            const errors: ProgramFormErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof ProgramFormValues;
                errors[key] ??= issue.message;
            }
            form.setErrors(errors);
            focusFirstInvalidField();
            return;
        }

        save.mutate(
            { id: program?.id, payload: result.data },
            { onSuccess: () => router.push(`/admin/program?saved=${program ? "updated" : "created"}`) },
        );
    }

    const busy = save.isPending || save.isSuccess;

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid items-start gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <FormCard title="Informasi dasar" description="Identitas program yang tampil di website.">
                        <TextField form={form} name="name" label="Nama program" required />
                        <div className={PAIR}>
                            <div>
                                <TextField
                                    form={form}
                                    name="programFormat"
                                    label="Format program"
                                    required={false}
                                    list={FORMAT_LIST_ID}
                                    hint="Mis. Reguler, Hybrid, Fast Track."
                                />
                                <datalist id={FORMAT_LIST_ID}>
                                    {options.programFormats.map((format) => (
                                        <option key={format} value={format} />
                                    ))}
                                </datalist>
                            </div>
                            <SelectField
                                form={form}
                                name="categoryId"
                                label="Kategori"
                                options={categoryOptions}
                                emptyLabel="Tanpa kategori"
                            />
                        </div>
                        <TextareaField form={form} name="description" label="Deskripsi" rows={5} />
                        <TextField form={form} name="location" label="Lokasi" />
                        <TextareaField
                            form={form}
                            name="contactInfo"
                            label="Informasi kontak"
                            rows={3}
                            hint="Email, telepon, atau alamat yang ditampilkan di halaman detail."
                        />
                    </FormCard>

                    <FormCard title="Persyaratan & timeline" description="Satu poin per baris agar tampil sebagai daftar.">
                        <TextareaField
                            form={form}
                            name="requirementsText"
                            label="Syarat pendaftaran"
                            rows={5}
                            hint="Satu syarat per baris. Ditampilkan di halaman detail program."
                        />
                        <TextareaField
                            form={form}
                            name="requirements"
                            label="Persyaratan (cadangan)"
                            rows={3}
                            hint="Dipakai bila Syarat pendaftaran dikosongkan."
                        />
                        <TextareaField
                            form={form}
                            name="timelineText"
                            label="Timeline"
                            rows={5}
                            hint="Satu tahapan per baris."
                        />
                    </FormCard>

                    <FormCard title="Biaya & pembayaran" description="Seluruh nominal dalam rupiah.">
                        <div className={PAIR}>
                            <NumberField form={form} name="trainingCost" label="Biaya pelatihan" required currency step={1000} />
                            <NumberField form={form} name="departureCost" label="Biaya keberangkatan" required currency step={1000} />
                        </div>
                        <div className={PAIR}>
                            <TextareaField
                                form={form}
                                name="trainingFeeDetails"
                                label="Rincian biaya pelatihan"
                                rows={4}
                                hint="Satu rincian per baris."
                            />
                            <TextareaField
                                form={form}
                                name="departureFeeDetails"
                                label="Rincian biaya keberangkatan"
                                rows={4}
                                hint="Satu rincian per baris."
                            />
                        </div>
                        <div className={PAIR}>
                            <SelectField
                                form={form}
                                name="installmentPlan"
                                label="Skema pembayaran"
                                required
                                options={installmentOptions}
                            />
                            <NumberField form={form} name="downPayment" label="Uang muka (DP)" required currency step={1000} />
                        </div>
                        <div className={PAIR}>
                            <NumberField form={form} name="jobMatchingCost" label="Biaya job matching" required currency step={1000} />
                            <TextField form={form} name="bridgeFund" label="Dana talangan keberangkatan" hint="Mis. Tersedia." />
                        </div>
                    </FormCard>
                </div>

                <div className="space-y-6">
                    <FormCard title="Pengaturan program" description="Status dan urutan tampil di website.">
                        <SelectField
                            form={form}
                            name="status"
                            label="Status"
                            required
                            options={PROGRAM_STATUS_OPTIONS}
                        />
                        <CheckboxField
                            form={form}
                            name="isRunning"
                            label="Sedang berjalan"
                            description="Tandai bila program sudah berjalan pada periode ini."
                        />
                        <NumberField
                            form={form}
                            name="sortOrder"
                            label="Urutan tampil"
                            required
                            hint="Semakin kecil angkanya, semakin awal ditampilkan."
                        />
                    </FormCard>

                    <FormCard title="Jadwal & kuota" description="Durasi, kuota peserta, dan tanggal penting.">
                        <TextField form={form} name="duration" label="Durasi" hint="Mis. 4 bulan." />
                        <TextField form={form} name="schedule" label="Jadwal" hint="Mis. Senin-Jumat, 09:00-17:00." />
                        <NumberField
                            form={form}
                            name="capacity"
                            label="Kuota peserta"
                            min={1}
                            hint={
                                program
                                    ? `Peserta saat ini: ${program.currentParticipants}. Kosongkan jika tanpa batas.`
                                    : "Kosongkan jika tanpa batas."
                            }
                        />
                        <TextField form={form} name="registrationDeadline" label="Batas pendaftaran" type="date" />
                        <div className={PAIR}>
                            <TextField form={form} name="startDate" label="Tanggal mulai" type="date" />
                            <TextField form={form} name="endDate" label="Tanggal selesai" type="date" />
                        </div>
                    </FormCard>
                </div>
            </div>

            {save.isError && (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Gagal menyimpan program</AlertTitle>
                    <AlertDescription>{save.error.message}</AlertDescription>
                </Alert>
            )}

            <div className="sticky bottom-0 z-20 -mx-4 flex items-center justify-end gap-2 border-t bg-background/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
                <Button asChild variant="outline" disabled={busy}>
                    <Link href="/admin/program">Batal</Link>
                </Button>
                <Button type="submit" disabled={busy}>
                    {busy ? (
                        <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                    ) : (
                        <Save data-icon="inline-start" aria-hidden />
                    )}
                    {busy ? "Menyimpan..." : program ? "Simpan perubahan" : "Simpan program"}
                </Button>
            </div>
        </form>
    );
}
