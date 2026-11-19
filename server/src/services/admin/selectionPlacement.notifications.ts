import { NotificationType, PlacementStage, Prisma, RegistrationStatus, RelatedEntity } from "../../../generated/prisma/client";
import { PlacementState } from "../../types/selection-placement.types";

interface NotificationDraft {
  title: string;
  message: string;
  type: NotificationType;
  relatedEntity: RelatedEntity;
}

const SELECTION_TITLE = "Hasil seleksi diklat";
const PLACEMENT_TITLE = "Status penyaluran kerja";

export function buildSelectionNotification(status: RegistrationStatus): NotificationDraft | null {
  if (status === "lolos") {
    return {
      title: SELECTION_TITLE,
      message: "Selamat, Anda dinyatakan lolos seleksi diklat.",
      type: "success",
      relatedEntity: "selection",
    };
  }
  if (status === "tidak_lolos") {
    return {
      title: SELECTION_TITLE,
      message: "Mohon maaf, Anda belum dinyatakan lolos seleksi diklat.",
      type: "error",
      relatedEntity: "selection",
    };
  }
  return null;
}

export function buildPlacementNotification({ status, companyName }: PlacementState): NotificationDraft | null {
  const company = companyName ? ` di ${companyName}` : "";
  const messages: Partial<Record<PlacementStage, string>> = {
    lolos: `Selamat, Anda dinyatakan lolos wawancara penyaluran kerja${company}.`,
    ditempatkan: `Selamat, Anda telah ditempatkan${company}.`,
  };

  const message = messages[status];
  return message ? { title: PLACEMENT_TITLE, message, type: "success", relatedEntity: "placement" } : null;
}

export async function createNotification(
  tx: Prisma.TransactionClient,
  userId: number,
  registrationId: number,
  draft: NotificationDraft | null
): Promise<void> {
  if (!draft) return;

  await tx.notification.create({ data: { userId, relatedEntityId: registrationId, ...draft } });
}

export function buildInterviewNotification(status: RegistrationStatus) {
  if (status === "lolos") return { title: "Hasil interview", message: "Selamat, Anda dinyatakan lolos interview.", type: "success" as const, relatedEntity: "registration" as const };
  if (status === "tidak_lolos") return { title: "Hasil interview", message: "Mohon maaf, Anda belum dinyatakan lolos interview.", type: "error" as const, relatedEntity: "registration" as const };
  return null;
}