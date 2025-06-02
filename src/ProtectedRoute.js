import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, loading } = useAuth();

	// console.log("Auth Done: ", isAuthenticated);

	if (loading) return null; // or show a loading spinner

	if (!isAuthenticated) {
		console.log("Navigating");
		return <Navigate to="/login" replace />;
	}

	return children ? children : <Outlet />;
};

export default ProtectedRoute;
