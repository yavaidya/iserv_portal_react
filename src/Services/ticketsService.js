import customHttp from "./customHTTP";

export const fetchTicketsService = async (req_body) => {
	try {
		const response = await customHttp.post("/user_tickets.php", req_body);
		return response;
	} catch (error) {
		console.log(error);
		return error.response;
	}
};
