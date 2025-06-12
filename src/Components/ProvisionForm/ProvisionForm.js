import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	MenuItem,
	Select,
	TextField,
	Typography,
	Alert,
	FormControl,
	Tooltip,
	IconButton,
	CircularProgress,
	Divider,
	FormControlLabel,
	Checkbox,
} from "@mui/material";
import PageHeader from "../PageHeader/PageHeader";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import _ from "lodash";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createCustomerUsersService, fetchCustomersService } from "../../Services/customerService";
import { useCustomTheme } from "../../Context/ThemeContext";
import FormField from "../FormField/FormField";
import AddressForm from "../AddressForm/AddressForm";
import { createEquipmentProvisionsService, fetchEquipmentsService } from "../../Services/equipmentService";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const ProvisionForm = ({
	formOpen,
	setFormOpen,
	fetchParentData,
	setParentData,
	showCustomer = false,
	showEquipment = false,
	createProvision = true,
	showStaticCustomer = false,
	showStaticEquipment = false,
	equipmentName = "",
	customerName = "",
	customerSites = [],
	selectedRow = null,
	isEditing = false,
}) => {
	const [formData, setFormData] = useState({
		customer: showStaticCustomer ? customerName : null,
		equipment: showStaticEquipment ? equipmentName : null,
		site: null,
		provisionedDate: moment(),
		serialNumber: "",
		status: "1",
	});
	const initialFormDataRef = useRef();
	const formTitle = "Add New Equipment Provision";
	const formSubTitle = "Fill out the following details to provision an equipment to customer";
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [showUrlField, setShowUrlField] = useState(false);
	const [showUploadBox, setShowUploadBox] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const { flexRow, flexCol } = useCustomTheme();
	const [formErrors, setFormErrors] = useState({});
	const [formError, setFormError] = useState(null);
	const [showNewCategoryField, setShowNewCategoryField] = useState(false);
	const [alert, setAlert] = useState("");
	const [customers, setCustomers] = useState([]);
	const [allCustomers, setAllCustomers] = useState([]);
	const [sites, setSites] = useState([]);
	const [equipments, setEquipments] = useState([]);

	const fetchEquipments = async () => {
		try {
			const response = await fetchEquipmentsService();
			if (response.status) {
				setFormError(null);
				const equipmentsData = response.data.map((equipment) => ({
					value: equipment.eq_id,
					label: equipment.equipment,
				}));
				setEquipments(equipmentsData);
				setFormLoading(false);
			} else {
				setFormError("Failed Fetching Customer Users");
				setEquipments([]);
				setFormLoading(false);
			}
		} catch (error) {
			setFormError("Failed Fetching Customer Users");
			setFormLoading(false);
			setEquipments([]);
		}
	};

	const fetchCustomers = async () => {
		try {
			setFormLoading(true);
			const response = await fetchCustomersService();
			if (response.status) {
				const customers = response.data.map((customer) => {
					return {
						value: customer.id,
						label: customer.name,
					};
				});

				setCustomers(customers);
				setAllCustomers(response.data);
				setFormLoading(false);
				console.log("Customers", response);
			}
		} catch (error) {
			console.log(error);
			setFormLoading(false);
		}
	};

	useEffect(() => {
		if (showCustomer) {
			fetchCustomers();
		}

		if (showEquipment) {
			fetchEquipments();
		}

		if (showStaticCustomer && customerSites) {
			const siteOpts = customerSites.map((site) => ({
				label: site.site_name,
				value: site.site_name,
			}));
			setSites(siteOpts);
			setFormData((prev) => ({ ...prev, customer: customerName }));
		}

		if (isEditing && selectedRow) {
			setFormData({
				customer: selectedRow.data.org_id,
				equipment: selectedRow.data.eq_id,
				site: null,
				provisionedDate: moment(),
				serialNumber: selectedRow.data.serial_number,
				status: selectedRow.data.status_id === 1 ? "1" : "0",
			});
		}
	}, []);

	useEffect(() => {
		if (!showStaticCustomer && formData.customer !== "") {
			const filteredCustomer = allCustomers.find((cus) => cus.id === parseInt(formData.customer));
			const cusSites = filteredCustomer?.org_sites?.map((site) => ({
				value: site.site_id,
				label: site.site_name,
			}));
			setSites(cusSites);
		}
	}, [formData.customer]);

	useEffect(() => {
		if (sites && sites.length > 0) {
			console.log("Sites: ", sites);
			if (isEditing && selectedRow) {
				console.log("Updating Site");
				setFormData((prev) => ({
					...prev,
					site: selectedRow.data.site_id,
				}));
			}
		}
	}, [sites]);

	useEffect(() => {
		if (formOpen) {
			initialFormDataRef.current = _.cloneDeep(formData);
		}
	}, [formOpen]);

	const handleFormChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		if (formErrors[name]) {
			setFormErrors((prev) => ({ ...prev, [name]: false }));
		}
	};

	const handleSubmit = async (addNew = false) => {
		const errors = {};
		if (!formData.customer) errors.customer = true;
		if (!formData.equipment) errors.equipment = true;
		if (!formData.site) errors.site = true;
		if (!formData.provisionedDate) errors.provisionedDate = true;
		if (!formData.serialNumber) errors.serialNumber = true;

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			setAlert("Please fill all required fields.");
			return;
		}

		let req_body = formData;

		setAlert("");
		setFormErrors({});
		setFormSubmitting(true);

		if (!createProvision) {
			console.log("Form submitted", req_body);
			const selectedEq = equipments.find((eq) => eq.value === req_body.equipment);
			const selectedSite = sites.find((site) => site.value === req_body.site);
			req_body = {
				...req_body,
				equipment_name: showStaticCustomer ? selectedEq.label : showStaticEquipment ? equipmentName : "",
				site_name: showStaticCustomer ? req_body.site : showStaticEquipment ? selectedSite.label : "",
			};
			let exists = false;
			setParentData((prev) => {
				const provisionExists =
					Array.isArray(prev.provisions) &&
					prev.provisions.some(
						(provision) =>
							provision.site_name === req_body.site_name &&
							provision.equipment === req_body.equipment &&
							provision.serialNumber === req_body.serialNumber
					);

				if (provisionExists) {
					exists = true;
					return prev; // Prevent adding duplicate
				}
				return {
					...prev,
					provisions: Array.isArray(prev.provisions) ? [...prev.provisions, req_body] : [req_body],
				};
			});

			if (!exists) {
				setAlert("");
				setFormErrors({});
				if (!addNew) {
					setFormOpen(false);
				}
				setFormData({
					customer: showStaticCustomer ? customerName : null,
					equipment: showStaticEquipment ? equipmentName : null,
					site: null,
					provisionedDate: moment(),
					serialNumber: "",
					internalNotes: "",
					status: "1",
				});
			} else {
				console.log("Provision already exists:", req_body.site_name);
				setFormErrors({ serialNumber: true });
				setAlert("Provision already exists with same Serial Number");
			}

			setFormSubmitting(false);
		} else {
			const response = await createEquipmentProvisionsService(req_body);
			console.log(response);
			if (response.status) {
				if (fetchParentData) {
					// console.log("Setting Parent Data", setParentData);
					// const provisionsData = response.data.map((prov) => ({
					// 	id: prov.id,
					// 	serial_number: prov.serial_number,
					// 	status: prov?.status_id || 0,
					// 	equipment_name: prov?.equipment?.equipment || "",
					// 	customer_name: prov?.organization?.name || "",
					// 	created: prov.createdAt,
					// 	updated: prov.updatedAt,
					// 	data: prov,
					// }));
					// setParentData((prev) => [...prev, ...provisionsData]);

					fetchParentData();
				}
				if (!addNew) {
					setFormOpen(false);
				}
				setFormData({
					customer: showStaticCustomer ? customerName : null,
					equipment: showStaticEquipment ? equipmentName : null,
					site: null,
					provisionedDate: moment(),
					serialNumber: "",
					internalNotes: "",
					status: "1",
				});
				setFormSubmitting(false);
			} else {
				setAlert(response.message);
				setFormLoading(false);
				setFormSubmitting(false);
			}
		}
	};

	const handleCloseForm = () => {
		const hasChanged = !_.isEqual(formData, initialFormDataRef.current);

		if (!hasChanged) {
			setFormOpen(false);
			setFormData({
				customer: showStaticCustomer ? customerName : null,
				equipment: showStaticEquipment ? equipmentName : null,
				site: null,
				provisionedDate: moment(),
				serialNumber: "",
			});
			return;
		}
		Swal.fire({
			icon: "warning",
			title: "Are you sure?",
			text: "You are attempting to close the Form! Any unsaved data will be lost.",
			showDenyButton: true,
			confirmButtonText: "Yes",
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				setFormOpen(false);
				setFormData({
					customer: showStaticCustomer ? customerName : null,
					equipment: showStaticEquipment ? equipmentName : null,
					site: null,
					provisionedDate: moment(),
					serialNumber: "",
					internalNotes: "",
					status: "1",
				});
			}
		});
	};

	if (formSubmitting || formLoading) {
		return (
			<Box
				p={2}
				width="50vw"
				sx={{ ...flexCol, justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
				<CircularProgress />
				{formSubmitting && (
					<Typography variant="h6" mt={2}>
						Creating New Equipment Provision
					</Typography>
				)}
			</Box>
		);
	}

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<Box p={2} sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
				<Box
					sx={{
						...flexRow,
						justifyContent: "space-between",
						width: "100%",
					}}>
					<PageHeader title={formTitle} subtitle={formSubTitle} />
					<Tooltip title="Close the Form">
						<IconButton size="small" onClick={handleCloseForm}>
							<CloseIcon />
						</IconButton>
					</Tooltip>
				</Box>

				{alert && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{alert}
					</Alert>
				)}

				<Box
					sx={{
						flexGrow: 1,
						display: "flex",
						flexDirection: "column",
						gap: 2,
						overflowY: "auto",
						px: 2,
						pt: 1,
					}}>
					{showCustomer && (
						<FormField
							type={"select"}
							label={"Customer"}
							name={"customer"}
							value={formData.customer}
							error={formErrors.customer}
							onChange={handleFormChange}
							showRequired
							options={customers}
						/>
					)}
					{showStaticCustomer && (
						<FormField
							type={"text"}
							label={"Customer"}
							showRequired={true}
							name="customer"
							value={formData.customer}
							onChange={handleFormChange}
							error={formErrors.customer}
							disabled={true}
						/>
					)}
					<FormField
						type={"select"}
						label={"Site"}
						name={"site"}
						value={formData.site}
						error={formErrors.site}
						onChange={handleFormChange}
						showRequired
						options={sites}
					/>

					{showEquipment && (
						<FormField
							type={"select"}
							label={"Equipment"}
							name={"equipment"}
							value={formData.equipment}
							error={formErrors.equipment}
							onChange={handleFormChange}
							showRequired
							options={equipments}
						/>
					)}

					{showStaticEquipment && (
						<FormField
							type={"text"}
							label={"Equipment"}
							showRequired={true}
							name="equipment"
							value={formData.equipment}
							onChange={handleFormChange}
							error={formErrors.equipment}
							disabled={true}
						/>
					)}

					<Divider flexItem sx={{ my: "10px" }} />

					<FormField
						type={"text"}
						label={"Serial Number"}
						showRequired={true}
						name="serialNumber"
						value={formData.serialNumber}
						onChange={handleFormChange}
						error={formErrors.serialNumber}
					/>

					<Box display="flex" alignItems="center">
						<Box width="200px" minWidth="200px">
							<Typography variant="body1" fontWeight={"bold"}>
								Provisioned Date <span style={{ color: "red" }}>*</span>
							</Typography>
						</Box>
						<DatePicker
							label="Provisioned Date"
							value={formData.provisionedDate}
							onChange={(newValue) => handleFormChange("provisionedDate", moment(newValue))}
							slotProps={{
								textField: {
									size: "small",
									error: formErrors?.provisionedDate,
								},
							}}
							sx={{ flex: 1, minWidth: 130 }}
						/>
					</Box>
					<FormField
						type="select"
						label="Status"
						name="status"
						value={formData.status}
						error={formErrors.status}
						onChange={handleFormChange}
						options={[
							{ label: "Active", value: "1" },
							{ label: "Inactive", value: "0" },
						]}
						showRequired={true}
					/>
					<Divider flexItem sx={{ my: "10px" }} />
					<FormField
						type={"textarea"}
						label={"Internal Notes"}
						name="internalNotes"
						value={formData.internalNotes}
						onChange={handleFormChange}
						error={formErrors.internalNotes}
					/>
				</Box>

				<Box display="flex" justifyContent="space-between" mt={2}>
					<Button variant="outlined" onClick={handleCloseForm}>
						Cancel
					</Button>
					<Box display="flex" gap={1}>
						<Button variant="contained" color="primary" onClick={() => handleSubmit(true)}>
							Save & New
						</Button>
						<Button variant="contained" color="primary" onClick={() => handleSubmit(false)}>
							Save
						</Button>
					</Box>
				</Box>
			</Box>
		</LocalizationProvider>
	);
};
export default ProvisionForm;
