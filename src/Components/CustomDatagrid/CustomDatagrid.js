import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Toolbar, TextField, Tooltip, IconButton } from "@mui/material";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const CustomDatagrid = ({
	data,
	columns,
	onSelect,
	customButtons,
	onPageChange,
	rowIdField,
	sortBy,
	pageSize = 5, // Default page size
	showSearchBar = true, // Control search bar visibility
	checkboxSelection = false, // Control checkbox visibility
	rowClick = false,
	onRowClick,
	pageSizeOptions = [pageSize],
	showActions = true, // Default page size options
}) => {
	const [searchText, setSearchText] = useState("");
	const [filteredData, setFilteredData] = useState(data);

	const handleSelectionChange = (newSelection) => {
		if (onSelect) {
			onSelect(newSelection);
		}
	};

	useEffect(() => {
		setFilteredData(data);
	}, [data]);

	// Handle search change
	const handleSearchChange = (e) => {
		const query = e.target.value.toLowerCase();
		setSearchText(query);

		// Filter rows based on search query
		const filteredRows = data.filter((row) => {
			return columns.some((column) => {
				const cellValue = row[column.field]?.toString()?.toLowerCase();
				return cellValue?.includes(query);
			});
		});
		setFilteredData(filteredRows);
	};

	const actions = [
		{
			headerName: "Actions",
			width: 110,
			sortable: false,
			headerAlign: "center",
			align: "left",
			renderCell: (params) => (
				<div>
					<Tooltip title="Edit">
						<IconButton color="primary" aria-label="Actions" size="small" onClick={null}>
							<EditRoundedIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Edit">
						<IconButton color="primary" aria-label="Actions" size="small" onClick={null}>
							<ContentCopyOutlinedIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Edit">
						<IconButton color="primary" aria-label="Actions" size="small" onClick={null}>
							<DeleteRoundedIcon />
						</IconButton>
					</Tooltip>
				</div>
			),
		},
	];

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "fit-content",
				width: "100%",
				marginBottom: "30px",
			}}>
			{/* Flexbox layout for search and buttons */}
			{showSearchBar && (
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "5px",
					}}>
					<TextField
						variant="outlined"
						size="small"
						value={searchText}
						onChange={handleSearchChange}
						placeholder="Search..."
						style={{ marginRight: "20px", minWidth: "20%" }}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>

					{/* Custom Buttons */}
					<Toolbar style={{ display: "flex", gap: "8px", margin: 0, padding: 0 }}>
						{customButtons &&
							customButtons.map((button, index) => (
								<Button
									key={index}
									startIcon={button?.icon}
									variant="contained"
									color="primary"
									onClick={button.onClick}>
									{button.label}{" "}
									{button?.upload && (
										<input
											type="file"
											hidden
											onChange={button?.handleFileChange}
											accept={button?.acceptedFile} // Adjust file types as needed
										/>
									)}
								</Button>
							))}
					</Toolbar>
				</div>
			)}

			{/* DataGrid */}
			<div style={{ width: "100%", height: "inherit" }}>
				<DataGrid
					rows={filteredData}
					columns={showActions ? [...columns, ...actions] : columns}
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 5,
							},
						},
						sorting: {
							sortModel: sortBy,
						},
					}}
					{...(rowClick && { onRowClick })}
					pageSizeOptions={pageSizeOptions}
					onRowSelectionModelChange={handleSelectionChange}
					onPageChange={onPageChange}
					autoHeight={true}
					disableSelectionOnClick
					checkboxSelection={checkboxSelection} // Enable/Disable checkbox based on prop
					getRowId={(row) => row[rowIdField]}
				/>
			</div>
		</div>
	);
};

export default CustomDatagrid;
