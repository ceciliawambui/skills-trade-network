import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useAuth } from "../context/AuthContext";

const SkillsSection = ({ title, skills, setSkills, type }) => {
    const { user } = useAuth();
    const [input, setInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState("");

    const isOffer = type === "skillsOffered";
    const accentColor = isOffer ? "var(--green-800)" : "#B45309";
    const accentBg = isOffer ? "rgba(16, 185, 129, 0.08)" : "rgba(245, 158, 11, 0.08)";

    const syncToFirestore = async (updatedSkills) => {
        try {
            setSaving(true);
            const ref = doc(db, "users", user.uid);
            await updateDoc(ref, { [type]: updatedSkills });
        } catch (err) {
            console.error("Skill sync failed:", err);
        } finally {
            setSaving(false);
        }
    };

    const addSkill = async () => {
        const trimmed = input.trim();
        if (!trimmed || skills.includes(trimmed)) {
            setInput("");
            return;
        }
        const updated = [...skills, trimmed];
        setSkills(updated);
        setInput("");
        await syncToFirestore(updated);
    };

    const removeSkill = async (index) => {
        const updated = skills.filter((_, i) => i !== index);
        setSkills(updated);
        await syncToFirestore(updated);
    };

    const startEdit = (index) => {
        setEditingIndex(index);
        setEditValue(skills[index]);
    };

    const saveEdit = async (index) => {
        const trimmed = editValue.trim();
        if (!trimmed) return;
        const updated = [...skills];
        updated[index] = trimmed;
        setSkills(updated);
        setEditingIndex(null);
        setEditValue("");
        await syncToFirestore(updated);
    };

    return (
        <div className="bg-white border border-(--green-100) rounded-2xl p-8 shadow-sm flex flex-col gap-6">

            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-(--green-950)">
                        {title}
                    </h3>

                    <p className="text-sm text-(--green-400) mt-1">
                        {saving ? (
                            <span className="text-(--green-500)">Syncing changes...</span>
                        ) : (
                            `${skills.length} expertise items defined`
                        )}
                    </p>
                </div>

                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm"
                    style={{ background: accentBg, color: accentColor }}
                >
                    {isOffer ? "▲" : "▼"}
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                    <div
                        key={`${skill}-${index}`}
                        className="relative bg-(--cream-100) border border-(--green-100) rounded-xl px-3 py-2 flex items-center min-h-10 overflow-hidden group"
                    >
                        {editingIndex === index ? (
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    autoFocus
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && saveEdit(index)}
                                    className="bg-transparent outline-none text-(--green-950) font-semibold w-30"
                                />
                                <button
                                    onClick={() => saveEdit(index)}
                                    className="bg-(--green-800) text-white text-xs px-2 py-1 rounded"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 w-full">
                                <span className="text-[0.9rem] font-semibold text-(--green-900)">
                                    {skill}
                                </span>

                                {/* ACTIONS */}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => startEdit(index)}
                                        className="text-xs font-bold uppercase tracking-wide text-(--green-600)"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => removeSkill(index)}
                                        className="text-xs font-bold uppercase tracking-wide text-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {skills.length === 0 && (
                    <p className="text-sm italic text-(--green-400)">
                        No skills added yet.
                    </p>
                )}
            </div>

            <div className="flex gap-3 mt-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder={`Add a ${isOffer ? "skill to offer" : "skill you need"}...`}
                    className="flex-1 bg-(--cream-100) border border-(--green-100) rounded-xl px-4 py-3 outline-none"
                />

                <button
                    onClick={addSkill}
                    className="px-6 rounded-xl text-white font-bold"
                    style={{ background: accentColor }}
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default SkillsSection;