import { Autocomplete, Box, FormControl, MenuItem, Select, TextField, Typography } from "@mui/material";
import React from "react";

const FormField = ({
	label,
	value,
	name,
	onChange,
	error,
	type,
	disabled = false,
	options = [],
	placeholder = "",
	showRequired = false,
	inputRef = null,
}) => {
	switch (type) {
		case "text":
			return (
				<Box display="flex" alignItems="center">
					<Box width="200px" minWidth="200px">
						<Typography variant="body1" fontWeight={"bold"}>
							{label} {showRequired && <span style={{ color: "red" }}>*</span>}
						</Typography>
					</Box>
					<TextField
						inputRef={inputRef}
						size="small"
						name={name}
						value={value}
						onChange={onChange}
						sx={{ width: "100%" }}
						error={error}
						disabled={disabled}
					/>
				</Box>
			);

		case "password":
			return (
				<Box display="flex" alignItems="center">
					<Box width="200px" minWidth="200px">
						<Typography variant="body1" fontWeight={"bold"}>
							{label} {showRequired && <span style={{ color: "red" }}>*</span>}
						</Typography>
					</Box>
					<TextField
						inputRef={inputRef}
						size="small"
						name={name}
						value={value}
						onChange={onChange}
						sx={{ width: "100%" }}
						error={error}
						type="password"
						disabled={disabled}
					/>
				</Box>
			);

		case "number":
			return (
				<Box display="flex" alignItems="center">
					<Box width="200px" minWidth="200px">
						<Typography variant="body1" fontWeight={"bold"}>
							{label} {showRequired && <span style={{ color: "red" }}>*</span>}
						</Typography>
					</Box>
					<TextField
						inputRef={inputRef}
						size="small"
						type="number"
						name={name}
						value={value}
						onChange={onChange}
						sx={{ width: "100%" }}
						error={error}
						disabled={disabled}
					/>
				</Box>
			);

		case "textarea":
			return (
				<Box display="flex" alignItems="flex-start">
					<Box width="200px" minWidth="200px">
						<Typography variant="body1" fontWeight={"bold"}>
							{label} {showRequired && <span style={{ color: "red" }}>*</span>}
						</Typography>
					</Box>
					<TextField
						inputRef={inputRef}
						name={name}
						value={value}
						onChange={onChange}
						multiline
						rows={4}
						fullWidth
						size="small"
						disabled={disabled}
					/>
				</Box>
			);

		case "select":
			return (
				<Box display="flex" alignItems="center">
					<Box width="200px" minWidth="200px">
						<Typography variant="body1" fontWeight={"bold"}>
							{label} {showRequired && <span style={{ color: "red" }}>*</span>}
						</Typography>
					</Box>
					<FormControl fullWidth>
						<Select
							name={name}
							size="small"
							value={value || ""}
							onChange={onChange}
							error={error}
							disabled={disabled}
							displayEmpty>
							<MenuItem value="">Select {label}</MenuItem>
							{options.length > 0 &&
								options.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</Box>
			);

		case "autocomplete":
			return (
				<Box display="flex" alignItems="center">
					<Box width="200px" minWidth="200px">
						<Typography variant="body1" fontWeight={"bold"}>
							{label} {showRequired && <span style={{ color: "red" }}>*</span>}
						</Typography>
					</Box>

					<Autocomplete
						options={options}
						getOptionLabel={(option) => option.label}
						isOptionEqualToValue={(option, value) => option.value === value.value}
						value={options.find((opt) => opt.value === value) || null}
						onChange={(event, newValue) => {
							onChange({
								target: {
									name,
									value: newValue ? newValue.value : "",
								},
							});
						}}
						sx={{ width: "100%" }}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder={`Select ${label}`}
								label={`Select ${label}`}
								error={error}
								size="small"
								sx={{ width: "100%" }}
							/>
						)}
					/>
				</Box>
			);
	}
};

export default FormField;
