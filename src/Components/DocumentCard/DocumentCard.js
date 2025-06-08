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

const DocumentCard = ({ data, showCategory = true, showDelete = true, handleRemove = null, origin = "category" }) => {
	const { flexRow } = useCustomTheme();
	return (
		<Paper elevation={0} sx={{ border: "1px solid #eee", padding: 1, mb: 0.5 }}>
			<Box sx={{ ...flexRow, justifyContent: "flex-start", alignItems: "center", columnGap: 2 }}>
				<img src="/ith_icon.png" width={"30px"} />
				<Box sx={{ flex: 1 }}>
					<Typography variant="body1" fontWeight={"bold"}>
						<Link underline="hover" sx={{ cursor: "pointer" }}>
							{data.title}
						</Link>
					</Typography>
					{showCategory && (
						<Typography
							variant="body1"
							fontSize={"11px"}
							fontStyle={"italic"}
							color="text.secondary"
							sx={{ mb: 0 }}>
							<b>Category:</b>{" "}
							{data.category === "new"
								? data.newCategory
								: data.category_name
								? data.category_name
								: data.category}
						</Typography>
					)}
				</Box>
				<Box sx={{ ...flexRow, justifyContent: "flex-start", alignItems: "center", columnGap: 1 }}>
					<Tooltip title={"View Document"}>
						<IconButton size="medium" color="primary">
							<FileOpenIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title={"Download File"}>
						<IconButton size="medium" color="primary">
							<FileDownloadIcon />
						</IconButton>
					</Tooltip>
					{showDelete && (
						<Tooltip title={"Remove Provision"}>
							<IconButton
								size="medium"
								color="error"
								onClick={() => {
									if (origin === "category") {
										handleRemove(data.title, data.description);
									} else if (origin === "equipment") {
										handleRemove(data.kb_id);
									}
								}}>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					)}
				</Box>
			</Box>
		</Paper>
	);
};

export default DocumentCard;
