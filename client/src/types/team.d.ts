export type Team = {
    id: number;
    name: string;
    position: string;
    bio: string | null;
    image: string | null;
};

export type TeamData = Team[];