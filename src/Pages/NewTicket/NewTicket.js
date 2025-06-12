import React from "react";
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
} from "@mui/material";
import { useCustomTheme } from "../../Context/ThemeContext";
import FormField from "../../Components/FormField/FormField";
import { useState } from "react";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../../Components/ErrorAlertWrapper/ErrorAlertWrapper";
import { fetchCustomersService, fetchCustomerUsersService } from "../../Services/customerService";
import RichTextEditor from "../../Components/RichTextEditor/RichTextEditor";
import { useDropzone } from "react-dropzone";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Delete as DeleteIcon, AttachFile as AttachFileIcon } from "@mui/icons-material";
import SectionTitle from "../../Components/SectionTitle/SectionTitle";
import { fetchAgentsService } from "../../Services/agentService";
import Swal from "sweetalert2";

const NewTicket = () => {
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

	const onDrop = (acceptedFiles) => {
		const allowedTypes = [
			"application/pdf",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/vnd.ms-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx files
			"text/csv",
		];

		// Filter files to only include supported types
		const validFiles = acceptedFiles.filter((file) => allowedTypes.includes(file.type));
		const invalidFiles = acceptedFiles.filter((file) => !allowedTypes.includes(file.type));

		// Add valid files to existing files
		if (validFiles.length > 0) {
			setFormData((prev) => ({
				...prev,
				files: [...(prev.files || []), ...validFiles],
			}));

			// Clear any previous error if we have valid files
			if (invalidFiles.length === 0) {
				setAlert("");
			}
		}

		// Show error message for invalid files
		if (invalidFiles.length > 0) {
			const invalidFileNames = invalidFiles.map((file) => file.name).join(", ");
			if (validFiles.length > 0) {
				setAlert(
					`Some files were not added due to unsupported format: ${invalidFileNames}. Only PDF, Word, Excel, and CSV files are allowed.`
				);
			} else {
				setAlert(
					`Unsupported file type(s): ${invalidFileNames}. Please upload PDF, Word, Excel, or CSV files.`
				);
			}
		}

		// Optional: Show success message for valid files
		if (validFiles.length > 0) {
			console.log(`${validFiles.length} file(s) added successfully`);
		}
	};
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	useEffect(() => {
		setActiveTitle({
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

	const handleCancel = () => {
		Swal.fire({
			icon: "warning",
			title: "Are you sure?",
			text: "You are attempting to close the Form! Any unsaved data will be lost.",
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

	const handleSubmit = () => {
		const requiredFields = [
			"customer",
			"user",
			"equipment",
			"subject",
			"description",
			"priority",
			"ticket_notice",
			"ticket_source",
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
	};

	const handleDeleteFile = (indexToDelete) => {
		const updatedFiles = formData.files.filter((_, index) => index !== indexToDelete);
		setFormData((prev) => ({
			...prev,
			files: updatedFiles,
		}));
	};

	if (loading) {
		return <LoadingWrapper minHeight={"300px"} />;
	}

	if (error && !loading) {
		return <ErrorAlertWrapper minHeight={"300px"} error={error} />;
	}

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<Box p={2} px={4} width={"100%"} height={"100%"}>
				{alert && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{alert}
					</Alert>
				)}
				<Box
					sx={{
						...flexRow,
						justifyContent: "flex-start",
						alignItems: "flex-start",
						width: "100%",
						columnGap: 2,
						height: "100%",
					}}>
					<Box sx={{ width: "50%", pr: 2 }}>
						<SectionTitle
							title={"User & Equipment"}
							subtitle="Please select the User for whom the ticket is being opened"
						/>

						<Box display="flex" flexDirection="column" rowGap={"15px"} mb={2} width={"100%"}>
							<Box
								sx={{
									...flexRow,
									justifyContent: "flex-start",
									alignItems: "flex-start",
									width: "100%",
									columnGap: 1,
									flexWrap: "nowrap",
								}}>
								<Box
									sx={{
										...flexCol,
										justifyContent: "flex-start",
										alignItems: "flex-start",
										width: "100%",
									}}>
									<Typography variant="body1" fontWeight={"bold"}>
										Customer
									</Typography>
									<Autocomplete
										options={customerOptions}
										getOptionLabel={(option) => option.label}
										isOptionEqualToValue={(option, value) => option.value === value.value}
										value={customerOptions.find((opt) => opt.value === formData.customer) || null}
										onChange={(event, newValue) => {
											handleFormChange({
												target: {
													name: "customer",
													value: newValue ? newValue.value : "",
												},
											});
										}}
										sx={{ width: "100%" }}
										renderInput={(params) => (
											<TextField
												{...params}
												placeholder={`Select Customer`}
												error={formErrors.customer}
												size="small"
												sx={{ width: "100%" }}
											/>
										)}
									/>
								</Box>
								<Box
									sx={{
										...flexCol,
										justifyContent: "flex-start",
										alignItems: "flex-start",
										width: "100%",
									}}>
									<Typography variant="body1" fontWeight={"bold"}>
										User
									</Typography>
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
												error={formErrors.user}
												size="small"
												sx={{ width: "100%" }}
											/>
										)}
									/>
								</Box>
							</Box>
							<Box sx={{ ...flexCol, justifyContent: "flex-start", alignItems: "flex-start" }}>
								<Typography variant="body1" fontWeight={"bold"}>
									Equipment
								</Typography>

								<Autocomplete
									options={equipmentOptions}
									getOptionLabel={(option) => option.label}
									isOptionEqualToValue={(option, value) => option.value === value.value}
									value={equipmentOptions.find((opt) => opt.value === formData.equipment) || null}
									onChange={(event, newValue) => {
										handleFormChange({
											target: {
												name: "equipment",
												value: newValue ? newValue.value : "",
											},
										});
									}}
									sx={{ width: "100%" }}
									renderInput={(params) => (
										<TextField
											{...params}
											placeholder={`Select Equipment`}
											error={formErrors.equipment}
											size="small"
											sx={{ width: "100%" }}
										/>
									)}
								/>
							</Box>
							<Box sx={{ ...flexCol, justifyContent: "flex-start", alignItems: "flex-start" }}>
								<Typography variant="body1" fontWeight={"bold"}>
									Assign To
								</Typography>

								<Autocomplete
									options={agentOptions}
									getOptionLabel={(option) => option.label}
									isOptionEqualToValue={(option, value) => option.value === value.value}
									value={agentOptions.find((opt) => opt.value === formData.staff) || null}
									onChange={(event, newValue) => {
										handleFormChange({
											target: {
												name: "staff",
												value: newValue ? newValue.value : "",
											},
										});
									}}
									sx={{ width: "100%" }}
									renderInput={(params) => (
										<TextField
											{...params}
											placeholder={`Select Service Engineer`}
											error={formErrors.staff}
											size="small"
											sx={{ width: "100%" }}
										/>
									)}
								/>
							</Box>
						</Box>
					</Box>
					<Divider orientation="vertical" flexItem />
					<Box sx={{ width: "50%", pl: 2 }}>
						<SectionTitle title={"Ticket Options"} subtitle="Please select appropriate ticket option" />

						<Box display="flex" flexDirection="column" rowGap={"15px"} mb={2} width={"100%"}>
							<Box
								sx={{
									...flexCol,
									justifyContent: "flex-start",
									alignItems: "flex-start",
									width: "100%",
								}}>
								<Typography variant="body1" fontWeight={"bold"}>
									Due Date
								</Typography>

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
							<Box
								sx={{
									...flexRow,
									justifyContent: "flex-start",
									alignItems: "flex-start",
									width: "100%",
									columnGap: 1,
									flexWrap: "nowrap",
								}}>
								<Box
									sx={{
										...flexCol,
										justifyContent: "flex-start",
										alignItems: "flex-start",
										width: "100%",
									}}>
									<Typography variant="body1" fontWeight={"bold"}>
										Ticket Notice
									</Typography>

									<FormControl fullWidth>
										<Select
											name={"ticket_notice"}
											size="small"
											value={formData.ticket_notice || ""}
											onChange={handleFormChange}
											error={formErrors.ticket_notice}
											displayEmpty>
											<MenuItem value="noalert">-- Do Not Send Alert --</MenuItem>
											<MenuItem value="all">Alert All</MenuItem>
											<MenuItem value="user">Alert to User</MenuItem>
										</Select>
									</FormControl>
								</Box>
								<Box
									sx={{
										...flexCol,
										justifyContent: "flex-start",
										alignItems: "flex-start",
										width: "100%",
									}}>
									<Typography variant="body1" fontWeight={"bold"}>
										Ticket Source
									</Typography>

									<FormControl fullWidth>
										<Select
											name={"ticket_source"}
											size="small"
											value={formData.ticket_source || ""}
											onChange={handleFormChange}
											error={formErrors.ticket_source}
											displayEmpty>
											<MenuItem value="web">Web</MenuItem>
											<MenuItem value="phone">Phone</MenuItem>
											<MenuItem value="email">Email</MenuItem>
											<MenuItem value="other">Other</MenuItem>
										</Select>
									</FormControl>
								</Box>
							</Box>
							<Box
								sx={{
									...flexRow,
									justifyContent: "flex-start",
									alignItems: "flex-start",
									width: "100%",
									columnGap: 1,
									flexWrap: "nowrap",
								}}>
								<Box
									sx={{
										...flexCol,
										justifyContent: "flex-start",
										alignItems: "flex-start",
										width: "100%",
									}}>
									<Typography variant="body1" fontWeight={"bold"}>
										Department
									</Typography>

									<FormControl fullWidth>
										<Select
											name={"department"}
											size="small"
											value={formData.department || ""}
											onChange={handleFormChange}
											error={formErrors.department}
											displayEmpty>
											<MenuItem value="maintenance">Maintenance</MenuItem>
											<MenuItem value="service">Service</MenuItem>
											<MenuItem value="support">Support</MenuItem>
										</Select>
									</FormControl>
								</Box>
								<Box
									sx={{
										...flexCol,
										justifyContent: "flex-start",
										alignItems: "flex-start",
										width: "100%",
									}}>
									<Typography variant="body1" fontWeight={"bold"}>
										SLA Plan
									</Typography>

									<FormControl fullWidth>
										<Select
											name={"sla"}
											size="small"
											value={formData.sla || ""}
											onChange={handleFormChange}
											error={formErrors.sla}
											displayEmpty>
											<MenuItem value="">-- System Default --</MenuItem>
										</Select>
									</FormControl>
								</Box>
							</Box>
						</Box>
					</Box>
				</Box>
				<Box sx={{ mt: 2 }}>
					<SectionTitle title={"Ticket Details"} subtitle="Please describe your issue" />
					<Box display="flex" flexDirection="column" rowGap={"15px"} mb={2} width={"100%"}>
						<Box
							sx={{
								...flexRow,
								justifyContent: "flex-start",
								alignItems: "flex-start",
								width: "100%",
								columnGap: 1,
								flexWrap: "nowrap",
							}}>
							<Box
								sx={{
									...flexCol,
									justifyContent: "flex-start",
									alignItems: "flex-start",
									width: "100%",
								}}>
								<Typography variant="body1" fontWeight={"bold"}>
									Ticket Priority
								</Typography>

								<FormControl fullWidth>
									<Select
										name={"priority"}
										size="small"
										value={formData.priority || ""}
										onChange={handleFormChange}
										error={formErrors.priority}
										displayEmpty>
										<MenuItem value="low">Low</MenuItem>
										<MenuItem value="normal">Normal</MenuItem>
										<MenuItem value="high">High</MenuItem>
										<MenuItem value="emergency">Emergency</MenuItem>
									</Select>
								</FormControl>
							</Box>

							<Box
								sx={{
									...flexCol,
									justifyContent: "flex-start",
									alignItems: "flex-start",
									width: "100%",
								}}>
								<Typography variant="body1" fontWeight={"bold"}>
									Service Type
								</Typography>

								<FormControl fullWidth>
									<Select
										name={"service_type"}
										size="small"
										value={formData.service_type || ""}
										onChange={handleFormChange}
										error={formErrors.service_type}
										displayEmpty>
										<MenuItem value="service">Service</MenuItem>
										<MenuItem value="installation">Installation</MenuItem>
										<MenuItem value="problem">Problem</MenuItem>
										<MenuItem value="request">Request</MenuItem>
									</Select>
								</FormControl>
							</Box>
						</Box>
						<Box sx={{ ...flexCol, justifyContent: "flex-start", alignItems: "flex-start" }}>
							<Typography variant="body1" fontWeight={"bold"}>
								Issue Summary
							</Typography>
							<TextField
								placeholder="Issue Summary"
								name="subject"
								error={formErrors.subject}
								value={formData.subject}
								onChange={handleFormChange}
								size="small"
								sx={{ width: "100%" }}
							/>
						</Box>
						<Box sx={{ ...flexCol, justifyContent: "flex-start", alignItems: "flex-start" }}>
							<Typography variant="body1" fontWeight={"bold"}>
								Description
							</Typography>
							<RichTextEditor value={formData.description} onChange={handleEditorChange} />
							{formErrors.description && (
								<Typography color="error" variant="body1" fontSize="12px" mt={1}>
									Description is required
								</Typography>
							)}
						</Box>
						<Box sx={{ ...flexCol, justifyContent: "flex-start", alignItems: "flex-start" }}>
							<Typography variant="body1" fontWeight={"bold"}>
								Attachments
							</Typography>

							{/* File Upload Area */}
							<Box sx={{ width: "100%" }}>
								<Box
									{...getRootProps()}
									sx={{
										border: "2px dashed #ccc",
										padding: 2,
										textAlign: "center",
										cursor: "pointer",
										width: "100%",
										minHeight: "40px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
									}}>
									<input {...getInputProps()} />
									<Typography>
										{formData.files && formData.files.length > 0
											? `Click to add more files or drag and drop here`
											: "Drag and drop files here, or click to select"}
									</Typography>
								</Box>
								{formErrors.file && (
									<Typography color="error" variant="body1" fontSize="12px" mt={1}>
										File is required
									</Typography>
								)}
							</Box>

							{/* Attached Files Display */}
							{formData.files && formData.files.length > 0 && (
								<Box sx={{ width: "100%", mt: 2 }}>
									<Typography variant="body2" color="textSecondary" mb={1}>
										Attached Files ({formData.files.length})
									</Typography>
									<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
										{formData.files.map((file, index) => (
											<Card
												key={index}
												variant="outlined"
												sx={{
													width: "100%",
													"&:hover": {
														backgroundColor: "action.hover",
													},
												}}>
												<CardContent
													sx={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														py: 1.5,
														"&:last-child": {
															pb: 1.5,
														},
													}}>
													<Box
														sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
														<AttachFileIcon color="action" fontSize="small" />
														<Box sx={{ flex: 1, minWidth: 0 }}>
															<Typography
																variant="body2"
																sx={{
																	fontWeight: 500,
																	overflow: "hidden",
																	textOverflow: "ellipsis",
																	whiteSpace: "nowrap",
																}}>
																{file.name}
															</Typography>
															<Typography variant="caption" color="textSecondary">
																{(file.size / 1024).toFixed(1)} KB
															</Typography>
														</Box>
														<Chip
															label={file.type || "Unknown"}
															size="small"
															variant="outlined"
															sx={{ ml: 1 }}
														/>
													</Box>
													<IconButton
														onClick={() => handleDeleteFile(index)}
														size="small"
														color="error"
														sx={{ ml: 1 }}>
														<DeleteIcon fontSize="small" />
													</IconButton>
												</CardContent>
											</Card>
										))}
									</Box>
								</Box>
							)}
						</Box>
					</Box>
				</Box>

				<Box display="flex" justifyContent="center" alignItems={"align"} mt={4}>
					<Box display="flex" gap={1}>
						<Button variant="outlined" color="primary" onClick={() => handleCancel()}>
							Cancel
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

export default NewTicket;
