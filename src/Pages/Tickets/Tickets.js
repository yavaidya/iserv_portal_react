import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { Alert, Box, Button, CircularProgress, Drawer, IconButton, Tab, Tabs, Tooltip } from "@mui/material";
import { fetchTicketsService } from "../../Services/ticketsService";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import { error } from "jodit/esm/core/helpers";
import { useCustomTheme } from "../../Context/ThemeContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import NewTicketFormV2 from "../../Components/NewTicketFormV2/NewTicketFormV2";
import { formatDate } from "../../Services/globalServiceUtils";
import UserName from "../../Components/UserName/UserName";
import CustomChip from "../../Components/CustomChip/CustomChip";
import AddIcon from "@mui/icons-material/Add";
import CounterCard from "../../Components/CounterCard/CounterCard";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../../Components/ErrorAlertWrapper/ErrorAlertWrapper";
import KanbanBoardComponent from "../../Components/KanbanBoard/KanbanBoard";
import CreateCustomView from "../../Components/CreateCustomView/CreateCustomView";

const Tickets = () => {
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [tickets, setTickets] = useState([]);
	const [allTickets, setAllTickets] = useState([]);
	const [tabIndex, setTabIndex] = useState(0);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [formOpen, setFormOpen] = useState(false);
	const [viewModalOpen, setViewModalOpen] = useState(false);
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
			field: "status",
			headerName: "Status",
			// width: 125,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => (
				<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
					<CustomChip text={params.value} />
				</Box>
			),
		},
		{
			field: "equipment",
			headerName: "Equipment",
			// width: 175,
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
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => (
				<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
					<UserName name={params.value} />
				</Box>
			),
		},
		{
			field: "staff",
			headerName: "Staff",
			width: 150,
			align: "center",
			headerAlign: "center",
			// renderCell: (params) => {
			// 	let statusText = "";
			// 	if (params.value === 0 || params.value === "0") {
			// 		statusText = `<span style="font-size: 11px; color: #aaa;">N/A</span>`;
			// 		return <span dangerouslySetInnerHTML={{ __html: statusText }} />;
			// 	} else {
			// 		statusText = <UserName name={params.value} />;
			// 		return <UserName name={params.value} />;
			// 	}
			// },
			renderCell: (params) => (
				<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
					<UserName name={params.value} />
				</Box>
			),
		},
		{
			field: "due_date",
			headerName: "Due Date",
			width: 175,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => formatDate(params.value),
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
			label: "Create Ticket",
			icon: <AddCircleOutlineIcon />,
			onClick: () => {
				setFormOpen(true);
			},
		},
	];
	useEffect(() => {
		setActiveTitle({
			title: "Tickets",
			subtitle: "List of all the Tickets",
		});
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		setLoading(true);
		try {
			const req_body = {
				start_date: "1",
				end_date: "",
			};
			const response = await fetchTicketsService(req_body);
			console.log(response);
			if (response.status) {
				console.log(response);
				setError(null);
				setAllTickets(response.data);
				const ticketUserCounts = response.data.map((ticket) => ({
					id: ticket.ticket_id,
					number: ticket.ticket_number,
					subject: ticket.ticket_subject,
					status: "Open",
					department: ticket.dept_id,
					equipment: ticket.ticket_equipment.serial_number,
					user: ticket.ticket_user.name,
					staff: ticket.ticket_assignee.name,
					due_date: ticket.due_date,
					created: ticket.createdAt,
					data: ticket,
				}));
				console.log("Tickets", ticketUserCounts);
				setTickets(ticketUserCounts);
				setLoading(false);
			} else {
				setError("Failed Fetching tickets");
				setTickets([]);
				setLoading(false);
			}
		} catch (error) {
			setError("Failed Fetching tickets catch");
			setLoading(false);
			setTickets([]);
		}
	};

	const handleRowSelect = (selectedRows) => {
		console.log("Selected row IDs:", selectedRows);
	};

	const handleRowClick = (params) => {
		console.log("Row clicked:", params.row);
	};

	const handleTabChange = (newValue) => {
		console.log("New Tab Value", newValue);
		setTabIndex(newValue);
	};

	if (loading) {
		return <LoadingWrapper minHeight={"300px"} />;
	}

	if (error && !loading) {
		return <ErrorAlertWrapper minHeight={"300px"} error={error} />;
	}
	return (
		<>
			<Box pb={2} px={4} width={"100%"}>
				<Box
					sx={{
						...flexRow,
						justifyContent: "flex-start",
						alignItems: "center",
						flexWrap: "nowrap",
						columnGap: 2,
						mt: 1,
						mb: 1,
						py: 2,
					}}>
					<CounterCard title="My Tickets" count="37" color="primary" />
					<CounterCard title="Overdue Tickets" count="4" color="error" />
					<CounterCard title="Open Tickets" count="23" color="success" />
					<CounterCard title="Closed Tickets" count="10" color="warning" />
				</Box>
				{/* <Box
					sx={{
						...flexRow,
						justifyContent: "flex-start",
						alignItems: "center",
						columnGap: 1,
						mt: 1,
						mb: 1,
						pb: 1,
						borderBottom: "1px solid #ddd",
					}}>
					<Button
						size="small"
						onClick={() => handleTabChange(0)}
						color="primary"
						variant={tabIndex === 0 ? "contained" : "text"}>
						My Tickets
					</Button>
					<Button
						size="small"
						color="primary"
						onClick={() => handleTabChange(1)}
						variant={tabIndex === 1 ? "contained" : "text"}>
						Open
					</Button>
					<Button
						size="small"
						color="primary"
						onClick={() => handleTabChange(2)}
						variant={tabIndex === 2 ? "contained" : "text"}>
						Closed
					</Button>
					<Button
						size="small"
						color="primary"
						onClick={() => handleTabChange(3)}
						variant={tabIndex === 3 ? "contained" : "text"}>
						Unassigned
					</Button>
					<Tooltip title="Add New View">
						<IconButton>
							<AddIcon />
						</IconButton>
					</Tooltip>
				</Box> */}
				<CustomDatagrid
					data={tickets}
					columns={columns}
					rowIdField="id"
					onSelect={handleRowSelect}
					rowClick={true}
					onRowClick={handleRowClick}
					pageSize={10}
					pageSizeOptions={[5, 10, 25, 50]}
					checkboxSelection={true}
					customButtons={customButtons}
					showToggle={true}
					showFilters={true}
				/>

				<Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => setViewModalOpen(true)}>
					Create Custom View
				</Button>
			</Box>
			<Drawer anchor={"right"} sx={{ width: "50vw" }} open={formOpen}>
				<Box width={"50vw"}>
					<NewTicketFormV2 formOpen={formOpen} setFormOpen={setFormOpen} />
				</Box>
			</Drawer>

			<CreateCustomView
				open={viewModalOpen}
				onClose={() => setViewModalOpen(false)}
				data={allTickets}
				onSave={(viewConfig) => {
					console.log("Saved View Config:", viewConfig);
					// 🔁 optionally call API to save it to DB here
				}}
			/>
		</>
	);
};

export default Tickets;
