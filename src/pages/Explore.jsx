import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => !user || u.id !== user.uid);

        setUsers(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handleProtectedAction = (targetId) => {
    if (!user) navigate("/signup");
    else navigate(`/trade/propose/${targetId}`);
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    if (!q) return true;

    return (
      u.name?.toLowerCase().includes(q) ||
      u.profession?.toLowerCase().includes(q) ||
      u.skillsOffered?.some((s) => s.toLowerCase().includes(q)) ||
      u.skillsWanted?.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-(--cream-100) font-(--font-body)">
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-10 py-12">

        <div className="mb-10">
          <h1 className="text-4xl font-(--font-display) tracking-[-0.03em] text-(--green-950) mb-2">
            Explore Community
          </h1>
          <p className="text-(--green-500)">
            Discover professionals ready to exchange knowledge.
          </p>
        </div>

        <div className="mb-12 max-w-2xl relative">
          <input
            type="text"
            placeholder="Search by name, skill, or profession..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-(--green-100) bg-white shadow-sm text-(--green-950) outline-none focus:border-(--green-400) transition"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--green-400)">
            ⌕
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-(--green-400)">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-(--green-100) rounded-2xl">
            <p className="text-lg font-semibold text-(--green-700)">
              No results found
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((u) => (
              <UserCard
                key={u.id}
                u={u}
                onPropose={() => handleProtectedAction(u.id)}
                onViewProfile={() => setSelectedUser(u)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <ProfileModal
          u={selectedUser}
          onClose={() => setSelectedUser(null)}
          onPropose={() => handleProtectedAction(selectedUser.id)}
        />
      )}
    </div>
  );
};


const UserCard = ({ u, onPropose, onViewProfile }) => {
  const initials =
    u.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    u.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition w-full">

      {/* Top */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-(--green-800) text-white flex items-center justify-center font-bold overflow-hidden shrink-0">
          {u.photoURL ? (
            <img src={u.photoURL} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-(--green-950) truncate">
            {u.name || "Anonymous"}
          </h3>
          <p className="text-sm text-gray-500">
            {u.profession || "Member"}
          </p>
          <p className="text-xs text-(--green-500)">
            {u.city || u.country
              ? `${u.city || ""}${u.city && u.country ? ", " : ""}${u.country || ""}`
              : "Location not specified"}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">
        {u.bio || "No bio provided."}
      </p>

      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">
          Offers
        </p>
        <div className="flex flex-wrap gap-2">
          {u.skillsOffered?.slice(0, 2).map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-1 rounded-md bg-green-50 text-green-700 font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase font-bold text-amber-600 mb-2">
          Wants
        </p>
        <div className="flex flex-wrap gap-2">
          {u.skillsWanted?.slice(0, 2).map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-1 rounded-md bg-amber-50 text-amber-700 font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={onPropose}
          className="flex-1 bg-(--green-900) text-white py-2 rounded-xl text-sm font-semibold hover:bg-(--green-800) transition"
        >
          Propose Trade
        </button>

        <button
          onClick={onViewProfile}
          className="flex-1 border border-gray-200 text-gray-800 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
        >
          View
        </button>
      </div>
    </div>
  );
};


const ProfileModal = ({ u, onClose, onPropose }) => {
  const initials =
    u.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl flex flex-col max-h-[85vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100"
        >
          ×
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-(--green-800) text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
            {u.photoURL ? (
              <img src={u.photoURL} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>

          <h2 className="text-2xl font-bold mt-4">
            {u.name}
          </h2>

          <p className="text-(--green-600)">{u.profession}</p>
        </div>

        <div className="overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs uppercase text-gray-400 font-bold mb-2">
              About
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {u.bio || "No bio provided."}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase text-gray-400 font-bold mb-2">
              Offering
            </h4>
            <div className="flex flex-wrap gap-2">
              {u.skillsOffered?.map((s) => (
                <span key={s} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase text-amber-600 font-bold mb-2">
              Wants
            </h4>
            <div className="flex flex-wrap gap-2">
              {u.skillsWanted?.map((s) => (
                <span key={s} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onPropose}
          className="mt-6 w-full bg-(--green-900) text-white py-3 rounded-xl font-semibold hover:bg-(--green-800) transition"
        >
          Propose Trade
        </button>
      </div>
    </div>
  );
};

export default Explore;