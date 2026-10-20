import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";

type TableCardProps = {
    title: string;
    description: string;
    href?: string;
    children: ReactNode;
};

export function TableCard({ title, description, href, children }: TableCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                {href && (
                    <CardAction>
                        <Button asChild variant="ghost" size="sm">
                            <Link href={href}>
                                Lihat semua
                                <ArrowRight data-icon="inline-end" aria-hidden />
                            </Link>
                        </Button>
                    </CardAction>
                )}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="h-24 text-center text-muted-foreground">
                {children}
            </TableCell>
        </TableRow>
    );
}
