import { request } from "@/api/axios";
import type {
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  DeleteCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from "@/interfaces/category";

const CATEGORY_API_BASE = "/categories";

export const categoryService = {
  getAll: (): Promise<CategoriesResponse> => {
    return request.get<CategoriesResponse>(CATEGORY_API_BASE);
  },

  getById: (id: string): Promise<CategoryResponse> => {
    return request.get<CategoryResponse>(`${CATEGORY_API_BASE}/${id}`);
  },

  create: (data: CreateCategoryRequest): Promise<CreateCategoryResponse> => {
    return request.post<CreateCategoryRequest, CreateCategoryResponse>(
      CATEGORY_API_BASE,
      data
    );
  },

  update: (
    id: string,
    data: UpdateCategoryRequest
  ): Promise<UpdateCategoryResponse> => {
    return request.put<UpdateCategoryRequest, UpdateCategoryResponse>(
      `${CATEGORY_API_BASE}/${id}`,
      data
    );
  },

  delete: (id: string): Promise<DeleteCategoryResponse> => {
    return request.delete<DeleteCategoryResponse>(`${CATEGORY_API_BASE}/${id}`);
  },
};
