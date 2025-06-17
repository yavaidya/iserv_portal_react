import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, Modal, TextField, Typography, Divider } from "@mui/material";

const flattenObject = (obj, prefix = "") =>
	Object.entries(obj).reduce((acc, [key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			Object.assign(acc, flattenObject(value, path));
		} else {
			acc[path] = value;
		}
		return acc;
	}, {});

const formatHeader = (key) => {
	return key
		.split(".")
		.map((k) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
		.join(" > ");
};

const CreateCustomViewModal = ({ open, onClose, data, onSave }) => {
	const [flattenedFields, setFlattenedFields] = useState([]);
	const [selectedColumns, setSelectedColumns] = useState([]);
	const [filters, setFilters] = useState({});
	const [viewName, setViewName] = useState("");

	useEffect(() => {
		if (data) {
			const flattened = flattenObject(data);
			const fields = Object.keys(flattened);
			setFlattenedFields(fields);
			setSelectedColumns(fields); // default: all
		}
	}, [data]);

	const toggleColumn = (field) => {
		setSelectedColumns((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]));
	};

	const handleFilterChange = (field, value) => {
		setFilters((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		onSave({
			name: viewName,
			columns: selectedColumns,
			filters,
		});
		onClose();
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					width: "60vw",
					bgcolor: "background.paper",
					margin: "5vh auto",
					p: 4,
					boxShadow: 24,
					maxHeight: "90vh",
					overflowY: "auto",
					borderRadius: 2,
				}}>
				<Typography variant="h6" gutterBottom>
					Create Custom View
				</Typography>

				<TextField
					label="View Name"
					fullWidth
					value={viewName}
					onChange={(e) => setViewName(e.target.value)}
					sx={{ mb: 3 }}
				/>

				<Typography variant="subtitle1" gutterBottom>
					Choose Columns to Display
				</Typography>
				<Box display="flex" flexWrap="wrap" gap={2} mb={3}>
					{flattenedFields.map((field) => (
						<FormControlLabel
							key={field}
							control={
								<Checkbox
									checked={selectedColumns.includes(field)}
									onChange={() => toggleColumn(field)}
								/>
							}
							label={formatHeader(field)}
						/>
					))}
				</Box>

				<Divider sx={{ my: 2 }} />
				<Typography variant="subtitle1" gutterBottom>
					Add Filters
				</Typography>
				{flattenedFields.map((field) => (
					<TextField
						fullWidth
						size="small"
						key={field}
						label={`Filter: ${formatHeader(field)}`}
						value={filters[field] || ""}
						onChange={(e) => handleFilterChange(field, e.target.value)}
						sx={{ mb: 2 }}
					/>
				))}

				<Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
					<Button onClick={onClose}>Cancel</Button>
					<Button
						variant="contained"
						disabled={!viewName || selectedColumns.length === 0}
						onClick={handleSave}>
						Save View
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default CreateCustomViewModal;
