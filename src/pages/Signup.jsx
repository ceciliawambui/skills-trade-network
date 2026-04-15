import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase.config";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                skillsOffered: [],
                skillsWanted: [],
                createdAt: new Date(),
            });

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.code === "auth/email-already-in-use"
                    ? "An account with this email already exists."
                    : err.code === "auth/weak-password"
                    ? "Password must be at least 6 characters."
                    : "Something went wrong. Please try again."
            );
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-(--cream-100) font-(--font-body)">
            <div className="w-full max-w-md">
                <div className="bg-white border border-(--green-100) rounded-[28px] px-6 py-10 sm:px-10 shadow-[0_10px_30px_rgba(20,45,34,0.05)]">

                    <div className="text-center mb-8">
                        <Link
                            to="/"
                            className="text-[1.75rem] tracking-[-0.03em] text-(--green-800) font-(--font-display)"
                        >
                            Skilltrade
                        </Link>
                    </div>

                    <h1 className="text-[1.75rem] text-center mb-1 tracking-[-0.02em] text-(--green-950) font-(--font-display)">
                        Create account
                    </h1>

                    <p className="text-center text-sm mb-10 text-(--green-500) font-light">
                        Join the community and start trading skills.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">

                        <div>
                            <label className="block text-[0.82rem] font-semibold text-(--green-800) mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-[14px] border-[1.5px] border-(--green-100) bg-(--cream-100) text-[0.95rem] text-(--green-950) outline-none focus:border-(--green-400) transition"
                            />
                        </div>

                        <div>
                            <label className="block text-[0.82rem] font-semibold text-(--green-800) mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-[14px] border-[1.5px] border-(--green-100) bg-(--cream-100) text-[0.95rem] text-(--green-950) outline-none focus:border-(--green-400) transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-full text-white text-base font-medium transition 
                                ${loading 
                                    ? "bg-(--green-400) cursor-not-allowed" 
                                    : "bg-(--green-800) hover:bg-(--green-700)"
                                }`}
                        >
                            {loading ? "Creating account..." : "Get started"}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-(--green-500)">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-(--green-800) font-semibold"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;