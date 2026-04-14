import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Repeat, Users, Sparkles } from "lucide-react";

const features = [
  {
    icon: Repeat,
    title: "Skill Exchange",
    desc: "Trade expertise directly — no money, no middlemen. Just two people making each other better.",
  },
  {
    icon: Users,
    title: "Real Connections",
    desc: "Build lasting professional relationships through the act of mutual learning.",
  },
  {
    icon: Sparkles,
    title: "Smart Matching",
    desc: "We surface people who want exactly what you offer, and offer exactly what you need.",
  },
];

const section = {
  width: "100%",
  padding: "0 4rem",
};

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--cream-100)", fontFamily: "var(--font-body)" }}
    >
      <section style={{ ...section, paddingTop: "6rem", paddingBottom: "4rem" }}>
        <div style={{ ...container, textAlign: "center" }}>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--green-100)",
              color: "var(--green-700)",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0.35rem 0.9rem",
              borderRadius: "100px",
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--green-500)",
              }}
            />
            Community-powered learning
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 6vw, 4rem)",
              lineHeight: 1.12,
              color: "var(--green-950)",
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Teach what you know.
            <br />
            <em style={{ color: "var(--green-600)" }}>
              Learn what you need.
            </em>
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--green-700)",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "0 auto 2.5rem",
              fontWeight: 300,
            }}
          >
            Skilltrade connects professionals through skill exchange. No money,
            no hierarchy. Just people making each other better.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate(user ? "/dashboard" : "/signup")}
              style={{
                background: "var(--green-800)",
                color: "#fff",
                border: "none",
                padding: "0.85rem 2rem",
                borderRadius: "100px",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {user ? "Go to dashboard" : "Join the community"}
            </button>

            {!user && (
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "transparent",
                  color: "var(--green-800)",
                  border: "1.5px solid var(--green-200)",
                  padding: "0.85rem 2rem",
                  borderRadius: "100px",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </section>

      <section style={{ ...section, marginBottom: "5rem" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1px",
              background: "var(--green-100)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {[
              { num: "2,400+", label: "Skills listed" },
              { num: "840+", label: "Trades completed" },
              { num: "94%", label: "Match satisfaction" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "var(--cream-100)",
                  padding: "1.5rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    color: "var(--green-800)",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--green-500)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...section, marginBottom: "6rem" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {features.map((f) => {
              const Icon = f.icon;

              return (
                <div
                  key={f.title}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--green-100)",
                    borderRadius: "20px",
                    padding: "2rem 1.75rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      background: "var(--green-50)",
                      border: "1px solid var(--green-100)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                      color: "var(--green-700)",
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.15rem",
                      color: "var(--green-900)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {f.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--green-600)",
                      lineHeight: 1.65,
                      fontWeight: 300,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {!user && (
        <section style={{ ...section, marginBottom: "6rem" }}>
          <div style={container}>
            <div
              style={{
                background: "var(--green-900)",
                borderRadius: "24px",
                padding: "3.5rem 3rem",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  color: "var(--cream-100)",
                  marginBottom: "0.75rem",
                }}
              >
                Ready to start trading?
              </h2>

              <p
                style={{
                  color: "var(--green-200)",
                  fontSize: "0.95rem",
                  marginBottom: "2rem",
                  fontWeight: 300,
                }}
              >
                Join a community of professionals learning from each other.
              </p>

              <button
                onClick={() => navigate("/signup")}
                style={{
                  background: "var(--amber-400)",
                  color: "var(--green-950)",
                  border: "none",
                  padding: "0.85rem 2rem",
                  borderRadius: "100px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Create your profile
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;