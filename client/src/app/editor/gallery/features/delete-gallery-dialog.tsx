"use client";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { useDeleteEditorGalleryItem } from "@/hooks/editor/use-editor-gallery";
import type { EditorGalleryItem } from "@/types/editor/editor-gallery";

type DeleteGalleryDialogProps = {
    item: EditorGalleryItem;
    onClose: () => void;
    onDeleted: (item: EditorGalleryItem) => void;
};

export function DeleteGalleryDialog({ item, onClose, onDeleted }: DeleteGalleryDialogProps) {
    const remove = useDeleteEditorGalleryItem();

    return (
        <ConfirmDeleteDialog
            title="Hapus gambar ini?"
            description={
                <>
                    Gambar <strong className="text-foreground">{item.title}</strong> akan dihapus permanen dari galeri
                    dan server. Tindakan ini tidak dapat dibatalkan.
                </>
            }
            pending={remove.isPending}
            errorMessage={remove.isError ? remove.error.message : undefined}
            onConfirm={() => remove.mutate(item.id, { onSuccess: () => onDeleted(item) })}
            onClose={onClose}
        />
    );
}
