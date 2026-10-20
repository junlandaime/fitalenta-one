export const MEMBERS_PER_PAGE = 10;

export const MEMBER_LIMITS = {
    name: 191,
    position: 191,
    bio: 2000,
} as const;

export const MEMBER_STATUS_OPTIONS = [
    { value: "all", label: "Semua status" },
    { value: "true", label: "Aktif" },
    { value: "false", label: "Nonaktif" },
] as const;

export const TEAM_MEMBER_SECTIONS = [
    { value: "experts", label: "Pakar" },
    { value: "members", label: "Tim" },
] as const;

export type TeamMemberSection = (typeof TEAM_MEMBER_SECTIONS)[number]["value"];

export type MemberKind = TeamMemberSection;

type MemberKindConfig = {
    noun: string;
    label: string;
    shownIn: string;
};

export const MEMBER_KINDS: Record<MemberKind, MemberKindConfig> = {
    experts: { noun: "pakar", label: "Pakar", shownIn: "section Experts di halaman Home" },
    members: { noun: "anggota tim", label: "Anggota tim", shownIn: "halaman About" },
};