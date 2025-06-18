import { Button, ButtonGroup, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import React, { useRef, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
const CustomButtonGroup = ({
	iconOnly = false,
	icon,
	buttonLabel,
	options,
	variant = "contained",
	tooltipTitle,
	size = "medium",
}) => {
	const [open, setOpen] = useState(false);
	const anchorRef = useRef(null);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	return (
		<>
			<Tooltip title={tooltipTitle}>
				<ButtonGroup variant={variant} ref={anchorRef} aria-label="More actions" sx={{ borderRadius: "20px" }}>
					<Button
						size={size}
						onClick={handleToggle}
						startIcon={iconOnly ? null : icon}
						sx={{
							...(iconOnly && { minWidth: "40px", width: "40px" }),
						}}>
						{iconOnly ? icon : buttonLabel}
					</Button>

					<Button
						size={size}
						aria-controls={open ? "split-button-menu" : undefined}
						aria-expanded={open ? "true" : undefined}
						aria-label="select action"
						aria-haspopup="menu"
						sx={{ width: "20px", minWidth: "20px" }}
						onClick={handleToggle}>
						<ArrowDropDownIcon />
					</Button>
				</ButtonGroup>
			</Tooltip>
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
							mt: 1,
						},
					},
				}}>
				{options.map((option, index) => (
					<MenuItem
						key={option.text}
						onClick={(e) => {
							handleClose(e);
							option.onClick && option.onClick(); // Call the function if it exists
						}}>
						<ListItemIcon>{option.icon}</ListItemIcon>
						<ListItemText>{option.text}</ListItemText>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default CustomButtonGroup;
