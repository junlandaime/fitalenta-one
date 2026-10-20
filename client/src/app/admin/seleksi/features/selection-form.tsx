"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Building2, CircleAlert, CircleCheck, ClipboardCheck, Info, Loader2, Pencil, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PLACEMENT_STATUS, SELECTION_STATUS, statusLabel } from "@/constants/admin/admin-status";
import {
    COMPANY_REQUIRED_PLACEMENT_STATUSES,
    DATE_REQUIRED_PLACEMENT_STATUSES,
    PASSED_SELECTION_STATUS,
    PLACEMENT_STATUS_VALUES,
    SELECTION_STATUS_VALUES,
} from "@/constants/admin/selection-placement-constant";
import { buildUpdatePayload, toFormValues } from "@/helpers/admin/admin-selection-placement-helper";
import { useUpdateAdminParticipant } from "@/hooks/admin/use-admin-selection-placements";
import {
    validateSelectionPlacementForm,
    type SelectionPlacementFormErrors,
    type SelectionPlacementFormValues,
} from "@/schemas/admin/admin-selection-placement";
import type { Participant, PlacementStatus, SelectionStatus } from "@/types/admin/selection-placement";

type FieldName = keyof SelectionPlacementFormValues;

type FieldProps = {
    id: FieldName;
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: ReactNode;
};

