"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFeedback } from "@/hooks/use-feedback";

const CATEGORIES = ["Bug / Error", "Masukan UI", "Saran Fitur", "Lainnya"];

export function FeedbackSheet({ onClose }: { onClose: () => void }) {
    const mutation = useCreateFeedback();
    const [category, setCategory] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!category || subject.trim().length < 3 || message.trim().length < 10) return;

        mutation.mutate(
            {
                category,
                subject: subject.trim(),
                message: message.trim(),
                pageUrl: window.location.pathname,
            },
            {
                onSuccess: () => {
                    setCategory("");
                    setSubject("");
                    setMessage("");
                },
            },
        );
    }

    return (
        <Sheet open onOpenChange={(open) => !open && !mutation.isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-md!">
                <SheetHeader className="border-b pr-12">
                    <SheetTitle>Laporkan Masalah / Masukan</SheetTitle>
                    <SheetDescription>Bantu kami memperbaiki pengalaman penggunaan FITALENTA.</SheetDescription>
                </SheetHeader>

                {mutation.isSuccess ? (
                    <>
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                            <CheckCircle2 className="size-12 text-emerald-600" aria-hidden />
                            <h3 className="text-lg font-semibold">Feedback berhasil dikirim</h3>
                            <p role="status" className="text-sm text-muted-foreground">Terima kasih atas masukan Anda.</p>
                        </div>
                        <SheetFooter className="border-t"><Button onClick={onClose}>Tutup</Button></SheetFooter>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                        <div className="flex-1 space-y-4 overflow-y-auto p-4">
                            <div className="space-y-2">
                                <Label>Kategori</Label>
                                <Select value={category} onValueChange={setCategory} disabled={mutation.isPending}>
                                    <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="feedback-subject">Subjek</Label>
                                <Input id="feedback-subject" value={subject} maxLength={200} onChange={(event) => setSubject(event.target.value)} disabled={mutation.isPending} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="feedback-message">Pesan</Label>
                                <Textarea id="feedback-message" value={message} maxLength={2000} rows={7} onChange={(event) => setMessage(event.target.value)} disabled={mutation.isPending} />
                                <p className="text-right text-xs text-muted-foreground">{message.length}/2000</p>
                            </div>
                            {(!category || subject.trim().length < 3 || message.trim().length < 10) && (subject.length > 0 || message.length > 0) && (
                                <Alert variant="destructive"><CircleAlert aria-hidden /><AlertTitle>Lengkapi data</AlertTitle><AlertDescription>Isi kategori, subjek minimal 3 karakter, dan pesan minimal 10 karakter.</AlertDescription></Alert>
                            )}
                            {mutation.isError && (
                                <Alert variant="destructive"><CircleAlert aria-hidden /><AlertTitle>Feedback gagal dikirim</AlertTitle><AlertDescription>{mutation.error.message}</AlertDescription></Alert>
                            )}
                        </div>
                        <SheetFooter className="border-t sm:flex-row sm:justify-end">
                            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>Batal</Button>
                            <Button type="submit" disabled={mutation.isPending || !category || subject.trim().length < 3 || message.trim().length < 10}>
                                {mutation.isPending && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
                                {mutation.isPending ? "Mengirim..." : "Kirim feedback"}
                            </Button>
                        </SheetFooter>
                    </form>
                )}
            </SheetContent>
        </Sheet>
    );
}
