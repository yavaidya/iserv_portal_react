import axios from "axios";
import { API_BASE_URL, API_KEY } from "../config";
console.log("API Key: ", API_KEY);
// Create a custom axios instance
const customHttp = axios.create({
	baseURL: API_BASE_URL || "http://localhost:5000",
	headers: {
		"Content-Type": "application/json",
	},
});

console.log("Base API URL: ", API_BASE_URL);

// Intercept request to add authorization token dynamically
customHttp.interceptors.request.use(
	(config) => {
		const token = API_KEY; // Assuming the token is stored in localStorage
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default customHttp;
