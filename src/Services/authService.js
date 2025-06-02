import customHttp from "./customHTTP";

const loginService = async (data) => {
	try {
		const response = await customHttp.post("/dual_login.php", data);
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response;
	}
};

export default loginService;
