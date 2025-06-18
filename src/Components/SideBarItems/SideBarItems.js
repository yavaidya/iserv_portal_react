import { Box, Typography, Tooltip, Divider, alpha } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useState } from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../Context/PageTitleContext";

const SideBarItems = ({ menuItems, sideBarCollapsed }) => {
	const { flexCol, flexRow } = useCustomTheme();
	const [openMenu, setOpenMenu] = useState({}); // track expanded submenus
	const navigate = useNavigate();
	const { activeTitle } = usePageTitle();
	const toggleMenu = (title) => {
		setOpenMenu((prev) => ({ ...prev, [title]: !prev[title] }));
	};

	const navigateToPath = (menu) => {
		if (menu) {
			if (menu.path) {
				navigate(menu.path);
			}
		}
	};

	useEffect(() => {
		console.log("Active Title: ", activeTitle);
	}, [activeTitle]);

	const renderMenuItem = (item) => {
		const hasChildren = item.children?.length > 0;
		const isOpen = openMenu[item.title] || false;

		if (item.visible === false) {
			return null;
		}

		return (
			<Box key={item.title} width="100%" my={1}>
				<Tooltip title={item.title} key={`Tooltip_${item.title}`} placement="right" arrow disableInteractive>
					<Box
						sx={{
							...flexRow,
							padding: sideBarCollapsed ? "10px" : "8px 15px",
							columnGap: "12px",
							alignItems: "center",
							cursor: "pointer",
							width: "100%",
							borderRadius: 1,
							color:
								activeTitle.activeKey === item.activeKey
									? (theme) => theme.palette.primary.main
									: "text.secondary",
							backgroundColor:
								activeTitle.activeKey === item.activeKey
									? (theme) => alpha(theme.palette.primary.light, 0.2)
									: "transparent",
							"&:hover": {
								backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.2),
								color: (theme) => theme.palette.primary.main,
							},
						}}
						onClick={() => (hasChildren ? toggleMenu(item.title) : navigateToPath(item))}>
						{item.icon && (
							<Box sx={{ ...flexCol, justifyContent: "center", color: "inherit", fontSize: "20px" }}>
								{item.icon}
							</Box>
						)}
						{!sideBarCollapsed && (
							<Typography variant="body1" sx={{ fontSize: "12px", color: "inherit", fontWeight: "bold" }}>
								{item.title}
							</Typography>
						)}
						{hasChildren && <Box ml="auto">{isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}</Box>}
					</Box>
				</Tooltip>

				{hasChildren && isOpen && (
					<Box sx={{ pl: 2, width: "100%", borderRadius: 1 }}>
						{item.children
							.filter((child) => child.visible !== false)
							.map((child) => (
								<Tooltip
									title={child.title}
									key={child.title}
									placement="right"
									arrow
									disableInteractive>
									<Box
										sx={{
											...flexRow,
											padding: sideBarCollapsed ? "10px" : "8px 15px",
											columnGap: "12px",
											alignItems: "center",
											cursor: "pointer",
											width: "100%",
											borderRadius: 1,
											color:
												activeTitle.activeKey === child.activeKey
													? (theme) => theme.palette.primary.main
													: "text.secondary",
											backgroundColor:
												activeTitle.activeKey === child.activeKey
													? (theme) => alpha(theme.palette.primary.light, 0.2)
													: "transparent",
											"&:hover": {
												backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.2),
												color: (theme) => theme.palette.primary.main,
											},
										}}
										onClick={() => navigateToPath(child)}>
										{child.icon && (
											<Box
												sx={{
													...flexCol,
													justifyContent: "center",
													color: "inherit",
													fontSize: "14px",
												}}>
												{child.icon}
											</Box>
										)}
										{!sideBarCollapsed && (
											<Typography
												variant="body1"
												sx={{
													fontSize: "12px",
													color: "inherit",
													fontWeight: "bold",
												}}>
												{child.title}
											</Typography>
										)}
									</Box>
								</Tooltip>
							))}
					</Box>
				)}
			</Box>
		);
	};

	return (
		<Box>
			{menuItems.map((section, index) => {
				const blockTitle = section.blockTitle || section.block;
				const items = section.items || section.item || [];
				const isLast = index === menuItems.length - 1;

				return (
					<Box key={blockTitle} width="100%" sx={{ mb: 2 }}>
						{!sideBarCollapsed && (
							<Typography
								variant="body1"
								color="text.secondary"
								fontSize="11px"
								fontWeight="bolder"
								sx={{ margin: "8px" }}>
								{blockTitle}
							</Typography>
						)}
						{items.filter((item) => item.visible).map(renderMenuItem)}
						{!isLast && <Divider flexItem sx={{ margin: sideBarCollapsed ? "10px 0" : "5px 10px" }} />}
					</Box>
				);
			})}
		</Box>
	);
};

export default SideBarItems;
