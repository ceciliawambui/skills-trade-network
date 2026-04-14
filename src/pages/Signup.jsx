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
        <div
            style={{
                minHeight: "100vh",
                background: "var(--cream-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                fontFamily: "var(--font-body)",
            }}
        >
            <div style={{ width: "100%", maxWidth: "420px" }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <a
                        href="/"
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.5rem",
                            color: "var(--green-800)",
                            textDecoration: "none",
                        }}
                    >
                        Skilltrade
                    </a>
                </div>

                <div
                    style={{
                        background: "#fff",
                        border: "1px solid var(--green-100)",
                        borderRadius: "24px",
                        padding: "2.5rem",
                    }}
                >
                    <h1
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.75rem",
                            color: "var(--green-950)",
                            marginBottom: "0.4rem",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Create your account
                    </h1>
                    <p
                        style={{
                            fontSize: "0.9rem",
                            color: "var(--green-500)",
                            marginBottom: "2rem",
                            fontWeight: 300,
                        }}
                    >
                        Join thousands of professionals trading skills.
                    </p>

                    {error && (
                        <div
                            style={{
                                background: "#fef2f2",
                                border: "1px solid #fecaca",
                                borderRadius: "10px",
                                padding: "0.75rem 1rem",
                                fontSize: "0.875rem",
                                color: "#b91c1c",
                                marginBottom: "1.25rem",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup}>
                        <div style={{ marginBottom: "1rem" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "0.82rem",
                                    fontWeight: 500,
                                    color: "var(--green-800)",
                                    marginBottom: "0.4rem",
                                    letterSpacing: "0.01em",
                                }}
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "0.82rem",
                                    fontWeight: 500,
                                    color: "var(--green-800)",
                                    marginBottom: "0.4rem",
                                }}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                background: loading ? "var(--green-400)" : "var(--green-800)",
                                color: "#fff",
                                border: "none",
                                padding: "0.875rem",
                                borderRadius: "100px",
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "var(--font-body)",
                                transition: "background 0.2s",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>
                </div>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "1.5rem",
                        fontSize: "0.875rem",
                        color: "var(--green-500)",
                    }}
                >
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        style={{
                            color: "var(--green-800)",
                            fontWeight: 500,
                            textDecoration: "none",
                            borderBottom: "1px solid var(--green-200)",
                        }}
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1.5px solid var(--green-100)",
    borderRadius: "12px",
    fontSize: "0.9rem",
    color: "var(--green-950)",
    background: "var(--cream-100)",
    fontFamily: "var(--font-body)",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
};

export default Signup;