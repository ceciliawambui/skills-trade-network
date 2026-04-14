import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import SkillsSection from "../components/SkillsSection";

const Dashboard = () => {
  const { user } = useAuth();

  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setSkillsOffered(data.skillsOffered || []);
        setSkillsWanted(data.skillsWanted || []);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">

        <SkillsSection
          title="Skills I Offer"
          skills={skillsOffered}
          setSkills={setSkillsOffered}
          type="skillsOffered"
          color="blue"
        />

        <SkillsSection
          title="Skills I Want to Learn"
          skills={skillsWanted}
          setSkills={setSkillsWanted}
          type="skillsWanted"
          color="green"
        />

      </div>

    </div>
  );
};

export default Dashboard;