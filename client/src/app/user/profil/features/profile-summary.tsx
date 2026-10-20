"use client";

import { useState } from "react";
import { CalendarDays, KeyRound, Mail } from "lucide-react";
import { ChangePasswordSheet } from "@/components/common/change-password-sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROLE_META } from "@/constants/admin/admin-user-constant";
import { getInitials } from "@/helpers/admin/admin-helper";
import { normalizeRole } from "@/lib/auth-role";
import { formatDate } from "@/lib/utils";
import type { MyProfile } from "@/types/user/user-profile";

export function ProfileSummary({ profile }: { profile: MyProfile }) {
    const [passwordOpen, setPasswordOpen] = useState(false);
    const role = ROLE_META[normalizeRole(profile.role)];

    return (
        <Card className="h-fit items-center gap-0 rounded-3xl p-6 text-center shadow-xs">
            <Avatar className="size-24">
                <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
                    {getInitials(profile.name)}
                </AvatarFallback>
            </Avatar>

            <h2 className="mt-4 text-xl font-bold wrap-break-word text-primary">{profile.name}</h2>
            <Badge className={`${role.className} mt-2`}>
                {role.label}
            </Badge>

            <ul className="mt-6 w-full space-y-3 border-t pt-6 text-left text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span className="min-w-0 break-all">{profile.email}</span>
                </li>
                <li className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>Bergabung sejak {formatDate(profile.createdAt, "id-ID")}</span>
                </li>
            </ul>

            <Button variant="outline" size="lg" className="mt-6 w-full" onClick={() => setPasswordOpen(true)}>
                <KeyRound data-icon="inline-start" aria-hidden />
                Ubah password
            </Button>

            {passwordOpen && <ChangePasswordSheet onClose={() => setPasswordOpen(false)} />}
        </Card>
    );
}
