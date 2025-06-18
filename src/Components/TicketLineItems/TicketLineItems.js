import React, { useState, useMemo } from "react";
import {
	Box,
	List,
	ListItem,
	ListItemText,
	TextField,
	Typography,
	Divider,
	Tooltip,
	Stack,
	Avatar,
	ListItemAvatar,
	Checkbox,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemSecondaryAction,
	Button,
	Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ConstructionIcon from "@mui/icons-material/Construction";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaidIcon from "@mui/icons-material/Paid";
import CustomButtonGroup from "../CustomButtonGroup/CustomButtonGroup";
import DeleteIcon from "@mui/icons-material/Delete";

const formatCurrency = (value) => `$${parseFloat(value || 0).toFixed(2)}`;

const TicketLineItems = ({ items = [] }) => {
	const [search, setSearch] = useState("");
	const [selectedType, setSelectedType] = useState(""); // material, labour, expense
	const [filterAnchorEl, setFilterAnchorEl] = useState(null);
	const [selectedIds, setSelectedIds] = useState([]);

	const handleFilterClick = (event) => {
		setFilterAnchorEl(event.currentTarget);
	};

	const handleClearFilter = () => {
		setSelectedType("");
	};

	const handleFilterClose = () => {
		setFilterAnchorEl(null);
	};

	const handleTypeSelect = (type) => {
		setSelectedType(type === selectedType ? "" : type); // Toggle
		handleFilterClose();
	};

	const handleToggleCheckbox = (id) => {
		setSelectedIds((prev) => {
			const newSelection = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
			console.log("Selected:", newSelection);
			return newSelection;
		});
	};

	const filteredItems = useMemo(() => {
		const searchLower = search.toLowerCase();
		return items
			.filter(
				(item) =>
					item.item_name.toLowerCase().includes(searchLower) ||
					(item.item_status && item.item_status.toLowerCase().includes(searchLower)) ||
					(item.item_type && item.item_type.toLowerCase().includes(searchLower))
			)
			.filter((item) => !selectedType || item.item_type.toLowerCase() === selectedType.toLowerCase());
	}, [items, search, selectedType]);

	const total = useMemo(() => {
		return filteredItems.reduce((sum, item) => sum + parseFloat(item.item_subtotal || 0), 0);
	}, [filteredItems]);

	return (
		<Box px={1} display="flex" flexDirection="column" rowGap={1} mt={1} width="100%">
			{/* Top Bar */}
			<Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="nowrap" gap={2}>
				<Box display="flex" alignItems="center" gap={1}>
					<TextField
						size="small"
						placeholder="Search items..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						sx={{ minWidth: 250 }}
					/>
					<IconButton onClick={handleFilterClick} color={selectedType ? "primary" : "default"}>
						<FilterListIcon />
					</IconButton>
					{selectedType && (
						<Chip
							label={selectedType}
							color="primary"
							variant="outlined"
							onDelete={handleClearFilter}
							sx={{ ml: 1 }}
						/>
					)}
					<Menu
						anchorEl={filterAnchorEl}
						open={Boolean(filterAnchorEl)}
						onClose={handleFilterClose}
						transformOrigin={{ horizontal: "left", vertical: "top" }}
						anchorOrigin={{ horizontal: "left", vertical: "bottom" }}>
						<MenuItem selected={selectedType === "Material"} onClick={() => handleTypeSelect("Material")}>
							Material
						</MenuItem>
						<MenuItem selected={selectedType === "Labour"} onClick={() => handleTypeSelect("Labour")}>
							Labour
						</MenuItem>
						<MenuItem selected={selectedType === "Expenses"} onClick={() => handleTypeSelect("Expenses")}>
							Expense
						</MenuItem>
					</Menu>
				</Box>
			</Box>

			{/* List */}
			<Box sx={{ maxHeight: "600px", overflowY: "auto" }}>
				<List>
					{filteredItems.length > 0 ? (
						filteredItems.map((item) => (
							<React.Fragment key={item.id}>
								<ListItem alignItems="flex-start">
									<ListItemIcon>
										<Checkbox
											edge="start"
											checked={selectedIds.includes(item.id)}
											onChange={() => handleToggleCheckbox(item.id)}
										/>
									</ListItemIcon>

									<ListItemText>
										<Box
											display="flex"
											justifyContent="space-between"
											alignItems="center"
											flexWrap="nowrap">
											<Box display={"flex"} justifyContent={"flex-start"} columnGap={1}>
												<Avatar>
													{item.item_type ? (
														item.item_type[0]
													) : (
														<PersonIcon fontSize="small" />
													)}
												</Avatar>
												<Box>
													<Tooltip title={item.item_description || "No Description"}>
														<Typography fontWeight="bold">{item.item_name}</Typography>
													</Tooltip>
													<Box
														display="flex"
														columnGap={0.5}
														justifyContent="flex-start"
														alignItems={"center"}>
														<Typography variant="body2">
															Type: <strong>{item.item_type}</strong>
														</Typography>
														<span>|</span>
														<Typography variant="body2">
															Status: <strong>{item.item_status}</strong>
														</Typography>
														<span>|</span>
														<Typography variant="body2">
															Quote: <strong>{item.quote}</strong>
														</Typography>
													</Box>
												</Box>
											</Box>
											<Box
												display={"flex"}
												justifyContent={"flex-start"}
												alignItems={"flex-end"}
												rowGap={1}
												flexDirection={"column"}>
												<Typography variant="body2" color="text.secondary">
													<strong>Qty:</strong> {item.item_value} {item.item_unit} |{" "}
													<strong>Price:</strong> {formatCurrency(item.item_price)}
												</Typography>
												<Box
													display="flex"
													columnGap={1}
													justifyContent="flex-start"
													alignItems={"center"}>
													<Typography
														fontWeight="bold"
														variant="body1"
														color="text.secondary">
														Subtotal:
													</Typography>
													<Typography fontWeight="bold" variant="h6">
														{formatCurrency(item.item_subtotal)}
													</Typography>
												</Box>
											</Box>
										</Box>
									</ListItemText>
								</ListItem>
								<Divider />
							</React.Fragment>
						))
					) : (
						<Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
							No ticket items found.
						</Typography>
					)}
				</List>
			</Box>

			{/* Total */}
			<Box display="flex" px={2} columnGap={2} justifyContent="flex-end">
				<Typography fontWeight="bold" variant="h6">
					Total:
				</Typography>
				<Typography fontWeight="bold" variant="h4" color="primary">
					{formatCurrency(total)}
				</Typography>
			</Box>
		</Box>
	);
};

export default TicketLineItems;
