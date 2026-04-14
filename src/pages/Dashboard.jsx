import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchUserProfile();
  }, [user]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* USER INFO */}
      <div className="bg-white p-4 shadow rounded mb-4">
        <h2 className="font-semibold">User Info</h2>
        <p>Email: {user?.email}</p>
      </div>

      {/* SKILLS OFFERED */}
      <div className="bg-white p-4 shadow rounded mb-4">
        <h2 className="font-semibold">Skills I Can Teach</h2>
        {profile?.skillsOffered?.length > 0 ? (
          <ul className="list-disc ml-5">
            {profile.skillsOffered.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>No skills added yet</p>
        )}
      </div>

      <div className="bg-white p-4 shadow rounded mb-4">
        <h2 className="font-semibold">Skills I Want</h2>
        {profile?.skillsWanted?.length > 0 ? (
          <ul className="list-disc ml-5">
            {profile.skillsWanted.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>No skills added yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;