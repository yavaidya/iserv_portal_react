import {
	Alert,
	alpha,
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Link,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useCustomTheme } from "../../../Context/ThemeContext";
import "../Auth.css"; // Assuming you have some styles in Auth.css
import SupportHome from "../SupportHome/SupportHome";
import { Navigate, useNavigate } from "react-router-dom";
import login from "../../../Services/authService";
const ManagerLogin = () => {
	const { flexCol, flexRow } = useCustomTheme();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [loginLoading, setLoginLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleFieldChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleLogin = async () => {
		setError(null); // Reset error
		setLoginLoading(true);
		if (!formData.username || !formData.password) {
			setError("Please enter both email and password.");
			setLoginLoading(false);
			return;
		}
		try {
			// Example API request
			const response = await login(formData);

			console.log("Login success:", response);
			setTimeout(() => {
				setLoginLoading(false);

				navigate("/dashboard");
			}, 1000);
		} catch (err) {
			setTimeout(() => {
				setLoginLoading(false);
				setError(err.message);
			}, 1000);
		}
	};

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
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
					}}>
					<Box
						sx={{
							...flexCol,
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
						}}>
						<Typography variant="h3" fontWeight={"bold"}>
							Service Engineer / Manager Login
						</Typography>
						<Box
							sx={{
								mt: 1,
								background: (theme) => theme.palette.primary.main,
								width: "90px",
								height: "4px",
							}}></Box>
					</Box>

					<Box
						sx={{
							...flexCol,
							rowGap: 2,
							width: "70%",
							mt: 4,
							width: "80%",
						}}>
						{error && (
							<Alert severity="error" color="error" variant="filled" sx={{ width: "100%", mb: 2 }}>
								{error}
							</Alert>
						)}
						<TextField
							label="Email / Username"
							type="text"
							name="username"
							fullWidth
							variant="outlined"
							size="small"
							value={formData.username}
							onChange={handleFieldChange}
						/>
						<TextField
							label="Password"
							type="password"
							name="password"
							fullWidth
							size="small"
							variant="outlined"
							value={formData.password}
							onChange={handleFieldChange}
						/>
						<Box width="100%" textAlign="right">
							<Link
								onClick={() => navigate("/staff/forgot-password")}
								variant="body2"
								underline="hover"
								sx={{ cursor: "pointer" }}>
								Forgot Password?
							</Link>
						</Box>
						<Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
							Login
						</Button>
						{loginLoading && (
							<Box
								sx={{
									...flexRow,
									justifyContent: "center",
									alignItems: "center",
									columnGap: "16px",
									width: "100%",
								}}>
								<CircularProgress size={30} color="success" />
								<Typography variant="h6" fontWeight={"bold"} color="success">
									Verifying...
								</Typography>
							</Box>
						)}
						<Box sx={{ ...flexCol, width: "100%", mt: 2, alignItems: "center" }}>
							<Link
								onClick={() => navigate("/login")}
								variant="body2"
								underline="hover"
								sx={{ cursor: "pointer" }}>
								Login as Customer
							</Link>
						</Box>
					</Box>
				</Box>
				<Box
					sx={{
						...flexCol,
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						my: 3,
					}}>
					<Typography variant="body2" color="textSecondary">
						&copy; {new Date().getFullYear()} Ithena. All rights reserved.
					</Typography>
					<Box sx={{ ...flexRow, gap: 1, mt: 1 }}>
						<Link href="/privacy-policy" underline="hover" color="textSecondary">
							Privacy Policy
						</Link>
						|
						<Link href="/terms-of-service" underline="hover" color="textSecondary">
							Terms of Service
						</Link>
						|
						<Link href="/eula" underline="hover" color="textSecondary">
							EULA
						</Link>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default ManagerLogin;
