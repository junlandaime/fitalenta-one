"use client";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { useDeleteEditorBanner } from "@/hooks/editor/use-editor-banners";
import type { EditorBanner } from "@/types/editor/editor-banner";

type DeleteBannerDialogProps = {
    item: EditorBanner;
    onClose: () => void;
    onDeleted: (item: EditorBanner) => void;
};

export function DeleteBannerDialog({ item, onClose, onDeleted }: DeleteBannerDialogProps) {
    const remove = useDeleteEditorBanner();

    return (
        <ConfirmDeleteDialog
            title="Hapus banner ini?"
            description={
                <>
                    <strong className="text-foreground">{item.title}</strong> beserta gambarnya akan dihapus permanen dan
                    hilang dari website. Untuk menyembunyikan sementara, nonaktifkan banner atau atur jadwal tayangnya.
                    Tindakan ini tidak dapat dibatalkan.
                </>
            }
            pending={remove.isPending}
            errorMessage={remove.isError ? remove.error.message : undefined}
            onConfirm={() => remove.mutate(item.id, { onSuccess: () => onDeleted(item) })}
            onClose={onClose}
        />
    );
}