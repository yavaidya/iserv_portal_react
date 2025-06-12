import React, { useState, useEffect } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { useCustomTheme } from "../../Context/ThemeContext";

import { Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EquipmentForm from "../../Components/EquipmentForm/EquipmentForm";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../../Components/ErrorAlertWrapper/ErrorAlertWrapper";
import EntityWrapper from "../../Components/EntityWrapper/EntityWrapper";

import { fetchEquipmentProvisionsService, fetchEquipmentsService } from "../../Services/equipmentService";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../Services/globalServiceUtils";
import ProvisionForm from "../../Components/ProvisionForm/ProvisionForm";
import moment from "moment";

const Provisions = () => {
	const [activeStep, setActiveStep] = useState(0);
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [provisions, setProvisions] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [eqFormOpen, setEqFormOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);
	const [formData, setFormData] = useState({
		customer: null,
		equipment: null,
		site: null,
		provisionedDate: moment(),
		serialNumber: "",
		status: "1",
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

	const fetchProvisions = async () => {
		setLoading(true);
		try {
			const response = await fetchEquipmentProvisionsService();
			if (response.status) {
				console.log(response);
				setError(null);
				const provisionsData = response.data.map((prov) => ({
					id: prov.id,
					serial_number: prov.serial_number,
					status: prov?.status_id || 0,
					equipment_name: prov?.equipment?.equipment || "",
					customer_name: prov?.organization?.name || "",
					created: prov.createdAt,
					updated: prov.updatedAt,
					data: prov,
				}));
				setProvisions(provisionsData);
				setLoading(false);
			} else {
				setError("Failed Fetching Customer Provisions");
				setProvisions([]);
				setLoading(false);
			}
		} catch (error) {
			setError("Failed Fetching Customer Provisions");
			setLoading(false);
			setProvisions([]);
		}
	};

	useEffect(() => {
		setActiveTitle({
			title: "Provisions",
			subtitle: "List of all the Provisions",
			tooltip: "List of all the Provisions",
		});
		setFormTitle("Add New Equipment");
		setFormSubTitle("Complete all the steps to create a new Equipment");
		fetchProvisions();
	}, []);

	const handleRowSelect = (selectedRows) => {
		const rows = Array.from(selectedRows.ids);
		console.log("Selected row IDs:", rows);
	};

	const handleRowClick = (params) => {
		console.log("Row clicked:", params.row);
		navigate(`/provisions/${params.row.id}`);
	};

	const handleEdit = (row) => {
		console.log("Selected Eq: ", row);
		setIsEditing(true);
		setSelectedRow(row);
		handleOpenForm();
	};

	const customButtons = [
		{
			label: "Provision",
			icon: <AddCircleIcon />,
			onClick: () => {
				setIsEditing(false);
				handleOpenForm();
			},
		},
	];

	const columns = [
		{
			field: "equipment_name",
			headerName: "Equipment Name",
			flex: 1,
			renderCell: (params) => (
				<Tooltip title="View Details">
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
			field: "serial_number",
			headerName: "Serial #",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === "" ? <span style={{ fontSize: "10px", color: "gray" }}>N/A</span> : params.value,
		},
		{
			field: "customer_name",
			headerName: "Customer Name",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === "" ? <span style={{ fontSize: "10px", color: "gray" }}>N/A</span> : params.value,
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
				title={"Provisions"}
				subtitle={"List of all the Provisions"}
				data={provisions}
				setData={setProvisions}
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
					selectedRow: selectedRow,
					setFormOpen: setEqFormOpen,
					showCustomer: true,
					showEquipment: true,
					createProvision: true,
					fetchParentData: fetchProvisions,
				}}
				FormComponent={ProvisionForm}
			/>
		</>
	);
};

export default Provisions;
