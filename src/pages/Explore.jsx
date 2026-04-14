import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";

const Explore = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));

      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Explore Skills</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            {/* PROFILE */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold">{user.name || "Anonymous"}</h2>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* BIO */}
            {user.bio && (
              <p className="text-sm text-gray-600 mb-3">{user.bio}</p>
            )}

            {/* SKILLS OFFERED */}
            <div className="mb-3">
              <h3 className="text-sm font-semibold mb-1">Offers</h3>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered?.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* SKILLS WANTED */}
            <div>
              <h3 className="text-sm font-semibold mb-1">Wants</h3>
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted?.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Explore;