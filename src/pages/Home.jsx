import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Skill Trade Network
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Exchange skills without money. Teach what you know. Learn what you need.
          Build real connections through peer-to-peer learning.
        </p>

        <div className="flex justify-center gap-4">
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
              >
                Get Started
              </button>

              <button
                onClick={() => navigate("/login")}
                className="bg-white border border-gray-300 px-6 py-3 rounded-xl shadow hover:bg-gray-50 transition"
              >
                Login
              </button>
            </>
          )}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Skill Exchange</h3>
            <p className="text-sm text-gray-600">
              Trade skills directly without money or intermediaries.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Real Connections</h3>
            <p className="text-sm text-gray-600">
              Build relationships through mutual learning.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Smart Matching</h3>
            <p className="text-sm text-gray-600">
              Find people who want what you offer and offer what you want.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;