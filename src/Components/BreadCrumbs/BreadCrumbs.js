import React from "react";
import { Breadcrumbs, Typography, Link, Box, IconButton } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useLocation, useNavigate } from "react-router-dom";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const CustomBreadcrumbs = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const pathnames = location.pathname.split("/").filter((x) => x);

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
			<IconButton color="text.secondary" size="small" onClick={() => navigate("/")}>
				<HomeOutlinedIcon sx={{ fontSize: 18, cursor: "pointer", fontWeight: "bold" }} />
			</IconButton>

			{pathnames.length > 0 && (
				<Typography sx={{ mx: 1 }} variant="body1" color="text.secondary">
					/
				</Typography>
			)}

			<Breadcrumbs separator="/" aria-label="breadcrumb">
				{pathnames.map((value, index) => {
					const to = `/${pathnames.slice(0, index + 1).join("/")}`;
					const isLast = index === pathnames.length - 1;

					return isLast ? (
						<Typography key={to} color="text.secondary">
							{capitalize(decodeURIComponent(value))}
						</Typography>
					) : (
						<Link
							key={to}
							underline="hover"
							color="inherit"
							onClick={() => navigate(to)}
							sx={{ cursor: "pointer", fontWeight: "600" }}>
							{capitalize(decodeURIComponent(value))}
						</Link>
					);
				})}
			</Breadcrumbs>
		</Box>
	);
};

export default CustomBreadcrumbs;
