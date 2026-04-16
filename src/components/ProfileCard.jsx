import { useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

const CLOUDINARY_UPLOAD_PRESET = "skilltrade_profile";
const CLOUDINARY_CLOUD_NAME = "dxg7kzvyi";

const ProfileCard = ({ profile, user }) => {
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useState(() => {
    setLocalProfile(profile);
  }, [profile]);

  const initials =
    localProfile.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ||
    user?.email?.[0]?.toUpperCase();

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

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);

      const updated = { ...localProfile, photoURL: url };
      setLocalProfile(updated);

      await updateDoc(doc(db, "users", user.uid), {
        photoURL: url,
      });
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), localProfile);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <div className="bg-white border border-(--green-100) rounded-3xl p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-(--font-display) text-(--green-900)">
          Profile
        </h2>

        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-1.5 text-sm rounded-full border border-(--green-200) text-(--green-600)"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1.5 text-sm rounded-full bg-(--green-800) text-white"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-1.5 text-sm rounded-full border border-(--green-200) text-(--green-700)"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-(--green-100) bg-(--green-800) flex items-center justify-center text-white text-xl font-semibold relative">
            {localProfile.photoURL ? (
              <img
                src={localProfile.photoURL}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs">
                Uploading...
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs px-3 py-1 rounded-full border border-(--green-100) text-(--green-600) bg-(--green-50)"
          >
            Change photo
          </button>
        </div>

        <div className="flex-1">

          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className="text-xs text-(--green-500)">Full name</label>
                <input
                  value={localProfile.name}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, name: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-(--green-100) bg-(--cream-100)"
                />
              </div>

              <div>
                <label className="text-xs text-(--green-500)">Profession</label>
                <input
                  value={localProfile.profession}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, profession: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-(--green-100) bg-(--cream-100)"
                />
              </div>

              <div>
                <label className="text-xs text-(--green-500)">City</label>
                <input
                  value={localProfile.city}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, city: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-(--green-100) bg-(--cream-100)"
                />
              </div>

              <div>
                <label className="text-xs text-(--green-500)">Country</label>
                <input
                  value={localProfile.country}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, country: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-(--green-100) bg-(--cream-100)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-(--green-500)">Bio</label>
                <textarea
                  rows={3}
                  value={localProfile.bio}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, bio: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-(--green-100) bg-(--cream-100)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-(--green-500)">Email</label>
                <input
                  value={user?.email}
                  disabled
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-(--green-100) bg-gray-100 text-gray-400"
                />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-(--font-display) text-(--green-950)">
                {localProfile.name || "Add your name"}
              </h3>

              <p className="text-(--green-500) mt-1">
                {localProfile.profession || "Add your profession"}
              </p>

              {(localProfile.city || localProfile.country) && (
                <p className="text-sm text-(--green-400) mt-1">
                  {[localProfile.city, localProfile.country].filter(Boolean).join(", ")}
                </p>
              )}

              <p className="text-sm text-(--green-600) mt-4 leading-relaxed max-w-md">
                {localProfile.bio || "Add a short bio about what you trade."}
              </p>

              <p className="text-xs text-(--green-300) mt-3">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;