function Field({ id, label, required, hint, error, children }: FieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>
                {label}
                {required && (
                    <span aria-hidden className="text-destructive">
                        *
                    </span>
                )}
            </Label>
            {children}
            {error ? (
                <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            ) : hint ? (
                <p id={`${id}-hint`} className="text-sm text-muted-foreground">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}

const a11y = (id: FieldName, error?: string, hint?: string) => ({
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});

type SelectionFormProps = {
    participant: Participant;
    initialEditing: boolean;
};

export function SelectionForm({ participant, initialEditing }: SelectionFormProps) {
    const save = useUpdateAdminParticipant(participant.registrationId);

    const [editing, setEditing] = useState(initialEditing);
    const [draft, setDraft] = useState<SelectionPlacementFormValues>(() => toFormValues(participant));
    const [errors, setErrors] = useState<SelectionPlacementFormErrors>({});
    const [notice, setNotice] = useState<string | null>(null);

    const values = editing ? draft : toFormValues(participant);
    const passed = values.selectionStatus === PASSED_SELECTION_STATUS;
    const companyRequired = COMPANY_REQUIRED_PLACEMENT_STATUSES.includes(values.placementStatus);
    const dateRequired = DATE_REQUIRED_PLACEMENT_STATUSES.includes(values.placementStatus);
    const locked = !editing || save.isPending;

    function setValue<K extends FieldName>(name: K, value: SelectionPlacementFormValues[K]) {
        setDraft((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: undefined }));
    }

    function startEditing() {
        setDraft(toFormValues(participant));
        setErrors({});
        setNotice(null);
        save.reset();
        setEditing(true);
    }

    function cancelEditing() {
        setErrors({});
        save.reset();
        setEditing(false);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const nextErrors = validateSelectionPlacementForm(draft);
        if (draft.selectionStatus !== PASSED_SELECTION_STATUS && participant.placement.determined) {
            nextErrors.selectionStatus =
                "Status seleksi harus tetap Lolos selama data penyaluran kerja sudah terisi.";
        }
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        const payload = buildUpdatePayload(participant, draft);
        if (!payload.selection && !payload.placement) {
            setEditing(false);
            return;
        }

        save.mutate(payload, {
            onSuccess: () => {
                setNotice("Data seleksi dan penyaluran berhasil diperbarui.");
                setEditing(false);
            },
        });
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {notice && (
                <Alert>
                    <CircleCheck aria-hidden />
                    <AlertTitle className="pr-8">{notice}</AlertTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-2 right-2"
                        aria-label="Tutup pemberitahuan"
                        onClick={() => setNotice(null)}
                    >
                        <X aria-hidden />
                    </Button>
                </Alert>
            )}

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <ClipboardCheck className="size-5" aria-hidden />
                        </span>
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Seleksi Diklat</CardTitle>
                            <CardDescription>Keputusan hasil seleksi diklat peserta.</CardDescription>
                        </div>
                    </div>
                    {!editing && (
                        <CardAction>
                            <Button type="button" variant="outline" onClick={startEditing}>
                                <Pencil data-icon="inline-start" aria-hidden />
                                Ubah data
                            </Button>
                        </CardAction>
                    )}
                </CardHeader>

                <CardContent>
                    <fieldset disabled={locked} className="min-w-0 space-y-4 border-0 p-0">
                        <Field id="selectionStatus" label="Status seleksi" required error={errors.selectionStatus}>
                            <Select
                                value={values.selectionStatus}
                                onValueChange={(value) => setValue("selectionStatus", value as SelectionStatus)}
                            >
                                <SelectTrigger
                                    id="selectionStatus"
                                    className="h-10 w-full sm:max-w-xs"
                                    {...a11y("selectionStatus", errors.selectionStatus)}
                                >
                                    <SelectValue placeholder="Pilih status seleksi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SELECTION_STATUS_VALUES.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {statusLabel(SELECTION_STATUS, status)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field
                            id="selectionNotes"
                            label="Catatan seleksi"
                            hint="Opsional. Mis. kelengkapan dokumen atau alasan keputusan."
                            error={errors.selectionNotes}
                        >
                            <Textarea
                                id="selectionNotes"
                                rows={3}
                                value={values.selectionNotes}
                                onChange={(event) => setValue("selectionNotes", event.target.value)}
                                {...a11y("selectionNotes", errors.selectionNotes, "x")}
                            />
                        </Field>

                        {participant.selection.evaluatedAt && (
                            <p className="text-xs text-muted-foreground">
                                Terakhir dievaluasi{" "}
                                {new Intl.DateTimeFormat("id-ID", {
                                    dateStyle: "long",
                                    timeStyle: "short",
                                    timeZone: "Asia/Jakarta",
                                }).format(new Date(participant.selection.evaluatedAt))}{" "}
                                WIB.
                            </p>
                        )}
                    </fieldset>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Building2 className="size-5" aria-hidden />
                        </span>
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Penyaluran Kerja</CardTitle>
                            <CardDescription>Status wawancara, perusahaan, dan tanggal penempatan.</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {!passed && (
                        <Alert>
                            <Info aria-hidden />
                            <AlertTitle>Penyaluran belum dapat diatur</AlertTitle>
                            <AlertDescription>
                                Penyaluran kerja hanya dapat diisi setelah peserta dinyatakan Lolos seleksi diklat.
                            </AlertDescription>
                        </Alert>
                    )}

                    <fieldset disabled={locked || !passed} className="min-w-0 space-y-4 border-0 p-0">
                        <Field id="placementStatus" label="Status penyaluran" required error={errors.placementStatus}>
                            <Select
                                value={values.placementStatus}
                                onValueChange={(value) => setValue("placementStatus", value as PlacementStatus)}
                            >
                                <SelectTrigger
                                    id="placementStatus"
                                    className="h-10 w-full sm:max-w-xs"
                                    {...a11y("placementStatus", errors.placementStatus)}
                                >
                                    <SelectValue placeholder="Pilih status penyaluran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PLACEMENT_STATUS_VALUES.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {statusLabel(PLACEMENT_STATUS, status)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                id="companyName"
                                label="Nama perusahaan"
                                required={companyRequired}
                                error={errors.companyName}
                            >
                                <Input
                                    id="companyName"
                                    value={values.companyName}
                                    onChange={(event) => setValue("companyName", event.target.value)}
                                    autoComplete="off"
                                    className="h-10"
                                    {...a11y("companyName", errors.companyName)}
                                />
                            </Field>

                            <Field
                                id="placementDate"
                                label="Tanggal penempatan"
                                required={dateRequired}
                                error={errors.placementDate}
                            >
                                <Input
                                    id="placementDate"
                                    type="date"
                                    value={values.placementDate}
                                    onChange={(event) => setValue("placementDate", event.target.value)}
                                    className="h-10"
                                    {...a11y("placementDate", errors.placementDate)}
                                />
                            </Field>
                        </div>

                        <Field
                            id="placementNotes"
                            label="Catatan penyaluran"
                            hint="Opsional. Mis. bidang pekerjaan atau jadwal keberangkatan."
                            error={errors.placementNotes}
                        >
                            <Textarea
                                id="placementNotes"
                                rows={3}
                                value={values.placementNotes}
                                onChange={(event) => setValue("placementNotes", event.target.value)}
                                {...a11y("placementNotes", errors.placementNotes, "x")}
                            />
                        </Field>
                    </fieldset>

                    {save.isError && (
                        <Alert variant="destructive">
                            <CircleAlert aria-hidden />
                            <AlertTitle>Gagal menyimpan perubahan</AlertTitle>
                            <AlertDescription>{save.error.message}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>

                {editing && (
                    <CardFooter className="flex-wrap justify-between gap-3 border-t">
                        <p className="max-w-md text-xs text-muted-foreground">
                            Peserta akan menerima notifikasi saat hasil seleksi atau status penyaluran berubah.
                        </p>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={cancelEditing} disabled={save.isPending}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={save.isPending}>
                                {save.isPending && (
                                    <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                                )}
                                {save.isPending ? "Menyimpan..." : "Simpan perubahan"}
                            </Button>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </form>
    );
}
