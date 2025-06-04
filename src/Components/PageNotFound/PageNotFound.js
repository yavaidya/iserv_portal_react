import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../Context/PageTitleContext";

const PageNotFound = () => {
	const navigate = useNavigate();
	const { setActiveTitle } = usePageTitle();

	useEffect(() => {
		setActiveTitle({
			title: "Page Not Found",
			subtitle: "The page you're looking for doesn't exist or has been moved.",
		});
	}, []);

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			height="75vh"
			textAlign="center"
			px={2}>
			<Typography variant="h1" color="primary" gutterBottom>
				404
			</Typography>
			<Typography variant="h5" gutterBottom>
				Oops! Page Not Found
			</Typography>
			<Typography variant="body1" mb={4}>
				The page you're looking for doesn't exist or has been moved.
			</Typography>
			<Button variant="contained" color="primary" onClick={() => navigate("/home")}>
				Go to Home
			</Button>
		</Box>
	);
};

export default PageNotFound;
