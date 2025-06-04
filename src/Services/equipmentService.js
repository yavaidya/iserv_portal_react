import customHttp from "./customHTTP";

export const fetchEquipmentsService = async () => {
	try {
		const response = await customHttp.get("/eq/get-all-eq");
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};
