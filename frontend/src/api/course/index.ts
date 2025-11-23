import { request } from "@/api/axios";
import type {
  CourseResponse,
  CoursesResponse,
  CreateCourseRequest,
  CreateCourseResponse,
  DeleteCourseResponse,
  UpdateCourseRequest,
  UpdateCourseResponse,
} from "@/interfaces/course";

const COURSE_API_BASE = "/courses";

export const courseService = {
  getAll: (): Promise<CoursesResponse> => {
    return request.get<CoursesResponse>(COURSE_API_BASE);
  },

  getById: (id: string): Promise<CourseResponse> => {
    return request.get<CourseResponse>(`${COURSE_API_BASE}/${id}`);
  },

  create: (data: CreateCourseRequest): Promise<CreateCourseResponse> => {
    return request.post<CreateCourseRequest, CreateCourseResponse>(
      COURSE_API_BASE,
      data
    );
  },

  update: (
    id: string,
    data: UpdateCourseRequest
  ): Promise<UpdateCourseResponse> => {
    return request.put<UpdateCourseRequest, UpdateCourseResponse>(
      `${COURSE_API_BASE}/${id}`,
      data
    );
  },

  delete: (id: string): Promise<DeleteCourseResponse> => {
    return request.delete<DeleteCourseResponse>(`${COURSE_API_BASE}/${id}`);
  },
};
