import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[rgba(242,250,245,0.92)] backdrop-blur-md border-b border-(--green-100) font-(--font-body)">
      <div className="h-15 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          to="/"
          className="font-(--font-display) text-xl text-(--green-800) tracking-tight"
        >
          Skilltrade
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <Link
              to="/"
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition ${
                isActive("/")
                  ? "text-(--green-900) bg-(--green-100)"
                  : "text-(--green-500) hover:text-(--green-800)"
              }`}
            >
              Home
            </Link>

            <Link
              to="/explore"
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition ${
                isActive("/explore")
                  ? "text-(--green-900) bg-(--green-100)"
                  : "text-(--green-500) hover:text-(--green-800)"
              }`}
            >
              Explore
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition ${
                  isActive("/dashboard")
                    ? "text-(--green-900) bg-(--green-100)"
                    : "text-(--green-500) hover:text-(--green-800)"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3 ml-2">

              <div
                onClick={() => navigate("/dashboard")}
                className="w-8 h-8 rounded-full bg-(--green-800) flex items-center justify-center text-xs text-white font-semibold cursor-pointer"
              >
                {user.email?.[0]?.toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm font-medium border border-(--green-200) text-(--green-700) rounded-full hover:bg-(--green-50) transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-2">

              <Link
                to="/login"
                className="text-sm font-medium text-(--green-700) hover:text-(--green-800) transition"
              >
                Sign in
              </Link>

              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 text-sm font-medium bg-(--green-800) text-white rounded-full hover:bg-(--green-700) transition"
              >
                Get started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;