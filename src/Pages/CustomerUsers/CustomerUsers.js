import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { Alert, Box, CircularProgress, Tooltip } from "@mui/material";
import { fetchCustomersService, fetchCustomerUsersService } from "../../Services/customerService";
import { useCustomTheme } from "../../Context/ThemeContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CustomerUserForm from "../../Components/CustomerUserForm/CustomerUserForm";
import EntityWrapper from "../../Components/EntityWrapper/EntityWrapper";
import { formatDate } from "../../Services/globalServiceUtils";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../../Components/ErrorAlertWrapper/ErrorAlertWrapper";

const CustomerUsers = () => {
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [customerUsers, setCustomerUsers] = useState([]);
	const [formOpen, setFormOpen] = useState(false);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const columns = [
		{
			field: "name",
			headerName: "Name",
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
			headerName: "Customer",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === "" || !params.value ? (
					<span style={{ fontSize: "10px", color: "gray" }}>No Customer Assigned</span>
				) : (
					params.value
				),
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
		setFormOpen(true);
	};

	const customButtons = [
		{
			label: "Customer User",
			icon: <AddCircleIcon />,
			onClick: () => {
				setIsEditing(false);
				handleOpenForm();
			},
		},
	];

	useEffect(() => {
		setActiveTitle({
			title: "Customer Users",
			subtitle: "List of all the Customer Users",
		});
		fetchCustomerUsers();
	}, []);

	const fetchCustomerUsers = async () => {
		setLoading(true);
		try {
			const response = await fetchCustomerUsersService();
			if (response.status) {
				console.log(response);
				setError(null);
				const customerUserCounts = response.data.map((customer) => ({
					id: customer.id,
					name: customer.name,
					organization: customer?.organization?.name || "",
					created: customer.createdAt,
				}));
				setCustomerUsers(customerUserCounts);
				setLoading(false);
			} else {
				setError("Failed Fetching Customer Users");
				setCustomerUsers([]);
				setLoading(false);
			}
		} catch (error) {
			setError("Failed Fetching Customer Users");
			setLoading(false);
			setCustomerUsers([]);
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
			title={"Customer Users"}
			subtitle={"List of Users for the customers"}
			data={customerUsers}
			setData={setCustomerUsers}
			columns={columns}
			rowIdField="id"
			onSelect={handleRowSelect}
			rowClick={true}
			onRowClick={handleRowClick}
			checkboxSelection={true}
			customButtons={customButtons}
			sortBy={[{ field: "created", sort: "desc" }]}
			formProps={{
				formOpen: formOpen,
				setFormOpen: setFormOpen,
				setParentData: setCustomerUsers,
				selectedRow: null,
				fetchParentData: fetchCustomerUsers,
			}}
			FormComponent={CustomerUserForm}
		/>
	);
};

export default CustomerUsers;
