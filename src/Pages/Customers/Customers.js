import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { Alert, Box, CircularProgress, Tooltip } from "@mui/material";
import { fetchCustomerByIdService, fetchCustomersService } from "../../Services/customerService";
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
import { useNavigate } from "react-router-dom";

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
	const navigate = useNavigate();
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

	const handleEditCustomer = async (row) => {
		console.log("Editing", row);

		const response = await fetchCustomerByIdService(row.id);
		if (response.status) {
			const cusData = response.data;
			setCusFormData({
				customer_name: cusData?.name || "",
				phone: cusData?.phone || "",
				website: cusData?.website || "",
				manager: cusData?.manager || null,
				status: cusData?.status || "0",
				users: cusData.org_users.map((user) => ({
					name: "",
					first_name: user?.firstname || "",
					last_name: user?.lastname || "",
					email: user?.emails[0]?.address || "",
					customer: user.org_id,
					status: user?.status || "0",
					notes: "",
					username: "",
					sendActivationEmail: true,
				})),
				sites: cusData.org_sites.map((site) => ({
					site_name: site.site_name,
					street1: site.street1,
					street2: site.street2,
					city: site.city,
					state: site.state,
					country: site.country,
					zip: site.zip,
					address: site.address,
					isDefault: false,
				})),
				provisions: cusData.org_equipments.map((prov) => ({
					customer: prov.org_id,
					equipment: prov.eq_id,
					site: prov.site_id,
					provisionedDate: prov.commission_date,
					serialNumber: prov.serial_number,
					equipment_name: prov.equipment.equipment,
					site_name: "Sherbrooke",
				})),
				internalNotes: cusData?.notes || "",
			});
		}
		setIsEditing(true);
		handleOpenForm();
		console.log(response);
	};

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
		navigate(`/customers/${params.row.id}`);
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
			activeKey={"customers"}
			data={customers}
			setData={setCustomers}
			columns={columns}
			rowIdField="id"
			onSelect={handleRowSelect}
			rowClick={true}
			onRowClick={handleRowClick}
			checkboxSelection={true}
			customButtons={customButtons}
			handleEdit={handleEditCustomer}
			sortBy={[{ field: "created", sort: "desc" }]}
			formProps={{
				formOpen: cusFormOpen,
				setFormOpen: setCusFormOpen,
				formData: cusFormData,
				setFormData: setCusFormData,
				setParentData: setCustomers,
				fetchParentData: fetchCustomers,
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
