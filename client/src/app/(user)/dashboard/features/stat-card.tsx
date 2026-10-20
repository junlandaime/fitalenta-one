import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
    icon: LucideIcon;
    title: string;
    value?: string | null;
};

export function StatCard({ icon: Icon, title, value }: Props) {
    return (
        <Card className="relative gap-0 overflow-hidden border-0 bg-linear-to-br from-[#4a64a1] to-[#334d82] py-0 text-white shadow-lg shadow-[#334d82]/20">
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
            <div aria-hidden className="pointer-events-none absolute -bottom-16 right-8 h-32 w-48 rounded-t-full bg-white/10" />

            <CardContent className="relative flex items-start gap-5 p-6 pb-10">
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
                    <Icon className="size-6" aria-hidden />
                </span>
                <div className="min-w-0">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="mt-2 truncate text-sm text-white/80">{value || "-"}</p>
                </div>
            </CardContent>
        </Card>
    );
}