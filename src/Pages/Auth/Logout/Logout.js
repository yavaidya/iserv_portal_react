import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { alpha, Box, CircularProgress, Divider, Typography } from "@mui/material";
import { useCustomTheme } from "../../../Context/ThemeContext";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
const Logout = () => {
	const { logout } = useAuth(); // Use the logout function from AuthContext
	const navigate = useNavigate(); // React Router hook for navigation
	const { flexCol, flexRow } = useCustomTheme();
	const [loggingOut, setLoggingOut] = useState(true);

	useEffect(() => {
		setLoggingOut(true);
		logout();
		setTimeout(() => {
			// navigate("/login");
			setLoggingOut(false);
		}, 1500);
		setTimeout(() => {
			navigate("/login");
			// setLoggingOut(false);
		}, 2500);
	}, [logout, navigate]);

	return (
		<Box
			sx={{
				...flexRow,
				width: "100%",
				height: "100vh",
				justifyContent: "center",
				alignItems: "center",
				background: "url(/home_bg2.jpg) no-repeat center center fixed",
				backgroundSize: "cover",
			}}>
			<Box
				height={"100%"}
				sx={{
					...flexCol,
					justifyContent: "center",
					rowGap: 2,
					alignItems: "center",
					height: "fit-content",
					width: "400px",
					background: (theme) => alpha(theme.palette.background.paper, 0.95),
					borderRadius: "20px",
				}}>
				<Box
					sx={{
						...flexCol,
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
					}}>
					<img src="/logo.png" alt="Company Logo" width={"180px"} style={{ margin: "30px" }} />
				</Box>
				<Box
					sx={{
						...flexCol,
						justifyContent: "flex-start",
						alignItems: "center",
						width: "100%",
						minHeight: "200px",
					}}>
					<Divider variant="middle" flexItem>
						<Box sx={{ ...flexCol, justifyContent: "center", alignItems: "center", rowGap: "15px" }}>
							{loggingOut ? (
								<>
									<CircularProgress size={35} />
									<Typography fontWeight={"bold"} variant="body1">
										Logging Out...
									</Typography>
								</>
							) : (
								<>
									<CheckCircleOutlineRoundedIcon sx={{ fontSize: 60 }} color="success" />
									<Typography fontWeight={"bold"} variant="body1">
										You have been Logged Out! Navigating to Login....
									</Typography>
								</>
							)}
						</Box>
					</Divider>
				</Box>
			</Box>
		</Box>
	);
};

export default Logout;
