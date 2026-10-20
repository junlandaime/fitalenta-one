"use client";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { useDeleteEditorEvent } from "@/hooks/editor/use-editor-events";
import type { EditorEvent } from "@/types/editor/editor-event";

type DeleteEventDialogProps = {
    event: EditorEvent;
    onClose: () => void;
    onDeleted: (event: EditorEvent) => void;
};

export function DeleteEventDialog({ event, onClose, onDeleted }: DeleteEventDialogProps) {
    const remove = useDeleteEditorEvent();

    return (
        <ConfirmDeleteDialog
            title="Hapus event ini?"
            description={
                <>
                    Event <strong className="text-foreground">{event.title}</strong> beserta gambarnya akan dihapus
                    permanen dan hilang dari website. Tindakan ini tidak dapat dibatalkan.
                </>
            }
            pending={remove.isPending}
            errorMessage={remove.isError ? remove.error.message : undefined}
            onConfirm={() => remove.mutate(event.id, { onSuccess: () => onDeleted(event) })}
            onClose={onClose}
        />
    );
}
