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

const Equipments = () => {
	const [activeStep, setActiveStep] = useState(0);
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [equipments, setEquipments] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [eqFormOpen, setEqFormOpen] = useState(false);
	const [formData, setFormData] = useState({
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
	const [formTitle, setFormTitle] = useState("");
	const [formSubTitle, setFormSubTitle] = useState("");
	const [useDrawer, setUseDrawer] = useState(true);
	const [documents, setDocuments] = useState([]);
	const steps = ["Equipment Details", "Documents Provisioning", "Customer(s) Provision"];

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
	};

	function formatDate(isoString) {
		const date = new Date(isoString);

		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
		const year = date.getFullYear();

		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");

		return `${month}-${day}-${year} ${hours} ${minutes} ${seconds}`;
	}

	const customButtons = [
		{
			label: "Equipment",
			icon: <AddCircleIcon />,
			onClick: () => {
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
				<Tooltip title="View User Details">
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
			renderCell: (params) => (params.value === 1 ? <span>Active</span> : <span>Inactive</span>),
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
		return (
			<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", minHeight: "300px", width: "100%" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error && !loading) {
		return (
			<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", minHeight: "300px", width: "100%" }}>
				<Alert severity="error">{error}</Alert>
			</Box>
		);
	}
	return (
		<>
			<Box p={3} px={5} width={"100%"}>
				{useDrawer && (
					<>
						{/* Show DataGrid in background */}
						<CustomDatagrid
							data={equipments}
							columns={columns}
							rowIdField="id"
							onSelect={handleRowSelect}
							rowClick={true}
							onRowClick={handleRowClick}
							pageSize={10}
							pageSizeOptions={[5, 10, 25, 50]}
							checkboxSelection={true}
							customButtons={customButtons}
						/>

						{/* Stepper form in Drawer */}
						<Drawer anchor={"right"} sx={{ width: "45vh" }} open={eqFormOpen}>
							<EquipmentForm
								formOpen={eqFormOpen}
								setFormOpen={setEqFormOpen}
								useDrawer={useDrawer}
								setUseDrawer={setUseDrawer}
								formData={formData}
								setFormData={setFormData}
								activeStep={activeStep}
								setActiveStep={setActiveStep}
							/>
						</Drawer>
					</>
				)}

				{eqFormOpen && !useDrawer && (
					<Box sx={{ minHeight: "600px" }}>
						<EquipmentForm
							formOpen={eqFormOpen}
							setFormOpen={setEqFormOpen}
							useDrawer={useDrawer}
							setUseDrawer={setUseDrawer}
							formData={formData}
							setFormData={setFormData}
							activeStep={activeStep}
							setActiveStep={setActiveStep}
						/>
					</Box>
				)}
			</Box>
		</>
	);
};

export default Equipments;
