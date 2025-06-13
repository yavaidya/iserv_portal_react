import { alpha, Box, Tooltip, Typography } from "@mui/material";
import React from "react";

const CustomChip = ({ text, color = "primary" }) => {
	return (
		<Tooltip title={`Status: `}>
			<Box
				sx={{
					background: (theme) => alpha(theme.palette[color].light, 0.25),
					cursor: "pointer",
					pt: "2px",
					px: "20px",
					borderRadius: "20px",
				}}>
				<Typography
					variant="body1"
					color={(theme) => alpha(theme.palette[color].light, 1)}
					fontWeight={"bold"}
					margin={0}>
					{text}
				</Typography>
			</Box>
		</Tooltip>
	);
};

export default CustomChip;
