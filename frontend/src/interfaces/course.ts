import type { ApiResponse } from "./common";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  price: number;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
  sections?: Section[];
}

export interface Section {
  id: string;
  title: string;
  position: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  position: number;
  videoId?: string;
  documentUrl?: string;
  sectionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  categoryId: string;
}

export interface UpdateCourseRequest {
  title?: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  categoryId?: string;
}

export type CourseResponse = ApiResponse<Course>;
export type CoursesResponse = ApiResponse<Course[]>;
export type CreateCourseResponse = ApiResponse<Course>;
export type UpdateCourseResponse = ApiResponse<Course>;
export type DeleteCourseResponse = ApiResponse<Course>;
