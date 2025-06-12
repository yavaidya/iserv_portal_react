import { handleRequest } from "../Utilities/requestHandler";

// Documents
export const fetchDocumentsService = () => handleRequest("get", "/knowledgebase/documents/list");
export const getDocumentByIdService = (data) => handleRequest("post", "/knowledgebase/documents/by-id", data);
export const createDocumentService = (formData) => handleRequest("post", "/knowledgebase/documents/create", formData);

// Categories
export const fetchDocumentCategoriesService = () => handleRequest("get", "/knowledgebase/categories/list");
export const getCategoryByIdService = (data) => handleRequest("post", "/knowledgebase/categories/by-id", data);
export const createDocumentCategoriesService = (formData) =>
	handleRequest("post", "/knowledgebase/categories/create", formData);
