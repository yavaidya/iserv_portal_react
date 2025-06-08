import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";
import { Tabs, Tab, Box, Typography, Button } from "@mui/material";
import { useCustomTheme } from "../../Context/ThemeContext";
import EditIcon from "@mui/icons-material/Edit";
import ProfileForm from "../../Components/ProfileForm/ProfileForm";
import { useAuth } from "../../Context/AuthContext";
import "./Profile.css";
import ProfileLoginForm from "../../Components/ProfileLoginForm/ProfileLoginForm";
import RichTextEditor from "../../Components/RichTextEditor/RichTextEditor";
import TabPanel from "../../Components/TabPanel/TabPanel";



const Profile = () => {
	const { setActiveTitle } = usePageTitle();
	const [tabIndex, setTabIndex] = useState(0);
	const { flexCol, flexRow } = useCustomTheme();
	const { user, userAdditionalData } = useAuth();
	const [currentUser, setCurrentUser] = useState(user);
	const [currentUserAddData, setCurrentUserAddData] = useState(userAdditionalData || null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		user_first_name: "",
		user_last_name: "",
		user_email: "",
		user_phone: "",
		user_phone_extension: "",
		user_display_name: "",
	});

	const [content, setContent] = useState("<p>Hello <b>Quill</b></p>");

	const handleEditorChange = ({ html, text, json }) => {
		setContent(html);
	};

	const handleProfileInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleProfileFormSubmit = async () => {
		const user_id = currentUser.userID; // Assuming currentUser has an ID
		const req_body = {
			userId: user_id,
			data: formData,
		};

		console.log(req_body);
	};

	const handleSignatureSubmit = async () => {
		const user_id = currentUser.userID;
		const req_body = {
			user_id,
			data: content,
		};
		console.log(req_body);
	};

	useEffect(() => {
		setActiveTitle({
			title: "Profile",
			subtitle: "My Account Profile settings",
		});
	}, []);

	useEffect(() => {
		if (currentUser && currentUser.firstname) {
			setFormData({
				user_first_name: currentUser.firstname || "",
				user_last_name: currentUser.lastname || "",
				user_email: currentUser.email || "",
				user_display_name: currentUser.name || "",
				user_phone: currentUser.phone || "",
				user_phone_extension: currentUser.phone_ext || "",
				user_username: currentUser.username || "",
				user_vacation_mode: currentUser.vacation_mode || false,
			});
		}
	}, [currentUser]);

	useEffect(() => {
		if (currentUserAddData) {
			setContent(currentUserAddData.signature);
		}
	}, [currentUserAddData]);

	const handleTabChange = (event, newValue) => {
		setTabIndex(newValue);
	};

	const toggleEditing = () => {
		setIsEditing(!isEditing);
	};

	useEffect(() => {
		console.log(content);
	}, [content]);

	return (
		<Box sx={{ width: "100%", borderRadius: 2, px: 4, py: 2 }}>
			<Tabs
				sx={{ borderBottom: "1px solid #aaa" }}
				value={tabIndex}
				onChange={handleTabChange}
				aria-label="Profile Tabs"
				textColor="primary"
				indicatorColor="primary">
				<Tab label="My Account" />
				<Tab label="Preferences" />
				<Tab label="Signature" />
			</Tabs>

			<TabPanel value={tabIndex} index={0}>
				<Box
					sx={{
						...flexCol,
						justifyContent: "flex-start",
						alignItems: "flex-start",
						width: "100%",
						rowGap: 2,
					}}>
					<Box
						display="flex"
						flexDirection="row"
						justifyContent="space-between"
						alignItems="center"
						width="100%">
						<Box>
							<Typography variant="h5" fontWeight={"bold"}>
								My Account
							</Typography>
							<Typography variant="body1" m={0}>
								This is where user account settings can be updated.
							</Typography>
						</Box>
						<Button
							variant="text"
							color={isEditing ? "warning" : "primary"}
							startIcon={<EditIcon />}
							onClick={toggleEditing}
							className="edit-button">
							{isEditing ? "Editing Profile" : "Edit Profile"}
						</Button>
					</Box>
					<ProfileForm
						formData={formData}
						handleFieldChange={handleProfileInputChange}
						currentUser={currentUser}
						setCurrentUser={setCurrentUser}
						isEditing={isEditing}
						setIsEditing={setIsEditing}
					/>

					<Box
						display="flex"
						flexDirection="row"
						justifyContent="flex-start"
						alignItems="center"
						width="100%">
						<Box>
							<Typography variant="h5" fontWeight={"bold"}>
								Authentication
							</Typography>
							<Typography variant="body1" m={0}>
								This is where user login settings can be updated.
							</Typography>
						</Box>
					</Box>
					<Box sx={{ width: "100%" }}>
						<ProfileLoginForm
							formData={formData}
							handleFieldChange={handleProfileInputChange}
							currentUser={currentUser}
							setCurrentUser={setCurrentUser}
							isEditing={isEditing}
							setIsEditing={setIsEditing}
						/>
					</Box>

					<Box
						sx={{
							...flexRow,
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							columnGap: 2,
							mt: 4,
						}}>
						<Button
							variant="text"
							color="primary"
							disabled={!isEditing}
							className="button-primary"
							onClick={() => {
								setIsEditing(!isEditing);
							}}>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="primary"
							disabled={!isEditing}
							className="button-primary"
							onClick={handleProfileFormSubmit}>
							Update Profile
						</Button>
					</Box>
				</Box>
			</TabPanel>
			<TabPanel value={tabIndex} index={1}>
				<Box
					sx={{
						...flexCol,
						justifyContent: "flex-start",
						alignItems: "flex-start",
						width: "100%",
						rowGap: 2,
					}}>
					<Box
						display="flex"
						flexDirection="row"
						justifyContent="flex-start"
						alignItems="center"
						width="100%">
						<Box>
							<Typography variant="h5" fontWeight={"bold"}>
								Preferences
							</Typography>
							<Typography variant="body1" m={0}>
								This is where user account preferences can be updated.
							</Typography>
						</Box>
					</Box>
				</Box>
			</TabPanel>

			<TabPanel value={tabIndex} index={2}>
				<Box
					sx={{
						...flexCol,
						justifyContent: "flex-start",
						alignItems: "flex-start",
						width: "100%",
						rowGap: 2,
					}}>
					<Box
						display="flex"
						flexDirection="row"
						justifyContent="flex-start"
						alignItems="center"
						width="100%">
						<Box>
							<Typography variant="h5" fontWeight={"bold"}>
								Signature
							</Typography>
							<Typography variant="body1" m={0}>
								This is where user account signature can be updated.
							</Typography>
						</Box>
					</Box>
					<RichTextEditor value={content} onChange={handleEditorChange} />
					<Box
						sx={{
							...flexRow,
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							columnGap: 2,
							mt: 4,
						}}>
						<Button
							variant="contained"
							color="primary"
							className="button-primary"
							onClick={handleSignatureSubmit}>
							Update Signature
						</Button>
					</Box>
				</Box>
			</TabPanel>
		</Box>
	);
};

export default Profile;
