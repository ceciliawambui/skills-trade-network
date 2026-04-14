import { useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useAuth } from "../context/AuthContext";

const SkillsSection = ({
    title,
    skills,
    type,
    setSkills,
    color = "blue",
}) => {
    const { user } = useAuth();
    const [input, setInput] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState("");

    const ref = doc(db, "users", user.uid);

    const handleAdd = async () => {
        const value = input.trim();
        if (!value || skills.includes(value)) return;

        await updateDoc(ref, {
            [type]: arrayUnion(value),
        });

        setSkills([...skills, value]);
        setInput("");
    };
    const handleRemove = async (skill) => {
        await updateDoc(ref, {
            [type]: arrayRemove(skill),
        });

        setSkills(skills.filter((s) => s !== skill));
    };

    const startEdit = (index, value) => {
        setEditingIndex(index);
        setEditingValue(value);
    };

    const saveEdit = async (oldValue) => {
        const newValue = editingValue.trim();
        if (!newValue) return;

        await updateDoc(ref, {
            [type]: arrayRemove(oldValue),
        });

        await updateDoc(ref, {
            [type]: arrayUnion(newValue),
        });

        const updated = [...skills];
        updated[editingIndex] = newValue;

        setSkills(updated);
        setEditingIndex(null);
        setEditingValue("");
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>

            <div className="flex gap-2 mb-4">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a skill..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${color}-400"
                />
                <button
                    onClick={handleAdd}
                    className={`bg-${color}-600 text-white px-4 py-2 rounded-lg hover:bg-${color}-700 transition`}
                >
                    Add
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm group"
                    >
                        {editingIndex === index ? (
                            <>
                                <input
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    className="border px-2 py-1 rounded"
                                />
                                <button onClick={() => saveEdit(skill)}>✔</button>
                            </>
                        ) : (
                            <>
                                <span>{skill}</span>

                                <div className="hidden group-hover:flex gap-1">
                                    <button
                                        onClick={() => startEdit(index, skill)}
                                        className="text-blue-500 text-xs"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleRemove(skill)}
                                        className="text-red-500 text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsSection;