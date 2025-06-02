import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Checkbox,
	Divider,
	FormControl,
	FormControlLabel,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from "@mui/material";
import { useCustomTheme } from "../../Context/ThemeContext";
import { themeColors } from "../../Data/ThemeColors";
import { usePageTitle } from "../../Context/PageTitleContext";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

const fonts = ["Poppins", "Roboto", "Arial", "Open Sans", "Lato", "Montserrat"];

const ThemeCustomizer = () => {
	const { mode, accentColor, toggleMode, changeAccentColor, fontKey, fontOptions, changeFont, flexRow } =
		useCustomTheme();
	const { setActiveTitle } = usePageTitle();
	useEffect(() => {
		setActiveTitle({
			title: "Theme Customizer",
			subtitle: "Customize your theme settings",
		});
	}, []);

	return (
		<Box py={1} px={4} sx={{ ...flexRow, width: "100%", height: "fit-content", minHeight: "70vh" }}>
			<Box sx={{ width: "50%", px: 2 }}>
				<Box mb={4}>
					<Typography variant="h3" gutterBottom>
						Mode
					</Typography>
					<Button variant="outlined" onClick={toggleMode}>
						Toggle {mode === "light" ? "Dark" : "Light"} Mode
					</Button>
				</Box>
				<Box mb={4} width={"100%"}>
					<Typography variant="h3" gutterBottom>
						Colors & Fonts
					</Typography>
					<Box display="flex" gap={3} mb={4} sx={{ width: "100%", flexWrap: "wrap" }}>
						<FormControl variant="outlined" size="small" sx={{ width: "100%" }}>
							<InputLabel>Accent Color</InputLabel>
							<Select
								value={accentColor}
								onChange={(e) => changeAccentColor(e.target.value)}
								sx={{ width: "100%" }}
								label="Accent Color">
								{Object.keys(themeColors).map((colorKey) => (
									<MenuItem key={colorKey} value={colorKey}>
										{colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl variant="outlined" size="small" sx={{ width: "100%" }}>
							<InputLabel>Font</InputLabel>
							<Select value={fontKey} onChange={(e) => changeFont(e.target.value)} label="Font">
								{fontOptions.map((font) => (
									<MenuItem key={font} value={font}>
										{font}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<LanguageSwitcher />
					</Box>
				</Box>
			</Box>
			<Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
			<Box sx={{ width: "50%" }}>
				<Grid item xs={12} md={6}>
					<Card>
						<CardHeader title="Typography Preview" />
						<CardContent>
							{[
								"h1",
								"h2",
								"h3",
								"h4",
								"h5",
								"h6",
								"body1",
								"body2",
								"caption",
								"subtitle1",
								"subtitle2",
							].map((variant) => (
								<Typography key={variant} variant={variant} gutterBottom>
									{variant.toUpperCase()} Text
								</Typography>
							))}
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12}>
					<Card>
						<CardHeader title="Buttons Preview" />
						<CardContent>
							{["contained", "outlined", "text"].map((variant) => (
								<Box key={variant} display="flex" flexWrap="wrap" gap={2} mb={3}>
									{["primary", "secondary", "error", "info", "success", "warning"].map((color) => (
										<Button key={`${variant}-${color}`} variant={variant} color={color}>
											{`${color}`}
										</Button>
									))}
								</Box>
							))}
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12}>
					<Card>
						<CardHeader title="Checkbox Preview" />
						<CardContent>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6} md={3}>
									<FormControlLabel control={<Checkbox defaultChecked />} label="Default" />
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<FormControlLabel control={<Checkbox />} label="Unchecked" />
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<FormControlLabel control={<Checkbox disabled />} label="Disabled" />
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<FormControlLabel
										control={<Checkbox defaultChecked disabled />}
										label="Checked Disabled"
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Box>
		</Box>
	);
};

export default ThemeCustomizer;
