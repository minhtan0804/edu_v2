import { Link } from "react-router-dom";

import { PATHS } from "../constants/common";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to={PATHS.HOME}
          className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
