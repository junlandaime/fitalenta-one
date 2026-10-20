"use client";

import { Button } from "@/components/ui/button";
import { TEAM_MEMBER_SECTIONS, type TeamMemberSection } from "@/constants/editor/editor-team-member-constant";

type SectionTabsProps = {
    value: TeamMemberSection;
    onChange: (value: TeamMemberSection) => void;
};

export function SectionTabs({ value, onChange }: SectionTabsProps) {
    return (
        <div role="tablist" aria-label="Bagian konten tim" className="flex w-fit gap-1 rounded-lg border bg-muted/40 p-1">
            {TEAM_MEMBER_SECTIONS.map((section) => (
                <Button
                    key={section.value}
                    role="tab"
                    id={`team-tab-${section.value}`}
                    aria-selected={value === section.value}
                    aria-controls={`team-panel-${section.value}`}
                    variant={value === section.value ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onChange(section.value)}
                >
                    {section.label}
                </Button>
            ))}
        </div>
    );
}
