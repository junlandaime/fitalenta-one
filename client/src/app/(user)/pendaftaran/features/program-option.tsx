"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { getProgramFacts } from "@/helpers/user/registration-helper";
import { isFull, quotaLabel } from "@/helpers/program-helper";
import { cn } from "@/lib/utils";
import type { Program } from "@/types/program";

export function ProgramOption({ program }: { program: Program }) {
    const full = isFull(program);
    const id = `program-${program.id}`;
    const facts = [{ label: "Kuota", value: quotaLabel(program) }, ...getProgramFacts(program)];

    return (
        <Label
            htmlFor={id}
            className={cn(
                "items-stretch gap-4 rounded-xl border bg-card p-4 text-sm leading-normal font-normal transition-colors",
                "flex-col has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5",
                "has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                full ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-muted/40",
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                    <p className="text-base leading-snug font-semibold">{program.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                        {program.programFormat && <Badge variant="secondary">{program.programFormat}</Badge>}
                        {full && <Badge variant="destructive">Kuota penuh</Badge>}
                    </div>
                </div>
                <RadioGroupItem id={id} value={String(program.id)} disabled={full} />
            </div>

            {program.description && (
                <p className="line-clamp-2 text-muted-foreground">{program.description}</p>
            )}

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4">
                {facts.map((fact) => (
                    <div key={fact.label} className="min-w-0">
                        <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                        <dd className="font-medium wrap-break-word">{fact.value}</dd>
                    </div>
                ))}
            </dl>
        </Label>
    );
}
