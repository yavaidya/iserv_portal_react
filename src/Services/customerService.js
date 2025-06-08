import customHttp from "../Utilities/customHTTP";

export const fetchCustomersService = async () => {
	try {
		const response = await customHttp.get("/org/get-all-org");
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const fetchCustomerUsersService = async () => {
	try {
		const response = await customHttp.get("/user/get-all-user");
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const createCustomerUsersService = async (formData) => {
	try {
		const response = await customHttp.post("/user/create", formData);
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};
