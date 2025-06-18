import { handleRequest } from "../Utilities/requestHandler";

export const fetchTicketsService = (req_body) => handleRequest("post", "/tickets/list", req_body);

export const fetchTicketByIDService = (req_body) => handleRequest("post", "/tickets/by-id", req_body);

export const fetchTicketByNumberService = (req_body) => handleRequest("post", "/tickets/by-number", req_body);

export const createTicketsService = (req_body) => handleRequest("post", "/tickets/create", req_body);

export const postThreadService = (req_body) => handleRequest("post", "/tickets/threads/create", req_body);

