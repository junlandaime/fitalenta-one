import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type FormCardProps = {
    title: string;
    description: string;
    children: ReactNode;
};

export function FormCard({ title, description, children }: FormCardProps) {
    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
}
