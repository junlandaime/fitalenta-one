"use client";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { useDeleteAdminProgramCategory } from "@/hooks/admin/use-admin-program-categories";
import type { AdminProgramCategory } from "@/types/admin/admin-program-category";

type DeleteCategoryDialogProps = {
    category: AdminProgramCategory;
    onClose: () => void;
    onDeleted: (category: AdminProgramCategory) => void;
};

export function DeleteCategoryDialog({ category, onClose, onDeleted }: DeleteCategoryDialogProps) {
    const remove = useDeleteAdminProgramCategory();

    return (
        <ConfirmDeleteDialog
            title="Hapus kategori ini?"
            description={
                <>
                    Kategori <strong className="text-foreground">{category.name}</strong> akan dihapus permanen.
                    Tindakan ini tidak dapat dibatalkan.
                </>
            }
            pending={remove.isPending}
            errorMessage={remove.isError ? remove.error.message : undefined}
            onConfirm={() => remove.mutate(category.id, { onSuccess: () => onDeleted(category) })}
            onClose={onClose}
        />
    );
}
