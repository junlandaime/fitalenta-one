export type AdminUserRole = "user" | "editor" | "admin" | "superadmin";

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: AdminUserRole;
    createdAt: string;
    updatedAt: string;
    registrationsCount: number;
    relatedDataCount: number;
    canDelete: boolean;
};

export type AdminUserSummary = {
    total: number;
    participants: number;
    administrators: number;
    editors: number;
    withPhone: number;
};

export type AdminPageMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type AdminUserList = {
    users: AdminUser[];
    meta: AdminPageMeta;
};

export type AdminUserParams = {
    page: number;
    search: string;
    role: AdminUserRole | "all";
};

export type AdminUserCreatePayload = {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: AdminUserRole;
};

export type AdminUserUpdatePayload = Partial<Omit<AdminUserCreatePayload, "password">>;
