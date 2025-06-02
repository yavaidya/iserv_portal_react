import React, { useEffect } from "react";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import { Box } from "@mui/material";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import { usePageTitle } from "../../Context/PageTitleContext";

const Home = () => {
	const { setActiveTitle } = usePageTitle();
	useEffect(() => {
		setActiveTitle({
			title: "Home",
			subtitle: "Manage your service tickets efficiently",
		});
	}, []);
	const sampleServiceTickets = Array.from({ length: 100 }, (_, index) => {
		const id = index + 1;

		// Sample statuses and priorities for service tickets
		const statuses = ["Open", "In Progress", "Resolved", "Closed"];
		const priorities = ["Low", "Medium", "High", "Urgent"];
		const technicians = ["Alice", "Bob", "Charlie", "David", "Eve"];

		// Random date in last 90 days
		const createdDate = new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000));

		return {
			id,
			title: `Issue ${String.fromCharCode(65 + (index % 26))}${Math.floor(index / 26) + 1}`, // e.g., "Issue A1"
			status: statuses[index % statuses.length],
			priority: priorities[index % priorities.length],
			assignedTo: technicians[index % technicians.length],
			createdDate: createdDate.toISOString().split("T")[0], // formatted YYYY-MM-DD
		};
	});

	const columns = [
		{ field: "id", headerName: "Ticket ID", width: 90 },
		{ field: "title", headerName: "Title", flex: 1 },
		{ field: "status", headerName: "Status", width: 120 },
		{ field: "priority", headerName: "Priority", width: 100 },
		{ field: "assignedTo", headerName: "Assigned To", width: 140 },
		{ field: "createdDate", headerName: "Created Date", width: 130 },
	];

	const handleRowSelect = (selectedRows) => {
		console.log("Selected row IDs:", selectedRows);
	};

	const handleRowClick = (params) => {
		console.log("Row clicked:", params.row);
	};
	return (
		<Box p={2} px={4} width={"100%"}>
			<CustomDatagrid
				data={sampleServiceTickets}
				columns={columns}
				rowIdField="id"
				onSelect={handleRowSelect}
				rowClick={true}
				onRowClick={handleRowClick}
				pageSize={10}
				pageSizeOptions={[5, 10, 25, 50]}
				checkboxSelection={true}
				customButtons={[
					{
						label: "Export",
						icon: <IosShareOutlinedIcon />,
						onClick: () => alert("Export clicked!"),
					},
				]}
			/>
		</Box>
	);
};

export default Home;
