import type { Team } from "@/types/team";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;

export async function getPublicExperts(): Promise<Team[]> {
    try {
        const res = await fetch(`${API_URL}/team-members/experts`, {
            next: { revalidate: 300, tags: ["experts"] },
        });

        if (!res.ok) return [];

        const json = await res.json();
        return (json.data ?? json) as Team[];
    } catch (error) {
        console.error("Failed to fetch experts:", error);
        return [];
    }
}

export async function getPublicTeamMembers(): Promise<Team[]> {
    try {
        const res = await fetch(`${API_URL}/team-members`, {
            next: { revalidate: 300, tags: ["team-members"] },
        });

        if (!res.ok) return [];

        const json = await res.json();
        return (json.data ?? json) as Team[];
    } catch (error) {
        console.error("Failed to fetch team members:", error);
        return [];
    }
}