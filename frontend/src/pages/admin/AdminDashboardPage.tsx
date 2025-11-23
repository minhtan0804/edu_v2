import { BookOpen, FolderTree, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AdminDashboardPage() {
  const { t } = useTranslation();

  // TODO: Fetch stats from API
  const stats = {
    totalUsers: 0,
    totalCourses: 0,
    totalCategories: 0,
  };

  const statCards = [
    {
      title: t("admin.dashboard.totalUsers"),
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: t("admin.dashboard.totalCourses"),
      value: stats.totalCourses,
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: t("admin.dashboard.totalCategories"),
      value: stats.totalCategories,
      icon: FolderTree,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("admin.dashboard.title")}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {t("admin.dashboard.overview")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t("admin.dashboard.recentActivity")}
        </h2>
        <p className="text-sm text-gray-500">
          Recent activity will be displayed here
        </p>
      </div>
    </div>
  );
}
