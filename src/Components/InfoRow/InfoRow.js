import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Autocomplete, TextField, Chip } from "@mui/material";

const InfoRow = ({ label, value, chip, options = [], onChange = () => {}, type = "text" }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [internalValue, setInternalValue] = useState(value || null);
	const timerRef = useRef(null);

	// Handle click to switch to Autocomplete
	const handleClick = () => {
		setIsEditing(true);
		clearTimeout(timerRef.current);
		// Start timeout to revert back in 5 seconds
		timerRef.current = setTimeout(() => {
			setIsEditing(false);
		}, 5000);
	};

	// When user selects a value
	const handleAutocompleteChange = (event, newValue) => {
		setInternalValue(newValue);
		setIsEditing(false);
		clearTimeout(timerRef.current);
		onChange(newValue);
	};

	// Cleanup timer on unmount
	useEffect(() => {
		return () => clearTimeout(timerRef.current);
	}, []);

	return (
		<Box
			display="flex"
			justifyContent="flex-start"
			alignItems="flex-start"
			flexDirection="column"
			rowGap={1}
			mb={2}
			onClick={!isEditing ? handleClick : undefined}
			sx={{ cursor: "pointer", width: "100%" }}>
			<Typography fontWeight="bold">{label}</Typography>

			{isEditing ? (
				<Autocomplete
					autoFocus
					value={internalValue}
					onChange={handleAutocompleteChange}
					options={options}
					renderInput={(params) => <TextField {...params} size="small" />}
					fullWidth
				/>
			) : chip ? (
				<Chip label={internalValue || "-"} />
			) : type === "text" ? (
				<Typography>{internalValue || "-"}</Typography>
			) : (
				internalValue
			)}
		</Box>
	);
};

export default InfoRow;
