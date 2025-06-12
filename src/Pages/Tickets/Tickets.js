import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { Alert, Box, Button, CircularProgress, Drawer, Tooltip } from "@mui/material";
import { fetchTicketsService } from "../../Services/ticketsService";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import { error } from "jodit/esm/core/helpers";
import { useCustomTheme } from "../../Context/ThemeContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import NewTicketFormV2 from "../../Components/NewTicketFormV2/NewTicketFormV2";

const Tickets = () => {
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [customers, setCustomers] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [formOpen, setFormOpen] = useState(false);
	const columns = [
		{
			field: "number",
			headerName: "Ticket Number",
			width: 150,
			renderCell: (params) => (
				<Tooltip title="View Ticket Details">
					<span
						style={{
							cursor: "pointer",
							fontWeight: "bold",
						}}
						onMouseEnter={(e) => (e.target.style.fontWeight = "bold")}
						onMouseLeave={(e) => (e.target.style.fontWeight = "bold")}>
						#{params.value}
					</span>
				</Tooltip>
			),
		},
		{
			field: "subject",
			headerName: "Subject",

			flex: 1,
			align: "left",
			headerAlign: "left",
			renderCell: (params) =>
				params.value === "" || !params.value ? (
					<span style={{ fontSize: "10px", color: "gray" }}>N/A</span>
				) : (
					params.value
				),
		},
		{
			field: "department",
			headerName: "Department",
			width: 100,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				let statusText = "";
				if (params.value === 0 || params.value === "0") {
					statusText = `<span style="font-size: 11px; color: #aaa;">N/A</span>`;
				} else {
					statusText = `<span>${params.value}</span>`;
				}
				return <span dangerouslySetInnerHTML={{ __html: statusText }} />;
			},
		},
		{
			field: "equipment_id",
			headerName: "Equipment",
			width: 200,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				let statusText = "";
				if (params.value === 0 || params.value === "0" || !params.value) {
					statusText = `<span style="font-size: 11px; color: #aaa;">N/A</span>`;
				} else {
					statusText = `<b>${params.value}</b>`;
				}
				return <span dangerouslySetInnerHTML={{ __html: statusText }} />;
			},
		},
		{
			field: "user",
			headerName: "User",
			width: 100,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				let statusText = "";
				if (params.value === 0 || params.value === "0") {
					statusText = `<span style="font-size: 11px; color: #aaa;">N/A</span>`;
				} else {
					statusText = `<span>${params.value}</span>`;
				}
				return <span dangerouslySetInnerHTML={{ __html: statusText }} />;
			},
		},
		{
			field: "staff",
			headerName: "Staff",
			width: 200,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				let statusText = "";
				if (params.value === 0 || params.value === "0" || !params.value) {
					statusText = `<span style="font-size: 11px; color: #aaa;">--Unassigned--</span>`;
				} else {
					statusText = `<span>${params.value}</span>`;
				}
				return <span dangerouslySetInnerHTML={{ __html: statusText }} />;
			},
		},

		{ field: "created", headerName: "Created", width: 200, align: "center", headerAlign: "center" },
	];

	const customButtons = [
		{
			label: "Create Ticket",
			icon: <AddCircleOutlineIcon />,
			onClick: () => {
				console.log("Adding");
			},
		},
		{
			label: "",
			icon: <DeleteIcon />,
			onClick: () => {
				console.log("Deleting");
			},
		},
	];
	useEffect(() => {
		setActiveTitle({
			title: "Tickets",
			subtitle: "List of all the Tickets",
		});
		// fetchTickets();
	}, []);

	const fetchTickets = async () => {
		setLoading(true);
		try {
			const req_body = {
				user_id: "1",
				flag: "",
				status: "open",
				role: "agent",
			};
			const response = await fetchTicketsService(req_body);
			if (response.data.status) {
				console.log(response);
				setError(null);
				const customerUserCounts = response.data.tickets.map((ticket) => ({
					id: ticket.ticket_id,
					number: ticket.number,
					subject: ticket.subject,
					department: ticket.department,
					equipment: ticket.equipment,
					user: ticket.user_id,
					staff: ticket.staff_id,
					created: ticket.created,

					equipments: ticket.topics?.length || 0,
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

	// if (loading) {
	// 	return (
	// 		<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", minHeight: "300px", width: "100%" }}>
	// 			<CircularProgress />
	// 		</Box>
	// 	);
	// }

	// if (error && !loading) {
	// 	return (
	// 		<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", minHeight: "300px", width: "100%" }}>
	// 			<Alert severity="error">{error}</Alert>
	// 		</Box>
	// 	);
	// }

	return (
		<>
			<Box pb={2} px={4} width={"100%"}>
				{/* <CustomDatagrid
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
			/> */}
				<Button
					variant="contained"
					onClick={() => {
						setFormOpen(true);
					}}>
					Open Form
				</Button>
			</Box>
			<Drawer anchor={"right"} sx={{ width: "50vw" }} open={formOpen}>
				<Box width={"50vw"}>
					<NewTicketFormV2 formOpen={formOpen} setFormOpen={setFormOpen} />
				</Box>
			</Drawer>
		</>
	);
};

export default Tickets;
