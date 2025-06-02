import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { Alert, Box, CircularProgress, Tooltip } from "@mui/material";
import { fetchCustomersService } from "../../Services/customerService";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import { error } from "jodit/esm/core/helpers";
import { useCustomTheme } from "../../Context/ThemeContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const CustomerUsers = () => {
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [customers, setCustomers] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
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
					<span style={{ fontSize: "10px", color: "gray" }}>N/A</span>
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
					statusText = `<span style="font-size: 11px; color: #aaa;">N/A</span>`;
				} else {
					statusText = `<b>${params.value}</b> <span style="font-size: 11px;">${
						params.value > 1 ? "Sites" : "Site"
					}</span>`;
				}
				return <span dangerouslySetInnerHTML={{ __html: statusText }} />;
			},
		},
		{
			field: "equipments",
			headerName: "Provisioned Equipments",
			width: 200,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				let statusText = "";
				if (params.value === 0 || params.value === "0") {
					statusText = `<span style="font-size: 11px; color: #aaa;">N/A</span>`;
				} else {
					statusText = `<b>${params.value}</b> <span style="font-size: 11px;">${
						params.value > 1 ? "Equipments" : "Equipment"
					}</span>`;
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
					statusText = `<b>${params.value}</b> <span style="font-size: 11px;">${
						params.value > 1 ? "Users" : "User"
					}</span>`;
				}
				return <span dangerouslySetInnerHTML={{ __html: statusText }} />;
			},
		},
		{ field: "created", headerName: "Created", width: 200, align: "center", headerAlign: "center" },
	];

	const customButtons = [
		{
			label: "Add New Customer",
			icon: <AddCircleOutlineIcon />,
			onClick: () => {
				console.log("Adding");
			},
		},
		{
			label: "Delete Selected",
			icon: <DeleteIcon />,
			onClick: () => {
				console.log("Deleting");
			},
		},
	];
	useEffect(() => {
		setActiveTitle({
			title: "Customers",
			subtitle: "List of all the Customers",
		});
		fetchCustomers();
	}, []);

	const fetchCustomers = async () => {
		setLoading(true);
		try {
			const response = await fetchCustomersService();
			if (response.data.status) {
				console.log(response);
				setError(null);
				const customerUserCounts = response.data.customer.map((customer) => ({
					id: customer.id,
					name: customer.name,
					manager: customer.manager,
					created: customer.created,
					userCount: customer.users?.length || 0,
					sites: customer.sites?.length || 0,
					equipments: customer.topics?.length || 0,
				}));
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
		<Box pb={2} px={4} width={"100%"}>
			<CustomDatagrid
				data={customers}
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
		</Box>
	);
};

export default CustomerUsers;
