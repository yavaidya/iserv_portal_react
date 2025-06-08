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
import {
	createDocumentService,
	fetchDocumentCategoriesService,
	fetchDocumentsService,
} from "../../Services/documentService";
import { useEffect } from "react";
import { useRef } from "react";
import _ from "lodash";
import CustomDatagrid from "../CustomDatagrid/CustomDatagrid";

const DocumentsSelectionForm = ({
	formOpen,
	setFormOpen,
	selectedCategory = null,
	categoryFormData = null,
	setCategoryFormData = null,
	origin = "category",
}) => {
	const [formData, setFormData] = useState({
		doc_ids: {
			type: "include",
			ids: new Set(),
		},
		documents: [],
	});
	const formTitle = `Select Documents for ${selectedCategory}`;
	const formSubTitle = "Select from the list of documents to be assigned to the category";
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const { flexRow, flexCol } = useCustomTheme();
	const [alert, setAlert] = useState("");
	const [documents, setDocuments] = useState([]);
	const [allDocs, setAllDocs] = useState([]);

	useEffect(() => {
		fetchDocuments();
	}, []);
	const handleSubmit = async (addNew = false) => {
		if (formData.documents.length <= 0) {
			setAlert("Please Select at least 1 Document");
			return;
		}

		let req_body = formData;

		setAlert("");
		setFormSubmitting(true);
		console.log("Form submitted", req_body);

		if (setCategoryFormData && origin === "category") {
			const provisionedDocs = allDocs
				.filter((doc) => req_body.documents.includes(doc.kb_id))
				.map((doc) => ({
					kb_id: doc.kb_id,
					category: selectedCategory,
					newCategory: "",
					newCategoryListingType: "public",
					title: doc.title,
					description: doc.description,
					file: null,
					attachmentUrl: "",
					attachmentType: "na",
					listingType: doc.ispublished,
					internalNotes: doc.notes,
				}));
			setCategoryFormData((prev) => {
				const existingTitles = new Set((prev.new_docs || []).map((doc) => doc.title));
				const uniqueProvisionedDocs = provisionedDocs.filter((doc) => !existingTitles.has(doc.title));
				return {
					...prev,
					new_docs: [...(prev.new_docs || []), ...uniqueProvisionedDocs],
					selected_documents: Array.isArray(prev.selected_documents)
						? [...prev.selected_documents, ...req_body.documents]
						: req_body.documents,
				};
			});
			if (!addNew) {
				setFormOpen(false);
			}
			setFormData({
				doc_ids: {
					type: "include",
					ids: new Set(),
				},
				documents: [],
			});
			setTimeout(() => {
				setFormSubmitting(false);
			}, 1500);
		} else if (setCategoryFormData && origin === "equipment") {
			const provisionedDocs = allDocs
				.filter((doc) => req_body.documents.includes(doc.kb_id))
				.map((doc) => ({
					kb_id: doc.kb_id,
					category: selectedCategory,
					newCategory: "",
					newCategoryListingType: "public",
					title: doc.title,
					description: doc.description,
					file: null,
					attachmentUrl: "",
					attachmentType: "na",
					listingType: doc.ispublished,
					internalNotes: doc.notes,
				}));

			const kbIdsArray = provisionedDocs.map((doc) => doc.kb_id);

			setCategoryFormData((prev) => {
				const existingDocIds = Array.isArray(prev.selected_doc_ids) ? prev.selected_doc_ids : [];
				const mergedDocIds = [...new Set([...existingDocIds, ...kbIdsArray])];

				const existingDocs = Array.isArray(prev.documents) ? prev.documents : [];
				const mergedDocs = [...existingDocs, ...provisionedDocs];

				return {
					...prev,
					documents: mergedDocs,
					selected_doc_ids: mergedDocIds,
				};
			});
			if (!addNew) {
				setFormOpen(false);
			}
			setFormData({
				doc_ids: {
					type: "include",
					ids: new Set(),
				},
				documents: [],
			});
			setFormSubmitting(false);
		}

		// Submit logic goes here
	};
	const handleCloseForm = () => {
		setFormOpen(false);
		setFormData({
			doc_ids: {
				type: "include",
				ids: new Set(),
			},
			documents: [],
		});
	};
	const handleDocRowSelect = (selectedRows) => {
		const rows = Array.from(selectedRows.ids);
		console.log("Selected doc row IDs:", rows);
		setFormData((prevData) => ({
			...prevData,
			doc_ids: selectedRows,
			documents: rows,
		}));
	};

	const handleDocRowClick = (params) => {
		console.log("Row clicked:", params.row);
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
			align: "left",
			headerAlign: "left",
			renderCell: (params) =>
				params.value === "" ? (
					<span style={{ fontSize: "10px", color: "gray" }}>No Category</span>
				) : (
					params.value
				),
		},
	];
	const fetchDocuments = async () => {
		setFormLoading(true);
		try {
			const response = await fetchDocumentsService();

			if (response.status) {
				let selectedIds = [];
				if (origin === "equipment") {
					const selected_doc_ids = categoryFormData?.selected_doc_ids || [];
					const parent_doc_ids = categoryFormData?.parent_doc_ids || [];
					selectedIds = [...new Set([...selected_doc_ids, ...parent_doc_ids])];
				} else {
					selectedIds = categoryFormData?.selected_documents || [];
				}
				const docs = response.data
					.filter((doc) => !selectedIds.includes(doc.kb_id))
					.map((doc) => ({
						id: doc.kb_id,
						name: doc.title,
						category: doc?.category?.name || "",
						data: doc,
					}));

				setDocuments(docs);
				setAllDocs(response.data);
				setFormLoading(false);
			}
		} catch (error) {
			console.log(error);
			setDocuments([]);
			setFormLoading(false);
		}
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
				{documents.length > 0 ? (
					<>
						<Typography variant="body1" fontWeight={"bold"}>
							Available Documents to Provision
						</Typography>
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
					</>
				) : (
					<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
						No Documents available to assign
					</Alert>
				)}
			</Box>

			<Box display="flex" justifyContent="space-between" mt={2}>
				<Button variant="outlined" onClick={handleCloseForm}>
					Cancel
				</Button>
				<Box display="flex" gap={1}>
					<Button
						variant="contained"
						color="primary"
						disabled={documents.length <= 0}
						onClick={() => handleSubmit(false)}>
						Submit
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default DocumentsSelectionForm;
