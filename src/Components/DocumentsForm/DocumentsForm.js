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
} from "@mui/material";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import PageHeader from "../PageHeader/PageHeader";
import CloseIcon from "@mui/icons-material/Close";
import { useCustomTheme } from "../../Context/ThemeContext";
import { useDropzone } from "react-dropzone";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { createDocumentService, fetchDocumentCategoriesService } from "../../Services/documentService";
import { useEffect } from "react";
import { useRef } from "react";
import _ from "lodash";
import Documents from "../../Pages/Documents/Documents";

const DocumentsForm = ({
	formOpen,
	setFormOpen,
	setEqFormData = null,
	setDocuments = null,
	selectedCategory = null,
	showCategories = true,
	setCategoryFormData = null,
}) => {
	const [formData, setFormData] = useState({
		category: "",
		newCategory: "",
		newCategoryListingType: "public",
		title: "",
		description: "",
		file: null,
		attachmentUrl: "",
		attachmentType: "na",
		listingType: "public",
		internalNotes: "",
	});
	const initialFormDataRef = useRef();
	const formTitle = "Add new Document";
	const formSubTitle = "Upload a document and assign metadata";
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [showUrlField, setShowUrlField] = useState(false);
	const [showUploadBox, setShowUploadBox] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const { flexRow, flexCol } = useCustomTheme();
	const [formErrors, setFormErrors] = useState({});
	const [showNewCategoryField, setShowNewCategoryField] = useState(false);
	const [alert, setAlert] = useState("");
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		if (showCategories) {
			fetchCategories();
		}
	}, []);

	useEffect(() => {
		if (formOpen) {
			initialFormDataRef.current = _.cloneDeep(formData);
		}
	}, [formOpen]);

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (formErrors[name]) {
			setFormErrors((prev) => ({ ...prev, [name]: false }));
		}

		if (showCategories) {
			if (name === "category" && value === "new") {
				setShowNewCategoryField(true);
			} else if (name === "category") {
				setShowNewCategoryField(false);
			}
		}

		if (name === "attachmentType" && value === "url") {
			setShowUrlField(true);
			setShowUploadBox(false);
		} else if (name === "attachmentType" && value === "file") {
			setShowUrlField(false);
			setShowUploadBox(true);
		} else if (name === "attachmentType" && value === "na") {
			setShowUrlField(false);
			setShowUploadBox(false);
		}
	};

	const fetchCategories = async () => {
		try {
			setFormLoading(true);
			const response = await fetchDocumentCategoriesService();
			if (response.status) {
				const cats = response.data.map((cat) => {
					return {
						category_id: cat.category_id,
						category_name: cat.name,
					};
				});
				cats.push({
					category_id: "new", // or null, or a special key
					category_name: "Create New Category",
				});
				setCategories(cats);
				setFormLoading(false);
				console.log("Categories", response);
			}
		} catch (error) {
			console.log(error);
			setFormLoading(false);
		}
	};

	const handleEditorChange = ({ html }) => {
		setFormData((prev) => ({ ...prev, description: html }));
		if (formErrors.description) {
			setFormErrors((prev) => ({ ...prev, description: false }));
		}
	};

	const onDrop = (acceptedFiles) => {
		const file = acceptedFiles[0];
		if (
			file &&
			[
				"application/pdf",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				"application/vnd.ms-excel",
				"text/csv",
			].includes(file.type)
		) {
			setFormData((prev) => ({ ...prev, file }));
			setAlert("");
		} else {
			setAlert("Unsupported file type. Please upload PDF, Word, Excel, or CSV.");
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const handleSubmit = async (addNew = false) => {
		const errors = {};
		if (showCategories) {
			if (!formData.category) errors.category = true;
			if (showNewCategoryField && !formData.newCategory) errors.newCategory = true;
			if (showNewCategoryField && !formData.newCategoryListingType) errors.newCategoryListingType = true;
		}
		if (showUrlField && !formData.attachmentUrl) errors.attachmentUrl = true;
		if (showUploadBox && !formData.file) errors.file = true;
		if (!formData.title) errors.title = true;
		if (!formData.listingType) errors.listingType = true;
		if (!formData.description) errors.description = true;

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			setAlert("Please fill all required fields.");
			return;
		}

		let req_body = formData;

		if (showCategories) {
			const selectedCategory = categories.find((cat) => cat.category_id === formData.category);

			if (selectedCategory) {
				req_body = { ...formData, category_name: selectedCategory.category_name };
			}
		}

		setAlert("");
		setFormSubmitting(true);
		console.log("Form submitted", req_body);
		if (showCategories) {
			const response = await createDocumentService(req_body);
			console.log(response);
			if (response.status) {
				const kb_id = response.data.kb_id;
				if (setEqFormData) {
					req_body = { ...formData, kb_id: kb_id };
					console.log(req_body);
					setEqFormData((prev) => ({
						...prev,
						documents: Array.isArray(prev.documents) ? [...prev.documents, req_body] : [req_body],
						selected_doc_ids: Array.isArray(prev.selected_doc_ids)
							? [...prev.selected_doc_ids, req_body.kb_id]
							: [req_body.kb_id],
					}));
				} else if (setDocuments) {
					const doc = response.data;

					setDocuments((prev) => [
						...prev,
						...[
							{
								kb_id: doc.kb_id,
								name: doc.title,
								category_id: doc.category_id,
								category_name: doc?.category?.name || "",
								is_published: doc.ispublished ? "Public" : "Private",
								created: doc.createdAt,
								attachment_count: doc.attachment ? 1 : 0,
							},
						],
					]);
				}
				if (!addNew) {
					setFormOpen(false);
				}
				setFormData({
					category: "",
					newCategory: "",
					newCategoryListingType: "public",
					title: "",
					description: "",
					file: null,
					attachmentUrl: "",
					attachmentType: "na",
					listingType: "public",
					internalNotes: "",
				});
				setTimeout(() => {
					setFormSubmitting(false);
				}, 1500);
			} else {
				setAlert(response.message);
				setFormLoading(false);
				setFormSubmitting(false);
			}
		} else {
			if (setCategoryFormData) {
				req_body = { ...formData, category_name: selectedCategory, kb_id: null };
				setCategoryFormData((prev) => ({
					...prev,
					new_docs: Array.isArray(prev.new_docs) ? [...prev.new_docs, req_body] : [req_body],
				}));
				if (!addNew) {
					setFormOpen(false);
				}
				setFormData({
					category: "",
					newCategory: "",
					newCategoryListingType: "public",
					title: "",
					description: "",
					file: null,
					attachmentUrl: "",
					attachmentType: "na",
					listingType: "public",
					internalNotes: "",
				});
				setTimeout(() => {
					setFormSubmitting(false);
				}, 1500);
			}
		}
		// Submit logic goes here
	};

	const handleCloseForm = () => {
		const hasChanged = !_.isEqual(formData, initialFormDataRef.current);

		if (!hasChanged) {
			setFormOpen(false);
			setFormData({
				category: "",
				newCategory: "",
				newCategoryListingType: "public",
				title: "",
				description: "",
				file: null,
				attachmentUrl: "",
				attachmentType: "na",
				listingType: "public",
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
				setFormOpen(false);
				setFormData({
					category: "",
					newCategory: "",
					newCategoryListingType: "public",
					title: "",
					description: "",
					file: null,
					attachmentUrl: "",
					attachmentType: "na",
					listingType: "public",
					internalNotes: "",
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
						Creating New Document
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
				sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", px: 2, pt: 1 }}>
				{showCategories && (
					<>
						<Box display="flex" alignItems="center">
							<Box width="200px" minWidth="200px">
								<Typography fontWeight="bold">
									Document Category: <span style={{ color: "red" }}>*</span>
								</Typography>
							</Box>
							<FormControl fullWidth size="small">
								<Select
									name="category"
									value={formData.category}
									onChange={handleFormChange}
									error={formErrors.category}
									displayEmpty>
									<MenuItem value="" disabled>
										Select Category
									</MenuItem>
									{categories.map((cat) => (
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

						{/* New Category */}
						{showNewCategoryField && (
							<>
								<Box display="flex" alignItems="center">
									<Box width="200px" minWidth="200px">
										<Typography fontWeight="bold">
											New Category Name: <span style={{ color: "red" }}>*</span>
										</Typography>
									</Box>
									<TextField
										name="newCategory"
										value={formData.newCategory}
										onChange={handleFormChange}
										error={formErrors.newCategory}
										size="small"
										fullWidth
									/>
								</Box>
								<Box display="flex" alignItems="center">
									<Box width="200px" minWidth="200px">
										<Typography fontWeight="bold">
											Category Listing Type: <span style={{ color: "red" }}>*</span>
										</Typography>
									</Box>
									<FormControl fullWidth size="small">
										<Select
											name="listingType"
											value={formData.newCategoryListingType}
											error={formErrors.newCategoryListingType}
											onChange={handleFormChange}>
											<MenuItem value="public">Public</MenuItem>
											<MenuItem value="private">Private</MenuItem>
										</Select>
									</FormControl>
								</Box>
							</>
						)}
					</>
				)}

				{/* Title */}
				<Box display="flex" alignItems="center">
					<Box width="200px" minWidth="200px">
						<Typography fontWeight="bold">
							Document Title: <span style={{ color: "red" }}>*</span>
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

				{/* Description */}
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

				<Box display="flex" alignItems="center">
					<Box width="200px" minWidth="200px">
						<Typography fontWeight="bold">Document Attachment Type:</Typography>
					</Box>
					<FormControl fullWidth size="small">
						<Select
							name="attachmentType"
							value={formData.attachmentType}
							error={formErrors.attachmentType}
							onChange={handleFormChange}>
							<MenuItem value="na">-- No Attachment --</MenuItem>
							<MenuItem value="url">URL</MenuItem>
							<MenuItem value="file">File</MenuItem>
						</Select>
					</FormControl>
				</Box>

				{showUploadBox && (
					<>
						<Box display="flex" alignItems="flex-start">
							<Box width="200px" minWidth="200px" mt={1}>
								<Typography fontWeight="bold">
									Upload File: <span style={{ color: "red" }}>*</span>
								</Typography>
							</Box>
							<Box sx={{ width: "100%" }}>
								<Box
									{...getRootProps()}
									sx={{
										border: "2px dashed #ccc",
										padding: 2,
										textAlign: "center",
										cursor: "pointer",
										width: "100%",
										minHeight: 100,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
									}}>
									<input {...getInputProps()} />
									<Typography>
										{formData.file
											? formData.file.name
											: "Drag and drop a file here, or click to select"}
									</Typography>
								</Box>
								{formErrors.file && (
									<Typography color="error" variant="body1" fontSize="12px" mt={1}>
										File is required
									</Typography>
								)}
							</Box>
						</Box>
					</>
				)}
				{showUrlField && (
					<Box display="flex" alignItems="center">
						<Box width="200px" minWidth="200px">
							<Typography fontWeight="bold">
								Attachment Url: <span style={{ color: "red" }}>*</span>
							</Typography>
						</Box>
						<TextField
							name="attachmentUrl"
							value={formData.attachmentUrl}
							onChange={handleFormChange}
							error={formErrors.attachmentUrl}
							size="small"
							fullWidth
						/>
					</Box>
				)}
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
	);
};

export default DocumentsForm;
