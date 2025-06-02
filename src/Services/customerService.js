import customHttp from "./customHTTP";

export const fetchCustomersService = async () => {
	try {
		const response = await customHttp.get("/customers_list.php");
		return response;
	} catch (error) {
		console.log(error);
		return error.response;
	}
};
