import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { useCustomTheme } from "../../Context/ThemeContext";

const UserName = ({ name, onClick = null, cursor = "pointer", size = 25 }) => {
	const { flexRow } = useCustomTheme();
	function stringAvatar(name) {
		return {
			sx: {
				// bgcolor: stringToColor(name),
				width: size ? size : 25,
				height: size ? size : 25,
				cursor: cursor,
				fontSize: "12px",
			},
			children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
			onClick: onClick ? onClick : null,
		};
	}

	return (
		<Box sx={{ ...flexRow, justifyContent: "flex-start", alignItems: "center", columnGap: "5px", cursor }}>
			<Avatar {...stringAvatar(`${name}` || "John D")} />
			<Typography variant="body1">{name}</Typography>
		</Box>
	);
};

export default UserName;
