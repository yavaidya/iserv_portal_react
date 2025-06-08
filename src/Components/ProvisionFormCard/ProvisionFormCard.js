import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	IconButton,
	Link,
	Paper,
	Tooltip,
	Typography,
} from "@mui/material";
import React from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
const ProvisionFormCard = ({ data, handleRemove }) => {
	const { flexRow } = useCustomTheme();
	return (
		<Paper elevation={0} sx={{ border: "1px solid #eee", padding: 1, mb: 0.5 }}>
			<Box sx={{ ...flexRow, justifyContent: "flex-start", alignItems: "center", columnGap: 2 }}>
				<PrecisionManufacturingIcon sx={{ fontSize: "30px", color: (theme) => theme.palette.text.secondary }} />
				<Box sx={{ flex: 1 }}>
					<Typography variant="body1" fontWeight={"bold"}>
						<Link underline="hover" sx={{ cursor: "pointer" }}>
							{data.equipment_name}
						</Link>
					</Typography>
					<Typography
						variant="body1"
						fontSize={"11px"}
						fontStyle={"italic"}
						color="text.secondary"
						sx={{ mb: 0 }}>
						<b>Serial No:</b> {data.serialNumber} | <b>Site:</b> {data.site_name}
					</Typography>
				</Box>
				<Box sx={{ ...flexRow, justifyContent: "flex-start", alignItems: "center", columnGap: 1 }}>
					<Tooltip title={"Remove Customer Site"}>
						<IconButton
							size="medium"
							color="error"
							onClick={() => {
								handleRemove(data.equipment, data.serialNumber);
							}}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</Box>
			</Box>
		</Paper>
	);
};

export default ProvisionFormCard;
