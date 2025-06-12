import { handleRequest } from "../Utilities/requestHandler";

export const getAllCountries = () => handleRequest("get", "/utility/countries");

export const getCountrySates = (country) => handleRequest("get", `/utility/countries/states/${country}`);

export const getSatesCities = (country, state) =>
	handleRequest("get", `/utility/countries/states/cities/${country}/${state}`);

export const getCountryPhoneCodes = () => handleRequest("get", `/utility/countries/phonecodes`);

export const getCountriesMaster = () => handleRequest("get", `/utility/countries/master`);
