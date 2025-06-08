import {
	Alert,
	alpha,
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Divider,
	Link,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useCustomTheme } from "../../../Context/ThemeContext";
import "../Auth.css"; // Assuming you have some styles in Auth.css
import SupportHome from "../SupportHome/SupportHome";
import { useNavigate } from "react-router-dom";
import login from "../../../Services/authService";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useAuth } from "../../../Context/AuthContext";
import { useTranslation } from "react-i18next";

const Login = () => {
	const { t } = useTranslation("login");
	const { flexCol, flexRow } = useCustomTheme();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		user_password: "",
	});
	const [loginLoading, setLoginLoading] = useState(false);
	const [error, setError] = useState(null);
	const [loginTitle, setLoginTitle] = useState("Customer");
	const [otherLoginTitle, setOtherLoginTitle] = useState("Service Engineer / Manager");
	const [seLogin, setSeLogin] = useState(false);
	const { authLogin } = useAuth();

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
		if (!formData.email || !formData.user_password) {
			setError("Please enter both email and password.");
			setLoginLoading(false);
			return;
		}

		const req_body = { ...formData, mode: seLogin ? "agent" : "user" };
		const response = await authLogin(setLoginLoading, setError, req_body);
		console.log(response.status ? "Login success!" : "Login Failed!");
	};

	const handleLoginChange = () => {
		console.log("Changing Login");
		setLoginTitle((prev) => (prev === "Service Engineer / Manager" ? "Customer" : "Service Engineer / Manager"));
		setOtherLoginTitle((prev) => (prev === "Customer" ? "Service Engineer / Manager" : "Customer"));
		setSeLogin((prev) => !prev);
		setError(null);
		setFormData({
			email: "",
			user_password: "",
		});
	};

	return (
		<Box
			sx={{
				...flexRow,
				width: "100%",
				height: "100vh",
				justifyContent: "flex-start",
				alignItems: "center",
				background: "url(/home_bg2.jpg) no-repeat center center fixed",
				backgroundSize: "cover",
			}}>
			<SupportHome />
			<Box
				height={"100%"}
				sx={{
					...flexCol,
					justifyContent: "center",
					rowGap: 4,
					alignItems: "center",
					width: "30%",
					background: (theme) => alpha(theme.palette.background.paper, 0.95),
					// borderRadius: "20px 0 0 20px",
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
							{loginTitle} Login
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
							gap: 2,
							width: "70%",
							mt: 4,
							alignItems: "center",
						}}>
						{error && (
							<Alert severity="error" sx={{ width: "100%", mb: 2 }}>
								{error}
							</Alert>
						)}
						<TextField
							label="Email / Username"
							type="text"
							name="email"
							fullWidth
							size="small"
							variant="outlined"
							value={formData.email}
							onChange={handleFieldChange}
						/>
						<TextField
							label="Password"
							type="password"
							name="user_password"
							size="small"
							fullWidth
							variant="outlined"
							value={formData.user_password}
							onChange={handleFieldChange}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleLogin();
								}
							}}
						/>
						<Box width="100%" textAlign="right">
							<Link
								onClick={() => navigate("/forgot-password")}
								variant="body2"
								underline="hover"
								sx={{ cursor: "pointer" }}>
								Forgot Password?
							</Link>
						</Box>
						<Button
							variant="contained"
							endIcon={<ArrowRightAltIcon />}
							color="primary"
							sx={{ minWidth: "150px" }}
							onClick={handleLogin}>
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
							<Typography variant="body1">
								I am {otherLoginTitle} -{" "}
								<Link
									variant="body2"
									underline="hover"
									onClick={() => handleLoginChange()}
									sx={{ cursor: "pointer" }}>
									Login Here
								</Link>
							</Typography>
						</Box>
					</Box>
				</Box>
				<Box
					sx={{
						...flexCol,
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						mt: 4,
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

export default Login;
