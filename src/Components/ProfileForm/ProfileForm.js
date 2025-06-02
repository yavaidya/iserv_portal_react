import {
	Box,
	Button,
	CircularProgress,
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCustomTheme } from "../../Context/ThemeContext";

const ProfileForm = ({ formData, handleFieldChange, currentUser, setCurrentUser, isEditing, setIsEditing }) => {
	const { flexRow, flexCol } = useCustomTheme();

	return (
		<Box
			sx={{
				...flexRow,
				justifyContent: "flex-start",
				alignItems: "flex-start",
				width: "100%",
				columnGap: "15px",
				mt: 2,
			}}>
			<Box>
				<img src="/user-avatar-preview.png" alt="user-img" width={"200px"} />
			</Box>
			<Divider flexItem orientation="vertical" sx={{ my: 0.5 }} />
			<div className="form-section">
				<div className="form-group">
					<TextField
						label="First Name"
						name="user_first_name"
						value={formData.user_first_name}
						fullWidth
						size="small"
						disabled={!isEditing}
						onChange={handleFieldChange}
						className="form-input"
					/>
					<TextField
						label="Last Name"
						name="user_last_name"
						value={formData.user_last_name}
						fullWidth
						size="small"
						disabled={!isEditing}
						onChange={handleFieldChange}
						className="form-input"
					/>
				</div>
				<TextField
					label="Email"
					name="user_email"
					value={formData.user_email}
					fullWidth
					size="small"
					disabled={!isEditing}
					onChange={handleFieldChange}
					className="form-input"
				/>

				<div className="form-group">
					<TextField
						label="Ext."
						name="user_phone_extension"
						type="number"
						value={formData.user_phone_extension}
						sx={{ width: "75px" }}
						size="small"
						disabled={!isEditing}
						onChange={handleFieldChange}
					/>
					<TextField
						label="Phone"
						name="user_phone"
						value={formData.user_phone}
						fullWidth
						size="small"
						disabled={!isEditing}
						onChange={handleFieldChange}
						className="form-input"
					/>
				</div>
				<TextField
					label="Display Name"
					name="user_display_name"
					value={formData.user_display_name}
					fullWidth
					size="small"
					disabled
					onChange={handleFieldChange}
					className="form-input"
				/>
			</div>
		</Box>
	);
};

export default ProfileForm;
