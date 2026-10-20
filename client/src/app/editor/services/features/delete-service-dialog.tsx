"use client";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { useDeleteEditorService } from "@/hooks/editor/use-editor-services";
import type { EditorService } from "@/types/editor/editor-service";

type DeleteServiceDialogProps = {
    service: EditorService;
    onClose: () => void;
    onDeleted: (service: EditorService) => void;
};

export function DeleteServiceDialog({ service, onClose, onDeleted }: DeleteServiceDialogProps) {
    const remove = useDeleteEditorService();

    return (
        <ConfirmDeleteDialog
            title="Hapus layanan ini?"
            description={
                <>
                    Layanan <strong className="text-foreground">{service.title}</strong> beserta seluruh kontennya
                    akan dihapus permanen dan hilang dari website. Tindakan ini tidak dapat dibatalkan.
                </>
            }
            pending={remove.isPending}
            errorMessage={remove.isError ? remove.error.message : undefined}
            onConfirm={() => remove.mutate(service.id, { onSuccess: () => onDeleted(service) })}
            onClose={onClose}
        />
    );
}
