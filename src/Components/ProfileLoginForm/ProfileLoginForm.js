import { Box, Button, Modal, TextField, Typography, Alert } from "@mui/material";
import React, { useState } from "react";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useCustomTheme } from "../../Context/ThemeContext";

const ProfileLoginForm = ({ formData, handleFieldChange, currentUser, setCurrentUser, isEditing, setIsEditing }) => {
	const { flexRow } = useCustomTheme();
	const [openModal, setOpenModal] = useState(false);
	const [passwords, setPasswords] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [validation, setValidation] = useState({
		minLength: false,
		uppercase: false,
		specialChar: false,
		number: false,
		confirmpass: false,
	});
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswords((prev) => ({ ...prev, [name]: value }));

		if (name === "newPassword") {
			validatePassword(value);
			validateConfirmPassword(passwords.confirmPassword, value);
		}
		if (name === "confirmPassword") {
			validateConfirmPassword(value, passwords.newPassword);
		}
	};

	const validatePassword = (password) => {
		setValidation((prev) => ({
			...prev,
			minLength: password.length >= 8,
			uppercase: /[A-Z]/.test(password),
			specialChar: /[!@#$%^&*]/.test(password),
			number: /[0-9]/.test(password),
		}));
	};

	const validateConfirmPassword = (confirmPass, newPass) => {
		setValidation((prev) => ({
			...prev,
			confirmpass: confirmPass === newPass,
		}));
	};

	const isFormValid = () => {
		return (
			validation.minLength &&
			validation.uppercase &&
			validation.specialChar &&
			validation.number &&
			validation.confirmpass &&
			passwords.currentPassword
		);
	};

	const handleModalClose = () => {
		setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
		setSuccessMessage("");
		setOpenModal(false);
		setValidation({
			minLength: false,
			uppercase: false,
			specialChar: false,
			number: false,
			confirmpass: false,
		});
	};

	const handleSubmitPassword = async () => {
		const { currentPassword, newPassword, confirmPassword } = passwords;
		if (!currentPassword || !newPassword || !confirmPassword) {
			setErrorMessage("All fields are required.");
			return;
		}

		const reqBody = {
			userId: currentUser.user_id,
			current_pass: currentPassword,
			pass: newPassword,
			c_pass: confirmPassword,
		};
	};

	return (
		<>
			<Box
				sx={{
					...flexRow,
					justifyContent: "flex-start",
					alignItems: "flex-start",
					width: "100%",
					columnGap: "15px",
					mt: 2,
				}}>
				<div className="form-section">
					<div className="form-group">
						<TextField
							label="Username"
							name="user_username"
							value={formData.user_username}
							fullWidth
							size="small"
							disabled={!isEditing}
							onChange={handleFieldChange}
							className="form-input"
						/>
						<Button
							variant="contained"
							startIcon={<CachedRoundedIcon />}
							onClick={() => setOpenModal(true)}>
							Change Password
						</Button>
					</div>
				</div>
			</Box>

			<Modal open={openModal} onClose={handleModalClose}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
						width: "50%",
						display: "flex",
						flexDirection: "column",
						rowGap: 2,
					}}>
					<Typography variant="h4">Change Password</Typography>
					{errorMessage && <Alert severity="error">{errorMessage}</Alert>}
					{successMessage && <Alert severity="success">{successMessage}</Alert>}
					<TextField
						label="Current Password"
						type="password"
						size="small"
						name="currentPassword"
						value={passwords.currentPassword}
						onChange={handlePasswordChange}
						fullWidth
					/>
					<TextField
						label="New Password"
						type="password"
						size="small"
						name="newPassword"
						value={passwords.newPassword}
						onChange={handlePasswordChange}
						fullWidth
					/>
					<TextField
						label="Confirm Password"
						type="password"
						size="small"
						name="confirmPassword"
						value={passwords.confirmPassword}
						onChange={handlePasswordChange}
						fullWidth
					/>
					{/* Validation Feedback */}
					<Box>
						{[
							["minLength", "Minimum 8 characters"],
							["uppercase", "At least one uppercase letter"],
							["specialChar", "At least one special character"],
							["number", "At least one number"],
							["confirmpass", "Confirm Password Matches"],
						].map(([key, label]) => (
							<Typography
								key={key}
								sx={{
									fontSize: "11px",
									color: validation[key] ? "green" : "#aaa",
									display: "flex",
									alignItems: "center",
								}}>
								{validation[key] ? (
									<CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
								) : (
									<ErrorOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
								)}
								{label}
							</Typography>
						))}
					</Box>

					<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
						<Button onClick={handleModalClose} sx={{ mr: 1 }}>
							Cancel
						</Button>
						<Button variant="contained" onClick={handleSubmitPassword} disabled={!isFormValid()}>
							Change Password
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	);
};

export default ProfileLoginForm;
