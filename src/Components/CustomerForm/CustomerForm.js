import React from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import { useState } from "react";
import { useEffect } from "react";
import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Divider,
	Drawer,
	FormControl,
	IconButton,
	MenuItem,
	Paper,
	Select,
	Step,
	StepLabel,
	Stepper,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../PageHeader/PageHeader";
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { useRef } from "react";
import _ from "lodash";
import LoadingWrapper from "../LoadingWrapper/LoadingWrapper";
import CustomerUserForm from "../CustomerUserForm/CustomerUserForm";
import FormField from "../FormField/FormField";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { fetchEquipmentsService } from "../../Services/equipmentService";
import CustomerUserSelectionForm from "../CustomerUserSelectionForm/CustomerUserSelectionForm";
import UserFormCard from "../UserFormCard/UserFormCard";
import { fetchAgentsService } from "../../Services/agentService";
import AddressForm from "../AddressForm/AddressForm";
import CustomerSiteForm from "../CustomerSiteForm/CustomerSiteForm";
import SiteFormCard from "../SiteFormCard/SiteFormCard";
import ProvisionForm from "../ProvisionForm/ProvisionForm";
import ProvisionFormCard from "../ProvisionFormCard/ProvisionFormCard";
import { createCustomerService } from "../../Services/customerService";

const customersList = [
	{ id: 1, label: "Acme Corp" },
	{ id: 2, label: "Globex Inc" },
	{ id: 3, label: "Umbrella Industries" },
	{ id: 4, label: "Wayne Enterprises" },
];

const sitesList = [
	{ id: 101, label: "Acme - New York", customerId: 1 },
	{ id: 102, label: "Acme - Los Angeles", customerId: 1 },
	{ id: 201, label: "Globex - London", customerId: 2 },
	{ id: 301, label: "Umbrella - Raccoon City", customerId: 3 },
	{ id: 401, label: "Wayne - Gotham", customerId: 4 },
];

const defaultProvision = {
	equipment: null,
	site: null,
	provisionedDate: moment(),
	serialNumber: "",
};

