import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/components/ui";
import { useGetCategories } from "@/hooks/useCategories";
import {
  useCreateCourse,
  useDeleteCourse,
  useGetCourses,
  useUpdateCourse,
} from "@/hooks/useCourses";
import type { Course } from "@/interfaces/course";
import { type CourseForm, createCourseSchema } from "@/schemas/admin.schema";

export default function AdminCoursesPage() {
  const { t } = useTranslation();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    course: Course | null;
  }>({ isOpen: false, course: null });

  const schema = createCourseSchema(t as any);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CourseForm>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      thumbnail: "",
      price: 0,
      categoryId: "",
    },
  });

  // Fetch data
  const { data: courses = [], isLoading: coursesLoading } = useGetCourses();
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategories();

  // Mutations
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const onSubmit = (data: CourseForm) => {
    if (editingCourse) {
      updateMutation.mutate(
        { id: editingCourse.id, data },
        {
          onSuccess: () => {
            reset();
            setEditingCourse(null);
            setIsModalOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          reset();
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    reset({
      title: course.title,
      slug: course.slug,
      description: course.description || "",
      thumbnail: course.thumbnail || "",
      price: Number(course.price),
      categoryId: course.categoryId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (course: Course) => {
    setDeleteConfirm({ isOpen: true, course });
  };

  const confirmDelete = () => {
    if (deleteConfirm.course && !deleteMutation.isPending) {
      deleteMutation.mutate(deleteConfirm.course.id, {
        onSuccess: () => {
          setDeleteConfirm({ isOpen: false, course: null });
        },
      });
    }
  };

  const handleAddNew = () => {
    setEditingCourse(null);
    reset({
      title: "",
      slug: "",
      description: "",
      thumbnail: "",
      price: 0,
      categoryId: "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("admin.nav.courses")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("admin.courses.subtitle") || "Manage courses"}
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>{t("admin.courses.addNew") || "Add New Course"}</span>
        </Button>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {coursesLoading ? (
          <div className="p-8 text-center text-gray-500">
            {t("common.loading") || "Loading..."}
          </div>
        ) : courses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {t("admin.courses.noCourses") || "No courses found"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t("admin.courses.table.title") || "Title"}
                </TableHead>
                <TableHead>
                  {t("admin.courses.table.category") || "Category"}
                </TableHead>
                <TableHead>
                  {t("admin.courses.table.price") || "Price"}
                </TableHead>
                <TableHead>
                  {t("admin.courses.table.actions") || "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      {course.title}
                    </div>
                    <div className="text-sm text-gray-500">{course.slug}</div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {course.category?.name || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    ${Number(course.price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/courses/${course.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={t("admin.courses.view") || "View"}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Button
                        onClick={() => handleEdit(course)}
                        variant="ghost"
                        size="sm"
                        className="p-2 text-blue-600 hover:bg-blue-50"
                        title={t("admin.courses.edit") || "Edit"}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(course)}
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-600 hover:bg-red-50"
                        title={t("admin.courses.delete") || "Delete"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCourse
                ? t("admin.courses.editCourse") || "Edit Course"
                : t("admin.courses.createCourse") || "Create Course"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("admin.courses.form.title") || "Title"} *
              </label>
              <Input
                {...register("title")}
                type="text"
                onChange={(e) => {
                  const newTitle = e.target.value;
                  const slug = generateSlug(newTitle);
                  // Only auto-update slug if it's empty or matches the old title
                  if (
                    !editingCourse ||
                    slug === generateSlug(editingCourse.title)
                  ) {
                    setValue("slug", slug);
                  }
                }}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("admin.courses.form.slug") || "Slug"} *
              </label>
              <Input
                {...register("slug")}
                type="text"
                placeholder="course-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("admin.courses.form.category") || "Category"} *
              </label>
              <Select
                // eslint-disable-next-line react-hooks/incompatible-library
                value={watch("categoryId") || ""}
                onValueChange={(value) => setValue("categoryId", value)}
                disabled={categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      t("admin.courses.form.selectCategory") ||
                      "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("admin.courses.form.description") || "Description"}
              </label>
              <Textarea {...register("description")} rows={4} />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("admin.courses.form.price") || "Price"}
                </label>
                <Input
                  {...register("price")}
                  type="number"
                  step="0.01"
                  min="0"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("admin.courses.form.thumbnail") || "Thumbnail URL"}
                </label>
                <Input
                  {...register("thumbnail")}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.thumbnail.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                  setEditingCourse(null);
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("common.saving") || "Saving..."
                  : editingCourse
                    ? t("common.update") || "Update"
                    : t("common.create") || "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, course: null })}
        onConfirm={confirmDelete}
        title={t("admin.courses.deleteConfirm") || "Delete Course"}
        message={
          deleteConfirm.course
            ? `Are you sure you want to delete "${deleteConfirm.course.title}"? This action cannot be undone.`
            : ""
        }
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
