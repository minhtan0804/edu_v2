// src/lib/react-query.ts
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Hàm xử lý lỗi chung
const handleError = (error: any) => {
  const message = error?.response?.data?.message || "Đã có lỗi xảy ra.";

  // Ví dụ: Check 401 để logout
  // if (error?.response?.status === 401) { window.location.href = '/login' }

  toast.error(message);
};

export const queryClient = new QueryClient({
  // 1. Global Error Handling cho Queries (Get)
  queryCache: new QueryCache({
    onError: (error) => {
      // Chỉ hiện toast với các lỗi server (5xx) hoặc critical
      // Tránh hiện toast khi lỡ user mất mạng (network error) liên tục
      console.error("Query Error:", error);
    },
  }),

  // 2. Global Error Handling cho Mutations (Post/Put/Delete)
  mutationCache: new MutationCache({
    onError: handleError, // Tự động hiện toast lỗi khi gọi API thất bại
  }),

  // 3. Cấu hình mặc định
  defaultOptions: {
    queries: {
      // Data được coi là "tươi" trong 1 phút (không fetch lại dù component re-render)
      staleTime: 1000 * 60,

      // Data rác (không dùng nữa) sẽ bị xóa khỏi bộ nhớ sau 5 phút
      gcTime: 1000 * 60 * 5,

      // Tự động thử lại 1 lần nếu lỗi (mặc định là 3)
      retry: 1,

      // Không tự fetch lại khi user focus vào cửa sổ (tránh phiền khi dev)
      // Bật lên (true) nếu làm app real-time
      refetchOnWindowFocus: false,
    },
  },
});
