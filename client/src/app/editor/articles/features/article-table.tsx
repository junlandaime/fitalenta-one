import Link from "next/link";
import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react";
import { ContentThumbnail } from "@/components/editor/content-thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ARTICLE_STATUS_META } from "@/constants/editor/editor-article-constant";
import { formatShortDate, formatShortTime } from "@/helpers/admin/admin-helper";
import { excerptPreview, getArticleStatus } from "@/helpers/editor/editor-content-helper";
import { cn } from "@/lib/utils";
import type { EditorArticle } from "@/types/editor/editor-article";

const COLUMNS = ["Artikel", "Kategori", "Penulis", "Tanggal terbit", "Status", "Dilihat", "Aksi"];

const EDGE = "first:pl-(--card-spacing) last:pr-(--card-spacing)";

type ArticleTableProps = {
    articles?: EditorArticle[];
    stale?: boolean;
    onDelete: (article: EditorArticle) => void;
};

function LoadingRows() {
    return Array.from({ length: 5 }, (_, row) => (
        <TableRow key={row}>
            {COLUMNS.map((column) => (
                <TableCell key={column} className={EDGE}>
                    <Skeleton className="h-5 w-full max-w-28" />
                </TableCell>
            ))}
        </TableRow>
    ));
}

export function ArticleTable({ articles, stale, onDelete }: ArticleTableProps) {
    return (
        <Table className={cn("transition-opacity", stale && "opacity-60")}>
            <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                    {COLUMNS.map((column) => (
                        <TableHead
                            key={column}
                            className={cn(EDGE, "h-10 text-xs tracking-wide uppercase", column === "Aksi" && "text-right")}
                        >
                            {column}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {!articles ? (
                    <LoadingRows />
                ) : articles.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={COLUMNS.length} className="h-32 text-center text-muted-foreground">
                            Belum ada artikel. Klik &quot;Tambah artikel&quot; untuk membuat yang pertama.
                        </TableCell>
                    </TableRow>
                ) : (
                    articles.map((article) => {
                        const status = getArticleStatus(article);
                        const meta = ARTICLE_STATUS_META[status];

                        return (
                            <TableRow key={article.id}>
                                <TableCell className={cn(EDGE, "min-w-64 py-3 whitespace-normal")}>
                                    <div className="flex items-center gap-3">
                                        <ContentThumbnail image={article.image} alt={article.title} />
                                        <div className="min-w-0">
                                            <div className="line-clamp-2 font-medium">{article.title}</div>
                                            <div className="line-clamp-1 text-xs text-muted-foreground">
                                                {excerptPreview(article.excerpt)}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    {article.category ? (
                                        <Badge variant="outline">{article.category.name}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className={cn(EDGE, "whitespace-nowrap text-muted-foreground")}>
                                    {article.author?.name ?? "-"}
                                </TableCell>
                                <TableCell className={cn(EDGE, "whitespace-nowrap")}>
                                    {article.eventDate ? (
                                        <>
                                            <div className="font-medium">{formatShortDate(article.eventDate)}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatShortTime(article.eventDate)} WIB
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-muted-foreground">Belum dijadwalkan</span>
                                    )}
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <div className="flex flex-col items-start gap-1">
                                        <Badge variant={meta.variant}>{meta.label}</Badge>
                                        {article.isFeatured && (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Star className="size-3" aria-hidden />
                                                Artikel pilihan
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className={cn(EDGE, "tabular-nums")}>
                                    {article.views.toLocaleString("id-ID")}
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <div className="flex justify-end gap-1.5">
                                        {status === "published" && (
                                            <Button asChild variant="outline" size="icon-sm">
                                                <Link
                                                    href={`/articles/${article.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`Lihat ${article.title} di website`}
                                                >
                                                    <ExternalLink aria-hidden />
                                                </Link>
                                            </Button>
                                        )}
                                        <Button asChild variant="outline" size="icon-sm">
                                            <Link href={`/editor/articles/${article.id}`} aria-label={`Edit ${article.title}`}>
                                                <Pencil aria-hidden />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            aria-label={`Hapus ${article.title}`}
                                            onClick={() => onDelete(article)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 aria-hidden />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    );
}
