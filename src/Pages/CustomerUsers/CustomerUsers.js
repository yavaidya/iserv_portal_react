import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { Alert, Box, CircularProgress } from "@mui/material";
import { fetchCustomersService } from "../../Services/customerService";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import { error } from "jodit/esm/core/helpers";
import { useCustomTheme } from "../../Context/ThemeContext";

const CustomerUsers = () => {
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [customers, setCustomers] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const columns = [{ field: "name", headerName: "Customer Name", flex: 1 }];
	useEffect(() => {
		setActiveTitle({
			title: "Customer Users",
			subtitle: "List of all the Customer Users",
		});
		fetchCustomers();
	}, []);

	const fetchCustomers = async () => {
		setLoading(true);
		try {
			const response = await fetchCustomersService();
			if (response.status) {
				console.log(response);
				setError(null);
				setCustomers(response.customer);
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
		<Box p={2} px={4} width={"100%"}>
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
				// customButtons={[
				// 	{
				// 		label: "Export",
				// 		icon: <IosShareOutlinedIcon />,
				// 		onClick: () => alert("Export clicked!"),
				// 	},
				// ]}
			/>
		</Box>
	);
};

export default CustomerUsers;
