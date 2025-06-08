import React, { useState } from "react";
import {
	Box,
	Button,
	MenuItem,
	Select,
	TextField,
	Typography,
	Alert,
	InputLabel,
	FormControl,
	Tooltip,
	IconButton,
	CircularProgress,
	Drawer,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Divider,
} from "@mui/material";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import PageHeader from "../PageHeader/PageHeader";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useCustomTheme } from "../../Context/ThemeContext";
import Swal from "sweetalert2";
import { createDocumentCategoriesService } from "../../Services/documentService";
import { useEffect } from "react";
import { useRef } from "react";
import _ from "lodash";
import DocumentsForm from "../DocumentsForm/DocumentsForm";
import DocumentCard from "../DocumentCard/DocumentCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import DocumentsSelectionForm from "../DocumentsSelectionForm/DocumentsSelectionForm";
const DocumentCategoriesForm = ({ formOpen, setFormOpen, setCategories = null, selectedCategory = null }) => {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		listingType: "public",
		internalNotes: "",
		new_docs: [],
	});
	const initialFormDataRef = useRef();
	const formTitle = "Add new Document Category";
	const formSubTitle = "Create new Document Category and upload documents";
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const { flexRow, flexCol } = useCustomTheme();
	const [formErrors, setFormErrors] = useState({});
	const [alert, setAlert] = useState("");
	const [docFormOpen, setDocFormOpen] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [selectExisting, setSelectExisting] = useState(false);
	useEffect(() => {
		if (formOpen) {
			initialFormDataRef.current = _.cloneDeep(formData);
		}
	}, [formOpen]);

	useEffect(() => {
		console.log(formData);
	}, [formData]);

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (formErrors[name]) {
			setFormErrors((prev) => ({ ...prev, [name]: false }));
		}
	};

	const handleEditorChange = ({ html }) => {
		setFormData((prev) => ({ ...prev, description: html }));
		if (formErrors.description) {
			setFormErrors((prev) => ({ ...prev, description: false }));
		}
	};
	const handleSubmit = async (addNew = false) => {
		const errors = {};
		if (!formData.title) errors.title = true;
		if (!formData.listingType) errors.listingType = true;
		if (!formData.description) errors.description = true;

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			setAlert("Please fill all required fields.");
			return;
		}

		let req_body = {
			category_name: formData.title,
			description: formData.description,
			listing_type: formData.listingType,
			notes: formData.internalNotes,
			documents: formData.new_docs,
			selected_documents: formData?.selected_documents || [],
		};

		setAlert("");
		setFormSubmitting(true);
		console.log("Form submitted", req_body);
		const response = await createDocumentCategoriesService(req_body);
		console.log(response);
		if (response.status) {
			if (setCategories) {
				const docs = response.data.map((cat) => ({
					category_id: cat.category_id,
					category_name: cat.name,
					created: cat.createdAt,
					kb_count: cat?.knowledgebases?.length || 0,
				}));

				setCategories(docs);
			}
			if (!addNew) {
				setFormOpen(false);
			}
			setFormData({
				title: "",
				description: "",
				listingType: "public",
				internalNotes: "",
				new_docs: [],
			});
			setTimeout(() => {
				setFormSubmitting(false);
			}, 1500);
		} else {
			setAlert(response.message);
			setFormLoading(false);
			setFormSubmitting(false);
		}
		// Submit logic goes here
	};

	const handleRemoveDocuments = (doc_title, doc_desc) => {
		const currentDocuments = formData.new_docs || [];
		const currentSelectedIds = formData.selected_documents || [];

		// Find all kb_ids of documents that match the title and description
		const matchingKbIds = currentDocuments
			.filter((doc) => doc.title === doc_title && doc.description === doc_desc)
			.map((doc) => doc.kb_id);

		// Remove matching documents
		const updatedDocuments = currentDocuments.filter(
			(doc) => !(doc.title === doc_title && doc.description === doc_desc)
		);

		// Remove matching kb_ids from selected_documents
		const updatedSelectedIds = currentSelectedIds.filter((id) => !matchingKbIds.includes(id));

		setFormData((prev) => ({
			...prev,
			new_docs: updatedDocuments,
			selected_documents: updatedSelectedIds,
		}));
	};

	const handleCloseForm = () => {
		const hasChanged = !_.isEqual(formData, initialFormDataRef.current);

		if (!hasChanged) {
			setFormOpen(false);
			setFormData({
				title: "",
				description: "",
				listingType: "public",
				internalNotes: "",
				new_docs: [],
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
					title: "",
					description: "",
					listingType: "public",
					internalNotes: "",
					new_docs: [],
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
						Creating New Document Category
					</Typography>
				)}
			</Box>
		);
	}

	return (
		<>
			<Box p={2} width="50vw" sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
				<Box
					sx={{
						...flexRow,
						justifyContent: "flex-end",
						width: "100%",
					}}>
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
					sx={{
						flexGrow: 1,
						display: "flex",
						flexDirection: "column",
						gap: 2,
						overflowY: "auto",
						px: 2,
						pt: 1,
					}}>
					<Box display="flex" alignItems="center">
						<Box width="200px" minWidth="200px">
							<Typography fontWeight="bold">
								Category Name: <span style={{ color: "red" }}>*</span>
							</Typography>
						</Box>
						<TextField
							name="title"
							value={formData.title}
							onChange={handleFormChange}
							error={formErrors.title}
							size="small"
							fullWidth
						/>
					</Box>

					<Box display="flex" alignItems="flex-start">
						<Box width="200px" minWidth="200px">
							<Typography fontWeight="bold">
								Description: <span style={{ color: "red" }}>*</span>
							</Typography>
						</Box>
						<Box sx={{ width: "100%" }}>
							<RichTextEditor value={formData.description} onChange={handleEditorChange} placeholder="" />
							{formErrors.description && (
								<Typography color="error" variant="body1" fontSize="12px" mt={1}>
									Description is required
								</Typography>
							)}
						</Box>
					</Box>
					<Box display="flex" alignItems="center">
						<Box width="200px" minWidth="200px">
							<Typography fontWeight="bold">
								Listing Type: <span style={{ color: "red" }}>*</span>
							</Typography>
						</Box>
						<FormControl fullWidth size="small">
							<Select
								name="listingType"
								value={formData.listingType}
								error={formErrors.listingType}
								onChange={handleFormChange}>
								<MenuItem value="public">Public</MenuItem>
								<MenuItem value="private">Private</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<Box display="flex" alignItems="flex-start">
						<Box width="200px" minWidth="200px">
							<Typography fontWeight="bold">Internal Notes:</Typography>
						</Box>
						<TextField
							name="internalNotes"
							value={formData.internalNotes}
							onChange={handleFormChange}
							multiline
							rows={4}
							fullWidth
							size="small"
						/>
					</Box>
					<Box display="flex" alignItems="flex-start">
						<Box width="200px" minWidth="200px">
							<Typography fontWeight="bold">Add Documents:</Typography>
						</Box>
						<Box sx={{ ...flexRow, justifyContent: "flex-start", columnGap: 2, alignItems: "center" }}>
							<Button
								variant="outlined"
								component="label"
								startIcon={<CloudUploadIcon />}
								onClick={() => {
									if (formData.title) {
										setSelectExisting(false);
										setDocFormOpen(true);
										setAlert("");
									} else {
										setSelectExisting(false);
										setAlert("Please Enter Category Name before adding Documents");
										return;
									}
								}}>
								Upload New Documents
							</Button>
							<Typography variant="body1">Or</Typography>
							<Button
								variant="outlined"
								component="label"
								startIcon={<LibraryAddCheckIcon />}
								onClick={() => {
									if (formData.title) {
										setSelectExisting(true);
										setDocFormOpen(true);
										setAlert("");
									} else {
										setSelectExisting(false);
										setAlert("Please Enter Category Name before adding Documents");
										return;
									}
								}}>
								Select Existing Documents
							</Button>
						</Box>
					</Box>
					<Divider flexItem sx={{ my: "10px" }} />
					<Box>
						{formData.new_docs && formData.new_docs.length > 0 && (
							<>
								<Typography variant="body1" fontWeight={"bold"} mb={1}>
									Following Documents will be assigned to this category:{" "}
								</Typography>
								{formData.new_docs.map((doc, index) => (
									<Box key={index}>
										<DocumentCard
											data={doc}
											handleRemove={handleRemoveDocuments}
											key={`${doc.title}_${doc?.kb_id}`}
											origin="category"
										/>
									</Box>
								))}
							</>
						)}
					</Box>
				</Box>

				<Box display="flex" justifyContent="space-between" mt={2}>
					<Button variant="outlined" onClick={handleCloseForm}>
						Cancel
					</Button>
					<Box display="flex" gap={1}>
						<Button variant="contained" color="primary" onClick={() => handleSubmit(true)}>
							Upload & Add New
						</Button>
						<Button variant="contained" color="primary" onClick={() => handleSubmit(false)}>
							Upload
						</Button>
					</Box>
				</Box>
			</Box>
			<Drawer anchor={"right"} sx={{ width: "45vw" }} open={docFormOpen}>
				{selectExisting ? (
					<DocumentsSelectionForm
						formOpen={docFormOpen}
						setFormOpen={setDocFormOpen}
						setCategoryFormData={setFormData}
						categoryFormData={formData}
						selectedCategory={formData.title}
					/>
				) : (
					<DocumentsForm
						formOpen={docFormOpen}
						setFormOpen={setDocFormOpen}
						setCategoryFormData={setFormData}
						showCategories={false}
						selectedCategory={formData.title}
					/>
				)}
			</Drawer>
		</>
	);
};

export default DocumentCategoriesForm;
