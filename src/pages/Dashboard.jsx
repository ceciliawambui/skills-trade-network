/**
 * The layout controller and state provider for the authenticated experience.
 * It manages profile data, real-time trade statistics, and view-switching logic.
 */

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase.config";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";

// --- UI COMPONENTS ---
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Overview from "../components/Overview";
import TradesInbox from "../components/TradesInbox";
import ExchangeHistory from "../components/ExchangeHistory";
import SettingsPanel from "../components/SettingsPanel";

const Dashboard = () => {
  const { user, logout } = useAuth();

  // --- VIEW STATE ---
  // Determines which sub-component to render in the <main> area
  const [activeView, setActiveView] = useState("overview");

  // --- DATA STATE ---
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [incomingActive, setIncomingActive] = useState(0);
  const [outgoingActive, setOutgoingActive] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const [profile, setProfile] = useState({
    name: "",
    photoURL: "",
    profession: "",
    bio: "",
    city: "",
    country: "",
  });

  const [loading, setLoading] = useState(true);

  // Derived state: Total active exchanges
  const activeTrades = incomingActive + outgoingActive;

  /**
   * Effect: Static Profile Load
   * Fetches the user's basic info once when the component mounts.
   */
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
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
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

/**
 * Effect: Real-time Statistics Listener
 * Instead of fetching full trade objects, this listener iterates through
 * the user's trade subcollection to calculate summary numbers for the UI.
 * * Teaching Point: "Aggregation Logic." This is more efficient than 
 * running three separate queries for 'active', 'pending', and 'role'.
 */
useEffect(() => {
  if (!user?.uid) return;

  const tradesRef = collection(db, "users", user.uid, "trades");
  let unsub;

  try {
    unsub = onSnapshot(
      tradesRef,
      (snap) => {
        let incoming = 0;
        let outgoing = 0;
        let pending = 0;

        snap.forEach((doc) => {
          const t = doc.data();

          // Increment counters based on trade status and user role
          if (t.role === "receiver" && t.status === "active") incoming++;
          if (t.role === "initiator" && t.status === "active") outgoing++;
          if (t.role === "receiver" && t.status === "pending") pending++;
        });

        // Batch updates to state to prevent unnecessary re-renders
        setIncomingActive(incoming);
        setOutgoingActive(outgoing);
        setPendingCount(pending);
      },
      (err) => {
        console.error("Firestore listener error:", err);
      }
    );
  } catch (e) {
    console.error("Failed to initialize listener:", e);
  }

  return () => {
    if (unsub) unsub();
  };
}, [user]);


  // --- LOADING GUARD ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--cream-100)">
        <p className="text-(--green-400) animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--cream-100) flex">

      {/* --- SHARED NAVIGATION --- */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        profile={profile}
        user={user}
        pendingCount={pendingCount} // Sidebar needs this for the red notification dot
      />

      <div className="flex-1 flex flex-col">
        
        {/* Topbar displays the title of the current view */}
        <Topbar activeView={activeView} profile={profile} />

        {/* --- DYNAMIC CONTENT AREA --- */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-8">

          {/* Conditional Rendering based on activeView */}
          
          {activeView === "overview" && (
            <Overview
              profile={profile}
              user={user}
              skillsOffered={skillsOffered}
              skillsWanted={skillsWanted}
              setSkillsOffered={setSkillsOffered}
              setSkillsWanted={setSkillsWanted}
              activeTrades={activeTrades}
            />
          )}

          {activeView === "trades" && (
            <TradesInbox userId={user?.uid} />
          )}

          {activeView === "history" && (
            <ExchangeHistory userId={user?.uid} />
          )}

          {activeView === "settings" && (
            <SettingsPanel user={user} logout={logout} />
          )}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;