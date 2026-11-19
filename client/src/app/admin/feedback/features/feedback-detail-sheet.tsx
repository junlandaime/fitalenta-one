"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, ExternalLink, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAdminFeedback } from "@/hooks/use-feedback";
import type { FeedbackStatus, UserFeedback } from "@/types/feedback";

const STATUSES: FeedbackStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export function FeedbackDetailSheet({ feedback, onClose }: { feedback: UserFeedback; onClose: () => void }) {
    const mutation = useUpdateAdminFeedback();
    const [status, setStatus] = useState<FeedbackStatus>(feedback.status);
    const [adminNote, setAdminNote] = useState(feedback.adminNote ?? "");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        mutation.mutate(
            { id: feedback.id, payload: { status, adminNote: adminNote.trim() || null } },
            { onSuccess: onClose },
        );
    }

    return (
        <Sheet open onOpenChange={(open) => !open && !mutation.isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-xl!">
                <SheetHeader className="border-b pr-12">
                    <SheetTitle>{feedback.subject}</SheetTitle>
                    <SheetDescription>{feedback.user.name} · {feedback.user.email}</SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-5 overflow-y-auto p-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div><p className="text-xs text-muted-foreground">Kategori</p><Badge variant="outline">{feedback.category}</Badge></div>
                            <div><p className="text-xs text-muted-foreground">Status saat ini</p><Badge variant="outline">{feedback.status}</Badge></div>
                        </div>
                        <section className="space-y-2">
                            <p className="text-sm font-medium">Pesan</p>
                            <p className="rounded-lg border bg-muted/30 p-3 text-sm whitespace-pre-line">{feedback.message}</p>
                        </section>
                        {feedback.pageUrl && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Halaman</p>
                                <a href={feedback.pageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ExternalLink className="size-3.5" aria-hidden />{feedback.pageUrl}</a>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={(value) => setStatus(value as FeedbackStatus)} disabled={mutation.isPending}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{STATUSES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="feedback-admin-note">Catatan admin</Label>
                            <Textarea id="feedback-admin-note" value={adminNote} maxLength={2000} rows={5} onChange={(event) => setAdminNote(event.target.value)} disabled={mutation.isPending} />
                            <p className="text-right text-xs text-muted-foreground">{adminNote.length}/2000</p>
                        </div>
                        {mutation.isError && <Alert variant="destructive"><CircleAlert aria-hidden /><AlertTitle>Feedback gagal diperbarui</AlertTitle><AlertDescription>{mutation.error.message}</AlertDescription></Alert>}
                    </div>
                    <SheetFooter className="border-t sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>Batal</Button>
                        <Button type="submit" disabled={mutation.isPending || adminNote.length > 2000}>{mutation.isPending && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}{mutation.isPending ? "Menyimpan..." : "Simpan"}</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
