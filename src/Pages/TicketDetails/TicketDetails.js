import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Autocomplete,
	Box,
	Button,
	Chip,
	Divider,
	Drawer,
	FormControl,
	IconButton,
	Link,
	MenuItem,
	Select,
	Tab,
	Tabs,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../Components/PageHeader/PageHeader";
import { usePageTitle } from "../../Context/PageTitleContext";
import { useEffect } from "react";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../../Components/ErrorAlertWrapper/ErrorAlertWrapper";
import { useState } from "react";
import { fetchEquipmentByIdService } from "../../Services/equipmentService";
import TabPanel from "../../Components/TabPanel/TabPanel";
import { useCustomTheme } from "../../Context/ThemeContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DocumentCard from "../../Components/DocumentCard/DocumentCard";
import { fetchTicketByIDService, postThreadService } from "../../Services/ticketsService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserName from "../../Components/UserName/UserName";
import CustomChip from "../../Components/CustomChip/CustomChip";
import { formatDate, formatDateOnly } from "../../Services/globalServiceUtils";
import RichTextEditor from "../../Components/RichTextEditor/RichTextEditor";
import FileDropZone from "../../Components/FileDropZone/FileDropZone";
import ThreadChat from "../../Components/ThreadChat/ThreadChat";
import PersonIcon from "@mui/icons-material/Person";
import ReplyIcon from "@mui/icons-material/Reply";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import PrintIcon from "@mui/icons-material/Print";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CustomButtonGroup from "../../Components/CustomButtonGroup/CustomButtonGroup";
import GroupsIcon from "@mui/icons-material/Groups";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import TicketEventTimeline from "../../Components/TicketEventTimeline/TicketEventTimeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import ArchiveIcon from "@mui/icons-material/Archive";
import TicketDepartmentTransferForm from "../../Components/TicketDepartmentTransferForm/TicketDepartmentTransferForm";
// import InfoRow from "../../Components/InfoRow/InfoRow";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ConstructionIcon from "@mui/icons-material/Construction";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaidIcon from "@mui/icons-material/Paid";

import CheckIcon from "@mui/icons-material/Check";
import EditableAutocomplete from "../../Components/EditableAutocomplete/EditorAutocomplete";
import { fetchAgentsService } from "../../Services/agentService";
import { getCustomerUserByOrgIdService } from "../../Services/customerService";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import TicketLineItems from "../../Components/TicketLineItems/TicketLineItems";
import TicketItemsForm from "../../Components/TicketItemsForm/TicketItemsForm";

