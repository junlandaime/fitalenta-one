"use client";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { useDeleteAdminProgram } from "@/hooks/admin/use-admin-programs";
import type { AdminProgram } from "@/types/admin/admin-program";

type DeleteProgramDialogProps = {
    program: AdminProgram;
    onClose: () => void;
    onDeleted: (program: AdminProgram) => void;
};

export function DeleteProgramDialog({ program, onClose, onDeleted }: DeleteProgramDialogProps) {
    const remove = useDeleteAdminProgram();

    return (
        <ConfirmDeleteDialog
            title="Hapus program ini?"
            description={
                <>
                    Program <strong className="text-foreground">{program.name}</strong> akan dihapus permanen.
                    Tindakan ini tidak dapat dibatalkan.
                </>
            }
            pending={remove.isPending}
            errorMessage={remove.isError ? remove.error.message : undefined}
            onConfirm={() => remove.mutate(program.id, { onSuccess: () => onDeleted(program) })}
            onClose={onClose}
        />
    );
}
