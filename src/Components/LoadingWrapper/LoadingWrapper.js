import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { useCustomTheme } from "../../Context/ThemeContext";

const LoadingWrapper = ({ minHeight, minWidth = "100%" }) => {
	const { flexCol } = useCustomTheme();
	return (
		<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", minHeight, width: "100%", minWidth }}>
			<CircularProgress />
		</Box>
	);
};

export default LoadingWrapper;
