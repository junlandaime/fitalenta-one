"use client";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { MEMBER_KINDS, type MemberKind } from "@/constants/editor/editor-team-member-constant";
import { useDeleteEditorMember } from "@/hooks/editor/use-editor-team-members";
import type { EditorMember } from "@/types/editor/editor-team-member";

type DeleteMemberDialogProps = {
    kind: MemberKind;
    item: EditorMember;
    onClose: () => void;
    onDeleted: (item: EditorMember) => void;
};

export function DeleteMemberDialog({ kind, item, onClose, onDeleted }: DeleteMemberDialogProps) {
    const remove = useDeleteEditorMember(kind);

    return (
        <ConfirmDeleteDialog
            title={`Hapus ${MEMBER_KINDS[kind].noun} ini?`}
            description={
                <>
                    <strong className="text-foreground">{item.name}</strong> beserta fotonya akan dihapus permanen dan
                    hilang dari website. Untuk menyembunyikan sementara, ubah statusnya menjadi nonaktif. Tindakan ini
                    tidak dapat dibatalkan.
                </>
            }
            pending={remove.isPending}
            errorMessage={remove.isError ? remove.error.message : undefined}
            onConfirm={() => remove.mutate(item.id, { onSuccess: () => onDeleted(item) })}
            onClose={onClose}
        />
    );
}
