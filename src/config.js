const isSslEnabled = process.env.REACT_APP_SSL_ENABLED === "true"; // Check if SSL is enabled

// URLs based on SSL setting
const API_BASE_URL = isSslEnabled ? process.env.REACT_APP_API_BASE_URL_HTTPS : process.env.REACT_APP_API_BASE_URL_HTTP;

const API_KEY = process.env.REACT_APP_API_KEY;

const ASSETS_BASE_URL = isSslEnabled
	? process.env.REACT_APP_ASSETS_BASE_URL_HTTPS
	: process.env.REACT_APP_ASSETS_BASE_URL_HTTP;

const SERVER_BASE_URL = isSslEnabled
	? process.env.REACT_APP_SERVER_BASE_URL_HTTPS
	: process.env.REACT_APP_SERVER_BASE_URL_HTTP;

export { API_BASE_URL, ASSETS_BASE_URL, SERVER_BASE_URL, API_KEY };
