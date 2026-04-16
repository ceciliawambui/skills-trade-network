import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const STATUS_BADGE = {
  pending: { label: "Pending", bg: "#fefce8", color: "#854d0e" },
  active: { label: "Active", bg: "var(--green-50)", color: "var(--green-700)" },
  completed: { label: "Done", bg: "#f0fdf4", color: "#166534" },
  declined: { label: "Declined", bg: "#fef2f2", color: "#b91c1c" },
};

const TradesInbox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trades, setTrades] = useState([]);
  const [tab, setTab] = useState("incoming");
  const [loading, setLoading] = useState(true);

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
    return () => unsub();
  }, [user]);

  const incoming = trades.filter((t) => t.role === "receiver");
  const outgoing = trades.filter((t) => t.role === "initiator");
  const displayed = tab === "incoming" ? incoming : outgoing;
  const pendingCount = incoming.filter((t) => t.status === "pending").length;

  return (
    <div>
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", background: "var(--green-50)", padding: "0.25rem", borderRadius: "12px" }}>
        {[
          { id: "incoming", label: "Incoming", count: pendingCount },
          { id: "outgoing", label: "Outgoing" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "0.5rem", borderRadius: "10px", border: "none", background: tab === t.id ? "#fff" : "transparent", cursor: "pointer", fontWeight: 600 }}>
            {t.label}
            {t.count ? ` (${t.count})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : displayed.length === 0 ? (
        <p style={{ textAlign: "center" }}>No trades found</p>
      ) : (
        displayed.map((trade) => {
          const badge = STATUS_BADGE[trade.status] || STATUS_BADGE.pending;
          
          let otherName = "";
          if (trade.role === "initiator") {
              otherName = trade.receiverName || trade.otherUserName;
          } else {
              otherName = trade.initiatorName || trade.otherUserName;
          }

          return (
            <div key={trade.id} onClick={() => navigate(`/trade/${trade.id}`)} style={{ padding: "1.25rem", border: "1px solid var(--green-100)", borderRadius: "16px", marginBottom: "0.75rem", cursor: "pointer", background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "var(--green-900)" }}>{otherName || "Community Member"}</strong>
                <span style={{ background: badge.bg, color: badge.color, padding: "0.25rem 0.6rem", borderRadius: "100px", fontSize: "11px", fontWeight: 700 }}>
                  {badge.label.toUpperCase()}
                </span>
              </div>
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