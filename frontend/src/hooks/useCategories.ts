import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { categoryService } from "@/api/category";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/interfaces/category";
import { isSuccessResponse } from "@/utils/api-helpers";
import { handleApiError } from "@/utils/error-handler";

// ============================================================================
// Fetcher Functions
// ============================================================================

const getAllCategoriesFetcher = async (): Promise<Category[]> => {
  const response = await categoryService.getAll();
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error("Failed to fetch categories");
};

const getCategoryByIdFetcher = async (id: string): Promise<Category> => {
  const response = await categoryService.getById(id);
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error("Failed to fetch category");
};

const createCategoryFetcher = async (
  payload: CreateCategoryRequest
): Promise<Category> => {
  const response = await categoryService.create(payload);
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error("Failed to create category");
};

const updateCategoryFetcher = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateCategoryRequest;
}): Promise<Category> => {
  const response = await categoryService.update(id, data);
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error("Failed to update category");
};

const deleteCategoryFetcher = async (id: string): Promise<void> => {
  const response = await categoryService.delete(id);
  if (isSuccessResponse(response)) {
    return;
  }
  throw new Error("Failed to delete category");
};

// ============================================================================
// Query Hooks
// ============================================================================

export const useGetCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: getAllCategoriesFetcher,
  });
};

export const useGetCategory = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.categories.detail(id),
    queryFn: () => getCategoryByIdFetcher(id),
    enabled: !!id,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

export const useCreateCategory = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoryFetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
      toast.success(
        t("admin.categories.createSuccess") || "Category created successfully"
      );
    },
    onError: (error: unknown) => {
      handleApiError(error, t, t("errors.createFailed"));
    },
  });
};

export const useUpdateCategory = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategoryFetcher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categories.detail(data.id),
      });
      toast.success(
        t("admin.categories.updateSuccess") || "Category updated successfully"
      );
    },
    onError: (error: unknown) => {
      handleApiError(error, t, t("errors.updateFailed"));
    },
  });
};

export const useDeleteCategory = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryFetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
      toast.success(
        t("admin.categories.deleteSuccess") || "Category deleted successfully"
      );
    },
    onError: (error: unknown) => {
      handleApiError(error, t, t("errors.deleteFailed"));
    },
  });
};
