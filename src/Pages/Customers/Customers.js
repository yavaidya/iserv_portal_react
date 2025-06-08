import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { Alert, Box, CircularProgress, Tooltip } from "@mui/material";
import { fetchCustomersService } from "../../Services/customerService";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import { error } from "jodit/esm/core/helpers";
import { useCustomTheme } from "../../Context/ThemeContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../../Components/ErrorAlertWrapper/ErrorAlertWrapper";
import { formatDate } from "../../Services/globalServiceUtils";
import CustomerForm from "../../Components/CustomerForm/CustomerForm";
import EntityWrapper from "../../Components/EntityWrapper/EntityWrapper";

const Customer = () => {
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [customers, setCustomers] = useState([]);
	const [cusFormOpen, setCusFormOpen] = useState(false);
	const [selectedCusId, setSelectedCusId] = useState(null);
	const [activeStep, setActiveStep] = useState(0);
	const [cusFormData, setCusFormData] = useState({
		customer_name: "",
		phone: "",
		website: "",
		manager: "",
		status: "1",
		users: [],
		sites: [],
		provisions: [],
		internalNotes: "",
	});

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const columns = [
		{
			field: "name",
			headerName: "Customer Name",
			flex: 1,
			renderCell: (params) => (
				<Tooltip title="View Customer Details">
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
			field: "manager",
			headerName: "Manager",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === "" || !params.value ? (
					<span style={{ fontSize: "10px", color: "gray" }}>No Manager Assigned</span>
				) : (
					params.value
				),
		},
		{
			field: "sites",
			headerName: "Sites",
			width: 100,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				let statusText = "";
				if (params.value === 0 || params.value === "0") {
					statusText = `<span style="font-size: 11px; color: #aaa;">No Sites Available</span>`;
				} else {
					statusText = `<b>${params.value}</b>`;
				}
				return <span dangerouslySetInnerHTML={{ __html: statusText }} />;
			},
		},
		{
			field: "equipments",
			headerName: "Equipments",
			width: 100,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				let statusText = "";
				if (params.value === 0 || params.value === "0") {
					statusText = `<span style="font-size: 11px; color: #aaa;">No Equipments</span>`;
				} else {
					statusText = `<b>${params.value}</b>`;
				}
				return <span dangerouslySetInnerHTML={{ __html: statusText }} />;
			},
		},
		{
			field: "userCount",
			headerName: "Users",
			width: 100,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				let statusText = "";
				if (params.value === 0 || params.value === "0") {
					statusText = `<span style="font-size: 11px; color: #aaa;">N/A</span>`;
				} else {
					statusText = `<b>${params.value}</b>`;
				}
				return <span dangerouslySetInnerHTML={{ __html: statusText }} />;
			},
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
		setCusFormOpen(true);
	};

	const customButtons = [
		{
			label: "Customer",
			icon: <AddCircleIcon />,
			onClick: () => {
				setIsEditing(false);
				handleOpenForm();
			},
		},
	];

	useEffect(() => {
		fetchCustomers();
	}, []);

	const fetchCustomers = async () => {
		setLoading(true);
		try {
			const response = await fetchCustomersService();
			if (response.status) {
				console.log(response);
				setError(null);
				const customerUserCounts = response.data.map((customer) => ({
					id: customer.id,
					name: customer.name,
					manager: customer?.org_manager?.name || "",
					created: customer.createdAt,
					userCount: customer.org_users?.length || 0,
					sites: customer.org_sites?.length || 0,
					equipments: customer.org_equipments?.length || 0,
				}));
				console.log(customerUserCounts);
				setCustomers(customerUserCounts);
				setLoading(false);
			} else {
				setError("Failed Fetching Customers");
				setCustomers([]);
				setLoading(false);
			}
		} catch (error) {
			setError("Failed Fetching Customers");
			setLoading(false);
			setCustomers([]);
		}
	};

	const handleRowSelect = (selectedRows) => {
		console.log("Selected row IDs:", selectedRows);
	};

	const handleRowClick = (params) => {
		console.log("Row clicked:", params.row);
	};

	if (loading) {
		return <LoadingWrapper minHeight={"300px"} />;
	}

	if (error && !loading) {
		return <ErrorAlertWrapper minHeight={"300px"} error={error} />;
	}

	return (
		<EntityWrapper
			title={"Customers"}
			subtitle={"List of all the Customers"}
			data={customers}
			setData={setCustomers}
			columns={columns}
			rowIdField="id"
			onSelect={handleRowSelect}
			rowClick={true}
			onRowClick={handleRowClick}
			checkboxSelection={true}
			customButtons={customButtons}
			sortBy={[{ field: "created", sort: "desc" }]}
			formProps={{
				formOpen: cusFormOpen,
				setFormOpen: setCusFormOpen,
				formData: cusFormData,
				setFormData: setCusFormData,
				activeStep,
				setActiveStep,
				isEditing,
				selectedCusId,
			}}
			FormComponent={CustomerForm}
		/>
	);
};

export default Customer;
