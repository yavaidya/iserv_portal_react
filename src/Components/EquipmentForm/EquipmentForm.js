import React from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import { useState } from "react";
import { useEffect } from "react";
import {
	Alert,
	Autocomplete,
	Box,
	Button,
	CircularProgress,
	Divider,
	Drawer,
	IconButton,
	Paper,
	Step,
	StepLabel,
	Stepper,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../PageHeader/PageHeader";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

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

const machineDocuments = [
	{
		kb_id: 1,
		category_id: 101,
		ispublished: true,
		subject: "Routine Maintenance Guide - Model X100",
		answer: "Perform weekly checks on oil levels, belts, and filters. Follow the 10-step procedure as outlined in the attached PDF.",
		attachment_id: 201,
		keywords: "maintenance, model X100, oil check, filters, belts",
		notes: "Updated quarterly based on field feedback.",
		category: {
			category_id: 101,
			category_pid: null,
			ispublic: true,
			name: "Maintenance",
			description: "Guides and schedules for regular machine maintenance.",
			notes: "Covers all standard models.",
		},
	},
	{
		kb_id: 2,
		category_id: 102,
		ispublished: true,
		subject: "Initial Setup Instructions - Model Z200",
		answer: "Place the machine on a level surface, connect to a 220V power source, and follow the calibration procedure in the attachment.",
		attachment_id: 202,
		keywords: "setup, installation, model Z200, calibration",
		notes: "Last verified by engineering team on May 2025.",
		category: {
			category_id: 102,
			category_pid: null,
			ispublic: true,
			name: "Setup & Installation",
			description: "Documentation for setting up and installing machines.",
			notes: "Includes wiring and positioning info.",
		},
	},
	{
		kb_id: 3,
		category_id: 103,
		ispublished: true,
		subject: "Error Code E45 Troubleshooting - Model A300",
		answer: "Error E45 indicates a sensor misalignment. Power off the machine, realign the sensor block, and restart.",
		attachment_id: null,
		keywords: "error E45, troubleshooting, sensor, model A300",
		notes: "Common issue in cold environments. Recommend heater upgrade.",
		category: {
			category_id: 103,
			category_pid: null,
			ispublic: true,
			name: "Troubleshooting",
			description: "Help articles for resolving common errors and faults.",
			notes: "Should link to error code directory.",
		},
	},
	{
		kb_id: 4,
		category_id: 104,
		ispublished: false,
		subject: "Emergency Shutdown Protocol - All Models",
		answer: "In case of emergency, press the red EMERGENCY STOP button. Follow internal evacuation and reporting procedures.",
		attachment_id: 204,
		keywords: "emergency, shutdown, safety, all models",
		notes: "Pending final review by Safety Committee.",
		category: {
			category_id: 104,
			category_pid: null,
			ispublic: false,
			name: "Safety Procedures",
			description: "Mandatory safety operations and emergency responses.",
			notes: "Requires compliance training.",
		},
	},
	{
		kb_id: 5,
		category_id: 105,
		ispublished: true,
		subject: "Firmware Update Instructions - Controller v3.2",
		answer: "Connect the controller to a laptop via USB. Launch the update tool and load firmware file v3.2. Follow prompts.",
		attachment_id: 205,
		keywords: "firmware, update, controller v3.2, USB",
		notes: "Ensure backup is taken before update.",
		category: {
			category_id: 105,
			category_pid: null,
			ispublic: true,
			name: "Software Updates",
			description: "Instructions for applying updates to machine firmware or software.",
			notes: "Cross-reference with release notes.",
		},
	},
];

const defaultProvision = {
	customer: null,
	site: null,
	provisionedDate: moment(),
	serialNumber: "",
};

const EquipmentForm = ({
	useDrawer = true,
	setUseDrawer,
	formOpen,
	setFormOpen,
	formData,
	setFormData,
	activeStep,
	setActiveStep,
}) => {
	const { flexCol, flexRow } = useCustomTheme();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [equipmentImage, setEquipmentImage] = useState(null);
	const [formErrors, setFormErrors] = useState({
		equipmentName: "",
		equipmentParent: "",
		internalNotes: "",
	});
	const [formTitle, setFormTitle] = useState("Add New Equipment");
	const [formSubTitle, setFormSubTitle] = useState("Please fill out the following to add a new equipment");
	const [documents, setDocuments] = useState([]);
	const steps = ["Equipment Details", "Documents Provisioning", "Customer(s) Provision"];
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Navigation
	const handleNext = () => {
		if (activeStep === 0) {
			if (!formData.equipmentName?.trim()) {
				setFormErrors((prev) => ({ ...prev, equipmentName: true }));
				setError("Equipment Name is Required");
				return; // Don't proceed to next step
			} else {
				setError(false);
				setFormErrors((prev) => ({ ...prev, equipmentName: false }));
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

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const allowedTypes = ["image/jpeg", "image/png"];
			if (!allowedTypes.includes(file.type)) {
				setError("Only JPG or PNG files are allowed.");
				setEquipmentImage(null);
				return;
			}
			setError(null);
			setEquipmentImage(file);
			// Optionally, update formData if you want to submit the image
			setFormData((prevData) => ({
				...prevData,
				equipmentImage: file,
			}));
		}
	};
	// Finish submit handler
	const handleFinish = async () => {
		if (!handleSubmit) {
			return;
		}
		setIsSubmitting(true);
		try {
			await handleSubmit(formData);
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		const docs = machineDocuments.map((doc) => {
			return {
				id: doc.kb_id,
				name: doc.subject,
				category: doc?.category?.name || "",
			};
		});
		console.log(docs);
		setDocuments(docs);
		setLoading(false);
	}, []);

	const handleAddProvision = () => {
		setFormData((prev) => ({
			...prev,
			provisions: [...prev.provisions, { ...defaultProvision }],
		}));
	};

	const handleDeleteProvision = (index) => {
		setFormData((prev) => ({
			...prev,
			provisions: prev.provisions.filter((_, i) => i !== index),
		}));
	};

	const handleProvisionChange = (index, key, value) => {
		const updated = [...formData.provisions];
		updated[index][key] = value;
		setFormData((prev) => ({ ...prev, provisions: updated }));
	};

	const getFilteredSites = (customerId) => {
		return sitesList.filter((site) => site.customerId === customerId);
	};

	const columns_doc = [
		{
			field: "name",
			headerName: "Document Name",
			flex: 1,
			renderCell: (params) => (
				<Tooltip title="View Document Details">
					<span
						style={{
							cursor: "pointer",
							fontWeight: "bold",
						}}
						onMouseEnter={(e) => (e.target.style.fontWeight = "bold")}
						onMouseLeave={(e) => (e.target.style.fontWeight = "bold")}>
						{params.value}
					</span>
				</Tooltip>
			),
		},
		{
			field: "category",
			headerName: "Category",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === "" ? (
					<span style={{ fontSize: "10px", color: "gray" }}>No Category</span>
				) : (
					params.value
				),
		},
	];

	const handleSubmit = async (data) => {
		console.log("Final form data:", data);
		setFormData({
			equipmentName: "",
			equipmentParent: "",
			internalNotes: "",
			doc_ids: {
				type: "include",
				ids: new Set(),
			},
			provisions: [
				{
					customer: null,
					site: null,
					provisionedDate: moment(), // today
					serialNumber: "",
				},
			],
		});
		setFormOpen(false);
		setUseDrawer(true);
		setActiveStep(0);
	};

	const handleDocRowSelect = (selectedRows) => {
		const rows = Array.from(selectedRows.ids);
		console.log("Selected doc row IDs:", rows);
		setFormData((prevData) => ({
			...prevData,
			doc_ids: selectedRows,
		}));
	};

	const handleDocRowClick = (params) => {
		console.log("Row clicked:", params.row);
	};

	const handleCloseForm = () => {
		console.log("Form Closed");
		setFormOpen(false);
		setUseDrawer(true);
	};

	if (loading) {
		return (
			<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", minHeight: "300px", width: "100%" }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<Box
				p={useDrawer ? 1 : 0}
				width={useDrawer ? "45vw" : "100%"}
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}>
				{/* Top section (IconButtons) */}
				{useDrawer ? (
					<Box
						sx={{
							...flexRow,
							justifyContent: "space-between",
							width: "100%",
							mb: 1,
						}}>
						<Tooltip title={useDrawer ? "Open in Full Screen" : "Open in Drawer"}>
							<IconButton size="small" onClick={() => setUseDrawer(!useDrawer)}>
								{useDrawer ? <OpenInFullIcon /> : <CloseFullscreenIcon />}
							</IconButton>
						</Tooltip>
						<Tooltip title="Close the Form">
							<IconButton size="small" onClick={handleCloseForm}>
								<CloseIcon />
							</IconButton>
						</Tooltip>
					</Box>
				) : (
					<Box
						sx={{
							...flexRow,
							justifyContent: "space-between",
							width: "100%",
						}}>
						<Tooltip title="Close the Form">
							<Button startIcon={<ArrowBackIcon />} onClick={handleCloseForm}>
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
							<Tooltip title={useDrawer ? "Open in Full Screen" : "Open in Drawer"}>
								<IconButton size="small" onClick={() => setUseDrawer(!useDrawer)}>
									{useDrawer ? <OpenInFullIcon /> : <CloseFullscreenIcon />}
								</IconButton>
							</Tooltip>
						</Box>
					</Box>
				)}

				{/* Content container with scrollable step content */}
				<Box
					sx={{
						flexGrow: 1,
						overflowY: "auto",
						px: useDrawer ? 3 : 0,
						py: 1,
						minHeight: 0, // Required to ensure flexGrow + overflow works properly
					}}>
					<PageHeader title={formTitle} subtitle={formSubTitle} />
					<Stepper activeStep={activeStep} alternativeLabel>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
					<Box mt={5}>
						{activeStep === 0 && (
							<Box key="step-0" display="flex" flexDirection="column" rowGap={"20px"} width={"100%"}>
								<Box>
									<Typography variant="body1" fontWeight={"bold"}>
										Equipment Details{" "}
										<span
											style={{
												fontSize: "10px",
												fontStyle: "itallic",
												color: "gray",
												ml: "5px",
											}}>
											- Optional
										</span>
									</Typography>
									<Typography variant="body2">Add basic equipment details</Typography>
								</Box>
								{error && (
									<Alert severity="error" sx={{ width: "100%", mb: 2 }}>
										{error}
									</Alert>
								)}
								<Box display="flex" alignItems="center">
									<Box width="200px" minWidth="200px">
										<Typography variant="body1" fontWeight={"bold"}>
											Equipment Name: <span style={{ color: "red" }}>*</span>
										</Typography>
									</Box>
									<TextField
										size="small"
										name="equipmentName"
										value={formData.equipmentName}
										onChange={handleFormChange}
										sx={{ width: "100%" }}
										error={formErrors.equipmentName}
									/>
								</Box>

								<Box display="flex" alignItems="center">
									<Box width="200px" minWidth="200px">
										<Typography variant="body1" fontWeight={"bold"}>
											Equipment Parent:
										</Typography>
									</Box>
									<Autocomplete
										options={["--- Top Level ---", "Parent A", "Parent B"]}
										value={formData.equipmentParent || "--- Top Level ---"}
										onChange={(event, newValue) =>
											handleFormChange({
												target: { name: "equipmentParent", value: newValue },
											})
										}
										sx={{ width: "100%" }}
										renderInput={(params) => (
											<TextField
												{...params}
												size="small"
												sx={{
													width: "100%",
													"& .MuiAutocomplete-root": {
														width: "100%",
													},
												}}
											/>
										)}
									/>
								</Box>

								{/* Equipment Image */}
								<Box display="flex" alignItems="center">
									<Box width="200px" minWidth="200px">
										<Typography variant="body1" fontWeight={"bold"}>
											Equipment Image:{" "}
										</Typography>
									</Box>
									<Button
										variant="outlined"
										component="label"
										startIcon={<UploadFileIcon />}
										sx={{ width: "100%" }}>
										Upload
										<input
											type="file"
											hidden
											name="equipmentImage"
											accept=".jpg,.jpeg,.png"
											onChange={handleImageChange}
										/>
									</Button>
								</Box>
								{equipmentImage && (
									<Box display="flex" alignItems="center">
										<Box width="200px" minWidth="200px">
											<Typography variant="body1" fontWeight={"bold"}>
												Uploaded Image:{" "}
											</Typography>
										</Box>
										<Box width="100%" minWidth="200px">
											<Typography
												variant="body1"
												color="text.secondary"
												fontStyle={"italic"}
												fontSize={"11px"}>
												{equipmentImage ? equipmentImage.name : "No Image Added"}
											</Typography>
										</Box>
									</Box>
								)}
								<Divider flexItem variant="middle" sx={{ my: "10px" }} />
								{/* Internal Notes */}
								<Box display="flex" flexDirection={"column"} alignItems="flex-start">
									<Box width="150px" mb={1.5}>
										<Typography variant="body1" fontWeight={"bold"}>
											Internal Notes
										</Typography>
									</Box>
									<TextField
										name="internalNotes"
										multiline
										rows={4}
										value={formData.internalNotes}
										onChange={handleFormChange}
										sx={{ width: "100%" }}
									/>
								</Box>
							</Box>
						)}

						{activeStep === 1 && (
							<Box key="step-1">
								<Box sx={{ mb: 2 }}>
									<Typography variant="body1" fontWeight={"bold"}>
										Document Provisioning{" "}
										<span
											style={{
												fontSize: "10px",
												fontStyle: "itallic",
												color: "gray",
												ml: "5px",
											}}>
											- Optional
										</span>
									</Typography>
									<Typography variant="body2">
										Add/Assign Documents to the Equipment {formData.equipmentName}
									</Typography>
								</Box>
								<CustomDatagrid
									data={documents}
									columns={columns_doc}
									rowIdField="id"
									onSelect={handleDocRowSelect}
									rowClick={true}
									onRowClick={handleDocRowClick}
									pageSize={10}
									pageSizeOptions={[5, 10, 25, 50]}
									checkboxSelection={true}
									showMore={false}
									showActions={false}
									selectedRowIds={formData.doc_ids}
								/>
							</Box>
						)}

						{activeStep === 2 && (
							<Box key="step-2">
								<Box sx={{ ...flexRow, justifyContent: "space-between", mb: 3 }}>
									<Box sx={{ width: "60%" }}>
										<Typography variant="body1" fontWeight={"bold"}>
											Provision Equipment{" "}
											<span
												style={{
													fontSize: "10px",
													fontStyle: "itallic",
													color: "gray",
													ml: "5px",
												}}>
												- Optional
											</span>
										</Typography>
										<Typography variant="body2">
											You can provision the Equipment {formData.equipmentName} to the Customers
										</Typography>
									</Box>
									<Button
										variant="outlined"
										startIcon={<AddIcon />}
										onClick={handleAddProvision}
										sx={{ alignSelf: "flex-start" }}>
										Provision New Equipment
									</Button>
								</Box>
								{formData.provisions.map((item, index) => (
									<React.Fragment key={index}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												width: "100%",
												gap: "10px",
												mb: 2,
												p: 2,
												flexWrap: "nowrap", // ensure no wrap
											}}>
											{/* Provisioned Date */}
											<DatePicker
												label="Provisioned Date"
												value={item.provisionedDate}
												onChange={(newValue) =>
													handleProvisionChange(index, "provisionedDate", moment(newValue))
												}
												slotProps={{ textField: { size: "small" } }}
												sx={{ flex: 1, minWidth: 130 }}
											/>

											{/* Customer */}
											<Autocomplete
												size="small"
												value={item.customer}
												onChange={(_, value) => handleProvisionChange(index, "customer", value)}
												options={customersList}
												getOptionLabel={(option) => option?.label || ""}
												renderInput={(params) => (
													<TextField {...params} label="Customer" size="small" />
												)}
												sx={{ flex: 1, minWidth: 150 }}
											/>

											{/* Site */}
											<Autocomplete
												size="small"
												value={item.site}
												onChange={(_, value) => handleProvisionChange(index, "site", value)}
												options={item.customer ? getFilteredSites(item.customer.id) : []}
												getOptionLabel={(option) => option?.label || ""}
												renderInput={(params) => (
													<TextField {...params} label="Site" size="small" />
												)}
												sx={{ flex: 1, minWidth: 150 }}
											/>

											{/* Serial Number */}
											<TextField
												label="Serial Number"
												value={item.serialNumber}
												onChange={(e) =>
													handleProvisionChange(index, "serialNumber", e.target.value)
												}
												size="small"
												sx={{ flex: 1, minWidth: 130 }}
											/>

											{/* Delete */}
											<IconButton
												onClick={() => handleDeleteProvision(index)}
												color="error"
												sx={{ flexShrink: 0 }}>
												<DeleteIcon />
											</IconButton>
										</Box>

										{/* Divider after all but last */}
										{index < formData.provisions.length - 1 && <Divider sx={{ mb: 2 }} />}
									</React.Fragment>
								))}
							</Box>
						)}
					</Box>
				</Box>

				{/* Bottom navigation buttons */}
				<Box mt={1} p={useDrawer ? 2 : 0} display="flex" justifyContent="space-between">
					<Button disabled={activeStep === 0} onClick={handleBack}>
						Back
					</Button>
					<Box sx={{ ...flexRow, columnGap: "10px" }}>
						<Button onClick={handleCloseForm} variant="outlined">
							Cancel
						</Button>

						{activeStep === steps.length - 1 ? (
							<Button variant="contained" onClick={handleFinish} disabled={isSubmitting}>
								{formTitle}
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
	);
};

export default EquipmentForm;
