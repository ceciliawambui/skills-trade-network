import { useAuth } from "../context/AuthContext";
const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <div className="p-4 flex justify-between">
            <h1>Skills Trade Network</h1>

            {user && (
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                >
                    Logout
                </button>
            )}
        </div>
    );
};

export default Navbar;