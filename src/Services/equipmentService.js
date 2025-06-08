import customHttp from "../Utilities/customHTTP";

export const fetchEquipmentsService = async () => {
	try {
		const response = await customHttp.get("/eq/get-all-eq");
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const fetchEquipmentByIdService = async (id) => {
	try {
		const response = await customHttp.post("/eq/get-eq-by-id", { eq_id: id });
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const createEquipmentsService = async (formData) => {
	try {
		const response = await customHttp.post("/eq/create", { data: formData });
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};
