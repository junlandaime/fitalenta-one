import { z } from "zod";
import {
    COMPANY_REQUIRED_PLACEMENT_STATUSES,
    DATE_REQUIRED_PLACEMENT_STATUSES,
    PASSED_SELECTION_STATUS,
    PLACEMENT_STATUS_VALUES,
    SELECTION_STATUS_VALUES,
} from "@/constants/admin/selection-placement-constant";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const selectionPlacementSchema = z
    .object({
        selectionStatus: z.enum(SELECTION_STATUS_VALUES, { error: "Status seleksi wajib dipilih" }),
        selectionNotes: z.string().trim(),
        placementStatus: z.enum(PLACEMENT_STATUS_VALUES, { error: "Status penyaluran wajib dipilih" }),
        companyName: z.string().trim(),
        placementDate: z
            .string()
            .trim()
            .refine((value) => value === "" || (DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value))), {
                error: "Tanggal penempatan tidak valid",
            }),
        placementNotes: z.string().trim(),
    })
    .superRefine((values, ctx) => {
        if (values.selectionStatus !== PASSED_SELECTION_STATUS) return;

        if (COMPANY_REQUIRED_PLACEMENT_STATUSES.includes(values.placementStatus) && !values.companyName) {
            ctx.addIssue({
                code: "custom",
                path: ["companyName"],
                message: "Nama perusahaan wajib diisi untuk status ini",
            });
        }
        if (DATE_REQUIRED_PLACEMENT_STATUSES.includes(values.placementStatus) && !values.placementDate) {
            ctx.addIssue({
                code: "custom",
                path: ["placementDate"],
                message: "Tanggal penempatan wajib diisi untuk status ini",
            });
        }
    });

export type SelectionPlacementFormValues = z.input<typeof selectionPlacementSchema>;

export type SelectionPlacementFormErrors = Partial<Record<keyof SelectionPlacementFormValues, string>>;

export function validateSelectionPlacementForm(values: SelectionPlacementFormValues): SelectionPlacementFormErrors {
    const result = selectionPlacementSchema.safeParse(values);
    if (result.success) return {};

    const errors: SelectionPlacementFormErrors = {};
    for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof SelectionPlacementFormValues;
        errors[key] ??= issue.message;
    }
    return errors;
}
