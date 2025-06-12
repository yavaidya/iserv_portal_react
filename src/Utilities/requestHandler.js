import customHttp from "./customHTTP";

export const handleRequest = async (method, url, data = null) => {
	try {
		const response = await customHttp[method](url, data);
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response?.data || { error: "Unknown error" };
	}
};
