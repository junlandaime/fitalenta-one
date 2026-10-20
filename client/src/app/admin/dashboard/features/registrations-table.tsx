import Link from "next/link";
import { Eye, FileText, Mail, Pencil, Phone, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INTERVIEW_STATUS, PAYMENT_STATUS, PLACEMENT_STATUS, SELECTION_STATUS } from "@/constants/admin/admin-status";
import { formatIDR } from "@/lib/utils";
import type { AdminRegistrationListItem, PaginationMeta } from "@/types/admin/admin-dashboard";
import { StatusBadge, ToneBadge } from "./status-badge";
import { EmptyRow } from "./table-card";
import { ParticipantAvatar } from "../../../../components/admin/participant-avatar";

const detailHref = (id: number) => `/admin/seleksi/${id}`;
const editHref = (id: number) => `/admin/seleksi/${id}?mode=edit`;

const dateFmt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
});
const timeFmt = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
});

function formatDateTime(value: string) {
    const date = new Date(value);
    return `${dateFmt.format(date)} pukul ${timeFmt.format(date)}`;
}

function ParticipantCell({ participant }: { participant: AdminRegistrationListItem["participant"] }) {
    return (
        <div className="flex items-center gap-3">
            <ParticipantAvatar
                key={`${participant.name}-${participant.photoPath ?? ""}`}
                name={participant.name}
                photoPath={participant.photoPath}
            />
            <div className="min-w-0 space-y-0.5">
                <div className="truncate text-sm font-semibold">{participant.name}</div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Mail className="size-3 shrink-0" aria-hidden />
                    <span className="truncate">{participant.email}</span>
                </div>
                {participant.phone && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Phone className="size-3 shrink-0" aria-hidden />
                        {participant.phone}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProgramCell({ row }: { row: AdminRegistrationListItem }) {
    return (
        <div className="space-y-0.5">
            <div className="text-sm font-semibold">{row.program.name}</div>
            <div className="text-[11px] text-muted-foreground tabular-nums">
                {formatIDR(Number(row.program.trainingCost))}
            </div>
            <span className="inline-block rounded bg-pink-50 px-1.5 py-0.5 font-mono text-[10px] text-pink-600 dark:bg-pink-950">
                {row.registrationCode}
            </span>
        </div>
    );
}

function PaymentCell({ payment }: { payment: AdminRegistrationListItem["payment"] }) {
    if (!payment) return <span className="text-xs text-muted-foreground">Belum ada tagihan</span>;

    const paid = Number(payment.amountPaid);
    const isInstallment = payment.status.startsWith("installment_");
    const label =
        isInstallment && payment.installment
            ? `Cicilan ${payment.installment.current}/${payment.installment.total}`
            : undefined;

    return (
        <div className="space-y-1">
            <StatusBadge map={PAYMENT_STATUS} value={payment.status} label={label} />
            {paid > 0 && payment.status !== "cancelled" && (
                <div className="text-[11px] text-muted-foreground">
                    Terbayar <span className="font-semibold text-foreground tabular-nums">{formatIDR(paid)}</span>
                </div>
            )}
        </div>
    );
}

function ProgressRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3 text-[11px]">
            <span className="text-muted-foreground">{label}</span>
            {children}
        </div>
    );
}

function ProgressCell({ progress }: { progress: AdminRegistrationListItem["progress"] }) {
    return (
        <div className="min-w-48 space-y-1">
            <ProgressRow label="Interview">
                <StatusBadge map={INTERVIEW_STATUS} value={progress.interview} />
            </ProgressRow>
            <ProgressRow label="Seleksi">
                {progress.selection ? (
                    <StatusBadge map={SELECTION_STATUS} value={progress.selection} />
                ) : (
                    <span className="text-muted-foreground">-</span>
                )}
            </ProgressRow>
            <ProgressRow label="Penyaluran">
                {progress.placement ? (
                    <StatusBadge map={PLACEMENT_STATUS} value={progress.placement} />
                ) : (
                    <span className="text-muted-foreground">-</span>
                )}
            </ProgressRow>
        </div>
    );
}

function DocumentsCell({ documents }: { documents: AdminRegistrationListItem["documents"] }) {
    if (!documents.n4CertificatePath && !documents.sswCertificatePath) {
        return <span className="text-muted-foreground">-</span>;
    }
    return (
        <div className="flex gap-1.5">
            {documents.n4CertificatePath && (
                <ToneBadge tone="danger">
                    <FileText className="hidden" aria-hidden />N4
                </ToneBadge>
            )}
            {documents.sswCertificatePath && (
                <ToneBadge tone="danger">
                    <FileText className="hidden" aria-hidden />SSW
                </ToneBadge>
            )}
        </div>
    );
}

type Props = {
    rows: AdminRegistrationListItem[];
    meta: PaginationMeta;
    isFetching: boolean;
    onRefresh: () => void;
    onPageChange: (page: number) => void;
};

export function RegistrationsTable({ rows, meta, isFetching, onRefresh, onPageChange }: Props) {
    return (
        <Card className="gap-0 p-0 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Users className="size-4" aria-hidden />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">Database Peserta</p>
                        <h3 className="text-lg leading-tight font-bold">Data Pendaftar</h3>
                        <p className="text-xs text-muted-foreground">
                            Menampilkan {meta.total} data berdasarkan filter saat ini.
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={onRefresh} disabled={isFetching}>
                    <RefreshCw className={isFetching ? "animate-spin" : undefined} data-icon="inline-start" aria-hidden />
                    Refresh
                </Button>
            </div>

            <div className="overflow-x-auto border-t">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 text-[10px] tracking-wider uppercase">
                            <TableHead className="pl-5">Peserta</TableHead>
                            <TableHead>Program</TableHead>
                            <TableHead>Tanggal Daftar</TableHead>
                            <TableHead>Pembayaran</TableHead>
                            <TableHead>Perkembangan Peserta</TableHead>
                            <TableHead>Dokumen</TableHead>
                            <TableHead className="pr-5 text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length === 0 ? (
                            <EmptyRow colSpan={7}>Tidak ada pendaftar yang sesuai filter.</EmptyRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="pl-5">
                                        <ParticipantCell participant={row.participant} />
                                    </TableCell>
                                    <TableCell>
                                        <ProgramCell row={row} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs font-semibold whitespace-nowrap">
                                            {formatDateTime(row.registrationDate)}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">Tanggal pendaftaran</div>
                                    </TableCell>
                                    <TableCell>
                                        <PaymentCell payment={row.payment} />
                                    </TableCell>
                                    <TableCell>
                                        <ProgressCell progress={row.progress} />
                                    </TableCell>
                                    <TableCell>
                                        <DocumentsCell documents={row.documents} />
                                    </TableCell>
                                    <TableCell className="pr-5">
                                        <div className="flex justify-end gap-1.5">
                                            <Button asChild variant="outline" size="icon" className="size-8">
                                                <Link href={detailHref(row.id)} aria-label={`Lihat ${row.participant.name}`}>
                                                    <Eye aria-hidden />
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" size="icon" className="size-8">
                                                <Link href={editHref(row.id)} aria-label={`Ubah ${row.participant.name}`}>
                                                    <Pencil aria-hidden />
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/30 px-5 py-3 text-sm">
                <span className="font-medium">{rows.length} pendaftar ditampilkan</span>
                {meta.totalPages > 1 ? (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.page <= 1 || isFetching}
                            onClick={() => onPageChange(meta.page - 1)}
                        >
                            Sebelumnya
                        </Button>
                        <span className="text-xs text-muted-foreground tabular-nums">
                            {meta.page} / {meta.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.page >= meta.totalPages || isFetching}
                            onClick={() => onPageChange(meta.page + 1)}
                        >
                            Berikutnya
                        </Button>
                    </div>
                ) : (
                    <span className="text-[10px] text-muted-foreground">
                        Data diperbarui berdasarkan filter dan pencarian yang aktif.
                    </span>
                )}
            </div>
        </Card>
    );
}