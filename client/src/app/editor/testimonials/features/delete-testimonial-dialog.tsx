"use client";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { useDeleteEditorTestimonial } from "@/hooks/editor/use-editor-testimonials";
import type { EditorTestimonial } from "@/types/editor/editor-testimonial";

type DeleteTestimonialDialogProps = {
    item: EditorTestimonial;
    onClose: () => void;
    onDeleted: (item: EditorTestimonial) => void;
};

export function DeleteTestimonialDialog({ item, onClose, onDeleted }: DeleteTestimonialDialogProps) {
    const remove = useDeleteEditorTestimonial();

    return (
        <ConfirmDeleteDialog
            title="Hapus testimoni ini?"
            description={
                <>
                    Testimoni dari <strong className="text-foreground">{item.clientName}</strong> ({item.company})
                    beserta fotonya akan dihapus permanen dan hilang dari website. Tindakan ini tidak dapat
                    dibatalkan.
                </>
            }
            pending={remove.isPending}
            errorMessage={remove.isError ? remove.error.message : undefined}
            onConfirm={() => remove.mutate(item.id, { onSuccess: () => onDeleted(item) })}
            onClose={onClose}
        />
    );
}
