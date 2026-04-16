import { useEffect, useState } from "react";
import { db } from "../../firebase.config";
import {
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ExchangeHistory = ({ userId }) => {
  const navigate = useNavigate();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!userId) return;

  const q = query(
    collection(db, "users", userId, "trades")
  );

  const unsub = onSnapshot(q, (snap) => {
    const data = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((t) => t.status === "completed")
      .sort((a, b) => {
        const aTime = a.updatedAt?.seconds || 0;
        const bTime = b.updatedAt?.seconds || 0;
        return bTime - aTime;
      });

    setTrades(data);
    setLoading(false);
  });

  return () => unsub();
}, [userId]);

  if (loading) {
    return (
      <div className="text-center py-16 text-(--green-400)">
        Loading history...
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="bg-white border border-dashed border-(--green-100) rounded-2xl p-12 text-center">
        <p className="text-(--green-700) font-(--font-display) text-lg mb-2">
          No completed trades yet
        </p>
        <p className="text-sm text-(--green-400)">
          Your finished exchanges will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trades.map((trade) => {
        const otherName = trade.otherUserName;

        return (
          <div
            key={trade.id}
            onClick={() => navigate(`/trade/${trade.id}`)}
            className="bg-white border border-(--green-100) rounded-2xl px-5 py-4 flex items-center justify-between hover:border-(--green-300) transition cursor-pointer"
          >
            <div>
              <p className="font-medium text-(--green-900)">
                {otherName || "Community member"}
              </p>

              <p className="text-sm text-(--green-500)">
                <span className="text-(--green-700) font-medium">
                  {trade.initiatorSkill}
                </span>

                <span className="mx-2 text-(--green-300)">
                  ⇄
                </span>

                <span className="text-amber-700 font-medium">
                  {trade.receiverSkill}
                </span>
              </p>
            </div>

            <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold">
              Completed
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ExchangeHistory;