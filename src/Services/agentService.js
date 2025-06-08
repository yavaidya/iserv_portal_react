import customHttp from "../Utilities/customHTTP";

export const fetchAgentsService = async () => {
	try {
		const response = await customHttp.get("/staff/get-all-staff");
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};
