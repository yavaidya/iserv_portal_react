import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { Alert, Box, CircularProgress, Tooltip } from "@mui/material";
import { fetchAgentsService } from "../../Services/agentService";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import { error } from "jodit/esm/core/helpers";
import { useCustomTheme } from "../../Context/ThemeContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
const Agents = () => {
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [agents, setAgents] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const columns = [
		{
			field: "name",
			headerName: "Name",
			flex: 1,
			renderCell: (params) => (
				<Tooltip title="View Agent Details">
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
			field: "email",
			headerName: "Email",
			width: 200,
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
			field: "username",
			headerName: "Username",
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
			field: "is_service_manager",
			headerName: "Role",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => (params.value ? <span>Service Manager</span> : <span>Service Engineer</span>),
		},
		{
			field: "billing_profile",
			headerName: "Billing Profile",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === "" ? (
					<span style={{ fontSize: "10px", color: "gray", fontStyle: "italic" }}>N/A</span>
				) : (
					params.value
				),
		},
		{
			field: "status",
			headerName: "Status",
			width: 100,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => (params.value ? <span>Active</span> : <span>Inactive</span>),
		},
		{
			field: "last_login",
			headerName: "Last Login",
			width: 175,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === "" ? (
					<span style={{ fontSize: "10px", color: "gray", fontStyle: "italic" }}>Never</span>
				) : (
					<span style={{ fontSize: "11px", fontStyle: "italic", color: "gray" }}>
						{moment(params.value).fromNow()}
					</span>
				),
		},

		{
			field: "created",
			headerName: "Created",
			width: 175,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => formatDate(params.value),
		},
	];

	const customButtons = [
		{
			label: "Add New Agent",
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
			title: "Agents",
			subtitle: "List of all the Agents",
		});
		fetchAgents();
	}, []);

	const fetchAgents = async () => {
		setLoading(true);
		try {
			const response = await fetchAgentsService();
			if (response.status) {
				console.log(response);
				setError(null);
				const agentUserCounts = response.data.map((agent) => ({
					id: agent.staff_id,
					name: agent.name,
					billing_profile: agent?.billing_profile || "",
					username: agent?.staff_account?.username || "",
					status: agent?.staff_account?.status || false,
					is_service_manager: agent?.staff_account?.isservicemanager || false,
					last_login: agent?.staff_account?.lastlogin || "",
					email: agent?.staff_account?.email || "",
					created: agent.createdAt,
					updated: agent.updatedAt,
				}));
				console.log(agentUserCounts);
				setAgents(agentUserCounts);
				setLoading(false);
			} else {
				setError("Failed Fetching Agents");
				setAgents([]);
				setLoading(false);
			}
		} catch (error) {
			setError("Failed Fetching Agents");
			setLoading(false);
			setAgents([]);
		}
	};

	const handleRowSelect = (selectedRows) => {
		console.log("Selected row IDs:", selectedRows);
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
		<Box p={2} px={4} width={"100%"}>
			<CustomDatagrid
				data={agents}
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

export default Agents;
