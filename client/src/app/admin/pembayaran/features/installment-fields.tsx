import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MAX_INSTALLMENTS, MIN_INSTALLMENTS } from "@/constants/admin/admin-payment-constant";
import { sumAmounts } from "@/helpers/admin/admin-payment-helper";
import { cn, formatIDR } from "@/lib/utils";

const COUNT_OPTIONS = Array.from({ length: MAX_INSTALLMENTS - MIN_INSTALLMENTS + 1 }, (_, i) => MIN_INSTALLMENTS + i);

type Props = {
    amounts: string[];
    total: string;
    error?: string;
    onCountChange: (count: number) => void;
    onAmountChange: (index: number, value: string) => void;
    onSplitEvenly: () => void;
};

export function InstallmentFields({ amounts, total, error, onCountChange, onAmountChange, onSplitEvenly }: Props) {
    const sum = sumAmounts(amounts);
    const balanced = Number(total) > 0 && sum === Number(total);

    return (
        <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
            <div className="flex items-end justify-between gap-3">
                <div className="space-y-1.5">
                    <p className="text-xs font-medium">Jumlah cicilan</p>
                    <Select value={String(amounts.length)} onValueChange={(value) => onCountChange(Number(value))}>
                        <SelectTrigger className="h-9 w-32" aria-label="Jumlah cicilan">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {COUNT_OPTIONS.map((count) => (
                                <SelectItem key={count} value={String(count)}>
                                    {count}x cicilan
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={onSplitEvenly}>
                    Bagi rata
                </Button>
            </div>

            <div className="space-y-2">
                {amounts.map((amount, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <label htmlFor={`installment-${index}`} className="w-20 shrink-0 text-xs text-muted-foreground">
                            Cicilan ke-{index + 1}
                        </label>
                        <div className="relative flex-1">
                            <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                                Rp
                            </span>
                            <Input
                                id={`installment-${index}`}
                                inputMode="numeric"
                                value={amount}
                                onChange={(event) => onAmountChange(index, event.target.value)}
                                autoComplete="off"
                                className="h-9 pl-8 tabular-nums"
                                aria-invalid={Boolean(error)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between border-t pt-3 text-xs">
                <span className="text-muted-foreground">Total cicilan</span>
                <span
                    className={cn(
                        "font-semibold tabular-nums",
                        balanced ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
                    )}
                >
                    {formatIDR(sum)} / {Number(total) > 0 ? formatIDR(total) : "-"}
                </span>
            </div>

            {error && (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}
