import { RequestHandler } from "express";
import { CMS_ROLES, SUPER_ADMIN_ROLES } from "../config/access.config";
import { authenticate } from "./authenticate";
import { authorize } from "./authorize";

export const cmsAccess: RequestHandler[] = [authenticate, authorize(...CMS_ROLES)];

export const superAdminAccess: RequestHandler[] = [authenticate, authorize(...SUPER_ADMIN_ROLES)];