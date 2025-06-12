import { Box, Card, CardContent, Typography, Chip, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import { Delete as DeleteIcon, AttachFile as AttachFileIcon } from "@mui/icons-material";
const FileDropZone = ({ setParentData }) => {
	const [alert, setAlert] = useState("");
	const [formData, setFormData] = useState({
		files: null,
	});

	useEffect(() => {
		if (alert !== "") {
			Swal.fire({
				icon: "warning",
				text: alert,
				confirmButtonText: "Okay",
			});
		}
	}, [alert]);

	const onDrop = (acceptedFiles) => {
		const allowedTypes = [
			"application/pdf",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/vnd.ms-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"text/csv",
		];

		// Filter files to only include supported types
		const validFiles = acceptedFiles.filter((file) => allowedTypes.includes(file.type));
		const invalidFiles = acceptedFiles.filter((file) => !allowedTypes.includes(file.type));

		// Add valid files to existing files
		if (validFiles.length > 0) {
			if (setParentData) {
				setParentData((prev) => ({
					...prev,
					files: [...(prev.files || []), ...validFiles],
				}));
			}

			setFormData((prev) => ({
				...prev,
				files: [...(prev.files || []), ...validFiles],
			}));

			// Clear any previous error if we have valid files
			if (invalidFiles.length === 0) {
				setAlert("");
			}
		}

		// Show error message for invalid files
		if (invalidFiles.length > 0) {
			const invalidFileNames = invalidFiles.map((file) => file.name).join(", ");
			if (validFiles.length > 0) {
				setAlert(
					`Some files were not added due to unsupported format: ${invalidFileNames}. Only PDF, Word, Excel, and CSV files are allowed.`
				);
			} else {
				setAlert(
					`Unsupported file type(s): ${invalidFileNames}. Please upload PDF, Word, Excel, or CSV files.`
				);
			}
		}

		// Optional: Show success message for valid files
		if (validFiles.length > 0) {
			console.log(`${validFiles.length} file(s) added successfully`);
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const handleDeleteFile = (indexToDelete) => {
		const updatedFiles = formData.files.filter((_, index) => index !== indexToDelete);
		setFormData((prev) => ({
			...prev,
			files: updatedFiles,
		}));
		if (setParentData) {
			setParentData((prev) => ({
				...prev,
				files: updatedFiles,
			}));
		}
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box
				{...getRootProps()}
				sx={{
					border: "2px dashed #ccc",
					padding: 2,
					textAlign: "center",
					cursor: "pointer",
					width: "100%",
					minHeight: "40px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
				}}>
				<input {...getInputProps()} />
				<Typography>
					{formData.files && formData.files.length > 0
						? `Click to add more files or drag and drop here`
						: "Drag and drop files here, or click to select"}
				</Typography>
			</Box>
			{formData.files && formData.files.length > 0 && (
				<Box sx={{ width: "100%", mt: 2 }}>
					<Typography variant="body2" color="textSecondary" mb={1}>
						Attached Files ({formData.files.length})
					</Typography>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
						{formData.files.map((file, index) => (
							<Card
								key={index}
								variant="outlined"
								sx={{
									width: "100%",
									"&:hover": {
										backgroundColor: "action.hover",
									},
								}}>
								<CardContent
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										py: 1.5,
										"&:last-child": {
											pb: 1.5,
										},
									}}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
											flex: 1,
										}}>
										<AttachFileIcon color="action" fontSize="small" />
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Typography
												variant="body2"
												sx={{
													fontWeight: 500,
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												}}>
												{file.name}
											</Typography>
											<Typography variant="caption" color="textSecondary">
												{(file.size / 1024).toFixed(1)} KB
											</Typography>
										</Box>
										<Chip
											label={file.type || "Unknown"}
											size="small"
											variant="outlined"
											sx={{ ml: 1 }}
										/>
									</Box>
									<IconButton
										onClick={() => handleDeleteFile(index)}
										size="small"
										color="error"
										sx={{ ml: 1 }}>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</CardContent>
							</Card>
						))}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default FileDropZone;
