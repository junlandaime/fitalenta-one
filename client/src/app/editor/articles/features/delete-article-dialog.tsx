"use client";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { useDeleteEditorArticle } from "@/hooks/editor/use-editor-articles";
import type { EditorArticle } from "@/types/editor/editor-article";

type DeleteArticleDialogProps = {
    article: EditorArticle;
    onClose: () => void;
    onDeleted: (article: EditorArticle) => void;
};

export function DeleteArticleDialog({ article, onClose, onDeleted }: DeleteArticleDialogProps) {
    const remove = useDeleteEditorArticle();

    return (
        <ConfirmDeleteDialog
            title="Hapus artikel ini?"
            description={
                <>
                    Artikel <strong className="text-foreground">{article.title}</strong> beserta gambarnya akan dihapus
                    permanen dan hilang dari website. Tindakan ini tidak dapat dibatalkan.
                </>
            }
            pending={remove.isPending}
            errorMessage={remove.isError ? remove.error.message : undefined}
            onConfirm={() => remove.mutate(article.id, { onSuccess: () => onDeleted(article) })}
            onClose={onClose}
        />
    );
}
