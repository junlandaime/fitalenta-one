import type { PlacementStatus, SelectionStatus } from "@/types/admin/selection-placement";

export const PARTICIPANTS_PER_PAGE = 20;

export const SELECTION_STATUS_VALUES = ["menunggu", "lolos", "tidak_lolos"] as const satisfies readonly SelectionStatus[];

export const PLACEMENT_STATUS_VALUES = ["proses", "lolos", "ditempatkan"] as const satisfies readonly PlacementStatus[];

export const DEFAULT_SELECTION_STATUS: SelectionStatus = "menunggu";
export const DEFAULT_PLACEMENT_STATUS: PlacementStatus = "proses";
export const PASSED_SELECTION_STATUS: SelectionStatus = "lolos";

export const COMPANY_REQUIRED_PLACEMENT_STATUSES: readonly PlacementStatus[] = ["lolos", "ditempatkan"];
export const DATE_REQUIRED_PLACEMENT_STATUSES: readonly PlacementStatus[] = ["ditempatkan"];
