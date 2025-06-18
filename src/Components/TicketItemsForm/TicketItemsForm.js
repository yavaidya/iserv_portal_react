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

const TicketItemsForm = ({
	formOpen,
	setFormOpen,
	setParentData,
	selectedType = "Labour",
	showStaticCustomer = true,
	customerName = "",
}) => {
	const [formData, setFormData] = useState({
		itemType: selectedType,
		item: "",
		itemName: "",
		itemPrice: "",
		itemValue: "",
		itemUnit:
			selectedType === "Labour"
				? "hr"
				: selectedType === "Material"
				? "pc"
				: selectedType === "Expenses"
				? "ea"
				: "",
		itemDescription: "",
		description: "",
	});
	const [itemTypes, setItemTypes] = useState([
		{
			category_id: "1", // or null, or a special key
			category_name: `Sample Labour Rate`,
		},
		{
			category_id: "new", // or null, or a special key
			category_name: `Create New ${selectedType} Item`,
		},
	]);
	const initialFormDataRef = useRef();
	const formTitle = `Add new Ticket Item: ${selectedType}`;
	const formSubTitle = `Fill out the following form to add ${selectedType} item to the Ticket`;
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [showUrlField, setShowUrlField] = useState(false);
	const [showUploadBox, setShowUploadBox] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const { flexRow, flexCol } = useCustomTheme();
	const [formErrors, setFormErrors] = useState({});
	const [showNewItem, setShowNewItem] = useState(false);
	const [alert, setAlert] = useState("");
	const [customers, setCustomers] = useState([]);

	const handleFormChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		if (name === "item" && value === "new") {
			console.log(name);
			setShowNewItem(true);
		} else if (name === "item") {
			setShowNewItem(false);
		}

		if (formErrors[name]) {
			setFormErrors((prev) => ({ ...prev, [name]: false }));
		}
	};

	const handleCloseForm = () => {
		const hasChanged = !_.isEqual(formData, initialFormDataRef.current);

		if (!hasChanged) {
			setFormOpen(false);
			setFormData({
				itemType: selectedType,
				item: "",
				itemName: "",
				itemPrice: "",
				itemValue: "",
				itemUnit:
					selectedType === "Labour"
						? "hr"
						: selectedType === "Material"
						? "pc"
						: selectedType === "Expenses"
						? "ea"
						: "",
				itemDescription: "",
				description: "",
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
					itemType: selectedType,
					item: "",
					itemName: "",
					itemPrice: "",
					itemValue: "",
					itemUnit:
						selectedType === "Labour"
							? "hr"
							: selectedType === "Material"
							? "pc"
							: selectedType === "Expenses"
							? "ea"
							: "",
					itemDescription: "",
					description: "",
				});
			}
		});
	};

	const handleSubmit = async (addNew = false) => {
		const errors = {};
		if (!formData.itemType) errors.itemType = true;
		if (!formData.item) errors.item = true;
		if (!formData.itemValue) errors.itemValue = true;
		if (!formData.itemUnit) errors.itemUnit = true;
		if (showNewItem && !formData.itemName) errors.itemName = true;
		if (showNewItem && !formData.itemPrice) errors.itemPrice = true;
		if (showNewItem && !formData.itemDescription) errors.itemDescription = true;

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			setAlert("Please fill all required fields.");
			return;
		}

		let req_body = formData;
		console.log(req_body);

		setAlert("");
		setFormSubmitting(true);

		setAlert("");
		setFormErrors({});
		if (!addNew) {
			setFormOpen(false);
		}
		setFormData({
			itemType: selectedType,
			item: "",
			itemName: "",
			itemPrice: "",
			itemValue: "",
			itemUnit:
				selectedType === "Labour"
					? "hr"
					: selectedType === "Material"
					? "pc"
					: selectedType === "Expenses"
					? "ea"
					: "",
			itemDescription: "",
			description: "",
		});

		setTimeout(() => {
			setFormSubmitting(false);
		}, 1000);
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
						Adding Ticket Item
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
				<FormField
					type={"select"}
					label={"Item Type"}
					name={"itemType"}
					value={formData.itemType}
					error={formErrors.itemType}
					onChange={handleFormChange}
					showRequired
					options={[
						{ label: "Labour", value: "Labour" },
						{ label: "Material", value: "Material" },
						{ label: "Expenses", value: "Expenses" },
					]}
				/>
				<Box display="flex" alignItems="center">
					<Box width="200px" minWidth="200px">
						<Typography fontWeight="bold">
							Item: <span style={{ color: "red" }}>*</span>
						</Typography>
					</Box>
					<FormControl fullWidth size="small">
						<Select
							name="item"
							value={formData.item}
							onChange={handleFormChange}
							error={formErrors.item}
							displayEmpty>
							<MenuItem value="" disabled>
								Select Item
							</MenuItem>
							{itemTypes.length > 0 &&
								itemTypes.map((cat) => (
									<MenuItem
										key={cat.category_id}
										value={cat.category_id}
										sx={{
											fontStyle: cat.category_id === "new" ? "italic" : "normal",
											color: cat.category_id === "new" ? "primary.main" : "inherit",
											borderTop: cat.category_id === "new" ? "1px solid #ccc" : "none",
										}}>
										{cat.category_name}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</Box>
				{showNewItem && (
					<>
						<FormField
							type={"text"}
							label={"Item Name"}
							showRequired={true}
							name="itemName"
							value={formData.itemName}
							onChange={handleFormChange}
							error={formErrors.itemName}
						/>
						<FormField
							type={"textarea"}
							label={"Item description"}
							name={"itemDescription"}
							value={formData.itemDescription}
							error={formErrors.itemDescription}
							onChange={handleFormChange}
						/>
						<FormField
							type={"number"}
							label={"Item Price"}
							showRequired={true}
							name="itemPrice"
							value={formData.itemPrice}
							onChange={handleFormChange}
							error={formErrors.itemPrice}
						/>
					</>
				)}
				<Divider flexItem sx={{ my: "10px" }} />
				<FormField
					type={"number"}
					label={"Item Value"}
					showRequired={true}
					name="itemValue"
					value={formData.itemValue}
					onChange={handleFormChange}
					error={formErrors.itemValue}
				/>
				<FormField
					type={"select"}
					label={"Item Unit"}
					name={"itemUnit"}
					value={formData.itemUnit}
					error={formErrors.itemUnit}
					onChange={handleFormChange}
					showRequired
					options={[
						{ label: "Hr", value: "hr" },
						{ label: "Pc", value: "pc" },
						{ label: "EA", value: "ea" },
					]}
				/>
				<FormField
					type={"textarea"}
					label={"description"}
					name={"description"}
					value={formData.description}
					error={formErrors.description}
					onChange={handleFormChange}
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
	);
};

export default TicketItemsForm;
