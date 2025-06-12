import { handleRequest } from "../Utilities/requestHandler";

export const fetchTicketsService = (req_body) => handleRequest("post", "/tickets/get-all-tickets", req_body);

export const createTicketsService = (req_body) => handleRequest("post", "/tickets/create", req_body);
