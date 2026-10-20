import Link from "next/link";
import { ArrowRight, Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ShortcutCardProps = {
    title: string;
    description: string;
    href: string;
    createHref: string | null;
    icon: LucideIcon;
};

export function ShortcutCard({ title, description, href, createHref, icon: Icon }: ShortcutCardProps) {
    return (
        <Card className="border border-border shadow-none">
            <CardContent className="flex h-full flex-col gap-4">
                <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="space-y-1">
                        <h3 className="font-medium">{title}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={href}>
                            Kelola
                            <ArrowRight data-icon="inline-end" aria-hidden />
                        </Link>
                    </Button>
                    {createHref && (
                        <Button asChild size="sm">
                            <Link href={createHref}>
                                <Plus data-icon="inline-start" aria-hidden />
                                Tambah baru
                            </Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
