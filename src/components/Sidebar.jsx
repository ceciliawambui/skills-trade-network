const Sidebar = ({ activeView, setActiveView, profile, user, pendingCount }) => {
  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "trades", label: "Trades", badge: pendingCount },
    { id: "history", label: "History" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 border-r border-(--green-100) bg-white px-6 py-8 hidden lg:flex flex-col">
      
      <div className="mb-10">
        <h1 className="text-xl font-(--font-display) text-(--green-900)">
          Skilltrade
        </h1>
        <p className="text-xs text-(--green-400)">
          {profile.name || user?.email}
        </p>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition
              ${
                activeView === item.id
                  ? "bg-(--green-50) text-(--green-800) font-semibold"
                  : "text-(--green-500) hover:bg-(--green-50)"
              }`}
          >
            {item.label}
            {item.badge > 0 && (
              <span className="text-xs bg-(--green-800) text-white px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;