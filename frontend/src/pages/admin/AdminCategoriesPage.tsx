import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import ConfirmModal from "@/components/ConfirmModal";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/components/ui";
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from "@/hooks/useCategories";
import type { Category } from "@/interfaces/category";

function createCategorySchema(t: TFunction<"translation", undefined>) {
  return z.object({
    name: z.string().min(1, t("validation.required") || "Required"),
    slug: z
      .string()
      .min(1, t("validation.required") || "Required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        t("validation.slugInvalid") || "Invalid slug format"
      ),
    description: z.string().optional(),
  });
}

type CategoryForm = z.infer<ReturnType<typeof createCategorySchema>>;

export default function AdminCategoriesPage() {
  const { t } = useTranslation();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({ isOpen: false, category: null });

  const schema = createCategorySchema(t);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  // Fetch categories
  const { data: categories = [], isLoading, error } = useGetCategories();

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const onSubmit = (data: CategoryForm) => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, data },
        {
          onSuccess: () => {
            reset();
            setEditingCategory(null);
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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeleteConfirm({ isOpen: true, category });
  };

  const confirmDelete = () => {
    if (deleteConfirm.category && !deleteMutation.isPending) {
      deleteMutation.mutate(deleteConfirm.category.id, {
        onSuccess: () => {
          setDeleteConfirm({ isOpen: false, category: null });
        },
      });
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    reset({
      name: "",
      slug: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: t("admin.categories.table.name") || "Name",
    },
    {
      accessorKey: "slug",
      header: t("admin.categories.table.slug") || "Slug",
    },
    {
      accessorKey: "description",
      header: t("admin.categories.table.description") || "Description",
      cell: ({ row }) => (
        <span className="text-gray-500">{row.original.description || "-"}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("admin.categories.table.createdAt") || "Created At",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: t("admin.categories.table.actions") || "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleEdit(row.original)}
            variant="ghost"
            size="sm"
            className="p-2 text-blue-600 hover:bg-blue-50"
            title={t("admin.categories.edit") || "Edit"}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => handleDelete(row.original)}
            variant="ghost"
            size="sm"
            className="p-2 text-red-600 hover:bg-red-50"
            title={t("admin.categories.delete") || "Delete"}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Note: React Compiler warning about useReactTable is expected and safe to ignore.
  // TanStack Table handles its own memoization internally and this warning doesn't affect functionality.
  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("admin.nav.categories")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("admin.categories.subtitle")}
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>{t("admin.categories.addNew")}</span>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            {t("common.loading") || "Loading..."}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {t("errors.loadFailed") || "Failed to load categories"}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {t("admin.categories.noCategories") || "No categories found"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? t("admin.categories.editCategory") || "Edit Category"
                : t("admin.categories.createCategory") || "Create Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("admin.categories.form.name") || "Name"}
              </label>
              <Input {...register("name")} type="text" />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("admin.categories.form.slug") || "Slug"}
              </label>
              <Input
                {...register("slug")}
                type="text"
                placeholder="category-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("admin.categories.form.description") || "Description"}
              </label>
              <Textarea {...register("description")} rows={3} />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                  setEditingCategory(null);
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("common.saving") || "Saving..."
                  : editingCategory
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
        onClose={() => setDeleteConfirm({ isOpen: false, category: null })}
        onConfirm={confirmDelete}
        title={t("admin.categories.deleteConfirm") || "Delete Category"}
        message={
          deleteConfirm.category
            ? `Are you sure you want to delete "${deleteConfirm.category.name}"? This action cannot be undone.`
            : ""
        }
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
