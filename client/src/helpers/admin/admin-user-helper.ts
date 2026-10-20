import type { AdminUser, AdminUserUpdatePayload } from "@/types/admin/admin-user";

type FormData = {
    name: string;
    email: string;
    phone: string;
    role: AdminUser["role"];
};

export function buildUpdatePayload(original: AdminUser, data: FormData): AdminUserUpdatePayload {
    const payload: AdminUserUpdatePayload = {};

    if (data.name !== original.name) payload.name = data.name;
    if (data.email.toLowerCase() !== original.email) payload.email = data.email.toLocaleLowerCase();
    if (data.phone) payload.phone = data.phone;
    if (data.role !== original.role) payload.role = data.role;

    return payload;
}
