"use client";

import { useState } from "react";
import { Check, Copy, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentAccount } from "@/types/user/user-payment";

function CopyButton({ value, label }: { value: string; label: string }) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={copy} aria-label={label}>
            {copied ? <Check data-icon="inline-start" aria-hidden /> : <Copy data-icon="inline-start" aria-hidden />}
            {copied ? "Tersalin" : "Salin"}
        </Button>
    );
}

export function AccountCard({ account }: { account: PaymentAccount }) {
    return (
        <div className="space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Landmark className="size-4 text-indigo-600" aria-hidden />
                Rekening tujuan transfer
            </div>

            <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Bank</dt>
                    <dd className="font-semibold">{account.bankName}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Nomor rekening</dt>
                    <dd className="flex items-center gap-2">
                        <span className="font-mono font-semibold tracking-wide">{account.accountNumber}</span>
                        <CopyButton value={account.accountNumber} label="Salin nomor rekening" />
                    </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Atas nama</dt>
                    <dd className="text-right font-semibold">{account.accountHolder}</dd>
                </div>
            </dl>
        </div>
    );
}
