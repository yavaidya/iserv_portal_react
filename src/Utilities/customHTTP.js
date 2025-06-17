import axios from "axios";
import { API_BASE_URL, API_KEY } from "../config";

// Create a custom axios instance
const customHttp = axios.create({
	baseURL: API_BASE_URL || "http://localhost:5000",
	headers: {
		"Content-Type": "application/json",
	},
});

customHttp.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token"); // fetch latest token here
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default customHttp;
