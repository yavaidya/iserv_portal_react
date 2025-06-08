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

const CustomerSiteForm = ({
	formOpen,
	setFormOpen,
	setParentData,
	showCustomer = null,
	createSite = true,
	showStaticCustomer = false,
	customerName = "",
}) => {
	const [formData, setFormData] = useState({
		street1: "",
		street2: "",
		city: "",
		state: "",
		country: "",
		zip: "",
		address: "",
		site_name: "",
		customer: showStaticCustomer ? customerName : "",
	});
	const initialFormDataRef = useRef();
	const formTitle = "Add new Site";
	const formSubTitle = "Fill out the following details to create a new site";
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [showUrlField, setShowUrlField] = useState(false);
	const [showUploadBox, setShowUploadBox] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const { flexRow, flexCol } = useCustomTheme();
	const [formErrors, setFormErrors] = useState({});
	const [showNewCategoryField, setShowNewCategoryField] = useState(false);
	const [alert, setAlert] = useState("");
	const [customers, setCustomers] = useState([]);

	useEffect(() => {
		if (showCustomer) {
			fetchCustomers();
		}
		if (showStaticCustomer) {
			setFormData((prev) => ({ ...prev, customer: customerName }));
		}
	}, []);

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
				setFormLoading(false);
				console.log("Customers", response);
			}
		} catch (error) {
			console.log(error);
			setFormLoading(false);
		}
	};

	const handleSubmit = async (addNew = false) => {
		const errors = {};
		if (!formData.site_name) errors.site_name = true;
		if (!formData.street1) errors.street1 = true;
		if (!formData.state) errors.state = true;
		if (!formData.zip) errors.zip = true;
		if (!formData.country) errors.country = true;

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			setAlert("Please fill all required fields.");
			return;
		}

		let req_body = {
			...formData,
			// Optionally remove password fields if not needed
			...(formData.sendActivationEmail ? { password: undefined, confirmPassword: undefined } : {}),
		};

		setAlert("");
		setFormErrors({});
		setFormSubmitting(true);

		if (!createSite) {
			console.log("Form submitted", req_body);
			let exists = false;
			setParentData((prev) => {
				const siteExists =
					Array.isArray(prev.sites) && prev.sites.some((site) => site.site_name === req_body.site_name);

				if (siteExists) {
					exists = true;
					return prev; // Prevent adding duplicate
				}

				return {
					...prev,
					sites: Array.isArray(prev.sites) ? [...prev.sites, req_body] : [req_body],
				};
			});

			if (!exists) {
				setAlert("");
				setFormErrors({});
				if (!addNew) {
					setFormOpen(false);
				}
				setFormData({
					street1: "",
					street2: "",
					city: "",
					state: "",
					country: "",
					zip: "",
					address: "",
					site_name: "",
					customer: showStaticCustomer ? customerName : "",
				});
			} else {
				console.log("Site name already exists:", req_body.site_name);
				setFormErrors({ site_name: "Site name already exists" });
				setAlert("Site Name already exists");
			}

			setFormSubmitting(false);
		} else {
			const response = await createCustomerUsersService(req_body);
			console.log(response);
			if (response.status) {
				if (setParentData) {
					const customerUserCounts = response.data.map((customer) => ({
						id: customer.id,
						name: customer.name,
						organization: customer?.organization?.name || "",
						created: customer.createdAt,
					}));
					setParentData(customerUserCounts);
				}
				if (!addNew) {
					setFormOpen(false);
				}
				setFormData({
					name: "",
					first_name: "",
					last_name: "",
					email: "",
					customer: "",
					status: "0",
					notes: "",
					username: "",
					password: "",
					confirmPassword: "",
					sendActivationEmail: true,
				});
				setTimeout(() => {
					setFormSubmitting(false);
				}, 1500);
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
				street1: "",
				street2: "",
				city: "",
				state: "",
				country: "",
				zip: "",
				address: "",
				site_name: "",
				customer: showStaticCustomer ? customerName : "",
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
					street1: "",
					street2: "",
					city: "",
					state: "",
					country: "",
					zip: "",
					address: "",
					site_name: "",
					customer: showStaticCustomer ? customerName : "",
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
						Creating New Customer Site
					</Typography>
				)}
			</Box>
		);
	}
	return (
		<Box p={2} width="50vw" sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
				<Tooltip title="Close the Form">
					<IconButton size="small" onClick={handleCloseForm}>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			</Box>
			<PageHeader title={formTitle} subtitle={formSubTitle} />

			{alert && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{alert}
				</Alert>
			)}

			<Box
				sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", px: 2, pt: 1 }}>
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
				<Divider flexItem sx={{ my: "10px" }} />

				<FormField
					type={"text"}
					label={"Site Name"}
					showRequired={true}
					name="site_name"
					value={formData.site_name}
					onChange={handleFormChange}
					error={formErrors.site_name}
				/>

				<Divider flexItem sx={{ my: "10px" }} />
				<AddressForm setParentFormData={setFormData} formErrors={formErrors} initialData={formData} />
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
	);
};

export default CustomerSiteForm;
