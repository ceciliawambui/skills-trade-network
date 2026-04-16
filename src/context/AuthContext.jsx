/**
 * The Global Authentication Provider.
 * This component handles the connection between Firebase Auth and the React UI.
 * It manages the "Session State" so that any component in the app can instantly
 * check if a user is logged in, and access their UID, Email, or Profile Picture.
 */

import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase.config";

// 1. Initialize the Context object (The "Data Bus")
const AuthContext = createContext();

/**
 * AuthProvider
 * This component wraps the entire <App /> in main.jsx.
 * It acts as a "Broadcaster," sending user data down to all child components.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);    // Holds the authenticated user object
    const [loading, setLoading] = useState(true); // Prevents app flickering during session check

    /**
     * Effect: Firebase Auth Listener
     * We use onAuthStateChanged because authentication is "Asynchronous."
     * It takes time for the browser to check cookies/tokens with Firebase servers.
     */
    useEffect(() => {
        // onAuthStateChanged returns an 'unsubscribe' function to clean up the listener
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth State Changed: ", currentUser?.email || "No User");
            setUser(currentUser); 
            setLoading(false); // Once Firebase responds, we stop the loading state
        });

        // Cleanup: Ensures we don't have multiple listeners running if the app re-renders
        return unsubscribe;
    }, []);

    /**
     * logout function
     * A centralized helper to end the session. 
     * Because this is in the Provider, we can call 'logout()' from any page.
     */
    const logout = () => {
        return signOut(auth);
    }

    // This object contains everything we want to "Teleport" to other components
    const value = {
        user,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {/* LOGIC: Only render the children (the app) if loading is false.
                This ensures that components like 'Dashboard' don't try to access
                'user.uid' before Firebase has finished verifying the user.
            */}
            {!loading && children}
        </AuthContext.Provider>
    )
}

/**
 * Custom Hook: useAuth
 * Instead of components importing 'useContext' 
 * and 'AuthContext' separately, they just call 'useAuth()'.
 * * @example
 * const { user, logout } = useAuth();
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext)
};