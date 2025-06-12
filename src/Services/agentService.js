import { handleRequest } from "../Utilities/requestHandler";

export const fetchAgentsService = () => handleRequest("get", "/staff/get-all-staff");
