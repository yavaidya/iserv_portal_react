import customHttp from "../Utilities/customHTTP";

export const getAllCountries = async () => {
	try {
		const response = await customHttp.get("/utility/countries");
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const getCountrySates = async (country) => {
	try {
		const response = await customHttp.get(`/utility/countries/states/${country}`);
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const getSatesCities = async (country, state) => {
	try {
		const response = await customHttp.get(`/utility/countries/states/cities/${country}/${state}`);
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const getCountryPhoneCodes = async (country, state) => {
	try {
		const response = await customHttp.get(`/utility/countries/phonecodes`);
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const getCountriesMaster = async () => {
	try {
		const response = await customHttp.get(`/utility/countries/master`);
		return response.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};
