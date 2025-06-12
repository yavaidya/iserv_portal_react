import { Box, Button } from "@mui/material";
import { useCustomTheme } from "../../Context/ThemeContext";
import GlobalSearch from "../../Components/GlobalSearch/GlobalSearch";
import ProfileIcon from "../../Components/ProfileIcon/ProfileIcon";
import { useNavigate } from "react-router-dom";
import NotificationsButton from "../NotificationsButton/NotificationsButton";
import SettingsButton from "../SettingsButton/SettingsButton";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
const Header = () => {
	const { flexRow } = useCustomTheme();
	const navigate = useNavigate();
	return (
		<Box
			sx={{
				...flexRow,
				width: "100%",
				zIndex: 1052,
				height: "75px",
				px: 2,
				background: (theme) => theme.palette.background.paper,
				boxShadow: "2px 4px 5px 0px rgba(0,0,0,0.1)",
				justifyContent: "space-between",
				alignItems: "center",
			}}>
			<Box
				sx={{
					...flexRow,
					width: "50%",
					minHeight: "65px",
					height: "fit-content",
					justifyContent: "flex-start",
					alignItems: "center",
					columnGap: 3,
				}}>
				<Box sx={{ minWidth: "150px" }}>
					<img src="/logo.png" alt="Company Logo" width={"120px"} />
				</Box>
			</Box>
			<Box
				sx={{
					...flexRow,
					width: "100%",
					minHeight: "65px",
					height: "fit-content",
					justifyContent: "flex-end",
					alignItems: "center",
				}}>
				<Box sx={{ ...flexRow, justifyContent: "flex-end", alignItems: "center", columnGap: 2 }}>
					<Button
						variant="outlined"
						startIcon={<NoteAddRoundedIcon />}
						onClick={() => {
							navigate("/tickets/new-ticket");
						}}>
						New Ticket
					</Button>
					{/* <Box
						sx={{
							...flexRow,
							justifyContent: "flex-start",
							alignItems: "center",
							columnGap: 1,
							}}> */}
					<GlobalSearch width={400} />
					<NotificationsButton count={3} onClick={() => console.log("Notifications clicked")} />
					<SettingsButton onClick={() => console.log("Settings clicked")} />
					<ProfileIcon reverse={true} showMenu={false} sideBarCollapsed={true} iconClick={true} />
					{/* </Box> */}
				</Box>
			</Box>
		</Box>
	);
};

export default Header;
