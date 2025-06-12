import { handleRequest } from "../Utilities/requestHandler";

export const fetchEquipmentsService = () => handleRequest("get", "/equipments/list");

export const fetchEquipmentTypesService = () => handleRequest("get", "/equipments/types/list");

export const fetchEquipmentProvisionsService = () => handleRequest("get", "/equipments/provisions/list");

export const fetchEquipmentProvisionByIdService = (id) =>
	handleRequest("post", "/equipments/provisions/by-id", { prov_id: id });

export const fetchEquipmentByIdService = (id) => handleRequest("post", "/equipments/by-id", { eq_id: id });

export const createEquipmentsService = (formData) => handleRequest("post", "/equipments/create", formData);

export const createEquipmentProvisionsService = (formData) =>
	handleRequest("post", "/equipments/provisions/create", formData);
