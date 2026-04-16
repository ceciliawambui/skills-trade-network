import { useNavigate } from "react-router-dom";

const SettingsPanel = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="max-w-xl space-y-6">

      <div className="bg-white border border-(--green-100) rounded-2xl p-6">
        <h2 className="font-(--font-display) text-lg text-(--green-900) mb-1">
          Account
        </h2>
        <p className="text-sm text-(--green-400) mb-6">
          Manage your account details
        </p>

        <div className="flex items-center gap-3 bg-(--cream-100) rounded-xl px-4 py-3 border border-(--green-50)">
          <div className="w-10 h-10 rounded-full bg-(--green-800) flex items-center justify-center text-white text-sm font-semibold">
            {user?.email?.[0]?.toUpperCase()}
          </div>

          <div>
            <p className="text-sm font-medium text-(--green-800)">
              {user?.email}
            </p>
            <p className="text-xs text-(--green-400)">
              Signed in
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-full bg-red-50 text-red-600 border border-red-100 font-medium hover:bg-red-100 transition"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="bg-white border border-dashed border-(--green-100) rounded-2xl p-6 text-center">
        <p className="text-sm text-(--green-400)">
          More settings coming soon (notifications, preferences, etc.)
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;