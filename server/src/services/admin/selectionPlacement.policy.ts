import {
  COMPANY_REQUIRED_PLACEMENT_STATUSES,
  DATE_REQUIRED_PLACEMENT_STATUSES,
  PASSED_SELECTION_STATUS,
} from "../../config/selection.config";
import { RegistrationStatus } from "../../../generated/prisma/client";
import { FieldIssue, SelectionPlacementErrors } from "../../errors/selectionPlacement.errors";
import { PlacementState } from "../../types/selection-placement.types";

export function isPlacementDetermined(placement: PlacementState | null): boolean {
  if (!placement) return false;

  return (
    placement.status !== "proses" ||
    placement.companyName !== null ||
    placement.placementDate !== null ||
    placement.notes !== null
  );
}

function collectPlacementIssues({ status, companyName, placementDate }: PlacementState): FieldIssue[] {
  const issues: FieldIssue[] = [];

  if (COMPANY_REQUIRED_PLACEMENT_STATUSES.includes(status) && !companyName) {
    issues.push({ field: "placement.companyName", message: "Nama perusahaan wajib diisi untuk status ini" });
  }
  if (DATE_REQUIRED_PLACEMENT_STATUSES.includes(status) && !placementDate) {
    issues.push({ field: "placement.placementDate", message: "Tanggal penempatan wajib diisi untuk status ini" });
  }

  return issues;
}

export function assertPlacementAllowed(selection: RegistrationStatus, placement: PlacementState): void {
  if (selection !== PASSED_SELECTION_STATUS) return;

  const issues = collectPlacementIssues(placement);
  if (issues.length > 0) throw SelectionPlacementErrors.invalidPlacement(issues);
}