import customHttp from "./customHTTP";

const loginService = async (data) => {
	try {
		const response = await customHttp.post("/auth/login", data);
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export default loginService;
