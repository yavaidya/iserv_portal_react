import { IconButton, Badge, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationsButton = ({ count = 5, onClick = null }) => (
	<Badge badgeContent={count} color="primary">
		<Button
			onClick={onClick}
			color="primary"
			variant="outlined"
			sx={{ minWidth: "10px", width: "40px", height: "35px" }}>
			<NotificationsIcon sx={{ fontSize: "20px" }} />
		</Button>
	</Badge>
);

export default NotificationsButton;
