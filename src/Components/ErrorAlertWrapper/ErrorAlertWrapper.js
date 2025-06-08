import { Alert, Box } from "@mui/material";
import React from "react";
import { useCustomTheme } from "../../Context/ThemeContext";

const ErrorAlertWrapper = ({ minHeight, error }) => {
	const { flexCol } = useCustomTheme();
	return (
		<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", minHeight, width: "100%" }}>
			<Alert severity="error">{error}</Alert>
		</Box>
	);
};

export default ErrorAlertWrapper;
