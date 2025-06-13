import {
	Avatar,
	Box,
	Divider,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../Context/AuthContext";
import Swal from "sweetalert2";
const menuOptions = [
	{ label: "Administrator", path: "/administrator", icon: <DashboardIcon fontSize="small" /> },
	{ label: "Settings", path: "/settings", icon: <SettingsIcon fontSize="small" /> },
	{ label: "Profile", path: "/profile", icon: <PersonIcon fontSize="small" /> },
	{ label: "Logout", path: "/logout", icon: <LogoutIcon fontSize="small" /> },
];
const ProfileIcon = ({ sideBarCollapsed = false, reverse = false, showMenu = true, iconClick = false }) => {
	const { flexCol, flexRow } = useCustomTheme();
	const { user, userMode, userAdditionalData } = useAuth();
	const [anchorEl, setAnchorEl] = useState(null);
	const [userDisplayName, setUserDisplayName] = useState("John D");
	const open = Boolean(anchorEl);
	const navigate = useNavigate();

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = (path) => {
		if (path === "/logout") {
			handleMenuClose();
			Swal.fire({
				icon: "info",
				title: "Logout?",
				text: "You are attempting to Log out!",
				showDenyButton: true,
				confirmButtonText: "Logout",
				denyButtonText: `Cancel`,
			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
					navigate(path);
				}
			});
		} else {
			navigate(path);
			handleMenuClose();
		}
	};

	function stringToColor(string) {
		let hash = 0;
		let i;

		/* eslint-disable no-bitwise */
		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = "#";

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}
		/* eslint-enable no-bitwise */

		return color;
	}

	useEffect(() => {
		if (user) {
			if (userMode === "user") {
				const loggedUserName = user?.name
					? `${user.name.split(" ")[0]} ${user.name.split(" ")[1]?.charAt(0) || ""}`
					: "John D";
				setUserDisplayName(loggedUserName);
			} else if (userMode === "agent") {
				const loggedUserName = user.account?.name
					? `${user.account.name.split(" ")[0]} ${user.account.name.split(" ")[1]?.charAt(0) || ""}`
					: "John D";
				setUserDisplayName(loggedUserName);
			}
		}
	}, [user.account, userMode]);

	function stringAvatar(name) {
		return {
			sx: {
				// bgcolor: stringToColor(name),
				width: 35,
				height: 35,
				cursor: iconClick ? "pointer" : "default",
				fontSize: "14px",
			},
			children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
			onClick: iconClick ? handleMenuClick : null,
		};
	}

	return (
		<>
			{!reverse && <Divider flexItem sx={{ margin: sideBarCollapsed ? "0" : "0 10px" }} />}
			<Box
				sx={{
					...flexRow,
					justifyContent: "space-between",
					width: reverse ? "fit-content" : "100%",
					height: "100%",
					alignItems: "center",
					mt: reverse ? 0 : 1,
				}}>
				<Box
					sx={{
						...flexRow,
						alignItems: "center",
						columnGap: "10px",
						flexDirection: reverse ? "row-reverse" : "row",
					}}>
					<Avatar {...stringAvatar(`${userDisplayName}` || "John D")} />
					{!sideBarCollapsed && (
						<Box
							sx={{
								...flexCol,
								justifyContent: reverse ? "flex-end" : "flex-start",
								alignItems: reverse ? "flex-end" : "flex-start",
								rowGap: 0,
							}}>
							<Typography variant="body1" mb={0} lineHeight={"16px"}>
								Welcome, {userDisplayName || "John D"}
							</Typography>
							<Typography variant="body1" color="text.secondary" fontSize={"10px"} lineHeight={"14px"}>
								{userMode === "user" ? user?.organization?.name || "Customer" : "Service Manager"}
							</Typography>
						</Box>
					)}
				</Box>
				{showMenu && (
					<Box>
						{!sideBarCollapsed && (
							<IconButton onClick={handleMenuClick}>
								<MoreVertRoundedIcon />
							</IconButton>
						)}
					</Box>
				)}
				<Menu
					anchorEl={anchorEl}
					open={open}
					onClose={handleMenuClose}
					slotProps={{
						paper: {
							elevation: 0,
							sx: {
								overflow: "visible",
								filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
								mt: iconClick ? 1.5 : 0,
								ml: iconClick ? 0 : 4,
								mb: iconClick ? 0 : 4,
								width: "auto",
								minWidth: "175px",
								borderRadius: "10px",
							},
						},
					}}
					transformOrigin={
						iconClick
							? { horizontal: "right", vertical: "top" }
							: { horizontal: "left", vertical: "bottom" }
					}
					anchorOrigin={
						iconClick
							? { horizontal: "right", vertical: "bottom" }
							: { horizontal: "left", vertical: "top" }
					}>
					{menuOptions.map((option, index) => {
						const items = [];

						if (option.label === "Logout") {
							items.push(<Divider key={`divider-${index}`} />);
						}

						items.push(
							<MenuItem key={`menu-item-${index}`} onClick={() => handleMenuItemClick(option.path)}>
								<ListItemIcon>{option.icon}</ListItemIcon>
								<ListItemText>{option.label}</ListItemText>
							</MenuItem>
						);

						return items;
					})}
				</Menu>
			</Box>
		</>
	);
};

export default ProfileIcon;
