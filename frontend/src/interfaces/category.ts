import type { ApiResponse } from "./common";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
}

export type CategoryResponse = ApiResponse<Category>;
export type CategoriesResponse = ApiResponse<Category[]>;
export type CreateCategoryResponse = ApiResponse<Category>;
export type UpdateCategoryResponse = ApiResponse<Category>;
export type DeleteCategoryResponse = ApiResponse<Category>;
