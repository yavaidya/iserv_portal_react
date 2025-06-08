import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
	Button,
	Toolbar,
	TextField,
	Tooltip,
	IconButton,
	ButtonGroup,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Swal from "sweetalert2";
const options = [
	{ text: "Delete", icon: <DeleteIcon /> },
	{ text: "Export", icon: <FileUploadIcon /> },
];

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
	showMore = true,
	selectedRowIds = {
		type: "include",
		ids: new Set(),
	},
	handleEdit = null,
	handleDuplicate = null,
	handleDelete = null,
}) => {
	const [searchText, setSearchText] = useState("");
	const [filteredData, setFilteredData] = useState(data);
	const [rowSelectionModel, setRowSelectionModel] = useState(
		selectedRowIds || {
			type: "include",
			ids: new Set(),
		}
	);

	const [open, setOpen] = useState(false);
	const anchorRef = useRef(null);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [loading, setLoading] = useState(true);

	const handleSelectionChange = (e) => {
		console.log("SelectedIDs: ", e);
		if (onSelect) {
			onSelect(e);
		}
	};

	useEffect(() => {
		if (filteredData.length <= 0) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [filteredData]);

	useEffect(() => {
		if (data.length <= 0) {
			setLoading(true);
		} else {
			setFilteredData(data);
			setLoading(false);
		}
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

	const handleClick = () => {
		const selectedAction = options[selectedIndex];
		if (selectedAction === "Delete") {
			console.log("Delete triggered");
		} else if (selectedAction === "Export PDF") {
			console.log("Export PDF triggered");
		} else if (selectedAction === "Export Excel") {
			console.log("Export Excel triggered");
		}
	};

	const handleMenuItemClick = (event, index) => {
		setSelectedIndex(index);
		setOpen(false);
		handleClick();
	};

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	const handleDeleteHelper = (row) => {
		Swal.fire({
			icon: "info",
			title: "Confirm",
			text: "Are you sure, you want to delete?",
			showDenyButton: true,
			confirmButtonText: "Confirm",
			denyButtonText: `Cancel`,
		}).then((result) => {
			if (result.isConfirmed) {
				console.log(row);
				if (handleDelete) {
					handleDelete(row);
				}
			}
		});
	};

	// const sortedData = [...filteredData].sort((a, b) => {
	// 	const aSelected = rowModel.includes(a[rowIdField]);
	// 	const bSelected = rowModel.includes(b[rowIdField]);
	// 	if (aSelected === bSelected) return 0;
	// 	return aSelected ? -1 : 1;
	// });

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
						<IconButton
							color="primary"
							aria-label="Actions"
							size="small"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								if (handleEdit) {
									handleEdit(params.row);
								}
							}}>
							<EditRoundedIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Duplicate">
						<IconButton
							color="primary"
							aria-label="Actions"
							size="small"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								if (handleDuplicate) {
									handleDuplicate(params.row);
								}
							}}>
							<ContentCopyOutlinedIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete">
						<IconButton
							color="primary"
							aria-label="Actions"
							size="small"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								handleDeleteHelper(params.row);
							}}>
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
					<Toolbar style={{ display: "flex", gap: "8px", margin: 0, padding: 0, minHeight: "45px" }}>
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

						{showMore && (
							<>
								<ButtonGroup variant="contained" ref={anchorRef} aria-label="More actions">
									<Button onClick={handleToggle} sx={{ minWidth: "100px" }}>
										More
									</Button>
									<Button
										size="small"
										aria-controls={open ? "split-button-menu" : undefined}
										aria-expanded={open ? "true" : undefined}
										aria-label="select action"
										aria-haspopup="menu"
										onClick={handleToggle}>
										<ArrowDropDownIcon />
									</Button>
								</ButtonGroup>
								<Menu
									id="split-button-menu"
									anchorEl={anchorRef.current}
									open={open}
									onClose={handleClose}
									transformOrigin={{ horizontal: "right", vertical: "top" }}
									anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
									slotProps={{
										paper: {
											elevation: 0,
											sx: {
												overflow: "visible",
												filter: "drop-shadow(0px 6px 8px rgba(0,0,0,0.32))",
												mt: 0.5,
											},
										},
									}}>
									{options.map((option, index) => (
										<MenuItem
											key={option.text}
											onClick={(event) => handleMenuItemClick(event, index)}>
											<ListItemIcon>{option.icon}</ListItemIcon>
											<ListItemText>{option.text}</ListItemText>
										</MenuItem>
									))}
								</Menu>
							</>
						)}
					</Toolbar>
				</div>
			)}

			{/* DataGrid */}
			<div style={{ width: "100%", height: "inherit" }}>
				<DataGrid
					loading={loading}
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
					onRowSelectionModelChange={(newRowSelectionModel) => {
						setRowSelectionModel(newRowSelectionModel);
						handleSelectionChange(newRowSelectionModel);
					}}
					rowSelectionModel={rowSelectionModel}
					pageSizeOptions={pageSizeOptions}
					// onRowSelectionModelChange={handleSelectionChange}
					onPageChange={onPageChange}
					autoHeight={true}
					disableSelectionOnClick
					checkboxSelection={checkboxSelection} // Enable/Disable checkbox based on prop
					getRowId={(row) => row?.[rowIdField] ?? row?.id}
					sx={{
						backgroundColor: (theme) => theme.palette.background.paper,
						"& .MuiDataGrid-main": {
							backgroundColor: (theme) => theme.palette.background.paper,
						},
						"& .MuiDataGrid-cell": {
							backgroundColor: (theme) => theme.palette.background.paper,
						},
						"& .MuiDataGrid-columnHeaders": {
							backgroundColor: (theme) => theme.palette.background.paper,
						},
						"& .MuiDataGrid-columnHeader": {
							backgroundColor: (theme) => theme.palette.background.paper,
						},
						"& .MuiDataGrid-footerContainer": {
							backgroundColor: (theme) => theme.palette.background.paper,
						},
						"& .MuiDataGrid-root": {
							backgroundColor: (theme) => theme.palette.background.paper,
						},
					}}
				/>
			</div>
		</div>
	);
};

export default CustomDatagrid;
