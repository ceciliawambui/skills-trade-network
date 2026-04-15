import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import SkillsSection from "../components/SkillsSection";

const CLOUDINARY_UPLOAD_PRESET = "skilltrade_profile";
const CLOUDINARY_CLOUD_NAME = "dxg7kzvyi";

const Dashboard = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [activeView, setActiveView] = useState("overview");

  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);

  const [profile, setProfile] = useState({
    name: "",
    photoURL: "",
    profession: "",
    bio: "",
    city: "",
    country: "",
  });

  const [editing, setEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const data = snap.data();
        setSkillsOffered(data.skillsOffered || []);
        setSkillsWanted(data.skillsWanted || []);
        setProfile({
          name: data.name || "",
          photoURL: data.photoURL || "",
          profession: data.profession || "",
          bio: data.bio || "",
          city: data.city || "",
          country: data.country || "",
        });
      }
    };

    fetchData();
  }, [user]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);

    try {
      const url = await uploadToCloudinary(file);
      setProfile((p) => ({ ...p, photoURL: url }));
      await updateDoc(doc(db, "users", user.uid), { photoURL: url });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    setSavingProfile(true);
    await updateDoc(doc(db, "users", user.uid), { ...profile });
    setSavingProfile(false);
    setEditing(false);
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase();

  const navItems = [
    { id: "overview", label: "Overview & Profile" },
    { id: "trades", label: "Active Trades" },
    { id: "exchanges", label: "Exchange History" },
    { id: "settings", label: "Settings" },
  ];

  const renderOverview = () => (
    <div className="max-w-350 w-full">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Skills Offered", value: skillsOffered.length },
          { label: "Skills Wanted", value: skillsWanted.length },
          { label: "Active Matches", value: "12" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <p className="text-sm text-(--green-600) mb-2">
              {s.label}
            </p>
            <h2 className="text-3xl font-bold text-(--green-900)">
              {s.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        <div className="bg-white rounded-2xl p-8 shadow-md">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-(--green-900)">
              Profile Information
            </h2>

            <div className="flex gap-3">
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 rounded-lg border border-(--green-200) text-(--green-700)"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-(--green-600) text-white"
                  >
                    {savingProfile ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded-lg border border-(--green-200) text-(--green-700)"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">

            <div className="relative w-28 h-28 rounded-full bg-(--green-500) flex items-center justify-center overflow-hidden">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {initials}
                </span>
              )}

              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm">
                  Uploading...
                </div>
              )}
            </div>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handlePhotoUpload}
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 rounded-lg bg-(--green-100) text-(--green-700)"
            >
              Upload Photo
            </button>

            <div className="w-full">
              {editing ? (
                <div className="space-y-4">

                  <input
                    placeholder="Full Name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border border-(--green-200) bg-(--cream-100)"
                  />

                  <input
                    placeholder="Profession"
                    value={profile.profession}
                    onChange={(e) =>
                      setProfile({ ...profile, profession: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border border-(--green-200) bg-(--cream-100)"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="City"
                      value={profile.city}
                      onChange={(e) =>
                        setProfile({ ...profile, city: e.target.value })
                      }
                      className="p-3 rounded-lg border border-(--green-200) bg-(--cream-100)"
                    />
                    <input
                      placeholder="Country"
                      value={profile.country}
                      onChange={(e) =>
                        setProfile({ ...profile, country: e.target.value })
                      }
                      className="p-3 rounded-lg border border-(--green-200) bg-(--cream-100)"
                    />
                  </div>

                  <textarea
                    placeholder="Bio"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    className="w-full p-3 min-h-30 rounded-lg border border-(--green-200) bg-(--cream-100)"
                  />
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-semibold">
                    {profile.name || "Add your name"}
                  </h3>
                  <p className="text-(--green-600)">
                    {profile.profession || "Add profession"}
                  </p>
                  <p className="text-(--green-500)">
                    {profile.city || profile.country
                      ? `${profile.city || ""}${
                          profile.city && profile.country ? ", " : ""
                        }${profile.country || ""}`
                      : "Add location"}
                  </p>

                  <div className="bg-(--cream-50) p-6 rounded-xl mt-4">
                    {profile.bio || "No bio provided yet."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">

          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-(--green-900)">
              Skills Portfolio
            </h2>
            <SkillsSection
              title="Skills I Offer"
              skills={skillsOffered}
              setSkills={setSkillsOffered}
              type="skillsOffered"
            />
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-(--green-900)">
              Learning Goals
            </h2>
            <SkillsSection
              title="Skills I Want"
              skills={skillsWanted}
              setSkills={setSkillsWanted}
              type="skillsWanted"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-(--cream-100)">

      <aside className="w-70 bg-(--green-800) text-white min-h-screen p-6">
        <h2 className="text-xl font-bold mb-10">SkillTrade</h2>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeView === item.id
                  ? "bg-white text-(--green-800)"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        {activeView === "overview" && renderOverview()}
      </main>
    </div>
  );
};

export default Dashboard;