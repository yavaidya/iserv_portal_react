import { Box, Divider, Link } from "@mui/material";
import React from "react";
import { useCustomTheme } from "../../Context/ThemeContext";

const Footer = () => {
	const { flexRow } = useCustomTheme();
	const currentYear = new Date().getFullYear();

	return (
		<>
			<Divider flexItem sx={{ mt: 1 }} variant="middle" />
			<Box sx={{ ...flexRow, justifyContent: "space-between", px: 2, py: 2, flexWrap: "wrap", gap: 1 }}>
				<Box>© {currentYear} Ithena. All rights reserved.</Box>
				<Box>
					<Link href="/privacy-policy" underline="hover" sx={{ mx: 1 }}>
						Privacy Policy
					</Link>
					|
					<Link href="/terms-of-service" underline="hover" sx={{ mx: 1 }}>
						Terms of Service
					</Link>
					|
					<Link href="/eula" underline="hover" sx={{ mx: 1 }}>
						EULA
					</Link>
				</Box>
			</Box>
		</>
	);
};

export default Footer;
