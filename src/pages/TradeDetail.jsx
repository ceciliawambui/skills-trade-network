import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc, getDoc, serverTimestamp,
  collection, addDoc, onSnapshot, query, orderBy, writeBatch
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { useAuth } from "../context/AuthContext";

const STATUS_META = {
  pending:   { label: "Awaiting response", dot: "#f59e0b",  bg: "#fffbeb", color: "#92400e" },
  active:    { label: "Active exchange",   dot: "#22c55e",  bg: "#f0fdf4", color: "#166534" },
  completed: { label: "Completed",         dot: "#38bdf8",  bg: "#f0f9ff", color: "#0369a1" },
  declined:  { label: "Declined",          dot: "#f87171",  bg: "#fef2f2", color: "#b91c1c" },
};

const Avatar = ({ photo, name, size = 40 }) => {
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: photo ? "transparent" : "var(--green-700)",
      overflow: "hidden", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: size * 0.32,
      fontWeight: 700, color: "#fff", border: "2px solid rgba(255,255,255,0.15)",
    }}>
      {photo
        ? <img src={photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initials}
    </div>
  );
};

const SkillPill = ({ label, variant = "green" }) => {
  const isGreen = variant === "green";
  return (
    <span style={{
      display: "inline-block",
      padding: "0.3rem 0.85rem", borderRadius: "100px",
      fontSize: "0.82rem", fontWeight: 600,
      background: isGreen ? "rgba(255,255,255,0.12)" : "rgba(251,191,36,0.15)",
      color: isGreen ? "#fff" : "#fbbf24",
      border: isGreen ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(251,191,36,0.3)",
    }}>
      {label}
    </span>
  );
};

