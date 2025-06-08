import customHttp from "../Utilities/customHTTP";

export const fetchDocumentsService = async () => {
	try {
		const response = await customHttp.get("/kb/get-all-docs");
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const fetchDocumentCategoriesService = async () => {
	try {
		const response = await customHttp.get("/kb/get-all-categories");
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const createDocumentService = async (formData) => {
	try {
		const response = await customHttp.post("/kb/create", formData);
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const createDocumentCategoriesService = async (formData) => {
	try {
		const response = await customHttp.post("/kb/create-category", formData);
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};
