import { handleRequest } from "../Utilities/requestHandler";

// Customers (Organizations)
export const fetchCustomersService = () => handleRequest("get", "/organizations/list");
export const fetchCustomerByIdService = (id) => handleRequest("post", "/organizations/by-id", { org_id: id });
export const createCustomerService = (formData) => handleRequest("post", "/organizations/create", formData);
export const deleteCustomersService = (ids) => handleRequest("post", "/organizations/delete", { org_ids: ids });

// Customer Users
export const fetchCustomerUsersService = () => handleRequest("get", "/users/list");
export const getCustomerUserByIdService = (id) => handleRequest("post", "/users/by-id", { user_id: id });
export const getCustomerUserByOrgIdService = (id) => handleRequest("post", "/users/by-org-id", { org_id: id });
export const createCustomerUsersService = (formData) => handleRequest("post", "/users/create", formData);
export const deleteCustomerUsersService = (ids) => handleRequest("post", "/users/delete", { user_ids: ids });

// Other User Actions
export const changeUserPasswordService = (data) => handleRequest("post", "/users/change-password", data);
export const updateUserPreferencesService = (data) => handleRequest("post", "/users/update-preferences", data);
export const updateUserEmailsService = (data) => handleRequest("post", "/users/update-emails", data);
export const changeDefaultEmailService = (data) => handleRequest("post", "/users/change-default-email", data);
