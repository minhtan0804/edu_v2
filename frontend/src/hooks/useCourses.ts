import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { courseService } from "@/api/course";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "@/interfaces/course";
import { isSuccessResponse } from "@/utils/api-helpers";
import { handleApiError } from "@/utils/error-handler";

// ============================================================================
// Fetcher Functions
// ============================================================================

const getAllCoursesFetcher = async (): Promise<Course[]> => {
  const response = await courseService.getAll();
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error("Failed to fetch courses");
};

const getCourseByIdFetcher = async (id: string): Promise<Course> => {
  const response = await courseService.getById(id);
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error("Failed to fetch course");
};

const createCourseFetcher = async (
  payload: CreateCourseRequest
): Promise<Course> => {
  const response = await courseService.create(payload);
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error("Failed to create course");
};

const updateCourseFetcher = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateCourseRequest;
}): Promise<Course> => {
  const response = await courseService.update(id, data);
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error("Failed to update course");
};

const deleteCourseFetcher = async (id: string): Promise<void> => {
  const response = await courseService.delete(id);
  if (isSuccessResponse(response)) {
    return;
  }
  throw new Error("Failed to delete course");
};

// ============================================================================
// Query Hooks
// ============================================================================

export const useGetCourses = () => {
  return useQuery({
    queryKey: QUERY_KEYS.courses.all,
    queryFn: getAllCoursesFetcher,
  });
};

export const useGetCourse = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.courses.detail(id),
    queryFn: () => getCourseByIdFetcher(id),
    enabled: !!id,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

export const useCreateCourse = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourseFetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.all });
      toast.success(
        t("admin.courses.createSuccess") || "Course created successfully"
      );
    },
    onError: (error: unknown) => {
      handleApiError(error, t, t("errors.createFailed"));
    },
  });
};

export const useUpdateCourse = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourseFetcher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.courses.detail(data.id),
      });
      toast.success(
        t("admin.courses.updateSuccess") || "Course updated successfully"
      );
    },
    onError: (error: unknown) => {
      handleApiError(error, t, t("errors.updateFailed"));
    },
  });
};

export const useDeleteCourse = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourseFetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.all });
      toast.success(
        t("admin.courses.deleteSuccess") || "Course deleted successfully"
      );
    },
    onError: (error: unknown) => {
      handleApiError(error, t, t("errors.deleteFailed"));
    },
  });
};
