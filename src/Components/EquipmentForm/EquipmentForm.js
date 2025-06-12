import React from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import { useState } from "react";
import { useEffect } from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Autocomplete,
	Box,
	Button,
	CircularProgress,
	Divider,
	Drawer,
	FormControl,
	FormControlLabel,
	IconButton,
	MenuItem,
	Paper,
	Select,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	Switch,
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
import Swal from "sweetalert2";
import {
	createEquipmentsService,
	fetchEquipmentByIdService,
	fetchEquipmentTypesService,
} from "../../Services/equipmentService";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRef } from "react";
import DocumentsForm from "../DocumentsForm/DocumentsForm";
import DocumentCard from "../DocumentCard/DocumentCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchDocumentsService } from "../../Services/documentService";
import _ from "lodash";
import FormField from "../FormField/FormField";
import ProvisionForm from "../ProvisionForm/ProvisionForm";
import ProvisionFormCard from "../ProvisionFormCard/ProvisionFormCard";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import DocumentsSelectionForm from "../DocumentsSelectionForm/DocumentsSelectionForm";

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
	customer: null,
	site: null,
	provisionedDate: moment(),
	serialNumber: "",
};

const EquipmentForm = ({
	drawerForm = true,
	setDrawerForm,
	formOpen,
	setFormOpen,
	formData,
	setFormData,
	activeStep,
	setActiveStep,
	fetchEquipments,
	equipments = [],
	isEditing = false,
	selectedEqId = null,
}) => {
	const steps = [
		{ label: "Equipment Details", description: "Enter basic equipment details", required: true },
		{ label: "Documents Provisioning", description: "Provision documnets to this equipment", required: false },
		{ label: "Customer(s) Provision", description: "Provision this equipment to customers", required: false },
	];

	const step0Ref = useRef(null);
	const initialFormDataRef = useRef();
	const { flexCol, flexRow } = useCustomTheme();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [eqList, setEqList] = useState([]);
	const [eqListTest, setEqListTest] = useState([]);
	const [equipmentImage, setEquipmentImage] = useState(null);
	const [provisionErrors, setProvisionErrors] = useState([]);
	const [docFormOpen, setDocFormOpen] = useState(false);
	const [selectExisting, setSelectExisting] = useState(false);
	const [documents, setDocuments] = useState([]);
	const [provisionedDocuments, setProvisionedDocuments] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [expanded, setExpanded] = useState("available");
	const [provisionFormOpen, setProvisionFormOpen] = useState(false);
	const [showParentOption, setShowParentOption] = useState(false);
	const [moveAlert, setMoveAlert] = useState(false);
	const [equipmentTypes, setEquipmentTypes] = useState([]);
	const [formErrors, setFormErrors] = useState({
		equipmentName: false,
		equipmentParent: false,
		internalNotes: false,
		isPublic: false,
		status: false,
	});
	const [formTitle, setFormTitle] = useState(
		isEditing ? `Editing Equipment: ${formData.equipmentName}` : `Add New Equipment`
	);
	const [parentEqDocs, setParentEqDocs] = useState([]);
	const [parentEqDocIds, setParentEqDocIds] = useState([]);
	const [shouldTriggerMoveAlert, setShouldTriggerMoveAlert] = useState(false);

	const formSubTitle = isEditing
		? "Please fill out the following to update equipment"
		: "Please fill out the following to add a new equipment";

	const handleAccordianChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	useEffect(() => {
		fetchEquipmentTypes();
		fetchDocuments();
	}, []);

	useEffect(() => {
		if (shouldTriggerMoveAlert) {
			setMoveAlert(true);
			setShouldTriggerMoveAlert(false); // Reset
		}
	}, [shouldTriggerMoveAlert]);

	const fetchEquipmentTypes = async () => {
		try {
			const response = await fetchEquipmentTypesService();
			console.log(response);
			if (response.status) {
				const typeOptions = response.data
					.filter((type) => type.key !== "max_levels")
					.map((type) => ({
						label: type.value,
						value: type.key,
					}));
				setEquipmentTypes(typeOptions);
				// setLoading(false);
			} else {
				setError("Failed Fetching Customer Users");
				setEquipmentTypes([]);
				// setLoading(false);
			}
		} catch (error) {
			setError("Failed Fetching Customer Users");
			// setLoading(false);
			setEquipmentTypes([]);
		}
	};

	useEffect(() => {
		if (formData.level && formData.level !== "" && formData.level !== "level_1") {
			if (equipments.length > 0) {
				const levelParts = formData.level.split("_");
				const currentLevelNum = parseInt(levelParts[1], 10);
				const parentLevel = `level_${currentLevelNum - 1}`;
				console.log("Eqs from Form: ", equipments);
				const eqs = equipments
					.filter((eq) => eq.level_key === parentLevel)
					.map((eq) => ({
						id: eq.id,
						label: eq.name,
					}));
				setEqList(eqs);
				setFormData((prev) => ({ ...prev, equipmentParent: { id: 0, label: "Select Parent" } }));
				const levelValue = equipmentTypes.find((et) => et.key === formData.level)?.value || "";
				setFormTitle(`Add New Equipment ${levelValue}`);
				setShowParentOption(true);
			}
		} else {
			setShowParentOption(false);
		}
	}, [formData.level]);

	useEffect(() => {
		if (formOpen) {
			initialFormDataRef.current = _.cloneDeep(formData);
		}
	}, [formOpen]);

	useEffect(() => {
		console.log("Eq Updated: ", formData);
	}, [formData]);

	useEffect(() => {
		if (moveAlert) {
			setTimeout(() => {
				setMoveAlert(false);
			}, 5000);
		}
	}, [moveAlert]);

	useEffect(() => {
		if (Object.keys(formData.equipmentParent).length > 0 && formData.equipmentParent.id !== 0) {
			fetchEquipmentParent();
		} else {
			setFormData((prev) => ({ ...prev, parent_doc_ids: [] }));
			setParentEqDocs([]);
			setExpanded("");
		}
	}, [formData.equipmentParent]);

	const fetchEquipmentParent = async () => {
		const response = await fetchEquipmentByIdService(formData.equipmentParent.id);
		const { parentDocs, kbIdArray } = extractDocs(response.data);
		console.log("Grouped Docs by Category:", parentDocs);
		console.log("Unique kb_ids:", kbIdArray);

		const alreadyExists =
			(formData.documents || []).some((doc) => kbIdArray.includes(doc.kb_id)) ||
			(formData.selected_doc_ids || []).some((id) => kbIdArray.includes(id));

		if (alreadyExists) {
			setMoveAlert(true);
		}

		setFormData((prev) => {
			const updatedDocuments = (prev.documents || []).filter((doc) => !kbIdArray.includes(doc.kb_id));

			const updatedSelectedIds = (prev.selected_doc_ids || []).filter((id) => !kbIdArray.includes(id));

			return {
				...prev,
				parent_doc_ids: kbIdArray,
				documents: updatedDocuments,
				selected_doc_ids: updatedSelectedIds,
			};
		});

		setParentEqDocs(parentDocs);
		setParentEqDocIds(kbIdArray);
	};

	const extractDocs = (equipment) => {
		const categoryMap = new Map(); // category_id → { category_name, docs: [] }
		const seenKbIds = new Set(); // To track unique kb_ids
		const kbIdArray = []; // To store unique kb_ids

		const traverse = (eq) => {
			if (!eq) return;

			eq.eq_docs?.forEach((doc) => {
				const kb = doc.knowledgebase;
				if (!kb || seenKbIds.has(kb.kb_id)) return;

				seenKbIds.add(kb.kb_id);
				kbIdArray.push(kb.kb_id);

				const category = kb.category;
				if (!category) return;

				const catId = category.category_id;
				if (!categoryMap.has(catId)) {
					categoryMap.set(catId, {
						category_id: catId,
						category_name: category.name,
						docs: [],
					});
				}

				categoryMap.get(catId).docs.push({
					kb_id: kb.kb_id,
					title: kb.title,
					description: kb.description,
					...kb,
				});
			});

			if (eq.parent_equipment) {
				traverse(eq.parent_equipment);
			}
		};

		traverse(equipment);

		return {
			parentDocs: Array.from(categoryMap.values()),
			kbIdArray, // Unique kb_ids
		};
	};

	// Navigation
	const handleNext = () => {
		if (activeStep === 0) {
			const requiredFields = ["equipmentName", "isPublic", "status"];
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
		try {
			await handleSubmit(formData);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchDocuments = async () => {
		setLoading(true);
		try {
			const response = await fetchDocumentsService();

			if (response.status) {
				const selectedIds = formData.documents || [];
				const docs = response.data
					.filter((doc) => !selectedIds.includes(doc.kb_id))
					.map((doc) => ({
						id: doc.kb_id,
						name: doc.title,
						category: doc?.category?.name || "",
					}));

				setDocuments(docs);

				const provisionedDocs = response.data
					.filter((doc) => selectedIds.includes(doc.kb_id)) // include only matched kb_ids
					.map((doc) => ({
						kb_id: doc.kb_id,
						category: doc?.category?.category_id || "",
						category_name: doc?.category?.name || "",
						newCategory: "",
						newCategoryListingType: "public",
						title: doc.title,
						description: doc.description,
						file: null,
						attachmentUrl: doc?.attachment?.path,
						attachmentType: doc?.attachment?.attachmentType || "na",
						listingType: doc.ispublished,
						internalNotes: doc.notes,
					}));
				setProvisionedDocuments(provisionedDocs);
				if (docs.length > 0) {
					setExpanded("available");
				} else {
					setExpanded("provisioned");
				}
				setLoading(false);
			}
		} catch (error) {
			console.log(error);
			setDocuments([]);
			setLoading(false);
		}
	};

	const handleParentInheritChange = () => {
		setFormData((prev) => {
			if (prev.parentDocsInherit) {
				// Turning OFF inheritance
				return {
					...prev,
					parentDocsInherit: false,
					parent_doc_ids: [],
				};
			} else {
				// Turning ON inheritance
				const selectedOverlap = (prev.selected_doc_ids || []).some((id) => parentEqDocIds.includes(id));
				const docOverlap = (prev.documents || []).some((doc) => parentEqDocIds.includes(doc.kb_id));

				if (selectedOverlap || docOverlap) {
					setShouldTriggerMoveAlert(true); // trigger outside render
				}

				const updatedSelectedDocIds = (prev.selected_doc_ids || []).filter(
					(id) => !parentEqDocIds.includes(id)
				);

				const updatedDocs = (prev.documents || []).filter((doc) => !parentEqDocIds.includes(doc.kb_id));

				return {
					...prev,
					parentDocsInherit: true,
					parent_doc_ids: parentEqDocIds,
					selected_doc_ids: updatedSelectedDocIds,
					documents: updatedDocs,
				};
			}
		});
	};

	const handleSubmit = async (data) => {
		setIsSubmitting(true);
		console.log("Final form data:", data);
		const req_body = {
			eq_id: selectedEqId ? selectedEqId : null,
			eq_pid: parseInt(data.equipmentParent?.id || null),
			ispublic: data.isPublic,
			status: parseInt(data.status),
			equipment: data.equipmentName,
			notes: data.internalNotes,
			documents: data.documents,
			provisions: data.provisions,
		};
		if (isEditing) {
			console.log("Editing: ", req_body);
		} else {
			const response = await createEquipmentsService(data);
			if (response.status) {
				setIsSubmitting(false);
				await fetchEquipments();
				setFormOpen(false);

				setDrawerForm(true);
				setActiveStep(0);
				setFormData({
					equipmentName: "",
					equipmentParent: { id: 0, label: "Select Parent" },
					internalNotes: "",
					isPublic: true,
					status: "0",
					documents: [],
					provisions: [],
					selected_doc_ids: [],
					parent_doc_ids: [],
					parentDocsInherit: true,
				});
				Swal.fire({
					icon: "success",
					title: "Success",
					text: response.message,
				});
			} else {
				setIsSubmitting(false);
			}
		}
	};

	const handleCloseForm = () => {
		const hasChanged = !_.isEqual(formData, initialFormDataRef.current);

		if (!hasChanged) {
			setFormOpen(false);
			setDrawerForm(true);
			setActiveStep(0);
			setFormData({
				equipmentName: "",
				equipmentParent: { id: 0, label: "Select Parent" },
				internalNotes: "",
				isPublic: true,
				status: "0",
				documents: [],
				provisions: [],
				selected_doc_ids: [],
				parent_doc_ids: [],
				parentDocsInherit: true,
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
				setDrawerForm(true);
				setActiveStep(0);
				setFormData({
					equipmentName: "",
					equipmentParent: { id: 0, label: "Select Parent" },
					internalNotes: "",
					isPublic: true,
					status: "0",
					documents: [],
					provisions: [],
					selected_doc_ids: [],
					parent_doc_ids: [],
					parentDocsInherit: true,
				});
			}
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

	const handleRemoveDocuments = (doc_id) => {
		const currentDocuments = formData.documents || [];
		const currentSelectedIds = formData.selected_doc_ids || [];

		const updatedDocuments = currentDocuments.filter((doc) => doc.kb_id !== doc_id);
		const updatedSelectedIds = currentSelectedIds.filter((id) => id !== doc_id);

		setFormData((prev) => ({
			...prev,
			documents: updatedDocuments,
			selected_doc_ids: updatedSelectedIds,
		}));
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

	if (loading) {
		return (
			<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", minHeight: "300px", width: "50vw" }}>
				<CircularProgress />
			</Box>
		);
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
										label={"Equipment Name"}
										showRequired={true}
										name="equipmentName"
										value={formData.equipmentName}
										onChange={handleFormChange}
										error={formErrors.equipmentName}
										inputRef={textFieldRef}
									/>

									<FormField
										type={"select"}
										label={"Equipment Type"}
										name={"level"}
										value={formData.level}
										error={formErrors.level}
										onChange={handleFormChange}
										showRequired
										options={equipmentTypes}
									/>

									{showParentOption && (
										<Box display="flex" alignItems="center">
											<Box width="200px" minWidth="200px">
												<Typography variant="body1" fontWeight={"bold"}>
													Equipment Parent:
												</Typography>
											</Box>
											<Autocomplete
												options={eqList}
												value={formData.equipmentParent}
												isOptionEqualToValue={(option, value) => option.id === value.id}
												onChange={(event, newValue) =>
													handleFormChange({
														target: { name: "equipmentParent", value: newValue },
													})
												}
												getOptionLabel={(option) => option.label || ""}
												sx={{ width: "100%" }}
												renderInput={(params) => <TextField {...params} size="small" />}
											/>
										</Box>
									)}

									<FormField
										type={"textarea"}
										label={"Internal Notes"}
										name={"internalNotes"}
										value={formData.internalNotes}
										error={formErrors.internalNotes}
										onChange={handleFormChange}
									/>
									<Box display="flex" alignItems="center">
										<Box width="200px" minWidth="200px">
											<Typography variant="body1" fontWeight={"bold"}>
												Equipment Image:{" "}
											</Typography>
										</Box>
										<Button
											variant="outlined"
											component="label"
											startIcon={<CloudUploadIcon />}
											sx={{ width: "150px" }}>
											Upload Image
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
										label={"Public"}
										name={"isPublic"}
										value={formData.isPublic ?? ""}
										onChange={handleFormChange}
										error={formErrors.isPublic}
										showRequired
										options={[
											{ value: "true", label: "Public" },
											{ value: "false", label: "Private" },
										]}
									/>
								</Box>
							)}

							{activeStep === 1 && (
								<Box key="step-1" sx={{ px: 1 }}>
									<Box
										mb={1}
										display={"flex"}
										flexDirection={"row"}
										alignItems={"flex-start"}
										justifyContent={"space-between"}>
										<Box>
											<Typography variant="body1" fontWeight={"bold"}>
												Provision Documents
											</Typography>
											<Typography variant="body1" color="text.secondary" fontSize={"11px"}>
												You can Add / Provision documents for this equipment
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
													setDocFormOpen(true);
													setSelectExisting(false);
												}}>
												Add New Document
											</Button>
											<Button
												variant="outlined"
												component="label"
												startIcon={<LibraryAddCheckIcon />}
												onClick={() => {
													setDocFormOpen(true);
													setSelectExisting(true);
												}}>
												Select Existing Documents
											</Button>
										</Box>
									</Box>

									{formData.documents.length > 0 ? (
										formData.documents.map((doc) => (
											<>
												<Box>
													<DocumentCard
														data={doc}
														showCategory={true}
														showDelete={true}
														handleRemove={handleRemoveDocuments}
														key={`${doc.title}_${doc.id}`}
													/>
												</Box>
											</>
										))
									) : (
										<Alert severity="info" sx={{ width: "100%" }}>
											No Provisioned Documents
										</Alert>
									)}

									{moveAlert && (
										<Alert severity="info" sx={{ width: "100%", mt: 2 }}>
											Some assigned documents are removed as the are inherited from the Parent.
										</Alert>
									)}

									{parentEqDocs.length > 0 && (
										<Box
											display="flex"
											flexDirection="column"
											justifyContent="flex-start"
											alignItems="flex-start"
											width="100%"
											mt={2}>
											<Box
												sx={{
													...flexRow,
													justifyContent: "space-between",
													alignItems: "flex-start",
													width: "100%",
													mb: 2,
												}}>
												<Box>
													<Typography variant="body1" fontWeight={"bold"}>
														Parent Equipment Documents
													</Typography>
													<Typography
														variant="body1"
														fontSize={"11px"}
														color="text.secondary"
														m={0}>
														List of all the documents inherited from the parent equipment
													</Typography>
												</Box>

												<FormControlLabel
													control={
														<Switch
															checked={formData.parentDocsInherit}
															onChange={handleParentInheritChange}
														/>
													}
													label="Inherit Parent Documents"
												/>
											</Box>
											{formData.parentDocsInherit &&
												parentEqDocs.map((category, index) => {
													const panelId = `parent-${index}`;
													return (
														<Accordion
															key={panelId}
															sx={{ width: "100%" }}
															expanded={expanded === panelId}
															onChange={handleAccordianChange(panelId)}>
															<AccordionSummary
																expandIcon={<ExpandMoreIcon />}
																aria-controls={`${panelId}-content`}
																id={`${panelId}-header`}>
																<Typography variant="body1" fontWeight="bold">
																	{category.category_name}
																</Typography>
															</AccordionSummary>
															<AccordionDetails>
																{category.docs.map((doc) => (
																	<>
																		<Box>
																			<DocumentCard
																				data={doc}
																				showCategory={false}
																				showDelete={false}
																				key={`${doc.title}_${doc?.kb_id}`}
																				origin="equipment"
																			/>
																		</Box>
																	</>
																))}
															</AccordionDetails>
														</Accordion>
													);
												})}
										</Box>
									)}
								</Box>
							)}

							{activeStep === 2 && (
								<Box
									key="step-2"
									display="flex"
									flexDirection="column"
									minHeight={"475px"}
									sx={{ px: 1 }}>
									<Box sx={{ ...flexRow, justifyContent: "space-between", mb: 1 }}>
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
											<Typography variant="body2" fontSize={"11px"} color="text.secondary">
												You can provision this equipment to the Customers
											</Typography>
										</Box>
										<Button
											variant="outlined"
											startIcon={<AddIcon />}
											// onClick={handleAddProvision}
											onClick={() => {
												setProvisionFormOpen(true);
												setError("");
											}}
											sx={{ alignSelf: "flex-start" }}>
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

					{/* Bottom navigation buttons */}
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
									{isEditing ? "Update Equipment" : formTitle}
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

			<Drawer anchor={"right"} sx={{ width: "45vw" }} open={docFormOpen}>
				{selectExisting ? (
					<DocumentsSelectionForm
						formOpen={docFormOpen}
						setFormOpen={setDocFormOpen}
						setCategoryFormData={setFormData}
						categoryFormData={formData}
						selectedCategory={formData.equipmentName}
						origin="equipment"
					/>
				) : (
					<DocumentsForm formOpen={docFormOpen} setFormOpen={setDocFormOpen} setEqFormData={setFormData} />
				)}
			</Drawer>

			<Drawer anchor={"right"} sx={{ width: "45vw" }} open={provisionFormOpen}>
				<ProvisionForm
					formOpen={provisionFormOpen}
					setFormOpen={setProvisionFormOpen}
					setParentData={setFormData}
					showCustomer={true}
					showEquipment={false}
					createProvision={false}
					showStaticCustomer={false}
					showStaticEquipment={true}
					customerName={formData?.customer_name || ""}
					equipmentName={formData?.equipmentName || ""}
					customerSites={formData?.sites || ""}
				/>
			</Drawer>
		</>
	);
};

export default EquipmentForm;
