import { Box, Divider, Link, Typography } from "@mui/material";
import React from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PageTitle from "../PageTitle/PageTitle";
import CustomBreadcrumbs from "../BreadCrumbs/BreadCrumbs";

const Hero = () => {
	const { flexRow } = useCustomTheme();
	const currentYear = new Date().getFullYear();

	return (
		<>
			<Box
				sx={{
					...flexRow,
					justifyContent: "space-between",
					px: 4,
					py: 2,
					flexWrap: "wrap",
					alignItems: "flex-start",
					width: "100%",
				}}>
				<PageTitle />
				<CustomBreadcrumbs />
			</Box>
		</>
	);
};

export default Hero;
