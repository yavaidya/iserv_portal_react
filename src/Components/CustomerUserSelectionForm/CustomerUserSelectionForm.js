import React, { useState } from "react";
import {
	Box,
	Button,
	MenuItem,
	Select,
	TextField,
	Typography,
	Alert,
	InputLabel,
	FormControl,
	Tooltip,
	IconButton,
	CircularProgress,
} from "@mui/material";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import PageHeader from "../PageHeader/PageHeader";
import CloseIcon from "@mui/icons-material/Close";
import { useCustomTheme } from "../../Context/ThemeContext";
import { useDropzone } from "react-dropzone";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { fetchDocumentCategoriesService, fetchDocumentsService } from "../../Services/documentService";
import { useEffect } from "react";
import { useRef } from "react";
import _ from "lodash";
import CustomDatagrid from "../CustomDatagrid/CustomDatagrid";
import { fetchCustomerUsersService } from "../../Services/customerService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const CustomerUserSelectionForm = ({
	formOpen,
	setFormOpen,
	selectedCustomer = null,
	customerFormData = null,
	setCustomerFormData = null,
}) => {
	const [formData, setFormData] = useState({
		user_ids: {
			type: "include",
			ids: new Set(),
		},
		users: [],
	});
	const formTitle = `Select Users for ${selectedCustomer}`;
	const formSubTitle = "Select from the list of users to be assigned to the customer";
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const { flexRow, flexCol } = useCustomTheme();
	const [alert, setAlert] = useState("");
	const [users, setUsers] = useState([]);
	const [allUsers, setAllUsers] = useState([]);

	useEffect(() => {
		fetchCustomerUsers();
	}, []);

	const handleSubmit = async (addNew = false) => {
		if (formData.users.length <= 0) {
			setAlert("Please Select at least 1 User");
			return;
		}

		let req_body = formData;

		setAlert("");
		setFormSubmitting(true);
		console.log("Form submitted", req_body);

		if (setCustomerFormData) {
			const provisionedUsers = allUsers
				.filter((user) => req_body.users.includes(user.id))
				.map((user) => ({
					id: user.id,
					first_name: user.firstname,
					last_name: user.lastname,
					email: user.emails[0].address,
					customer: user.org_id,
				}));
			setCustomerFormData((prev) => {
				const existingTitles = new Set((prev.users || []).map((doc) => doc.id));
				const uniqueProvisionedUsers = provisionedUsers.filter((doc) => !existingTitles.has(doc.id));
				return {
					...prev,
					users: [...(prev.users || []), ...uniqueProvisionedUsers],
					selected_users: Array.isArray(prev.selected_users)
						? [...prev.selected_users, ...req_body.users]
						: req_body.users,
				};
			});
			if (!addNew) {
				setFormOpen(false);
			}
			setFormData({
				user_ids: {
					type: "include",
					ids: new Set(),
				},
				users: [],
			});
			setTimeout(() => {
				setFormSubmitting(false);
			}, 1500);
		}

		// Submit logic goes here
	};
	const handleCloseForm = () => {
		setFormOpen(false);
		setFormData({
			user_ids: {
				type: "include",
				ids: new Set(),
			},
			users: [],
		});
	};
	const handleDocRowSelect = (selectedRows) => {
		const rows = Array.from(selectedRows.ids);
		console.log("Selected doc row IDs:", rows);
		setFormData((prevData) => ({
			...prevData,
			user_ids: selectedRows,
			users: rows,
		}));
	};

	const handleDocRowClick = (params) => {
		console.log("Row clicked:", params.row);
	};

	const columns_doc = [
		{
			field: "name",
			headerName: "User Name",
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
			field: "organization",
			headerName: "Organization",
			width: 150,
			align: "left",
			headerAlign: "left",
			renderCell: (params) =>
				params.value === "" ? (
					<span style={{ fontSize: "10px", color: "gray" }}>No Organization</span>
				) : (
					params.value
				),
		},
	];
	const fetchCustomerUsers = async () => {
		setFormLoading(true);
		try {
			const response = await fetchCustomerUsersService();
			if (response.status) {
				const selectedIds = customerFormData?.selected_users || [];
				const users = response.data
					.filter((user) => !selectedIds.includes(user.id))
					.map((user) => ({
						id: user.id,
						name: user.name,
						organization: user?.organization?.name || "",
						data: user,
					}));

				setUsers(users);
				setAllUsers(response.data);
				setFormLoading(false);
			}
		} catch (error) {
			console.log(error);
			setUsers([]);
			setFormLoading(false);
		}
	};
	if (formSubmitting || formLoading) {
		return (
			<Box
				p={2}
				width="50vw"
				sx={{ ...flexCol, justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
				<CircularProgress />
				{formSubmitting && (
					<Typography variant="h6" mt={2}>
						Creating New Document
					</Typography>
				)}
			</Box>
		);
	}

	return (
		<Box p={2} width="50vw" sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<Box
				sx={{
					...flexRow,
					justifyContent: "space-between",
					width: "100%",
				}}>
				<Tooltip title="Close the Form">
					<Button startIcon={<ArrowBackIcon />} sx={{ pl: 0 }} onClick={handleCloseForm}>
						Close Form
					</Button>
				</Tooltip>
				<Tooltip title="Close the Form">
					<IconButton size="small" onClick={handleCloseForm}>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			</Box>
			<PageHeader title={formTitle} subtitle={formSubTitle} />

			{alert && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{alert}
				</Alert>
			)}

			<Box
				sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", px: 2, pt: 1 }}>
				{users.length > 0 ? (
					<>
						<Typography variant="body1" fontWeight={"bold"}>
							Available Users to Provision
						</Typography>
						<CustomDatagrid
							data={users}
							columns={columns_doc}
							rowIdField="id"
							onSelect={handleDocRowSelect}
							rowClick={true}
							onRowClick={handleDocRowClick}
							pageSize={10}
							pageSizeOptions={[5, 10, 25, 50]}
							checkboxSelection={true}
							showMore={false}
							showActions={false}
							selectedRowIds={formData.user_ids}
						/>
					</>
				) : (
					<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
						No Users available to assign
					</Alert>
				)}
			</Box>

			<Box display="flex" justifyContent="space-between" mt={2}>
				<Button variant="outlined" onClick={handleCloseForm}>
					Cancel
				</Button>
				<Box display="flex" gap={1}>
					<Button
						variant="contained"
						color="primary"
						disabled={users.length <= 0}
						onClick={() => handleSubmit(false)}>
						Submit
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default CustomerUserSelectionForm;
