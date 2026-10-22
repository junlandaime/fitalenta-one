import { Role } from "../../generated/prisma/client";

export const SUPER_ADMIN_ROLES: Role[] = ["superadmin", "admin"];

export const CMS_ROLES: Role[] = ["superadmin", "admin", "editor"];