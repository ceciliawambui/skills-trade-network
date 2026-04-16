/**
 *  A dashboard-style component that lists all trades associated 
 * with the user. It differentiates between trade requests sent to others 
 * (Outgoing) and requests received from others (Incoming).
 */

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * STATUS_BADGE
 * Configuration for displaying the current state of a trade.
 * Keeps the rendering logic clean and centralized.
 */
const STATUS_BADGE = {
  pending: { label: "Pending", bg: "#fefce8", color: "#854d0e" },
  active: { label: "Active", bg: "var(--green-50)", color: "var(--green-700)" },
  completed: { label: "Done", bg: "#f0fdf4", color: "#166534" },
  declined: { label: "Declined", bg: "#fef2f2", color: "#b91c1c" },
};

const TradesInbox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- COMPONENT STATE ---
  const [trades, setTrades] = useState([]);
  const [tab, setTab] = useState("incoming"); // 'incoming' or 'outgoing'
  const [loading, setLoading] = useState(true);

  /**
   * Effect: Real-time listener
   * Subscribes to the specific subcollection of trades for this user.
   * Teaching Point: By listening to the subcollection, we only pull the data
   * relevant to this user, which is more efficient than filtering global data.
   */
  useEffect(() => {
    if (!user?.uid) return;
    
    const ref = collection(db, "users", user.uid, "trades");
    
    const unsub = onSnapshot(ref, (snap) => {
        setTrades(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }, (error) => {
        console.error("Trades listener error:", error);
        setLoading(false);
      }
    );
    
    return () => unsub(); // Unsubscribe when user leaves to save resources
  }, [user]);

  // --- DERIVED DATA ---
  // We classify trades by their 'role' (defined when the trade was created).
  const incoming = trades.filter((t) => t.role === "receiver");
  const outgoing = trades.filter((t) => t.role === "initiator");
  
  // Decide which list to render based on the active tab
  const displayed = tab === "incoming" ? incoming : outgoing;
  
  // Calculate count for the badge (e.g., "Incoming (2)")
  const pendingCount = incoming.filter((t) => t.status === "pending").length;

  return (
    <div>
      {/* --- TAB NAVIGATION --- */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", background: "var(--green-50)", padding: "0.25rem", borderRadius: "12px" }}>
        {[
          { id: "incoming", label: "Incoming", count: pendingCount },
          { id: "outgoing", label: "Outgoing" },
        ].map((t) => (
          <button 
            key={t.id} 
            onClick={() => setTab(t.id)} 
            style={{ 
              flex: 1, padding: "0.5rem", borderRadius: "10px", border: "none", 
              background: tab === t.id ? "#fff" : "transparent", 
              cursor: "pointer", fontWeight: 600, transition: "0.2s" 
            }}
          >
            {t.label}
            {t.count > 0 ? ` (${t.count})` : ""}
          </button>
        ))}
      </div>

      {/* --- LIST RENDERING --- */}
      {loading ? (
        <p style={{ textAlign: "center", color: "var(--green-400)" }}>Loading trades...</p>
      ) : displayed.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--green-400)" }}>No trades found in this category.</p>
      ) : (
        displayed.map((trade) => {
          const badge = STATUS_BADGE[trade.status] || STATUS_BADGE.pending;
          
          // Logic: Determine who the trade partner is
          // If I am the initiator, the partner is the receiver. If I am the receiver, the partner is the initiator.
          let otherName = trade.role === "initiator" 
            ? (trade.receiverName || "Community Member") 
            : (trade.initiatorName || "Community Member");

          return (
            <div 
              key={trade.id} 
              onClick={() => navigate(`/trade/${trade.id}`)} 
              style={{ 
                padding: "1.25rem", border: "1px solid var(--green-100)", 
                borderRadius: "16px", marginBottom: "0.75rem", 
                cursor: "pointer", background: "#fff",
                transition: "transform 0.1s, box-shadow 0.1s" 
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1)"}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "var(--green-900)" }}>{otherName}</strong>
                
                {/* Status Badge */}
                <span style={{ 
                  background: badge.bg, color: badge.color, 
                  padding: "0.25rem 0.6rem", borderRadius: "100px", 
                  fontSize: "11px", fontWeight: 700 
                }}>
                  {badge.label.toUpperCase()}
                </span>
              </div>
              
              {/* Trade Summary */}
              <p style={{ fontSize: "0.82rem", marginTop: "0.5rem", color: "var(--green-500)" }}>
                {trade.initiatorSkill} <span style={{ color: "var(--green-200)" }}>⇄</span> {trade.receiverSkill}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TradesInbox;