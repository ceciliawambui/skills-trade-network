/**
 * This component handles the business logic for initiating a 
 * "Knowledge Exchange." It fetches profiles for both parties and uses 
 * Firestore Write Batches to ensure data consistency across the database.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useAuth } from "../context/AuthContext";

const ProposeTrade = () => {
    // --- ROUTING & AUTH ---
    const { userId } = useParams(); // The ID of the person receiving the proposal
    const { user } = useAuth();     // The person sending the proposal
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [receiver, setReceiver] = useState(null);   // Data of the person you're proposing to
    const [myProfile, setMyProfile] = useState(null); // Your own profile data
    const [form, setForm] = useState({
        initiatorSkill: "", // Skill you will provide
        receiverSkill: "",  // Skill you want to learn
        message: "",        // Optional introduction
        mode: "async",      // Exchange method (Async vs Live)
    });
    const [submitting, setSubmitting] = useState(false); // Controls button loading state
    const [error, setError] = useState("");              // Captures validation/DB errors

    /**
     * Effect: Parallel Data Loading
     * We use Promise.all to fetch both profiles at the same time for better performance.
     */
    useEffect(() => {
        const load = async () => {
            try {
                const [receiverSnap, mySnap] = await Promise.all([
                    getDoc(doc(db, "users", userId)),
                    getDoc(doc(db, "users", user.uid)),
                ]);

                if (receiverSnap.exists()) setReceiver({ id: userId, ...receiverSnap.data() });
                if (mySnap.exists()) setMyProfile(mySnap.data());
            } catch (err) {
                console.error("Error loading profiles:", err);
                setError("Could not load user data.");
            }
        };
        load();
    }, [userId, user]);

    /**
     * handleSubmit
     * The core logic for creating a trade.
     * Explains: Why we use "WriteBatches" (Atomic Operations).
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // 1. Basic Validation
        if (!form.initiatorSkill || !form.receiverSkill) {
            setError("Please select skills for both sides.");
            return;
        }

        setSubmitting(true);

        try {
            // Generate a unique ID for this specific trade
            const tradeId = crypto.randomUUID();
            
            /**
             * FIRESTORE BATCH:
             * A batch ensures that either ALL writes succeed, or NONE of them do.
             * This prevents "Partial Data" where a trade exists in one place but not the other.
             */
            const batch = writeBatch(db);

            // 2. Prepare the Trade Object
            const tradeData = {
                tradeId,
                initiatorId: user.uid,
                initiatorName: myProfile.name || "Community Member",
                initiatorPhoto: myProfile.photoURL || "",
                initiatorProfession: myProfile.profession || "",
                
                receiverId: userId,
                receiverName: receiver.name || "Community Member",
                receiverPhoto: receiver.photoURL || "",
                receiverProfession: receiver.profession || "",

                initiatorSkill: form.initiatorSkill,
                receiverSkill: form.receiverSkill,
                message: form.message,
                mode: form.mode,

                status: "pending", // All trades start in pending
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastMessage: "",
                lastMessageAt: null,
            };

            // 3. Queue the writes into the batch
            
            // Write A: The global trades collection (Source of truth)
            batch.set(doc(db, "trades", tradeId), tradeData);

            // Write B: Current user's trade list (for quick dashboard loading)
            batch.set(doc(db, "users", user.uid, "trades", tradeId), {
                ...tradeData,
                role: "initiator",
            });

            // Write C: Receiver's trade list (so they get notified)
            batch.set(doc(db, "users", userId, "trades", tradeId), {
                ...tradeData,
                role: "receiver",
            });

            // 4. Commit all three writes at once
            await batch.commit();
            
            // Redirect to the newly created trade detail page
            navigate(`/trade/${tradeId}`);
        } catch (err) {
            console.error("Trade Submission Error:", err);
            setError("Failed to send trade. Please check your connection.");
        }
        setSubmitting(false);
    };

    // --- LOADING GUARD ---
    if (!receiver || !myProfile) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--cream-100)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", color: "var(--green-400)" }}>
                Preparing trade proposal...
            </div>
        );
    }

    /**
     * Helper: Initials generator
     * Uses optional chaining and array methods to transform "Jane Doe" -> "JD"
     */
    const initials = (name) =>
        name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

    return (
        <div className="min-h-screen bg-(--cream-100) font-(--font-body)">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* --- TITLE SECTION --- */}
                <div className="mb-10">
                    <h1 className="text-3xl font-(--font-display) text-(--green-950) tracking-tight">
                        Propose a trade
                    </h1>
                    <p className="text-(--green-500) mt-1 text-sm font-light">
                        Tell {receiver.name?.split(" ")[0] || "them"} what you're offering and what you'd like to learn.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    
                    {/* --- VISUAL PREVIEW: ME ⇄ THEM --- */}
                    <div className="bg-white border border-(--green-100) rounded-3xl p-8 flex items-center justify-between shadow-sm">
                        {/* Initiator (You) */}
                        <div className="text-center flex-1">
                            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-(--green-100) bg-(--green-800) flex items-center justify-center text-white font-semibold">
                                {myProfile.photoURL ? (
                                    <img src={myProfile.photoURL} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    initials(myProfile.name)
                                )}
                            </div>
                            <p className="mt-3 text-sm font-semibold text-(--green-900)">{myProfile.name || "You"}</p>
                            <p className="text-xs text-(--green-400)">{myProfile.profession}</p>
                        </div>

                        {/* Exchange Icon */}
                        <div className="flex flex-col items-center px-4">
                            <span className="text-2xl text-(--green-300)">⇄</span>
                            <span className="text-[10px] uppercase tracking-widest text-(--green-300)">Exchange</span>
                        </div>

                        {/* Receiver (Partner) */}
                        <div className="text-center flex-1">
                            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-(--green-100) bg-(--green-700) flex items-center justify-center text-white font-semibold">
                                {receiver.photoURL ? (
                                    <img src={receiver.photoURL} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    initials(receiver.name)
                                )}
                            </div>
                            <p className="mt-3 text-sm font-semibold text-(--green-900)">{receiver.name || "Partner"}</p>
                            <p className="text-xs text-(--green-400)">{receiver.profession}</p>
                        </div>
                    </div>

                    {/* --- PROPOSAL FORM --- */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white border border-(--green-100) rounded-3xl p-8 space-y-6 shadow-sm">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                    {error}
                                </div>
                            )}

                            {/* Section: Your Offering */}
                            <div>
                                <label className="block text-sm font-semibold text-(--green-800)">
                                    What skill are <em>you</em> offering?
                                </label>
                                <div className="flex flex-wrap gap-2 mt-3 mb-3">
                                    {myProfile.skillsOffered?.map((s) => (
                                        <button
                                            type="button"
                                            key={s}
                                            onClick={() => setForm({ ...form, initiatorSkill: s })}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border transition
                                            ${form.initiatorSkill === s
                                                    ? "border-(--green-600) bg-(--green-50) text-(--green-700)"
                                                    : "border-(--green-100) text-(--green-500) hover:border-(--green-300)"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    value={form.initiatorSkill}
                                    onChange={(e) => setForm({ ...form, initiatorSkill: e.target.value })}
                                    placeholder="Or type a custom skill..."
                                    className="w-full px-4 py-3 rounded-xl border border-(--green-100) bg-(--cream-100) text-sm outline-none focus:border-(--green-400)"
                                />
                            </div>

                            {/* Section: Your Request */}
                            <div>
                                <label className="block text-sm font-semibold text-(--green-800)">
                                    What skill do you want from {receiver.name?.split(" ")[0] || "them"}?
                                </label>
                                <div className="flex flex-wrap gap-2 mt-3 mb-3">
                                    {receiver.skillsOffered?.map((s) => (
                                        <button
                                            type="button"
                                            key={s}
                                            onClick={() => setForm({ ...form, receiverSkill: s })}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border transition
                                            ${form.receiverSkill === s
                                                    ? "border-amber-400 bg-amber-100 text-amber-700"
                                                    : "border-(--green-100) text-(--green-500) hover:border-amber-200"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    value={form.receiverSkill}
                                    onChange={(e) => setForm({ ...form, receiverSkill: e.target.value })}
                                    placeholder="Or type what you want to learn..."
                                    className="w-full px-4 py-3 rounded-xl border border-(--green-100) bg-(--cream-100) text-sm outline-none focus:border-(--green-400)"
                                />
                            </div>

                            {/* Section: Exchange Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-(--green-800)">
                                    Exchange mode
                                </label>
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    {[
                                        { id: "async", title: "Async", desc: "Chat & resources" },
                                        { id: "live", title: "Live", desc: "Video sessions" },
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => setForm({ ...form, mode: m.id })}
                                            className={`p-4 rounded-xl border text-left transition
                                            ${form.mode === m.id
                                                    ? "border-(--green-600) bg-(--green-50)"
                                                    : "border-(--green-100) hover:bg-gray-50"
                                                }`}
                                        >
                                            <p className="text-sm font-semibold text-(--green-800)">{m.title}</p>
                                            <p className="text-xs text-(--green-400)">{m.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Pitch Message */}
                            <div>
                                <label className="block text-sm font-semibold text-(--green-800)">
                                    Message (optional)
                                </label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    placeholder="Introduce yourself and explain why you want to trade..."
                                    rows={3}
                                    className="w-full mt-2 px-4 py-3 rounded-xl border border-(--green-100) bg-(--cream-100) text-sm outline-none focus:border-(--green-400)"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-4 rounded-full text-white font-medium shadow-md transition
                                ${submitting
                                        ? "bg-(--green-400) cursor-not-allowed"
                                        : "bg-(--green-800) hover:bg-(--green-700) active:scale-[0.98]"
                                    }`}
                            >
                                {submitting ? "Sending Proposal..." : "Send trade proposal"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProposeTrade;