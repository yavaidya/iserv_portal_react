import React, { useRef } from "react";
import { useEffect } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Divider,
	FormControl,
	MenuItem,
	Select,
	TextField,
	Typography,
	Card,
	CardContent,
	IconButton,
	Chip,
	Tooltip,
	CircularProgress,
} from "@mui/material";
import { useCustomTheme } from "../../Context/ThemeContext";
import FormField from "../FormField/FormField";
import { useState } from "react";
import LoadingWrapper from "../LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../ErrorAlertWrapper/ErrorAlertWrapper";
import { fetchCustomersService, fetchCustomerUsersService } from "../../Services/customerService";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import { useDropzone } from "react-dropzone";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Delete as DeleteIcon, AttachFile as AttachFileIcon } from "@mui/icons-material";
import SectionTitle from "../SectionTitle/SectionTitle";
import { fetchAgentsService } from "../../Services/agentService";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../PageHeader/PageHeader";
import CloseIcon from "@mui/icons-material/Close";
import _ from "lodash";
import FileDropZone from "../FileDropZone/FileDropZone";

const NewTicketFormV2 = ({ formOpen, setFormOpen, setParentData, fetchParentData }) => {
	const { setActiveTitle } = usePageTitle();
	const { flexRow, flexCol } = useCustomTheme();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [userOptions, setUserOptions] = useState([]);
	const [equipmentOptions, setEquipmentOptions] = useState([]);
	const [agentOptions, setAgentOptions] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const [allCustomers, setAllCustomers] = useState([]);
	const [alert, setAlert] = useState(null);
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const [formTitle, setFormTitle] = useState({
		title: `Create New Ticket`,
		subtitle: `Please fill out all the details to create a Ticket`,
	});
	const [formData, setFormData] = useState({
		customer: null,
		user: null,
		equipment: null,
		subject: "",
		description: "",
		ticket_notice: "all",
		priority: "normal",
		attachment: null,
		staff: null,
		sla: "",
		equipment: "",
		ticket_source: "web",
		department: "maintenance",
		service_type: "installation",
		due_date: moment().add(7, "days"),
	});
	const [formErrors, setFormErrors] = useState({});
	const [disabledAll, setDisabledAll] = useState(true);
	const initialFormDataRef = useRef();

	useEffect(() => {
		if (formOpen) {
			initialFormDataRef.current = _.cloneDeep(formData);
		}
	}, [formOpen]);

	useEffect(() => {
		setFormTitle({
			title: `Create New Ticket`,
			subtitle: `Please fill out all the details to create a Ticket`,
		});

		fetchCustomers();
		fetchCustomerUsers();
		fetchAgents();
	}, []);

	useEffect(() => {
		console.log("Updated: ", formData);
	}, [formData]);

	useEffect(() => {
		if (formData.user && formData.user !== "") {
			console.log("Selected User: ", formData.user);
			if (!formData.customer || formData.customer === "") {
				const selectedCustomer = userOptions.find((user) => user.value === formData.user)?.org_id;
				setFormData((prev) => ({ ...prev, customer: selectedCustomer }));
			}
		}
	}, [formData.user]);

	useEffect(() => {
		if (formData.customer && formData.customer !== "") {
			console.log("Selected Customer: ", formData.customer);
			const filteredUsers = userOptions.filter((user) => user.org_id === formData.customer);
			setUserOptions(filteredUsers);
			if (formData.user && formData.user !== "") {
				const selectedCustomer = userOptions.find((user) => user.value === formData.user)?.org_id;
				setDisabledAll(false);
				if (selectedCustomer !== formData.customer) {
					setFormData((prev) => ({ ...prev, user: null }));
					setDisabledAll(true);
				}
			}
		} else {
			setFormData((prev) => ({ ...prev, user: null }));
			fetchCustomerUsers();
		}
	}, [formData.customer]);

	useEffect(() => {
		if (formData.customer && formData.customer !== "" && formData.user && formData.user !== "") {
			const selectedCus = allCustomers.find((cus) => cus.id === formData.customer);
			const selectedCusEquipments = selectedCus?.org_equipments || [];
			if (selectedCusEquipments.length > 0) {
				const eqOptions = selectedCusEquipments.map((prov) => ({
					serial_number: prov.serial_number,
					label: prov.equipment.equipment,
					value: prov.eq_id,
				}));
				setEquipmentOptions(eqOptions);
			} else {
				setEquipmentOptions([]);
			}
		} else {
			setFormData((prev) => ({ ...prev, equipment: null }));
		}
	}, [formData.customer, formData.user]);

	const fetchCustomers = async () => {
		setLoading(true);
		try {
			const response = await fetchCustomersService();
			if (response.status) {
				console.log(response);
				setAllCustomers(response.data);
				setError(null);
				const customerUserCounts = response.data.map((customer) => ({
					value: customer.id,
					label: customer.name,
				}));
				console.log(customerUserCounts);
				setCustomerOptions(customerUserCounts);
				setLoading(false);
			} else {
				setError("Failed Fetching Customers");
				setCustomerOptions([]);
				setLoading(false);
			}
		} catch (error) {
			setError("Failed Fetching Customers");
			setLoading(false);
			setCustomerOptions([]);
		}
	};

	const fetchCustomerUsers = async () => {
		try {
			const response = await fetchCustomerUsersService();
			if (response.status) {
				console.log(response);
				setError(null);
				setAllUsers(response.data);
				const customerUserCounts = response.data.map((user) => ({
					org_id: user.org_id,
					customer: user.organization.name,
					email: user.emails[0].address,
					value: user.id,
					label: user.name,
				}));
				// Sort by customer name to prevent duplicate group headers
				const sortedUserOptions = customerUserCounts.sort((a, b) => {
					// First sort by customer name
					if (a.customer !== b.customer) {
						return a.customer.localeCompare(b.customer);
					}
					// Then sort by user name within the same customer
					return a.label.localeCompare(b.label);
				});
				setUserOptions(sortedUserOptions);
			} else {
				setError("Failed Fetching Customer Users");
				setUserOptions([]);
			}
		} catch (error) {
			setError("Failed Fetching Customer Users");
			setUserOptions([]);
		}
	};

	const fetchAgents = async () => {
		try {
			const response = await fetchAgentsService();
			if (response.status) {
				console.log(response);
				setError(null);
				const agentUserCounts = response.data.map((agent) => ({
					value: agent.staff_id,
					label: agent.name,
				}));
				console.log(agentUserCounts);
				setAgentOptions(agentUserCounts);
			} else {
				setError("Failed Fetching Agents");
				setAgentOptions([]);
			}
		} catch (error) {
			setError("Failed Fetching Agents");

			setAgentOptions([]);
		}
	};

	const handleEditorChange = ({ html, text, json }) => {
		setFormData((prev) => ({ ...prev, description: html }));
	};

	const handleDateChange = (name) => (newValue) => {
		handleFormChange({ target: { name, value: moment(newValue) } });
	};

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleCloseForm = () => {
		const hasChanged = !_.isEqual(formData, initialFormDataRef.current);

		if (!hasChanged) {
			setFormOpen(false);
			setFormData({
				customer: null,
				user: null,
				equipment: null,
				subject: "",
				description: "",
				ticket_notice: "all",
				priority: "normal",
				attachment: null,
				staff: null,
				sla: "",
				equipment: "",
				ticket_source: "web",
				department: "maintenance",
				service_type: "installation",
				due_date: moment().add(7, "days"),
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
					customer: null,
					user: null,
					equipment: null,
					subject: "",
					description: "",
					ticket_notice: "all",
					priority: "normal",
					attachment: null,
					staff: null,
					sla: "",
					equipment: "",
					ticket_source: "web",
					department: "maintenance",
					service_type: "installation",
					due_date: moment().add(7, "days"),
				});
			}
		});
	};

	const handleCancel = () => {
		Swal.fire({
			icon: "warning",
			title: "Are you sure?",
			text: "You are attempting to reset the Form!",
			showDenyButton: true,
			confirmButtonText: "Yes",
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				setAlert(null);
				setFormErrors({});
				setFormData({
					customer: null,
					user: null,
					equipment: null,
					subject: "",
					description: "",
					ticket_notice: "all",
					priority: "normal",
					attachment: null,
					staff: null,
					sla: "",
					equipment: "",
					ticket_source: "web",
					department: "maintenance",
					service_type: "installation",
					due_date: moment().add(7, "days"),
				});
			}
		});
	};

	const handleSubmit = async () => {
		const requiredFields = [
			"customer",
			"user",
			"equipment",
			"subject",
			"description",
			"priority",
			"department",
			"service_type",
			"due_date",
		];

		const errors = {};

		requiredFields.forEach((field) => {
			const value = formData[field];

			// Check for null, empty string, or invalid moment date
			if (value === null || value === "" || (moment.isMoment(value) && !value.isValid())) {
				errors[field] = true;
			}
		});

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			setAlert("Please fill all the required fields.");
			return;
		}

		// No errors
		setFormErrors({});
		setAlert(""); // clear previous alerts if any
		console.log("Form submitted:", formData);
		setFormSubmitting(true);
		// const response = await createTicket(req_body);
		// if (response.status) {
		if (fetchParentData) {
			await fetchParentData();
		}
		setFormOpen(false);
		setFormData({
			customer: null,
			user: null,
			equipment: null,
			subject: "",
			description: "",
			ticket_notice: "all",
			priority: "normal",
			attachment: null,
			staff: null,
			sla: "",
			equipment: "",
			ticket_source: "web",
			department: "maintenance",
			service_type: "installation",
			due_date: moment().add(7, "days"),
		});
		setTimeout(() => {
			setFormSubmitting(false);
		}, 1500);
		// } else {
		// 	setAlert(response.message);
		// 	setFormLoading(false);
		// 	setFormSubmitting(false);
		// }
	};

	// if (loading) {
	// 	return <LoadingWrapper minHeight={"300px"} />;
	// }

	// if (error && !loading) {
	// 	return <ErrorAlertWrapper minHeight={"300px"} error={error} />;
	// }

	if (formSubmitting || formLoading) {
		return (
			<Box
				p={2}
				width="50vw"
				sx={{ ...flexCol, justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
				<CircularProgress />
				{formSubmitting && (
					<Typography variant="h6" mt={2}>
						Creating New Ticket
					</Typography>
				)}
			</Box>
		);
	}

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<Box p={2} px={4} width={"100%"} height={"100%"} sx={{ display: "flex", flexDirection: "column" }}>
				<Box
					sx={{
						...flexRow,
						justifyContent: "space-between",
						width: "100%",
					}}>
					<PageHeader title={formTitle.title} subtitle={formTitle.subtitle} />
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
						py: 1,
					}}>
					<FormField
						type="autocomplete"
						label="Customer"
						name="customer"
						value={formData.customer}
						error={formErrors.customer}
						onChange={handleFormChange}
						options={customerOptions}
						showRequired={true}
					/>
					<Box display="flex" alignItems="center">
						<Box width="200px" minWidth="200px">
							<Typography variant="body1" fontWeight={"bold"}>
								User <span style={{ color: "red" }}>*</span>
							</Typography>
						</Box>

						<Autocomplete
							options={userOptions}
							getOptionLabel={(option) => `${option.label} - ${option.email}`}
							renderOption={(props, option) => (
								<Box component="li" {...props}>
									<Box>
										<Typography variant="body1" sx={{ fontWeight: 500 }}>
											{option.label}
										</Typography>
										{option.email && (
											<Typography variant="body2" color="text.secondary">
												{option.email}
											</Typography>
										)}
									</Box>
								</Box>
							)}
							isOptionEqualToValue={(option, value) => option.value === value.value}
							// Add groupBy prop to group by customer
							groupBy={(option) => option.customer}
							value={userOptions.find((opt) => opt.value === formData.user) || null}
							onChange={(event, newValue) => {
								handleFormChange({
									target: {
										name: "user",
										value: newValue ? newValue.value : "",
									},
								});
							}}
							sx={{ width: "100%" }}
							// Optional: Custom group header rendering
							renderGroup={(params) => (
								<li key={params.key}>
									<Typography
										variant="body1"
										sx={{
											fontWeight: "bold",
											padding: "4px 10px",
											backgroundColor: "#f5f5f5",
											borderBottom: "1px solid #e0e0e0",
											color: "#666",
										}}>
										{params.group}
									</Typography>
									<ul style={{ padding: 0 }}>{params.children}</ul>
								</li>
							)}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Select User"
									label={"Select User"}
									error={formErrors.user}
									size="small"
									sx={{ width: "100%" }}
								/>
							)}
						/>
					</Box>
					<FormField
						type="autocomplete"
						label="Equipment"
						name="equipment"
						value={formData.equipment}
						error={formErrors.equipment}
						onChange={handleFormChange}
						options={equipmentOptions}
						showRequired={true}
					/>
					<Divider flexItem />
					<Box display="flex" alignItems="center">
						<Box width="200px" minWidth="200px">
							<Typography variant="body1" fontWeight={"bold"}>
								Due Date <span style={{ color: "red" }}>*</span>
							</Typography>
						</Box>

						<DatePicker
							value={formData.due_date}
							onChange={handleDateChange("due_date")}
							slotProps={{
								textField: {
									size: "small",
									error: formErrors?.due_date,
								},
							}}
							sx={{ flex: 1, minWidth: 130, width: "100%" }}
						/>
					</Box>

					<FormField
						type="autocomplete"
						label="Service Engineer / Team"
						name="staff"
						value={formData.staff}
						error={formErrors.staff}
						onChange={handleFormChange}
						options={agentOptions}
						showRequired={false}
					/>

					<FormField
						type="select"
						label="Department"
						name="department"
						value={formData.department}
						error={formErrors.department}
						onChange={handleFormChange}
						options={[
							{ label: "Maintenance", value: "maintenance" },
							{ label: "Service", value: "service" },
							{ label: "Support", value: "support" },
						]}
					/>
					<Divider flexItem />
					<FormField
						type="select"
						label="Priority"
						name="priority"
						value={formData.priority}
						error={formErrors.priority}
						onChange={handleFormChange}
						options={[
							{ label: "Low", value: "low" },
							{ label: "Normal", value: "normal" },
							{ label: "High", value: "high" },
							{ label: "Emergency", value: "emergency" },
						]}
					/>
					<FormField
						type="select"
						label="Service Type"
						name="service_type"
						value={formData.service_type}
						error={formErrors.service_type}
						onChange={handleFormChange}
						options={[
							{ label: "Installation", value: "installation" },
							{ label: "Question", value: "question" },
							{ label: "Request", value: "request" },
						]}
						showRequired={true}
					/>
					<Divider flexItem />
					<FormField
						type="text"
						label="Subject"
						name="subject"
						value={formData.subject}
						error={formErrors.subject}
						onChange={handleFormChange}
						showRequired={true}
					/>
					<Box display="flex" alignItems="flex-start">
						<Box width="200px" minWidth="200px">
							<Typography fontWeight="bold">
								Description: <span style={{ color: "red" }}>*</span>
							</Typography>
						</Box>
						<Box sx={{ width: "100%" }}>
							<RichTextEditor value={formData.description} onChange={handleEditorChange} />
							{formErrors.description && (
								<Typography color="error" variant="body1" fontSize="12px" mt={1}>
									Description is required
								</Typography>
							)}
						</Box>
					</Box>
					<Box display="flex" alignItems="flex-start">
						<Box width="200px" minWidth="200px">
							<Typography fontWeight="bold">Attachment:</Typography>
						</Box>
						<Box sx={{ width: "100%" }}>
							<FileDropZone setParentData={setFormData} />
						</Box>
					</Box>
				</Box>

				<Box display="flex" justifyContent="space-between" alignItems={"align"} mt={4}>
					<Button variant="outlined" color="primary" onClick={() => handleCloseForm()}>
						Cancel
					</Button>
					<Box display="flex" gap={1}>
						<Button variant="outlined" color="primary" onClick={() => handleCancel()}>
							Reset
						</Button>
						<Button variant="contained" color="primary" onClick={() => handleSubmit()}>
							Create Ticket
						</Button>
					</Box>
				</Box>
			</Box>
		</LocalizationProvider>
	);
};

export default NewTicketFormV2;
