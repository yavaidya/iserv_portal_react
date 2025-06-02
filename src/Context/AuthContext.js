import React, { createContext, useContext, useState, useEffect } from "react";
import loginService from "../Services/authService";
import { useNavigate } from "react-router-dom";

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userMode, setUserMode] = useState(null);
	const [userAdditionalData, setUserAdditionalData] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	// Load user from localStorage on mount
	useEffect(() => {
		const userRoleMode = localStorage.getItem("userMode");
		if (userRoleMode) {
			setUserMode(userRoleMode);
		}
		const storedUser = localStorage.getItem("authUser");
		if (storedUser) {
			const userDataAdd = localStorage.getItem("userAdditionalData");
			if (userDataAdd) {
				setUserAdditionalData(JSON.parse(userDataAdd));
			}
			setUser(JSON.parse(storedUser));
			setIsAuthenticated(true);
		}
		setLoading(false);
	}, []);

	// Save user to localStorage on change
	useEffect(() => {
		if (user) {
			localStorage.setItem("authUser", JSON.stringify(user));
		} else {
			localStorage.removeItem("authUser");
		}
	}, [user]);

	useEffect(() => {
		if (userMode) {
			localStorage.setItem("userMode", userMode);
		} else {
			localStorage.removeItem("userMode");
		}
	}, [userMode]);

	useEffect(() => {
		if (userAdditionalData) {
			localStorage.setItem("userAdditionalData", JSON.stringify(userAdditionalData));
		} else {
			localStorage.removeItem("userAdditionalData");
		}
	}, [userAdditionalData]);

	// Login function
	const authLogin = async (setLoading, setError, formData) => {
		try {
			const response = await loginService(formData);
			console.log(response);
			if (response.status) {
				if (
					(formData.serviceEngineer && response.role === "agent") ||
					(!formData.serviceEngineer && response.role === "user")
				) {
					if (response.role === "agent") {
						setUserAdditionalData(response.u_c);
					} else {
						setUserAdditionalData(null);
					}
					setUser(response.user);
					setUserMode(response.role);
					setTimeout(() => {
						setLoading(false);
						setIsAuthenticated(true);
						setLoading(false);
						navigate("/dashboard");
					}, 1000);
				} else {
					setError("Login failed. Check your email and password.");
					setLoading(false);
				}
			} else if (!response.status && response.message === "Invalid Credentials!") {
				setError("Login failed. Check your email and password.");
				setLoading(false);
			}
			return response;
		} catch (error) {
			console.log(error);
			setTimeout(() => {
				setLoading(false);
				setError("Opps! Something went wrong during login. Please try again.");
			}, 1000);
		}
	};

	// Logout function
	const logout = () => {
		setUser(null);
		setUserMode(null);
		setUserAdditionalData(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, authLogin, logout, isAuthenticated, loading, userMode, userAdditionalData }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
