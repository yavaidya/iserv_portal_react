import { Box } from "@mui/material";

const TabPanel = ({ children, value, index }) => {
	if (value !== index) return null;
	return <Box p={2}>{children}</Box>;
};
export default TabPanel;
