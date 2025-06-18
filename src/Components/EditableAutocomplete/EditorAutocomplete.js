import React, { useState } from "react";
import { Box, Autocomplete, TextField, IconButton, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import UserName from "../UserName/UserName";

const EditableAutocomplete = ({
	options,
	value,
	handleChange,
	handleSubmit,
	placeholder = "Select",
	getOptionLabel = (option) => option.name,
	isOptionEqualToValue = (option, value) => option.id === value?.id,
}) => {
	const [editMode, setEditMode] = useState(false);

	const toggleEdit = () => {
		if (editMode && handleSubmit) handleSubmit(value);
		setEditMode((prev) => !prev);
	};

	const handleSelect = (newValue) => {
		handleChange(newValue);
		if (handleSubmit) handleSubmit(newValue);
		setEditMode(false);
	};

	return (
		<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
			{editMode ? (
				<Autocomplete
					size="small"
					fullWidth
					options={options}
					value={value}
					onChange={(e, newValue) => handleSelect(newValue)}
					getOptionLabel={getOptionLabel}
					isOptionEqualToValue={isOptionEqualToValue}
					renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
					renderOption={(props, option) => (
						<Box component="li" {...props}>
							<UserName name={option.name} />
						</Box>
					)}
				/>
			) : (
				<UserName name={value?.name || "-- Unassigned --"} />
			)}
			<Tooltip title={editMode ? "Save" : "Edit"}>
				<IconButton onClick={toggleEdit} color="primary">
					{editMode ? <CheckIcon /> : <EditIcon />}
				</IconButton>
			</Tooltip>
		</Box>
	);
};

export default EditableAutocomplete;
