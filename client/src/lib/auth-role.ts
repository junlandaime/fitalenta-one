export type AuthRole = "superadmin" | "admin" | "editor" | "user";

export function normalizeRole(role: unknown): AuthRole {
    const value = String(role).toLowerCase();
    if (value === "superadmin") return "superadmin";
    if (value === "admin") return "admin";
    if (value === "editor") return "editor";
    return "user";
}

export function getHomeByRole(role: AuthRole): string {
    if (role === "superadmin" || role === "admin") return "/admin/dashboard";
    if (role === "editor") return "/editor/dashboard";
    return "/user/dashboard";
}
