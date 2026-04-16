const Topbar = ({ activeView, profile }) => {
  const titles = {
    overview: "Dashboard",
    trades: "Trade requests",
    history: "Exchange history",
    settings: "Settings",
  };

  return (
    <div className="border-b border-(--green-100) bg-white px-6 lg:px-10 py-4 flex justify-between items-center">

      <div>
        <h1 className="text-xl font-(--font-display) text-(--green-950)">
          {titles[activeView]}
        </h1>
        <p className="text-sm text-(--green-400)">
          {activeView === "overview" && "Manage your profile and skills"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-(--green-800) text-white flex items-center justify-center text-sm font-semibold">
          {profile.name?.[0] || "U"}
        </div>
      </div>
    </div>
  );
};

export default Topbar;