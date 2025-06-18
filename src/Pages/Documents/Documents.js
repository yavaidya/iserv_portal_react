import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { Alert, Box, CircularProgress, Drawer, Tooltip } from "@mui/material";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import { useCustomTheme } from "../../Context/ThemeContext";
import { fetchDocumentsService } from "../../Services/documentService";
import DocumentsForm from "../../Components/DocumentsForm/DocumentsForm";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../../Components/ErrorAlertWrapper/ErrorAlertWrapper";
import { formatDate } from "../../Services/globalServiceUtils";
import EntityWrapper from "../../Components/EntityWrapper/EntityWrapper";

const Documents = () => {
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [formOpen, setFormOpen] = useState(false);
	const [useDrawer, setUseDrawer] = useState(true);
	const [documents, setDocuments] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const columns = [
		{
			field: "name",
			headerName: "Name",
			flex: 1,
			renderCell: (params) => (
				<Tooltip title="View Document">
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
			field: "category_name",
			headerName: "Category Name",
			width: 250,
		},
		{
			field: "is_published",
			headerName: "Status",
			width: 250,
		},
		{
			field: "attachment_count",
			headerName: "# Documents",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === 0 || !params.value ? (
					<span style={{ fontSize: "10px", color: "gray" }}>No Attachments</span>
				) : (
					params.value
				),
		},

		{
			field: "created",
			headerName: "Created",
			width: 200,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => formatDate(params.value),
		},
	];
	const handleOpenForm = () => {
		setFormOpen(true);
	};

	const customButtons = [
		{
			label: "Document",
			icon: <AddCircleIcon />,
			onClick: () => {
				setIsEditing(false);
				handleOpenForm();
			},
		},
	];

	useEffect(() => {
		setActiveTitle({
			title: "Documents",
			subtitle: "List of all the Documents",
		});
		fetchDocuments();
	}, []);

	const fetchDocuments = async () => {
		try {
			setLoading(true);
			const response = await fetchDocumentsService();
			if (response.status) {
				if (response.data.length > 0) {
					const docs = response.data.map((doc) => {
						return {
							kb_id: doc.kb_id,
							name: doc.title,
							category_id: doc.category_id,
							category_name: doc?.category?.name || "",
							is_published: doc.ispublished ? "Public" : "Private",
							created: doc.createdAt,
							attachment_count: doc.attachment ? 1 : 0,
						};
					});

					setDocuments(docs);
					setError(null);
					setLoading(false);
					console.log("Documents", response);
				} else {
					setLoading(false);
					setDocuments([]);
				}
			} else {
				setError("Failed Fetching Customer Users");
				setDocuments([]);
				setLoading(false);
			}
		} catch (error) {
			console.log(error);
			setError("Failed Fetching Customer Users");
			setDocuments([]);
			setLoading(false);
		}
	};

	const handleRowSelect = (selectedRows) => {
		console.log("Selected row IDs:", selectedRows);
	};

	const handleRowClick = (params) => {
		console.log("Row clicked:", params.row);
	};

	if (loading) {
		return <LoadingWrapper minHeight={"400px"} />;
	}

	if (error && !loading) {
		return <ErrorAlertWrapper minHeight={"400px"} error={error} />;
	}
	return (
		<EntityWrapper
			title={"Documents"}
			subtitle={"List of all the Documents"}
			activeKey={"documents"}
			data={documents}
			setData={setDocuments}
			columns={columns}
			rowIdField="kb_id"
			onSelect={handleRowSelect}
			rowClick={true}
			onRowClick={handleRowClick}
			checkboxSelection={true}
			customButtons={customButtons}
			sortBy={[{ field: "created", sort: "desc" }]}
			formProps={{
				formOpen: formOpen,
				setFormOpen: setFormOpen,
				setParentData: setDocuments,
				fetchParentData: fetchDocuments,
				selectedRow: null,
			}}
			FormComponent={DocumentsForm}
		/>
	);
};

export default Documents;
