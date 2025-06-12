import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { Alert, Box, CircularProgress, Drawer, Tooltip } from "@mui/material";
import { fetchCustomersService, fetchCustomerUsersService } from "../../Services/customerService";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import { error } from "jodit/esm/core/helpers";
import { useCustomTheme } from "../../Context/ThemeContext";
import { fetchDocumentCategoriesService } from "../../Services/documentService";
import DocumentsForm from "../../Components/DocumentsForm/DocumentsForm";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DocumentCategoriesForm from "../../Components/DocumentCategoriesForm/DocumentCategoriesForm";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../../Components/ErrorAlertWrapper/ErrorAlertWrapper";
import { formatDate } from "../../Services/globalServiceUtils";
import EntityWrapper from "../../Components/EntityWrapper/EntityWrapper";

const DocumentCategories = () => {
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [formOpen, setFormOpen] = useState(false);
	const [useDrawer, setUseDrawer] = useState(true);
	const [categories, setCategories] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);

	const handleOpenForm = () => {
		setFormOpen(true);
	};

	const columns = [
		{
			field: "category_name",
			headerName: "Category Name",
			flex: 1,
			renderCell: (params) => (
				<Tooltip title="View Category Details">
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
			field: "kb_count",
			headerName: "# Documents",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === 0 || !params.value ? (
					<span style={{ fontSize: "10px", color: "gray" }}>No Documents</span>
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

	const customButtons = [
		{
			label: "Document Category",
			icon: <AddCircleIcon />,
			onClick: () => {
				setIsEditing(false);
				handleOpenForm();
			},
		},
	];

	useEffect(() => {
		fetchDocumentCategories();
	}, []);

	const fetchDocumentCategories = async () => {
		try {
			setLoading(true);
			const response = await fetchDocumentCategoriesService();
			if (response.status) {
				const cats = response.data.map((cat) => {
					return {
						category_id: cat.category_id,
						category_name: cat.name,
						created: cat.createdAt,
						kb_count: cat?.knowledgebases?.length || 0,
					};
				});

				setCategories(cats);
				setError(null);

				setLoading(false);

				console.log("Categories", response);
			} else {
				setError("Failed Fetching Customer Users");
				setCategories([]);
				setLoading(false);
			}
		} catch (error) {
			console.log(error);
			setError("Failed Fetching Customer Users");
			setCategories([]);
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
			title={"Document Categories"}
			subtitle={"List of all the Document Categories"}
			listLoading={loading}
			data={categories}
			setData={setCategories}
			columns={columns}
			rowIdField="category_id"
			onSelect={handleRowSelect}
			rowClick={true}
			onRowClick={handleRowClick}
			checkboxSelection={true}
			customButtons={customButtons}
			sortBy={[{ field: "created", sort: "desc" }]}
			formProps={{
				formOpen: formOpen,
				setFormOpen: setFormOpen,
				setParentData: setCategories,
				selectedRow: null,
				fetchParentData: fetchDocumentCategories,
			}}
			FormComponent={DocumentCategoriesForm}
		/>
	);
};

export default DocumentCategories;
