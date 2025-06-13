import { alpha, Box, Typography } from "@mui/material";
import React from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useCustomTheme } from "../../Context/ThemeContext";
const CounterCard = ({ title = "Open Tickets", count = "0", icon, status, color = "primary", onClick = null }) => {
	const { flexRow, flexCol } = useCustomTheme();

	return (
		<Box
			onClick={onClick ? onClick : null}
			sx={{
				...flexRow,
				justifyContent: "space-between",
				alignItems: "center",
				background: (theme) => theme.palette.background.paper,
				boxShadow: "0 0 4px 1px rgba(0,0,0,0.1)",
				width: "100%",
				p: 3,
				cursor: "pointer",
				borderRadius: "10px",
				transition: "all 0.1s ease-in-out",
				"&:hover": {
					boxShadow: "0 0 20px 10px rgba(0,0,0,0.1)",
					transform: "scale(1.01)",
				},
			}}>
			<Box sx={{ ...flexCol, justifyContent: "flex-start", alignItems: "flex-start", rowGap: 1.5 }}>
				<Typography variant="body1" fontWeight={"bold"}>
					{title}
				</Typography>
				<Typography variant="h1" fontWeight={"bold"} color={color}>
					{count}
				</Typography>
			</Box>
			<Box
				sx={{
					height: "50px",
					width: "50px",
					background: (theme) => alpha(theme.palette[color].light, 0.1),
					borderRadius: "50%",
					...flexCol,
					justifyContent: "center",
					alignItems: "center",
					p: 1,
				}}>
				<InsertDriveFileIcon color={color} />
			</Box>
		</Box>
	);
};

export default CounterCard;
