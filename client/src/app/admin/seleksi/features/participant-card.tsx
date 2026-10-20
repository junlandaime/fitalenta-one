import { CalendarDays, Clock, GraduationCap, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/helpers/admin/admin-selection-placement-helper";
import { formatDate, imageUrl } from "@/lib/utils";
import type { Participant } from "@/types/admin/selection-placement";

function InfoRow({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2 text-sm">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="min-w-0 wrap-break-word">{children}</span>
        </div>
    );
}

export function ParticipantCard({ data }: { data: Participant }) {
    const { participant, program } = data;

    return (
        <Card>
            <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                    <Avatar className="size-16 rounded-xl after:rounded-xl">
                        <AvatarImage src={imageUrl(participant.photoPath)} alt={participant.name} className="rounded-xl" />
                        <AvatarFallback className="rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600 dark:bg-indigo-950">
                            {getInitials(participant.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-1">
                        <h3 className="truncate text-lg leading-tight font-semibold">{participant.name}</h3>
                        <span className="inline-block rounded bg-pink-50 px-1.5 py-0.5 font-mono text-[10px] text-pink-600 dark:bg-pink-950">
                            {data.registrationCode}
                        </span>
                    </div>
                </div>

                <div className="space-y-2.5 border-t pt-4">
                    <InfoRow icon={Mail}>{participant.email}</InfoRow>
                    <InfoRow icon={Phone}>{participant.phone || "-"}</InfoRow>
                    <InfoRow icon={CalendarDays}>Mendaftar {formatDate(data.registrationDate, "id-ID")}</InfoRow>
                </div>

                <div className="space-y-2.5 border-t pt-4">
                    <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Program</p>
                    <InfoRow icon={GraduationCap}>
                        <span className="font-semibold">{program.name || "-"}</span>
                        {program.programFormat && (
                            <span className="block text-xs text-muted-foreground">{program.programFormat}</span>
                        )}
                    </InfoRow>
                    {program.duration && <InfoRow icon={Clock}>{program.duration}</InfoRow>}
                </div>
            </CardContent>
        </Card>
    );
}
