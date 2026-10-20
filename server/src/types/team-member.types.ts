import type { TeamMemberType } from "../../generated/prisma/client";
import { PaginationMeta, PaginationQuery } from "../utils/pagination";

export type { TeamMemberType };

export interface MemberItem {
  id: number;
  type: TeamMemberType;
  name: string;
  position: string;
  bio: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberListFilters extends PaginationQuery {
  search?: string;
  isActive?: boolean;
}

export interface MemberSummary {
  total: number;
  active: number;
  inactive: number;
}

export interface MemberListResult {
  items: MemberItem[];
  meta: PaginationMeta;
  summary: MemberSummary;
}

export interface CreateMemberInput {
  name: string;
  position: string;
  bio?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateMemberInput {
  name?: string;
  position?: string;
  bio?: string;
  order?: number;
  isActive?: boolean;
  removeImage?: boolean;
}

export interface PublicMemberItem {
  id: number;
  name: string;
  position: string;
  bio: string | null;
  image: string | null;
}

export type ExpertItem = MemberItem;
export type ExpertListFilters = MemberListFilters;
export type ExpertSummary = MemberSummary;
export type ExpertListResult = MemberListResult;
export type CreateExpertInput = CreateMemberInput;
export type UpdateExpertInput = UpdateMemberInput;