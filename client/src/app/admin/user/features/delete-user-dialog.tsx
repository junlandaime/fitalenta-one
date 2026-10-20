"use client";

import { CircleAlert, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteAdminUser } from "@/hooks/admin/use-admin-users";
import type { AdminUser } from "@/types/admin/admin-user";

type DeleteUserDialogProps = {
    user: AdminUser;
    onClose: () => void;
    onDeleted: (user: AdminUser) => void;
};

export function DeleteUserDialog({ user, onClose, onDeleted }: DeleteUserDialogProps) {
    const remove = useDeleteAdminUser();

    return (
        <AlertDialog open onOpenChange={(open) => !open && !remove.isPending && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus user ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Akun <strong className="text-foreground">{user.name}</strong> ({user.email}) akan dihapus
                        permanen. Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {remove.isError && (
                    <Alert variant="destructive">
                        <CircleAlert aria-hidden />
                        <AlertDescription>{remove.error.message}</AlertDescription>
                    </Alert>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={remove.isPending}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={remove.isPending}
                        onClick={(event) => {
                            event.preventDefault();
                            remove.mutate(user.id, { onSuccess: () => onDeleted(user) });
                        }}
                    >
                        {remove.isPending && <Loader2 className="animate-spin" aria-hidden />}
                        {remove.isPending ? "Menghapus..." : "Hapus"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
