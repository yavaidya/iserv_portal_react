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

const CustomerUserForm = ({
	formOpen,
	setFormOpen,
	setParentData = null,
	showCustomer = true,
	createUser = true,
	showStaticCustomer = false,
	customerName = "",
}) => {
	const [formData, setFormData] = useState({
		name: "",
		first_name: "",
		last_name: "",
		email: "",
		customer: showStaticCustomer ? customerName : "",
		status: "0",
		notes: "",
		username: "",
		password: "",
		confirmPassword: "",
		sendActivationEmail: true,
	});
	const initialFormDataRef = useRef();
	const formTitle = "Add new User";
	const formSubTitle = "Upload a document and assign metadata";
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
		if (!formData.first_name) errors.first_name = true;
		if (!formData.last_name) errors.last_name = true;
		if (!formData.email) errors.email = true;
		if (showCustomer && !formData.customer) errors.customer = true;

		// Username required if sendActivationEmail is false
		if (!formData.sendActivationEmail && !formData.username) errors.username = true;

		// Password fields required if sendActivationEmail is false
		if (!formData.sendActivationEmail) {
			if (!formData.password) errors.password = true;
			if (!formData.confirmPassword) errors.confirmPassword = true;
			if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
				errors.confirmPassword = true;
				setAlert("Passwords do not match.");
			}
		}

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
		setFormSubmitting(true);

		if (!createUser) {
			console.log("Form submitted", req_body);
			let exists = false;
			setParentData((prev) => {
				const userExists =
					Array.isArray(prev.users) && prev.users.some((user) => user.email === req_body.email);

				if (userExists) {
					exists = true;
					return prev; // Prevent adding duplicate
				}
				return {
					...prev,
					users: Array.isArray(prev.users) ? [...prev.users, req_body] : [req_body],
				};
			});

			if (!exists) {
				setAlert("");
				setFormErrors({});
				if (!addNew) {
					setFormOpen(false);
				}
				setFormData({
					name: "",
					first_name: "",
					last_name: "",
					email: "",
					customer: showStaticCustomer ? customerName : "",
					status: "0",
					notes: "",
					username: "",
					password: "",
					confirmPassword: "",
					sendActivationEmail: true,
				});
			} else {
				console.log("User already exists:", req_body.site_name);
				setFormErrors({ email: true });
				setAlert("User already exists");
			}

			setFormSubmitting(false);
		} else {
			const response = await createCustomerUsersService(req_body);
			console.log(response);
			if (response.status) {
				if (setParentData) {
					console.log("Setting New USers");
					const customerUserCounts = response.data.map((customer) => ({
						id: customer.id,
						name: customer.name,
						organization: customer?.organization?.name || "",
						created: customer.createdAt,
					}));
					console.log(customerUserCounts.length);
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
					customer: showStaticCustomer ? customerName : "",
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
				name: "",
				first_name: "",
				last_name: "",
				email: "",
				customer: showStaticCustomer ? customerName : "",
				status: "0",
				notes: "",
				username: "",
				password: "",
				confirmPassword: "",
				sendActivationEmail: true,
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
					name: "",
					first_name: "",
					last_name: "",
					email: "",
					customer: showStaticCustomer ? customerName : "",
					status: "0",
					notes: "",
					username: "",
					password: "",
					confirmPassword: "",
					sendActivationEmail: true,
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
						Creating New User
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
					label={"First Name"}
					showRequired={true}
					name="first_name"
					value={formData.first_name}
					onChange={handleFormChange}
					error={formErrors.first_name}
				/>

				<FormField
					type={"text"}
					label={"Last Name"}
					showRequired={true}
					name="last_name"
					value={formData.last_name}
					onChange={handleFormChange}
					error={formErrors.last_name}
				/>
				<FormField
					type={"text"}
					label={"Email"}
					showRequired={true}
					name="email"
					value={formData.email}
					onChange={handleFormChange}
					error={formErrors.email}
				/>
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
					type={"textarea"}
					label={"Internal Notes"}
					name={"internalNotes"}
					value={formData.internalNotes}
					error={formErrors.internalNotes}
					onChange={handleFormChange}
				/>
				<Divider flexItem sx={{ my: "10px" }} />
				<FormField
					type={"text"}
					label={"Username"}
					showRequired={!formData.sendActivationEmail ? true : false}
					name="username"
					value={formData.username}
					onChange={handleFormChange}
					error={formErrors.username}
				/>
				<Box display="flex" alignItems="center">
					<FormControlLabel
						control={
							<Checkbox
								checked={formData.sendActivationEmail}
								onChange={handleFormChange}
								name="sendActivationEmail"
							/>
						}
						label="Send Account Activation & Password Set Email"
					/>
				</Box>

				{/* Password fields if sendActivationEmail is unchecked */}
				{!formData.sendActivationEmail && (
					<>
						<FormField
							type={"password"}
							label={"Password"}
							showRequired={true}
							name="password"
							value={formData.password}
							onChange={handleFormChange}
							error={formErrors.password}
						/>
						<FormField
							type={"password"}
							label={"Confirm Password"}
							showRequired={true}
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleFormChange}
							error={formErrors.confirmPassword}
						/>
					</>
				)}
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

export default CustomerUserForm;
