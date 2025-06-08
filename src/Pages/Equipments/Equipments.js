import React from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
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
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { fetchEquipmentsService } from "../../Services/equipmentService";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useCallback } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EquipmentForm from "../../Components/EquipmentForm/EquipmentForm";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../../Components/ErrorAlertWrapper/ErrorAlertWrapper";
import { formatDate } from "../../Services/globalServiceUtils";
import EntityWrapper from "../../Components/EntityWrapper/EntityWrapper";

const Equipments = () => {
	const [activeStep, setActiveStep] = useState(0);
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [equipments, setEquipments] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [eqFormOpen, setEqFormOpen] = useState(false);
	const [formData, setFormData] = useState({
		equipmentName: "",
		equipmentParent: { id: 0, label: "-- Top Level --" },
		internalNotes: "",
		isPublic: true,
		status: "0",
		documents: [],
		provisions: [],
		selected_doc_ids: [],
		parent_doc_ids: [],
	});
	const [selectedEqId, setSelectedEqId] = useState(null);
	const [formTitle, setFormTitle] = useState("");
	const [formSubTitle, setFormSubTitle] = useState("");
	const [useDrawer, setUseDrawer] = useState(true);
	const [documents, setDocuments] = useState([]);
	const steps = ["Equipment Details", "Documents Provisioning", "Customer(s) Provision"];
	const navigate = useNavigate();
	const handleOpenForm = () => {
		setEqFormOpen(true);
	};

	const fetchEquipments = async () => {
		setLoading(true);
		try {
			const response = await fetchEquipmentsService();
			if (response.status) {
				console.log(response);
				setError(null);
				const equipmentsData = response.data.map((equipment) => ({
					id: equipment.eq_id,
					name: equipment.equipment,
					status: equipment?.status || 0,
					provisions: equipment?.org_provisioned_eqs?.length || 0,
					created: equipment.createdAt,
					updated: equipment.updatedAt,
					parent_id: equipment?.parent_equipment?.eq_id || 0,
					parent_name: equipment?.parent_equipment?.equipment || "-- Top Level --",
					data: equipment,
				}));
				setEquipments(equipmentsData);
				setLoading(false);
			} else {
				setError("Failed Fetching Customer Users");
				setEquipments([]);
				setLoading(false);
			}
		} catch (error) {
			setError("Failed Fetching Customer Users");
			setLoading(false);
			setEquipments([]);
		}
	};

	useEffect(() => {
		setActiveTitle({
			title: "Equipments",
			subtitle: "List of all the Equipments",
			tooltip: "List of all the Equipments",
		});
		setFormTitle("Add New Equipment");
		setFormSubTitle("Complete all the steps to create a new Equipment");
		fetchEquipments();
	}, []);

	const handleRowSelect = (selectedRows) => {
		const rows = Array.from(selectedRows.ids);
		console.log("Selected row IDs:", rows);
	};

	const handleRowClick = (params) => {
		console.log("Row clicked:", params.row);
		navigate(`/equipments/${params.row.id}`);
	};

	const handleEdit = (row) => {
		console.log("Selected Eq: ", row);
		setIsEditing(true);
		let docids = [];
		if (row.data.eq_docs && row.data.eq_docs.length > 0) {
			docids = row.data.eq_docs.map((d) => d?.kb_id || 0);
		} else {
			docids = [];
		}
		setFormData({
			equipmentName: row.name,
			equipmentParent: { id: row.parent_id, label: row.parent_name },
			internalNotes: "",
			isPublic: true,
			status: "0",
			documents: docids,
			doc_ids: {
				type: "include",
				ids: new Set(),
			},
			provisions: [],
		});
		setSelectedEqId(parseInt(row.id));
		handleOpenForm();
	};

	const customButtons = [
		{
			label: "Equipment",
			icon: <AddCircleIcon />,
			onClick: () => {
				setIsEditing(false);
				handleOpenForm();
			},
		},
	];

	const columns = [
		{
			field: "name",
			headerName: "Equipment Name",
			flex: 1,
			renderCell: (params) => (
				<Tooltip title="View Equipment Details">
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
			field: "status",
			headerName: "Status",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === "1" || params.value === 1 ? <span>Active</span> : <span>Inactive</span>,
		},
		{
			field: "provisions",
			headerName: "Provisions",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === 0 ? (
					<span style={{ fontSize: "10px", color: "gray" }}>No Provisions</span>
				) : (
					params.value
				),
		},
		{
			field: "updated",
			headerName: "Last Update",
			width: 200,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => formatDate(params.value),
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

	if (loading) {
		return <LoadingWrapper minHeight={"400px"} />;
	}

	if (error && !loading) {
		return <ErrorAlertWrapper minHeight={"400px"} error={error} />;
	}
	return (
		<>
			<EntityWrapper
				title={"Equipments"}
				subtitle={"List of all the Equipments"}
				data={equipments}
				setData={setEquipments}
				columns={columns}
				rowIdField="id"
				onSelect={handleRowSelect}
				rowClick={true}
				onRowClick={handleRowClick}
				checkboxSelection={true}
				customButtons={customButtons}
				handleEdit={handleEdit}
				handleDelete={null}
				handleDuplicate={null}
				sortBy={[{ field: "created", sort: "desc" }]}
				formProps={{
					isEditing: isEditing,
					formOpen: eqFormOpen,
					setFormOpen: setEqFormOpen,
					useDrawer: useDrawer,
					setUseDrawer: setUseDrawer,
					formData: formData,
					setFormData: setFormData,
					activeStep: activeStep,
					setActiveStep: setActiveStep,
					fetchEquipments: fetchEquipments,
					equipments: equipments,
					selectedEqId: selectedEqId,
				}}
				FormComponent={EquipmentForm}
			/>
		</>
	);
};

export default Equipments;
