import { alpha, Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import { formatDate } from "../../Services/globalServiceUtils";
import "./ThreadChat.css";
const ThreadChat = ({ thread }) => {
	const { flexRow, flexCol } = useCustomTheme();

	function stringAvatar(name) {
		return {
			sx: {
				// bgcolor: stringToColor(name),
				width: 35,
				height: 35,
				cursor: "default",
				fontSize: "14px",
			},
			children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
		};
	}

	switch (thread.thread_from) {
		case "staff":
			return (
				<Box
					sx={{
						...flexRow,
						width: "100%",
						justifyContent: "flex-end",
						my: 1,
					}}>
					<Box
						sx={{
							...flexRow,
							width: "80%",

							justifyContent: "flex-end",
							alignItems: "flex-start",
							columnGap: 1.5,
						}}>
						<Box sx={{ ...flexCol, justifyContent: "flex-end", alignItems: "flex-end", rowGap: "3px" }}>
							<Box
								sx={{
									background: (theme) => alpha(theme.palette.primary.main, 0.4),
									px: 2,
									py: 1.5,
									borderRadius: "10px 10px 0px 10px",
									textWrap: "wrap",
									width: "100%",
									boxShadow: 2,
									minWidth: "20vw",
								}}>
								{thread.format === "html" ? (
									<div
										style={{ margin: 0 }}
										dangerouslySetInnerHTML={{ __html: thread.message }}
										className="thread-html"
									/>
								) : (
									<Typography variant="body1">{thread.message}</Typography>
								)}
							</Box>
							<Typography variant="body1" color="text.secondary" fontSize={"10px"} fontStyle={"italic"}>
								<b>{thread.staff_poster.name}</b> posted on {formatDate(thread.createdAt)}
							</Typography>
						</Box>
						<Avatar {...stringAvatar(`${thread.staff_poster.name}` || "John D")} />
					</Box>
				</Box>
			);

		case "user":
			return (
				<Box
					sx={{
						...flexRow,
						width: "100%",
						justifyContent: "flex-start",
						my: 1,
					}}>
					<Box
						sx={{
							...flexRow,
							width: "80%",
							justifyContent: "flex-start",
							alignItems: "flex-start",
							columnGap: 1.5,
						}}>
						<Avatar {...stringAvatar(`${thread.user_poster.name}` || "John D")} />
						<Box sx={{ ...flexCol, justifyContent: "flex-start", alignItems: "flex-start", rowGap: "3px" }}>
							<Box
								sx={{
									background: (theme) => alpha(theme.palette.primary.light, 0.2),
									px: 2,
									py: 1.5,
									borderRadius: "10px 10px 10px 0",
									textWrap: "wrap",
									width: "100%",
									boxShadow: 2,
								}}>
								{thread.format === "html" ? (
									<div
										style={{ margin: 0 }}
										dangerouslySetInnerHTML={{ __html: thread.message }}
										className="thread-html"
									/>
								) : (
									<Typography variant="body1">{thread.message}</Typography>
								)}
							</Box>
							<Typography variant="body1" color="text.secondary" fontSize={"10px"} fontStyle={"italic"}>
								<b>{thread.user_poster.name}</b> posted on {formatDate(thread.createdAt)}
							</Typography>
						</Box>
					</Box>
				</Box>
			);
	}
};

export default ThreadChat;
