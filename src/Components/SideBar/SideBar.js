import { alpha, Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import SideBarItems from "../SideBarItems/SideBarItems";
import ProfileIcon from "../ProfileIcon/ProfileIcon";
import { adminMenu, manageMenu, customerMenu } from "../../Data/NavItems";
const SideBar = ({ userMenu = "user", activeMenu, setActiveMenu }) => {
	const { flexCol, flexRow } = useCustomTheme();
	const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [menuItems, setMenuItems] = useState([]);

	useEffect(() => {
		switch (userMenu) {
			case "agent":
				setMenuItems(adminMenu);
				break;
			case "manager":
				setMenuItems(manageMenu);
				break;
			case "user":
				setMenuItems(customerMenu);
				break;
			default:
				setMenuItems(customerMenu);
				break;
		}
	}, []);

	const collapseExpandSidebar = () => {
		setSideBarCollapsed(!sideBarCollapsed);
	};

	const handleSubMenuOpen = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<Box
			sx={{
				...flexCol,
				width: sideBarCollapsed ? "5%" : "12%",
				height: "100%",
			}}>
			<Box
				sx={{
					...flexCol,
					width: "100%",
					p: 2,
					background: (theme) => theme.palette.background.paper,
					boxShadow: "2px 7px 6px 2px rgba(0,0,0,0.1)",
					height: "100%",
					// overflow: "hidden",
					position: "relative",
				}}>
				<Box
					sx={{
						position: "absolute",
						top: 10,
						zIndex: 10,
						right: sideBarCollapsed ? 1 : -1, // adjust as needed
						transform: sideBarCollapsed ? "translateX(50%)" : "translateX(50%)",
						backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
						borderRadius: "50%",
						boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
					}}>
					<Tooltip title={sideBarCollapsed ? "Expand Menu" : "Collapse Menu"}>
						<IconButton onClick={collapseExpandSidebar} size="small" color="primary">
							{sideBarCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
						</IconButton>
					</Tooltip>
				</Box>
				<Box
					sx={{
						flexGrow: 1,
						width: "100%",
						overflowY: "auto",
						overflowX: "hidden",
						scrollbarWidth: "none", // for Firefox
						"&::-webkit-scrollbar": { display: "none" }, // for Chrome
					}}>
					<SideBarItems
						menuItems={menuItems}
						activeMenu={activeMenu}
						setActiveMenu={setActiveMenu}
						sideBarCollapsed={sideBarCollapsed}
					/>
				</Box>
				<Box sx={{ width: "100%", height: "55px" }}>
					<ProfileIcon sideBarCollapsed={sideBarCollapsed} />
				</Box>
			</Box>
		</Box>
	);
};

export default SideBar;
