import { Box, Typography } from "@mui/material";
import React from "react";

const SectionTitle = ({ title, subtitle = "" }) => {
	return (
		<Box>
			<Typography variant="h6" fontWeight={"bold"}>
				{title}
			</Typography>
			{subtitle !== "" && (
				<Typography variant="body1" m={0}>
					{subtitle}
				</Typography>
			)}
			<Box
				sx={{
					width: "60px",
					height: "3px",
					mt: 1,
					mb: 2,
					background: (theme) => theme.palette.primary.main,
				}}></Box>
		</Box>
	);
};

export default SectionTitle;
