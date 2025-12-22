import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-white/90 mb-8 text-lg">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-white text-sky-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
