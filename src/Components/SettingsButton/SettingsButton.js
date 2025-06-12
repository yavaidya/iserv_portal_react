import { Button, IconButton } from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

const SettingsButton = ({ onClick }) => (
	<Button
		onClick={onClick}
		color="primary"
		variant="outlined"
		sx={{ minWidth: "10px", width: "40px", height: "35px" }}>
		<SettingsRoundedIcon sx={{ fontSize: "20px" }} />
	</Button>
);

export default SettingsButton;