const TradeDetail = () => {
  const { tradeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const [trade,     setTrade]     = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages,  setMessages]  = useState([]);
  const [newMsg,    setNewMsg]    = useState("");
  const [sending,   setSending]   = useState(false);
  const [updating,  setUpdating]  = useState(false);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (!tradeId || !user?.uid) return;
    const load = async () => {
      try {
        let snap = await getDoc(doc(db, "trades", tradeId));

        if (!snap.exists()) {
            snap = await getDoc(doc(db, "users", user.uid, "trades", tradeId));
        }

        if (!snap.exists()) {
            console.error("Trade not found.");
            return navigate("/dashboard");
        }

        const data = { id: snap.id, ...snap.data() };
        setTrade(data);

        const otherId = data.initiatorId === user.uid ? data.receiverId : data.initiatorId;
        const otherSnap = await getDoc(doc(db, "users", otherId));
        
        if (otherSnap.exists()) {
            setOtherUser({ id: otherId, ...otherSnap.data() });
        } else {
            setOtherUser({
                name: data.initiatorId === user.uid ? (data.receiverName || data.otherUserName) : (data.initiatorName || data.otherUserName),
                photoURL: data.initiatorId === user.uid ? data.receiverPhoto : data.initiatorPhoto,
                profession: data.initiatorId === user.uid ? data.receiverProfession : data.initiatorProfession
            });
        }
      } catch (err) {
        console.error("Load error:", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tradeId, user?.uid, navigate]);

  useEffect(() => {
    if (!tradeId) return;
    const q = query(
      collection(db, "trades", tradeId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [tradeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const updateStatus = async (status) => {
    if (updating) return;
    setUpdating(true);
    try {
      const batch = writeBatch(db);
      
      const updatedTradeData = { 
        ...trade, 
        status, 
        updatedAt: serverTimestamp() 
      };
      
      delete updatedTradeData.id;

      const globalRef = doc(db, "trades", tradeId);
      const initiatorRef = doc(db, "users", trade.initiatorId, "trades", tradeId);
      const receiverRef = doc(db, "users", trade.receiverId, "trades", tradeId);

      batch.set(globalRef, updatedTradeData, { merge: true });
      batch.set(initiatorRef, { status, updatedAt: serverTimestamp() }, { merge: true });
      batch.set(receiverRef, { status, updatedAt: serverTimestamp() }, { merge: true });

      await batch.commit();
      setTrade((prev) => ({ ...prev, status }));
      
    } catch (err) {
      console.error("Status update error:", err);
      alert("Could not update trade status. Please try again.");
    }
    setUpdating(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = newMsg.trim();
    if (!text || sending) return;
    setSending(true);
    setNewMsg("");
    try {
      await addDoc(collection(db, "trades", tradeId, "messages"), {
        senderId: user.uid,
        text,
        createdAt: serverTimestamp(),
      });
      
      const batch = writeBatch(db);
      const updateData = { updatedAt: serverTimestamp(), lastMessage: text };
      
      batch.set(doc(db, "trades", tradeId), updateData, { merge: true });
      batch.set(doc(db, "users", trade.initiatorId, "trades", tradeId), updateData, { merge: true });
      batch.set(doc(db, "users", trade.receiverId, "trades", tradeId), updateData, { merge: true });
      
      await batch.commit();
    } catch (err) {
      console.error("Send error:", err);
    }
    setSending(false);
    inputRef.current?.focus();
  };

  if (loading || !trade || !otherUser) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream-100)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", color: "var(--green-300)" }}>
        Loading exchange...
      </div>
    );
  }

  const isReceiver  = trade.receiverId  === user.uid;
  const isInitiator = trade.initiatorId === user.uid;
  const meta        = STATUS_META[trade.status] || STATUS_META.pending;
  const canChat     = trade.status === "active";
  const showChat    = trade.status === "active" || trade.status === "completed";

  const mySkill    = isInitiator ? trade.initiatorSkill : trade.receiverSkill;
  const theirSkill = isInitiator ? trade.receiverSkill  : trade.initiatorSkill;

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream-100)", fontFamily: "var(--font-body)", display: "flex", flexDirection: "column" }}>
      {/* Navbar Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--green-100)", padding: "0 2rem", height: 56, display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--green-500)", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          Back to Dashboard
        </button>
        <span style={{ color: "var(--green-200)" }}>|</span>
        <span style={{ fontSize: "0.82rem", color: "var(--green-400)" }}>
          Trade with <strong style={{ color: "var(--green-700)" }}>{otherUser.name?.split(" ")[0]}</strong>
        </span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "0.4rem", background: meta.bg, color: meta.color, padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.dot }} />
          {meta.label}
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", maxWidth: 1100, width: "100%", margin: "0 auto", padding: "2rem", gap: "1.5rem", alignItems: "flex-start" }}>
        {/* Profile Sidebar */}
        <div style={{ width: 300, background: "var(--green-900)", borderRadius: "24px", overflow: "hidden", position: "sticky", top: "2rem" }}>
          <div style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
              <Avatar photo={otherUser.photoURL} name={otherUser.name} size={48} />
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "#fff" }}>{otherUser.name}</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{otherUser.profession}</p>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.1rem" }}>
              <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>You offer</p>
              <SkillPill label={mySkill} variant="green" />
              <div style={{ margin: "0.75rem 0", textAlign: "center", color: "rgba(255,255,255,0.1)" }}>⇄</div>
              <p style={{ fontSize: "0.6rem", color: "rgba(251,191,36,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>You receive</p>
              <SkillPill label={theirSkill} variant="amber" />
            </div>
          </div>

          <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {isReceiver && trade.status === "pending" && (
              <>
                <button onClick={() => updateStatus("active")} disabled={updating} style={{ width: "100%", background: "#fff", color: "var(--green-900)", padding: "0.75rem", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>
                  {updating ? "Accepting..." : "Accept trade"}
                </button>
                <button onClick={() => updateStatus("declined")} disabled={updating} style={{ width: "100%", background: "transparent", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", padding: "0.75rem", borderRadius: "12px", cursor: "pointer" }}>
                  Decline
                </button>
              </>
            )}
            {trade.status === "active" && (
              <button onClick={() => updateStatus("completed")} disabled={updating} style={{ width: "100%", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "0.75rem", borderRadius: "12px", cursor: "pointer" }}>
                Mark Completed
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1, background: "#fff", borderRadius: "24px", border: "1px solid var(--green-100)", display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--green-50)" }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--green-900)" }}>
              {!showChat ? "Chat unlocks after acceptance" : "Messages"}
            </p>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {messages.map((msg) => {
              const isMine = msg.senderId === user.uid;
              return (
                <div key={msg.id} style={{ alignSelf: isMine ? "flex-end" : "flex-start", maxWidth: "70%", padding: "0.75rem 1rem", borderRadius: "14px", background: isMine ? "var(--green-800)" : "var(--cream-100)", color: isMine ? "#fff" : "var(--green-900)", fontSize: "0.9rem" }}>
                  {msg.text}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {canChat && (
            <form onSubmit={sendMessage} style={{ padding: "1.25rem", borderTop: "1px solid var(--green-50)", display: "flex", gap: "0.75rem" }}>
              <input ref={inputRef} value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Message..." style={{ flex: 1, padding: "0.75rem 1.25rem", borderRadius: "100px", border: "1px solid var(--green-100)", outline: "none" }} />
              <button type="submit" disabled={!newMsg.trim()} style={{ background: "var(--green-800)", color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "100px", cursor: "pointer" }}>Send</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeDetail;