import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminPageMeta } from "@/types/admin/admin-user";

type TablePaginationProps = {
    meta: AdminPageMeta;
    disabled?: boolean;
    onPageChange: (page: number) => void;
};

export function TablePagination({ meta, disabled, onPageChange }: TablePaginationProps) {
    const { page, limit, total, totalPages } = meta;
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
                {totalPages <= 1 ? `${total} user ditampilkan` : `Menampilkan ${from}–${to} dari ${total} user`}
            </p>

            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={disabled || page <= 1}
                        onClick={() => onPageChange(page - 1)}
                    >
                        <ChevronLeft data-icon="inline-start" aria-hidden />
                        Sebelumnya
                    </Button>
                    <span className="hidden text-sm text-muted-foreground sm:inline">
                        Halaman {page} dari {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={disabled || page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Berikutnya
                        <ChevronRight data-icon="inline-end" aria-hidden />
                    </Button>
                </div>
            )}
        </div>
    );
}
