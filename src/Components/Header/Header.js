import { Box } from "@mui/material";
import { useCustomTheme } from "../../Context/ThemeContext";
import GlobalSearch from "../../Components/GlobalSearch/GlobalSearch";
import ProfileIcon from "../../Components/ProfileIcon/ProfileIcon";
const Header = () => {
	const { flexRow } = useCustomTheme();
	return (
		<Box
			sx={{
				...flexRow,
				width: "100%",
				zIndex: 1052,
				height: "7%",
				px: 2,
				background: (theme) => theme.palette.background.paper,
				boxShadow: "2px 4px 5px 0px rgba(0,0,0,0.1)",
				justifyContent: "space-between",
				alignItems: "center",
			}}>
			<img src="/logo.png" alt="Company Logo" width={"120px"} />
			<Box
				sx={{
					...flexRow,
					width: "100%",
					minHeight: "65px",
					height: "fit-content",
					justifyContent: "flex-end",
					alignItems: "center",
				}}>
				<Box sx={{ ...flexRow, justifyContent: "flex-end", alignItems: "center", columnGap: 4 }}>
					<GlobalSearch width={300} />
					<ProfileIcon reverse={true} showMenu={false} iconClick={true} />
				</Box>
			</Box>
		</Box>
	);
};

export default Header;
