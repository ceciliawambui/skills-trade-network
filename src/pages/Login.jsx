import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.config";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch {
      setError("Incorrect email or password.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-(--cream-100) font-(--font-body)">
      <div className="w-full max-w-md">
        <div className="bg-white border border-(--green-100) rounded-[28px] px-6 py-10 sm:px-10 shadow-[0_10px_30px_rgba(20,45,34,0.05)]">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="text-[1.75rem] tracking-[-0.03em] text-(--green-800) font-(--font-display)"
            >
              Skilltrade
            </Link>
          </div>

          {/* Heading */}
          <h1 className="text-center text-[1.75rem] mb-1 tracking-[-0.02em] text-(--green-950) font-(--font-display)">
            Welcome back
          </h1>

          <p className="text-center text-sm mb-10 text-(--green-500) font-light">
            Sign in to your account to continue trading.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-[0.82rem] font-semibold text-(--green-800) mb-2">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-[14px] border-[1.5px] border-(--green-100) bg-(--cream-100) text-[0.95rem] text-(--green-950) outline-none focus:border-(--green-400) transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-full text-white text-base font-medium transition
                ${
                  loading
                    ? "bg-(--green-400) cursor-not-allowed"
                    : "bg-(--green-800) hover:bg-(--green-700)"
                }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-8 text-sm text-(--green-500)">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-(--green-800) font-semibold"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;