const TicketDetails = () => {
	const { ticket_id } = useParams();
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [ticket, setTicket] = useState(null);
	const [ticketThreads, setTicketThreads] = useState(null);
	const [equipmentDocs, setEquipmentDocs] = useState(null);
	const [parentEquipmentDocs, setParentEquipmentDocs] = useState(null);
	const [deptFormOpen, setDeptFormOpen] = useState(false);
	const [editAccountable, setEditAccountable] = useState(false);
	const [tabIndex, setTabIndex] = useState(0);
	const [expanded, setExpanded] = useState("equipment");
	const [allAccountables, setAllAccountables] = useState([]);
	const [ticketItems, setTicketItems] = useState([]);
	const [allAssignees, setAllAssignees] = useState([]);
	const [allCustomerUsers, setAllCustomerUsers] = useState([]);
	const [formData, setFormData] = useState({
		description: "",
		files: [],
	});
	const [formErrors, setFormErrors] = useState({
		description: false,
		files: [],
	});
	const [selectedAccountable, setSelectedAccountable] = useState(ticket?.ticket_accountable.name || null);
	const [selectedAssigned, setSelectedAssigned] = useState(ticket?.ticket_assignee.name || null);
	const [selectedOwner, setSelectedOwner] = useState(ticket?.ticket_user.name || null);
	const [itemTypeToAdd, setItemTypeToAdd] = useState("Labour");
	const [itemsFormOpen, setItemsFormOpen] = useState(false);
	const users = [
		{ id: 1, name: "Alice Smith" },
		{ id: 2, name: "Bob Johnson" },
		{ id: 3, name: "Charlie Rose" },
	];
	const navigate = useNavigate();
	const bottomRef = useRef(null);
	const scrollContainerRef = useRef(null);
	const editorRef = useRef();

	const actionOptions = [
		{ text: "Add Labour", icon: <ConstructionIcon fontSize="small" />, onClick: () => handleItemAdd("Labour") },
		{ text: "Add Material", icon: <InventoryIcon fontSize="small" />, onClick: () => handleItemAdd("Material") },
		{ text: "Add Expenses", icon: <PaidIcon fontSize="small" />, onClick: () => handleItemAdd("Expense") },
	];

	const handleItemAdd = (type) => {
		setItemTypeToAdd(type);
		setItemsFormOpen(true);
	};

	const scrollToBottom = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTo({
				top: scrollContainerRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	};

	const handleTabChange = (event, newValue) => {
		setTabIndex(newValue);
		if (newValue === 0) {
			// Delay to ensure content is rendered before scrolling
			setTimeout(() => {
				scrollToBottom();
			}, 100);
		}
	};

	useEffect(() => {
		fetchTicketDetailsByID();
	}, []);

	useEffect(() => {
		if (ticket) {
			setActiveTitle({
				title: `Ticket Details: #${ticket.ticket_number}`,
				activeKey: "tickets",
				subtitle: ticket?.ticket_subject || "",
			});
			setTimeout(() => {
				scrollToBottom();
			}, 100);
		}
	}, [ticket]);

	const handleNavigateBack = () => {
		navigate("/tickets");
	};

	const handleEditorChange = ({ html, text, json }) => {
		setFormData((prev) => ({ ...prev, description: html }));
	};

	const fetchTicketDetailsByID = async () => {
		try {
			setLoading(true);
			const response = await fetchTicketByIDService({ ticket_id });
			console.log(response);
			if (response.status) {
				setTicket(response.data);
				setTicketThreads(response?.data?.threads || null);
				setSelectedAccountable(
					{
						id: response?.data?.ticket_accountable?.staff_id,
						name: response?.data?.ticket_accountable?.name,
					} || null
				);
				setSelectedAssigned(
					{ id: response?.data?.ticket_assignee?.staff_id, name: response?.data?.ticket_assignee?.name } ||
						null
				);
				setSelectedOwner(
					{ id: response?.data?.ticket_user?.id, name: response?.data?.ticket_user?.name } || null
				);
				setLoading(false);

				const tktItems = response.data.ticket_line_items.map((item) => ({
					id: item.ticket_items.id,
					quote: item.ticket_items.quote_id ? item.ticket_items.quote_id : "NA",
					item_description: item.ticket_items.item_description,
					added_by_staff: item.ticket_items.added_by_staff,
					item_status: item.ticket_items.item_status,
					item_value: item.ticket_items.item_value,
					item_unit: item.ticket_items.item_unit,
					item_name: item.name,
					item_type: item.item_type.name,
					item_number: item.item_number,
					item_price: item.price,
					item_subtotal: parseFloat(
						parseFloat(item.price) * parseFloat(item.ticket_items.item_value)
					).toFixed(2),
					created: item.ticket_items.createdAt,
				}));
				console.log(tktItems);
				setTicketItems(tktItems);
			}
		} catch (error) {
			setLoading(false);
			console.log(error);
			setTicket(null);
			setError("Failed to Fetch Ticket Details.");
		}
	};

	useEffect(() => {
		if (ticket) {
			fetchCustomerUsers();
			fetchAgents();
		}
	}, [ticket]);

	const fetchAgents = async () => {
		try {
			const response = await fetchAgentsService();
			if (response.status) {
				const data = response.data;
				const allUsers = data.map((user) => ({
					id: user.staff_id,
					name: user.name,
				}));

				// 2. Admins or Service Managers
				const adminUsers = data
					.filter((user) => user.staff_account?.isadmin || user.staff_account?.isservicemanager)
					.map((user) => ({
						id: user.staff_id,
						name: user.name,
					}));

				setAllAccountables(adminUsers);
				setAllAssignees(allUsers);
			} else {
				setLoading(false);
				setTicket(null);
				setError("Failed to Fetch Staff Details.");
			}
		} catch (error) {
			setLoading(false);
			setTicket(null);
			setError("Failed to Fetch Staff Details.");
		}
	};

	const fetchCustomerUsers = async () => {
		try {
			const response = await getCustomerUserByOrgIdService(ticket?.ticket_user.org_id);
			if (response.status) {
				const data = response.data;
				const allUsers = data.map((user) => ({
					id: user.id,
					name: user.name,
				}));

				setAllCustomerUsers(allUsers);
			} else {
				setLoading(false);
				setTicket(null);
				setError("Failed to Fetch Staff Details.");
			}
		} catch (error) {
			setLoading(false);
			setTicket(null);
			setError("Failed to Fetch Staff Details.");
		}
	};

	const handlePostMessage = async () => {
		const response = await postThreadService({
			ticket_id: ticket.ticket_id,
			message: formData.description,
			owner: "staff",
			owner_id: 1,
		});
		if (response.status) {
			setTicketThreads((prev) => [...prev, response.data]);
			setTimeout(() => {
				scrollToBottom();
			}, 100);

			setFormData((prev) => ({ ...prev, description: "" }));
			editorRef.current?.clear();
		}
	};

	const handleAssignClick = () => {};

	const saveAccountable = (user) => {
		console.log("Saved Accountable", user);
	};
	const saveAssigned = (user) => {
		console.log("Saved Assigned", user);
	};

	const saveOwner = (user) => {
		console.log("Saved Owner", user);
	};

	const tktItemsColumns = [
		{
			field: "item_name",
			headerName: "Item Name",
			flex: 1,
			renderCell: (params) => (
				<Tooltip title="View Item">
					<span
						style={{
							cursor: "pointer",
							fontWeight: "bold",
						}}>
						{params.value}
					</span>
				</Tooltip>
			),
		},
		{
			field: "item_description",
			headerName: "Description",
			flex: 1.5,
			renderCell: (params) =>
				params.value ? (
					<span>{params.value}</span>
				) : (
					<span style={{ fontSize: "12px", color: "gray" }}>N/A</span>
				),
		},
		{
			field: "item_number",
			headerName: "Item #",
			width: 130,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "item_type",
			headerName: "Type",
			width: 130,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "item_status",
			headerName: "Status",
			width: 130,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => (
				<span style={{ color: params.value === "Pending" ? "orange" : "green", fontWeight: 500 }}>
					{params.value}
				</span>
			),
		},
		{
			field: "item_value",
			headerName: "Qty",
			width: 100,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "item_unit",
			headerName: "Unit",
			width: 100,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "item_price",
			headerName: "Price",
			width: 100,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value ? `$${parseFloat(params.value).toFixed(2)}` : <span style={{ color: "gray" }}>N/A</span>,
		},
		{
			field: "item_subtotal",
			headerName: "Subtotal",
			width: 120,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => `$${params.value}`,
		},
		{
			field: "added_by_staff",
			headerName: "Added By",
			width: 160,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "quote",
			headerName: "Quote ID",
			width: 120,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === "NA" ? <span style={{ fontSize: "11px", color: "gray" }}>N/A</span> : params.value,
		},
		{
			field: "created",
			headerName: "Created At",
			width: 180,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => formatDate(params.value),
		},
	];

	const InfoRow = ({ label, value, chip, type = "text", onClick = null }) => (
		<Box
			display="flex"
			justifyContent="flex-start"
			alignItems="flex-start"
			flexDirection="column"
			rowGap={1}
			mb={2}
			{...(onClick && { onClick })}
			sx={{ cursor: onClick ? "pointer" : "default" }} // Optional: Add visual cue
		>
			<Typography fontWeight="bold">{label}</Typography>
			{type === "text" ? <Typography>{value || "-"}</Typography> : value}
		</Box>
	);

	if (loading) {
		return <LoadingWrapper minHeight={"300px"} />;
	}

	if (error && !loading) {
		return <ErrorAlertWrapper minHeight={"300px"} error={error} />;
	}
	return (
		<>
			<Box p={2} px={4} width={"100%"}>
				<Box
					display="flex"
					flexDirection="row"
					justifyContent="space-between"
					alignItems="center"
					width="100%"
					sx={{
						position: "sticky",
						top: 0,
						zIndex: 1000, // Adjust if needed
						backgroundColor: (theme) => theme.palette.background.default, // Prevent transparency
						py: 1,
					}}>
					<Button variant="outlined" onClick={handleNavigateBack} startIcon={<ArrowBackIcon />}>
						Back
					</Button>
					<Box sx={{ ...flexRow, justifyContent: "flex-end", alignItems: "center", columnGap: 1 }}>
						<Tooltip title="Schedule an Appointment">
							<Button variant="contained" sx={{ minWidth: "40px", width: "40px" }}>
								<CalendarMonthIcon />
							</Button>
						</Tooltip>
						<Tooltip title="Order Parts">
							<Button variant="contained" sx={{ minWidth: "40px", width: "40px" }}>
								<ShoppingCartIcon />
							</Button>
						</Tooltip>

						<Tooltip title="Transfer Ticket">
							<Button
								size="medium"
								variant="contained"
								onClick={() => setDeptFormOpen(true)}
								sx={{ minWidth: "40px", width: "40px" }}>
								<ShortcutIcon />
							</Button>
						</Tooltip>
						<CustomButtonGroup
							tooltipTitle={"Chnage Status"}
							iconOnly={true}
							icon={<AutorenewIcon />}
							options={[
								{ text: "Close", icon: <CheckCircleIcon />, onClick: handleAssignClick },
								{ text: "Reopen", icon: <AutorenewIcon />, onClick: handleAssignClick },
								{ text: "Archive", icon: <ArchiveIcon />, onClick: handleAssignClick },
							]}
						/>
						<CustomButtonGroup
							tooltipTitle={"Assign"}
							iconOnly={true}
							icon={<PersonIcon />}
							options={[
								{ text: "Claim", icon: <HowToRegIcon />, onClick: handleAssignClick },
								{ text: "Reassign", icon: <PersonSearchIcon />, onClick: handleAssignClick },
								{ text: "Change Accountable", icon: <PersonIcon />, onClick: handleAssignClick },
								{ text: "Add Collaborators", icon: <GroupsIcon />, onClick: handleAssignClick },
							]}
						/>

						<CustomButtonGroup
							tooltipTitle={"Print"}
							iconOnly={true}
							icon={<PrintIcon />}
							options={[
								{ text: "Ticket Thread", icon: <ChatBubbleIcon />, onClick: handleAssignClick },
								{
									text: "Ticket Thread & Events",
									icon: <QuestionAnswerIcon />,
									onClick: handleAssignClick,
								},
								{
									text: "Ticket Threads, Events & Notes",
									icon: <SpeakerNotesIcon />,
									onClick: handleAssignClick,
								},
							]}
						/>
						<Button variant="contained" size="medium" startIcon={<DeleteIcon />}>
							Delete
						</Button>
					</Box>
				</Box>
				<Box width="100%" mx="auto" my={2}>
					<Box display="flex" flexWrap="wrap" gap={2} mb={2}>
						<Box minWidth={"18%"} maxWidth={"18%"} display={"flex"} flexDirection={"column"} rowGap={2}>
							<Box
								height={"fit-content"}
								borderRadius={3}
								sx={{ background: (theme) => theme.palette.background.paper }}
								boxShadow="0 1px 6px rgba(0,0,0,0.1)"
								px={3}
								py={3}>
								<Box display="flex" justifyContent="space-between">
									<Typography fontWeight={"bold"} variant="h5">
										Ticket{" "}
										<Link color="primary" underline="hover" sx={{ cursor: "pointer" }}>
											#{ticket.ticket_number}
										</Link>
									</Typography>
								</Box>
								<Divider flexItem sx={{ mt: "10px", mb: "10px" }} />

								<InfoRow
									label="Customer"
									type="text"
									value={ticket?.ticket_user?.organization?.name || "NA"}
								/>
								<InfoRow
									label="Customer User"
									type="component"
									value={
										<>
											<EditableAutocomplete
												options={allCustomerUsers}
												value={selectedOwner}
												handleChange={(newUser) => setSelectedOwner(newUser)}
												handleSubmit={saveOwner}
											/>
										</>
									}
								/>
								<InfoRow
									label="Customer Email"
									type="component"
									value={
										<Link color="primary" underline="hover" sx={{ cursor: "pointer" }}>
											{ticket?.ticket_user?.account?.email || "NA"}
										</Link>
									}
								/>
								<InfoRow
									label="Accountable"
									type="component"
									value={
										<>
											<EditableAutocomplete
												options={allAccountables}
												value={selectedAccountable}
												handleChange={(newUser) => setSelectedAccountable(newUser)}
												handleSubmit={saveAccountable}
											/>
										</>
									}
								/>

								<InfoRow
									label="Assignee"
									type="component"
									value={
										<>
											<EditableAutocomplete
												options={allAssignees}
												value={selectedAssigned}
												handleChange={(newUser) => setSelectedAssigned(newUser)}
												handleSubmit={saveAssigned}
											/>
										</>
									}
								/>
								<InfoRow
									label="Equipment"
									value={
										<Link
											underline="hover"
											sx={{ cursor: "pointer" }}
											onClick={() => {
												navigate(`/provisions/${ticket.ticket_equipment.id}`);
											}}>
											{ticket?.ticket_equipment?.serial_number || "N/A"}
										</Link>
									}
								/>
							</Box>
							<Box
								borderRadius={3}
								boxShadow="0 1px 4px rgba(0,0,0,0.08)"
								px={3}
								py={2}
								sx={{ background: (theme) => theme.palette.background.paper }}>
								<Typography fontWeight={"bold"} variant="h6" gutterBottom>
									Activity
								</Typography>
								<Divider flexItem sx={{ mt: "2px", mb: "10px" }} />
								<TicketEventTimeline
									events={[...ticket.events]
										.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
										.slice(0, 3)} // top 3
								/>
							</Box>
						</Box>

						<Box flex={1} minWidth={300} borderRadius={3} height={"100%"}>
							<Box
								flex={1}
								minWidth={300}
								borderRadius={3}
								minHeight={"600px"}
								height={"100%"}
								boxShadow="0 1px 4px rgba(0,0,0,0.08)"
								px={3}
								py={1}
								sx={{ background: (theme) => theme.palette.background.paper }}>
								<Tabs
									sx={{ borderBottom: "1px solid #eee" }}
									value={tabIndex}
									onChange={handleTabChange}
									aria-label="Profile Tabs"
									textColor="primary"
									indicatorColor="primary">
									<Tab label="Thread" />
									<Tab label="Attachments" />
									<Tab label="Documents" />
									<Tab label="Items" />
									<Tab label="Quotes" />
									<Tab label="Service Reports" />
									<Tab label="Ticket Activity" />
								</Tabs>

								<TabPanel value={tabIndex} index={0}>
									<Box
										sx={{
											...flexCol,
											justifyContent: "flex-start",
											alignItems: "flex-start",
											width: "100%",
											rowGap: 2,
										}}>
										<Box
											ref={scrollContainerRef}
											sx={{
												minHeight: "600px",
												maxHeight: "600px",
												overflowY: "auto",
												width: "100%",
												p: 2,
												px: 4,
												// background: (theme) => theme.palette.background.default,
												borderRadius: "10px",
											}}>
											{ticketThreads.length > 0 ? (
												<>
													{ticketThreads.map((thread) => (
														<ThreadChat key={thread.id} thread={thread} />
													))}
													<div ref={bottomRef} />
												</>
											) : (
												<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
													No Tickets for this Customer
												</Alert>
											)}
										</Box>
										<Box
											display="flex"
											flexDirection={"column"}
											height={"max-content"}
											alignItems="flex-start"
											width={"100%"}>
											<Box width="200px" minWidth="200px">
												<Typography fontWeight="bold" mb={1}>
													Description: <span style={{ color: "red" }}>*</span>
												</Typography>
											</Box>
											<Box sx={{ width: "100%", overflow: "hidden", height: "max-content" }}>
												<RichTextEditor
													ref={editorRef}
													height={"100px"}
													value={formData.description}
													onChange={handleEditorChange}
												/>
												{formErrors.description && (
													<Typography color="error" variant="body1" fontSize="12px" mt={1}>
														Description is required
													</Typography>
												)}
											</Box>
										</Box>
										<Box
											display="flex"
											flexDirection={"column"}
											alignItems="flex-start"
											width={"100%"}>
											<Box width="200px" minWidth="200px">
												<Typography fontWeight="bold" mb={1}>
													Attachment:
												</Typography>
											</Box>
											<Box sx={{ width: "100%" }}>
												<FileDropZone setParentData={setFormData} />
											</Box>
										</Box>

										<Box
											display="flex"
											flexDirection={"row"}
											width={"100%"}
											justifyContent="center"
											alignItems={"center"}
											columnGap={1}
											mt={2}>
											<Button variant="outlined" color="primary">
												Reset
											</Button>
											<Button
												variant="contained"
												color="primary"
												onClick={() => handlePostMessage()}>
												Post Internal Note
											</Button>
											<Button
												variant="contained"
												color="primary"
												onClick={() => handlePostMessage()}>
												Post Reply
											</Button>
										</Box>
									</Box>
								</TabPanel>
								<TabPanel value={tabIndex} index={1}>
									<Box
										sx={{
											...flexCol,
											justifyContent: "flex-start",
											alignItems: "flex-start",
											width: "100%",
											rowGap: 2,
										}}>
										<Box
											display="flex"
											flexDirection="row"
											justifyContent="flex-start"
											alignItems="center"
											width="100%">
											<Box>
												<Typography variant="h5" fontWeight={"bold"}>
													Ticket Attachments
												</Typography>
												<Typography variant="body1" m={0}>
													List of all the Ticket attachments
												</Typography>
											</Box>
										</Box>
										<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
											No Tickets for this Customer
										</Alert>
									</Box>
								</TabPanel>
								<TabPanel value={tabIndex} index={2}>
									<Box
										sx={{
											...flexCol,
											justifyContent: "flex-start",
											alignItems: "flex-start",
											width: "100%",
											rowGap: 2,
										}}>
										<Box
											display="flex"
											flexDirection="row"
											justifyContent="flex-start"
											alignItems="center"
											width="100%">
											<Box>
												<Typography variant="h5" fontWeight={"bold"}>
													Documents
												</Typography>
												<Typography variant="body1" m={0}>
													List of all the Ticket attachments
												</Typography>
											</Box>
										</Box>
										<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
											No Tickets for this Customer
										</Alert>
									</Box>
								</TabPanel>
								<TabPanel value={tabIndex} index={3}>
									<Box
										sx={{
											...flexCol,
											justifyContent: "flex-start",
											alignItems: "flex-start",
											width: "100%",
											rowGap: 2,
										}}>
										<Box
											display="flex"
											flexDirection="row"
											justifyContent="space-between"
											alignItems="center"
											width="100%">
											<Box>
												<Typography variant="h5" fontWeight={"bold"}>
													Ticket Items
												</Typography>
												<Typography variant="body1" m={0}>
													List of all the Ticket attachments
												</Typography>
											</Box>
											<Box display="flex" alignItems="center" gap={1}>
												<CustomButtonGroup
													size="small"
													iconOnly={false}
													icon={<AddCircleIcon />}
													buttonLabel="Item"
													options={actionOptions}
													variant="contained"
													tooltipTitle="Add Ticket Items"
												/>
												<Button size="small" variant="contained" startIcon={<AddCircleIcon />}>
													Quote
												</Button>
												<Button size="small" variant="contained" startIcon={<DeleteIcon />}>
													Delete
												</Button>
											</Box>
										</Box>
										{ticketItems.length > 0 ? (
											<TicketLineItems items={ticketItems} />
										) : (
											<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
												No Ticket Items added
											</Alert>
										)}
									</Box>
								</TabPanel>
								<TabPanel value={tabIndex} index={4}>
									<Box
										sx={{
											...flexCol,
											justifyContent: "flex-start",
											alignItems: "flex-start",
											width: "100%",
											rowGap: 2,
										}}>
										<Box
											display="flex"
											flexDirection="row"
											justifyContent="space-between"
											alignItems="center"
											width="100%">
											<Box>
												<Typography variant="h5" fontWeight={"bold"}>
													Quotes
												</Typography>
												<Typography variant="body1" m={0}>
													List of all the Ticket attachments
												</Typography>
											</Box>
											<Box display="flex" alignItems="center" gap={1}>
												<Button size="small" variant="contained" startIcon={<AddCircleIcon />}>
													Quote
												</Button>
												<Button size="small" variant="contained" startIcon={<DeleteIcon />}>
													Delete
												</Button>
											</Box>
										</Box>
										<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
											No Quotes for this Ticket
										</Alert>
									</Box>
								</TabPanel>
								<TabPanel value={tabIndex} index={5}>
									<Box
										sx={{
											...flexCol,
											justifyContent: "flex-start",
											alignItems: "flex-start",
											width: "100%",
											rowGap: 2,
										}}>
										<Box
											display="flex"
											flexDirection="row"
											justifyContent="space-between"
											alignItems="center"
											width="100%">
											<Box>
												<Typography variant="h5" fontWeight={"bold"}>
													Service Reports
												</Typography>
												<Typography variant="body1" m={0}>
													List of all the Ticket attachments
												</Typography>
											</Box>
											<Box display="flex" alignItems="center" gap={1}>
												<Button size="small" variant="contained" startIcon={<AddCircleIcon />}>
													Report
												</Button>
												<Button size="small" variant="contained" startIcon={<AddCircleIcon />}>
													Invoice
												</Button>
												<Button size="small" variant="contained" startIcon={<DeleteIcon />}>
													Delete
												</Button>
											</Box>
										</Box>
										<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
											No Tickets for this Customer
										</Alert>
									</Box>
								</TabPanel>
								<TabPanel value={tabIndex} index={6}>
									<Box
										sx={{
											...flexCol,
											justifyContent: "flex-start",
											alignItems: "flex-start",
											width: "100%",
											rowGap: 1,
										}}>
										<Box
											display="flex"
											flexDirection="row"
											justifyContent="flex-start"
											alignItems="center"
											width="100%">
											<Box>
												<Typography variant="h5" fontWeight={"bold"}>
													Ticket Timeline
												</Typography>
												<Typography variant="body1" m={0}>
													List of all the events in the Ticket
												</Typography>
											</Box>
										</Box>
										{ticket.events.length > 0 ? (
											<TicketEventTimeline events={ticket.events} />
										) : (
											<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
												No Tickets for this Customer
											</Alert>
										)}
									</Box>
								</TabPanel>
							</Box>
						</Box>
						<Box minWidth={"15%"} maxWidth={"25%"} display={"flex"} flexDirection={"column"} rowGap={2}>
							<Box
								borderRadius={3}
								sx={{ background: (theme) => theme.palette.background.paper }}
								boxShadow="0 1px 6px rgba(0,0,0,0.1)"
								px={3}
								height={"fit-content"}
								py={3}>
								<Box display="flex" justifyContent="space-between">
									<Typography fontWeight={"bold"} variant="h5">
										Ticket Details
									</Typography>
								</Box>
								<Divider flexItem sx={{ mt: "10px", mb: "10px" }} />
								<InfoRow
									label="Status"
									type="component"
									value={<CustomChip text={ticket.ticket_status.name} />}
								/>
								<InfoRow label="Priority" value={ticket?.ticket_priority.priority_desc || "N/A"} />
								<InfoRow label="Department" value={ticket?.ticket_department.name || "N/A"} />
								<InfoRow
									label="Service Type"
									value={ticket?.ticket_service_type.service_type || "N/A"}
								/>

								<InfoRow label="Due Date" value={formatDateOnly(ticket.due_date)} />
								<InfoRow label="Created On" value={formatDate(ticket.createdAt)} />
								<InfoRow label="Last Updated" value={formatDate(ticket?.updatedAt) || "-"} />
							</Box>
							<Box
								borderRadius={3}
								boxShadow="0 1px 4px rgba(0,0,0,0.08)"
								px={3}
								py={2}
								sx={{ background: (theme) => theme.palette.background.paper }}>
								<Typography fontWeight={"bold"} variant="h6" gutterBottom>
									Notes
								</Typography>
								<Divider flexItem sx={{ mt: "2px", mb: "10px" }} />
								<Typography>{ticket.notes || "-"}</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>

			{deptFormOpen && (
				<TicketDepartmentTransferForm ticket={ticket} open={deptFormOpen} setOpen={setDeptFormOpen} />
			)}

			<Drawer anchor={"right"} sx={{ width: "45vw" }} open={itemsFormOpen}>
				<TicketItemsForm
					formOpen={itemsFormOpen}
					setFormOpen={setItemsFormOpen}
					setParentData={setTicketItems}
					selectedType={itemTypeToAdd}
				/>
			</Drawer>
		</>
	);
};

export default TicketDetails;
