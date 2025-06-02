import { Box, Button } from "@mui/material";
import React, { act, use, useEffect, useState } from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import GlobalSearch from "../../Components/GlobalSearch/GlobalSearch";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SideBar from "../../Components/SideBar/SideBar";
import ProfileIcon from "../../Components/ProfileIcon/ProfileIcon";
import ThemeCustomizer from "../../Components/ThemeCustomizer/ThemeCustomizer";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { Route, Routes } from "react-router-dom";
import Hero from "../../Components/Hero/Hero";
import PageNotFound from "../../Components/PageNotFound/PageNotFound";
import Home from "../../Pages/Home/Home";
import { adminMenu, manageMenu, customerMenu } from "../../Data/NavItems";
import { useAuth } from "../../Context/AuthContext";
import Profile from "../../Pages/Profile/Profile";
import Customers from "../../Pages/Customers/Customers";
import CustomerUsers from "../../Pages/CustomerUsers/CustomerUsers";
import Tickets from "../../Pages/Tickets/Tickets";
const HorizontalLayout = () => {
	const { userMode } = useAuth();
	const { flexCol, flexRow } = useCustomTheme();
	const [menuItems, setMenuItems] = useState([]);
	const [dynamicRoutes, setDynamicRoutes] = useState([]);
	const extractRoutes = (menuItems) => {
		const routes = [];

		const traverse = (items) => {
			for (const item of items) {
				if (item.path && item.component) {
					routes.push({ path: item.path, component: item.component });
				}

				if (item.children) {
					traverse(item.children);
				}

				if (item.items) {
					traverse(item.items);
				}

				if (item.item) {
					traverse(item.item);
				}
			}
		};

		traverse(menuItems);
		return routes;
	};

	useEffect(() => {
		switch (userMode) {
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

	useEffect(() => {
		if (menuItems.length !== 0) {
			setDynamicRoutes(extractRoutes(menuItems));
			console.log("Dynamic Routes:", dynamicRoutes);
		}
	}, [menuItems]);

	return (
		<Box>
			<Box sx={{ ...flexCol, width: "100%", height: "100vh", columnGap: 0 }}>
				<Header />
				<Box
					sx={{
						...flexRow,
						width: "100%",
						height: "100%",
						justifyContent: "flex-start",
						alignItems: "flex-start",
						overflow: "hidden",
					}}>
					<SideBar userMenu={userMode} />
					<Box
						sx={{
							...flexCol,
							flex: 1,
							height: "100%",
							maxHeight: "100vh",
							width: "88%",
						}}>
						<Hero />
						<Box sx={{ width: "100%", overflowY: "auto" }}>
							<Box minHeight={"75vh"}>
								<Routes>
									{/* {dynamicRoutes.map(({ path, component }) => (
										<Route key={path} path={path} element={component} />
									))} */}
									<Route path="/home" element={<Home />} />
									<Route path="/settings" element={<ThemeCustomizer />} />
									<Route path="/profile" element={<Profile />} />
									<Route path="/customers" element={<Customers />} />
									<Route path="/tickets" element={<Tickets />} />
									<Route path="/users" element={<CustomerUsers />} />
									<Route path="/*" element={<PageNotFound />} />
								</Routes>
							</Box>
							<Footer />
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default HorizontalLayout;
