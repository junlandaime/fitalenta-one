import { PaginationQuery } from "../utils/pagination";

export interface ProgramCategoryItem {
  id: number;
  name: string;
  description: string | null;
  programCount: number;
  createdAt: Date;
}

export interface ProgramCategoryListFilters extends PaginationQuery {
  search?: string;
}

export interface CreateProgramCategoryInput {
  name: string;
  description?: string | null;
}

export interface UpdateProgramCategoryInput {
  name?: string;
  description?: string | null;
}
