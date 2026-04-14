import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div
            style={{ background: "var(--cream-100)", fontFamily: "var(--font-body)" }}
        >
            <nav
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.25rem 2.5rem",
                    borderBottom: "1px solid var(--green-100)",
                    background: "var(--cream-100)",
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.35rem",
                        color: "var(--green-800)",
                        letterSpacing: "-0.01em",
                    }}
                >
                    Skilltrade
                </span>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                    {user ? (
                        <>
                            <button
                                onClick={() => navigate("/dashboard")}
                                style={{
                                    background: "var(--green-800)",
                                    color: "#fff",
                                    border: "none",
                                    padding: "0.55rem 1.25rem",
                                    borderRadius: "100px",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    fontFamily: "var(--font-body)",
                                }}
                            >
                                Dashboard
                            </button>

                            <button
                                onClick={logout}
                                style={{
                                    background: "var(--green-800)",
                                    color: "#fff",
                                    border: "none",
                                    padding: "0.55rem 1.25rem",
                                    borderRadius: "100px",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    fontFamily: "var(--font-body)",
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate("/login")}
                                style={{
                                    background: "transparent",
                                    color: "var(--green-800)",
                                    border: "1.5px solid var(--green-200)",
                                    padding: "0.55rem 1.25rem",
                                    borderRadius: "100px",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    fontFamily: "var(--font-body)",
                                }}
                            >
                                Log in
                            </button>
                            <button
                                onClick={() => navigate("/signup")}
                                style={{
                                    background: "var(--green-800)",
                                    color: "#fff",
                                    border: "none",
                                    padding: "0.55rem 1.25rem",
                                    borderRadius: "100px",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    fontFamily: "var(--font-body)",
                                }}
                            >
                                Get started
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;