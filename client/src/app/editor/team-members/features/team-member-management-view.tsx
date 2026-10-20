"use client";

import { useState } from "react";
import type { TeamMemberSection } from "@/constants/editor/editor-team-member-constant";
import { MemberSection } from "./member-section";
import { SectionTabs } from "./section-tabs";

export function TeamMemberManagementView() {
    const [section, setSection] = useState<TeamMemberSection>("experts");

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">Manajemen Tim</h2>
                <p className="max-w-2xl text-sm text-muted-foreground">
                    Kelola pakar yang tampil di halaman Home dan anggota tim yang tampil di halaman About website FITALENTA.
                </p>
            </div>

            <SectionTabs value={section} onChange={setSection} />

            <MemberSection key={section} kind={section} />
        </div>
    );
}