const CustomerForm = ({
	drawerForm = true,
	setDrawerForm,
	formOpen,
	setFormOpen,
	formData,
	setFormData,
	setParentData,
	fetchParentData,
	activeStep,
	setActiveStep,
	isEditing = false,
	selectedCusId = null,
}) => {
	const steps = [
		{ label: "Customer Details", description: "Enter basic customer details", required: true },
		{ label: "Customer Sites", description: "Add Sites for this customers", required: true },
		{ label: "Customer Users", description: "Add / Provision users to customer", required: false },
		{ label: "Equipment Provisioning", description: "Provision equipments to this customer", required: false },
	];
	const formTitle = isEditing ? `Editing Customer: ${formData.equipmentName}` : "Add New Customer";
	const formSubTitle = isEditing
		? "Please fill out the following to update customer"
		: "Please fill out the following to add a new customer";

	const step0Ref = useRef(null);
	const initialFormDataRef = useRef();
	const { flexCol, flexRow } = useCustomTheme();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [provisionErrors, setProvisionErrors] = useState([]);
	const [userFormOpen, setUserFormOpen] = useState(false);
	const [siteFormOpen, setSiteFormOpen] = useState(false);
	const [provisionFormOpen, setProvisionFormOpen] = useState(false);
	const [users, setUsers] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectExisting, setSelectExisting] = useState(false);
	const [equipments, setEquipments] = useState([]);
	const [formErrors, setFormErrors] = useState({
		customer_name: false,
		customer_address: false,
		phone: false,
		website: false,
		status: false,
	});
	const [siteForms, setSiteForms] = useState([]);
	const [siteErrors, setSiteErrors] = useState([]);
	const [agents, setAgents] = useState([]);
	// Prefill Home Location site when entering step 2
	useEffect(() => {
		if (activeStep === 1 && formData.address && formData.address.trim() !== "" && formData.sites.length <= 0) {
			const defaultSite = {
				site_name: "-- Default --",
				street1: formData.street1 || "",
				street2: formData.street2 || "",
				city: formData.city || "",
				state: formData.state || "",
				country: formData.country || "",
				zip: formData.zip || "",
				address: formData.address || "",
				isDefault: true,
			};
			setFormData((prev) => ({
				...prev,
				sites: [defaultSite],
			}));
			setSiteErrors([{}]);
		}
	}, [activeStep, formData.address]);

	useEffect(() => {
		setLoading(true);
		fetchAgents();
		fetchEquipments();
	}, []);

	useEffect(() => {
		console.log("Updated: ", formData);
	}, [formData]);

	const fetchEquipments = async () => {
		try {
			const response = await fetchEquipmentsService();
			if (response.status) {
				setError(null);
				const equipmentsData = response.data.map((equipment) => ({
					id: equipment.eq_id,
					name: equipment.equipment,
				}));
				setEquipments(equipmentsData);
				setLoading(false);
			} else {
				setError("Failed Fetching Customer Users");
				setEquipments([]);
				setLoading(false);
			}
		} catch (error) {
			setError("Failed Fetching Customer Users");
			setLoading(false);
			setEquipments([]);
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
				setAgents(agentUserCounts);
			} else {
				setError("Failed Fetching Agents");
				setAgents([]);
			}
		} catch (error) {
			setError("Failed Fetching Agents");
			setAgents([]);
		}
	};

	const handleNext = () => {
		if (activeStep === 0) {
			const requiredFields = ["customer_name", "status", "street1", "country", "state", "city", "zip"];
			const newErrors = {};

			requiredFields.forEach((field) => {
				const value = formData[field];

				// If it's a string, trim and check
				if (typeof value === "string") {
					if (!value.trim()) newErrors[field] = true;
				}
				// If it's undefined or null, it's invalid
				else if (value === undefined || value === null) {
					newErrors[field] = true;
				}
				// For other types like boolean or number, check for emptiness
				else if (value === "") {
					newErrors[field] = true;
				}
			});

			const updatedErrors = {};
			requiredFields.forEach((field) => {
				updatedErrors[field] = !!newErrors[field]; // true if error, false otherwise
			});
			setFormErrors(updatedErrors);

			if (Object.keys(newErrors).length > 0) {
				setError("Please fill all the required fields.");
				return;
			} else {
				setError(null);
			}
		}
		setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
	};
	const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleFinish = async () => {
		if (!handleSubmit) {
			return;
		}
		try {
			await handleSubmit(formData);
		} catch (err) {
			console.error(err);
		}
	};

	const handleSubmit = async (data) => {
		setIsSubmitting(true);
		console.log("Final form data:", data);

		if (isEditing) {
			console.log("Editing: ", data);
		} else {
			const response = await createCustomerService(data);
			if (response.status) {
				setIsSubmitting(false);
				if (fetchParentData) {
					await fetchParentData();
				}
				setFormOpen(false);

				setDrawerForm(true);
				setActiveStep(0);
				setFormData({
					customer_name: "",
					phone: "",
					website: "",
					status: "1",
					manager: "",
					users: [],
					sites: [],
					provisions: [],
					internalNotes: "",
				});
				Swal.fire({
					icon: "success",
					title: "Success",
					text: response.message,
				});
			} else {
				setIsSubmitting(false);
				setError(response.message);
			}
		}
	};

	const handleCloseForm = () => {
		const hasChanged = !_.isEqual(formData, initialFormDataRef.current);

		if (!hasChanged) {
			// No changes, just close
			setFormOpen(false);
			// setUseDrawer(true);
			setActiveStep(0);
			setFormData({
				customer_name: "",
				phone: "",
				website: "",
				status: "1",
				manager: "",
				users: [],
				sites: [],
				provisions: [],
				internalNotes: "",
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
				console.log("Form Closed");
				setFormOpen(false);
				// setUseDrawer(true);
				setActiveStep(0);
				setFormData({
					customer_name: "",
					phone: "",
					website: "",
					manager: "",
					status: "1",
					users: [],
					sites: [],
					provisions: [],
					internalNotes: "",
				});
			}
		});
	};

	const textFieldRef = useRef(null);

	useEffect(() => {
		if (activeStep === 0) {
			// Delay the focus to ensure the TextField is mounted
			const timer = setTimeout(() => {
				textFieldRef.current?.focus();
			}, 0);

			return () => clearTimeout(timer);
		}
	}, [activeStep]);

	const handleRemoveAssignedUser = (email) => {
		const currentUsers = formData.users;
		const uniqueProvisionedUsers = currentUsers.filter((user) => user.email !== email);
		console.log("Email: ", email);
		console.log("Users: ", uniqueProvisionedUsers);
		setFormData((prev) => {
			return {
				...prev,
				users: uniqueProvisionedUsers,
			};
		});
	};

	const handleRemoveSite = (site_name) => {
		const currentSites = formData.sites;
		const uniqueProvisionedSites = currentSites.filter((site) => site.site_name !== site_name);
		setFormData((prev) => {
			return {
				...prev,
				sites: uniqueProvisionedSites,
			};
		});
	};

	const handleRemoveProvisions = (equipment, serial_number) => {
		const currentProvisions = formData.provisions;
		const uniqueProvisionedProvisions = currentProvisions.filter(
			(prov) => prov.equipment !== equipment && prov.serialNumber === serial_number
		);
		setFormData((prev) => {
			return {
				...prev,
				provisions: uniqueProvisionedProvisions,
			};
		});
	};

	if (loading) {
		return <LoadingWrapper minHeight={"400px"} minWidth={"50vw"} />;
	}

	return (
		<>
			<LocalizationProvider dateAdapter={AdapterMoment}>
				<Box
					p={drawerForm ? 1 : 0}
					width={drawerForm ? "50vw" : "100%"}
					sx={{
						display: "flex",
						flexDirection: "column",
						height: "100%",
					}}>
					{/* Top section (IconButtons) */}
					{drawerForm ? (
						<Box
							sx={{
								...flexRow,
								justifyContent: "space-between",
								width: "100%",
								mb: 1,
								px: 2,
								py: 1,
							}}>
							<PageHeader title={formTitle} subtitle={formSubTitle} />
							<Box
								sx={{
									...flexRow,
									justifyContent: "flex-end",
								}}>
								<Tooltip title={drawerForm ? "Open in Full Screen" : "Open in Drawer"}>
									<IconButton size="small" onClick={() => setDrawerForm(!drawerForm)}>
										{drawerForm ? <OpenInFullIcon /> : <CloseFullscreenIcon />}
									</IconButton>
								</Tooltip>
								<Tooltip title="Close the Form">
									<IconButton size="small" onClick={handleCloseForm}>
										<CloseIcon />
									</IconButton>
								</Tooltip>
							</Box>
						</Box>
					) : (
						<Box
							sx={{
								...flexRow,
								justifyContent: "space-between",
								width: "100%",
							}}>
							<Tooltip title="Close the Form">
								<Button startIcon={<ArrowBackIcon />} sx={{ pl: 0 }} onClick={handleCloseForm}>
									Close Form
								</Button>
							</Tooltip>
							<Box
								sx={{
									...flexRow,
									justifyContent: "flex-end",
									width: "60%",
									mb: 1,
								}}>
								<Tooltip title={drawerForm ? "Open in Full Screen" : "Open in Drawer"}>
									<IconButton size="small" onClick={() => setDrawerForm(!drawerForm)}>
										{drawerForm ? <OpenInFullIcon /> : <CloseFullscreenIcon />}
									</IconButton>
								</Tooltip>
							</Box>
						</Box>
					)}
					<Box
						sx={{
							flexGrow: 1,
							overflowY: "auto",
							px: drawerForm ? 3 : 0,
							py: 1,
							minHeight: 0, // Required to ensure flexGrow + overflow works properly
						}}>
						{error && (
							<Alert severity="error" sx={{ width: "100%", my: 2 }}>
								{error}
							</Alert>
						)}
						<Stepper activeStep={activeStep} alternativeLabel>
							{steps.map((step, index) => (
								<Step key={step.label}>
									<StepLabel>
										<Typography variant="body1" fontWeight={"bold"}>
											{step.label}
											{!step.required && (
												<span
													style={{
														fontSize: "10px",
														fontStyle: "itallic",
														color: "gray",
														ml: "5px",
													}}>
													- Optional
												</span>
											)}
										</Typography>
										<Typography variant="body2" fontSize={"11px"} color="text.secondary">
											{step.description}
										</Typography>
									</StepLabel>
								</Step>
							))}
						</Stepper>

						<Box sx={{ mt: 3 }}>
							{activeStep === 0 && (
								<Box key="step-0" display="flex" flexDirection="column" rowGap={"20px"} width={"100%"}>
									<FormField
										type={"text"}
										label={"Customer Name"}
										showRequired={true}
										name={"customer_name"}
										value={formData.customer_name}
										onChange={handleFormChange}
										error={formErrors.customer_name}
										inputRef={textFieldRef}
									/>
									<FormField
										type={"number"}
										label={"Phone"}
										name={"phone"}
										value={formData.phone}
										error={formErrors.phone}
										onChange={handleFormChange}
									/>
									<FormField
										type={"text"}
										label={"Website"}
										name={"website"}
										value={formData.website}
										error={formErrors.website}
										onChange={handleFormChange}
									/>
									<Divider flexItem sx={{ my: "10px" }} />
									<AddressForm
										setParentFormData={setFormData}
										formErrors={formErrors}
										initialData={formData}
									/>{" "}
									<Divider flexItem sx={{ my: "10px" }} />
									<FormField
										type={"select"}
										label={"Status"}
										name={"status"}
										value={formData.status}
										error={formErrors.status}
										onChange={handleFormChange}
										showRequired
										options={[
											{ value: "0", label: "Inactive" },
											{ value: "1", label: "Active" },
										]}
									/>
									<FormField
										type={"select"}
										label={"Manager"}
										name={"manager"}
										value={formData?.manager || ""}
										error={formErrors.manager}
										onChange={handleFormChange}
										options={agents}
									/>
									<Divider flexItem sx={{ my: "10px" }} />
									<FormField
										type={"textarea"}
										label={"Internal Notes"}
										name={"internalNotes"}
										value={formData.internalNotes}
										error={formErrors.internalNotes}
										onChange={handleFormChange}
									/>
								</Box>
							)}

							{activeStep === 1 && (
								<Box
									key="step-2"
									display="flex"
									flexDirection="column"
									minHeight={"475px"}
									sx={{ px: 1 }}>
									<Box
										mb={3}
										display={"flex"}
										flexDirection={"row"}
										alignItems={"flex-start"}
										justifyContent={"space-between"}>
										<Box>
											<Typography variant="body1" fontWeight={"bold"}>
												Customer Sites
											</Typography>
											<Typography variant="body1" color="text.secondary" fontSize={"11px"}>
												By Default, Customer Address will be considered as a Site, More sites
												can be added.
											</Typography>
										</Box>
										<Button
											variant="outlined"
											startIcon={<AddIcon />}
											onClick={() => {
												setSiteFormOpen(true);
												setError("");
											}}
											disabled={
												siteForms.length > 0 && !siteForms[0].isDefault && !formData.address
											}>
											Add Site
										</Button>
									</Box>
									{formData.sites.length === 0 ? (
										<Alert severity="info" sx={{ width: "100%" }}>
											No Sites Added
										</Alert>
									) : (
										<>
											<Typography variant="body1" fontWeight={"bold"} mb={1}>
												Following Sites will be assigned to this customer:{" "}
											</Typography>
											{formData.sites.map((site, idx) => (
												<React.Fragment key={site.site_name}>
													<SiteFormCard data={site} handleRemove={handleRemoveSite} />
												</React.Fragment>
											))}
										</>
									)}
								</Box>
							)}

							{activeStep === 2 && (
								<Box key="step-1" sx={{ px: 1 }}>
									<Box
										mb={3}
										display={"flex"}
										flexDirection={"row"}
										alignItems={"flex-start"}
										justifyContent={"space-between"}>
										<Box>
											<Typography variant="body1" fontWeight={"bold"}>
												Customer Users
											</Typography>
											<Typography variant="body1" color="text.secondary" fontSize={"11px"}>
												Add new user or select user from the existing list.
											</Typography>
										</Box>
										<Box
											sx={{
												...flexRow,
												justifyContent: "flex-start",
												columnGap: "5px",
												alignItems: "center",
											}}>
											<Button
												variant="outlined"
												component="label"
												startIcon={<AddIcon />}
												onClick={() => {
													setSelectExisting(false);
													setUserFormOpen(true);
													setError("");
												}}>
												Add New User
											</Button>
											<Button
												variant="outlined"
												component="label"
												startIcon={<LibraryAddCheckIcon />}
												onClick={() => {
													setSelectExisting(true);
													setUserFormOpen(true);
													setError("");
												}}>
												Select Existing Users
											</Button>
										</Box>
									</Box>

									{formData.users.length <= 0 ? (
										<Alert severity="info" sx={{ width: "100%" }}>
											No Users Added
										</Alert>
									) : (
										<>
											<Typography variant="body1" fontWeight={"bold"} mb={1}>
												Following Users will be assigned to this customer:{" "}
											</Typography>
											{formData.users.map((user) => (
												<React.Fragment key={`${user.first_name}_${user.email}`}>
													<UserFormCard data={user} handleRemove={handleRemoveAssignedUser} />
												</React.Fragment>
											))}
										</>
									)}
								</Box>
							)}

							{activeStep === 3 && (
								<Box key="step-2" sx={{ px: 1 }}>
									<Box
										mb={3}
										display={"flex"}
										flexDirection={"row"}
										alignItems={"flex-start"}
										justifyContent={"space-between"}>
										<Box>
											<Typography variant="body1" fontWeight={"bold"}>
												Customer Equipments
											</Typography>
											<Typography variant="body1" color="text.secondary" fontSize={"11px"}>
												Provision equipments to this customer
											</Typography>
										</Box>
										<Button
											variant="outlined"
											startIcon={<AddIcon />}
											onClick={() => {
												setProvisionFormOpen(true);
												setError("");
											}}>
											Add Provision
										</Button>
									</Box>
									{formData.provisions.length <= 0 ? (
										<Alert severity="info" sx={{ width: "100%" }}>
											No Equipments Provisioned
										</Alert>
									) : (
										<>
											<Typography variant="body1" fontWeight={"bold"} mb={1}>
												Following Equipments will be provisioned to this customer:{" "}
											</Typography>
											{formData.provisions.map((prov) => (
												<ProvisionFormCard data={prov} handleRemove={handleRemoveProvisions} />
											))}
										</>
									)}
								</Box>
							)}
						</Box>
					</Box>

					<Box mt={1} p={drawerForm ? 2 : 0} display="flex" justifyContent="space-between">
						<Button disabled={activeStep === 0} onClick={handleBack}>
							Back
						</Button>
						<Box sx={{ ...flexRow, columnGap: "10px" }}>
							<Button onClick={handleCloseForm} variant="outlined">
								Cancel
							</Button>

							{activeStep === steps.length - 1 ? (
								<Button
									loading={isSubmitting}
									loadingPosition="start"
									variant="contained"
									onClick={handleFinish}
									disabled={isSubmitting}>
									{isEditing ? "Update Customer" : formTitle}
								</Button>
							) : (
								<Button variant="contained" onClick={handleNext}>
									Next
								</Button>
							)}
						</Box>
					</Box>
				</Box>
			</LocalizationProvider>

			<Drawer anchor={"right"} sx={{ width: "45vw" }} open={userFormOpen}>
				{selectExisting ? (
					<CustomerUserSelectionForm
						formOpen={userFormOpen}
						setFormOpen={setUserFormOpen}
						setCustomerFormData={setFormData}
						customerFormData={formData}
						selectedCustomer={formData.customer_name}
					/>
				) : (
					<CustomerUserForm
						formOpen={userFormOpen}
						setFormOpen={setUserFormOpen}
						setParentData={setFormData}
						showStaticCustomer={true}
						customerName={formData?.customer_name || ""}
						showCustomer={false}
						createUser={false}
					/>
				)}
			</Drawer>

			<Drawer anchor={"right"} sx={{ width: "45vw" }} open={siteFormOpen}>
				<CustomerSiteForm
					formOpen={siteFormOpen}
					setFormOpen={setSiteFormOpen}
					setParentData={setFormData}
					showStaticCustomer={true}
					customerName={formData?.customer_name || ""}
					showCustomer={false}
					createSite={false}
				/>
			</Drawer>

			<Drawer anchor={"right"} sx={{ width: "45vw" }} open={provisionFormOpen}>
				<ProvisionForm
					formOpen={provisionFormOpen}
					setFormOpen={setProvisionFormOpen}
					setParentData={setFormData}
					showCustomer={false}
					showEquipment={true}
					createProvision={false}
					showStaticCustomer={true}
					customerName={formData?.customer_name || ""}
					customerSites={formData?.sites || ""}
				/>
			</Drawer>
		</>
	);
};

export default CustomerForm;
