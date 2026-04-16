import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProposeTrade from "./pages/ProposeTrade";
import TradeDetail from "./pages/TradeDetail";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/explore" element={<Explore />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/trade/propose/:userId" element={<ProtectedRoute><ProposeTrade /></ProtectedRoute>} />
        <Route path="/trade/:tradeId" element={<ProtectedRoute><TradeDetail /></ProtectedRoute>} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;