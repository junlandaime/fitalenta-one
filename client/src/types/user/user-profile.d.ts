export type MyProfile = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    birthPlace: string | null;
    birthDate: string | null;
    role: string;
    createdAt: string;
};

export type MyProfileUpdateResult = Omit<MyProfile, "createdAt">;

export type MyProfileUpdatePayload = Partial<{
    name: string;
    phone: string;
    address: string;
    birthPlace: string;
    birthDate: string;
}>;
