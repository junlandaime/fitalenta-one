import type { AdminUserRole } from "@/types/admin/admin-user";

export const ADMIN_USER_ROLES = ["user", "editor", "admin", "superadmin"] as const satisfies readonly AdminUserRole[];

type RoleMeta = {
    label: string;
    subtitle: string;
    className: string;
};

export const ROLE_META: Record<AdminUserRole, RoleMeta> = {
    user: {
        label: "Peserta",
        subtitle: "Peserta FITALENTA",
        className:
            "border-transparent bg-muted text-muted-foreground",
    },
    editor: {
        label: "Editor",
        subtitle: "Editor konten",
        className:
            "border-transparent bg-sky-500/10 text-sky-700 dark:text-sky-400",
    },
    admin: {
        label: "Admin",
        subtitle: "Administrator",
        className:
            "border-transparent bg-violet-500/10 text-violet-700 dark:text-violet-400",
    },
    superadmin: {
        label: "Super Admin",
        subtitle: "Akses Penuh (Admin & Editor)",
        className:
            "border-transparent bg-amber-500/10 text-amber-700 dark:text-amber-400",
    },
};

export const ROLE_FILTER_OPTIONS = [
    { value: "all", label: "Semua tipe" },
    ...ADMIN_USER_ROLES.map((role) => ({ value: role, label: ROLE_META[role].label })),
] as const;

export const USERS_PER_PAGE = 10;
