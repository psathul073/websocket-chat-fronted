import { Navigate } from "react-router";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {

        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsub();
    }, []);


    if (loading) {
        return (
            <div id="loader-container">
              <p> <span className="loader"></span> Loading...</p>  
            </div>
        )
    }

    if (!user) return <Navigate to="/signin" replace />;

    return children;
};

export default PrivateRoute;
