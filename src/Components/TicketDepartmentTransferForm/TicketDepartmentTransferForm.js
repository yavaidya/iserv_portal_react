import { Box, Button, Checkbox, Fade, FormControlLabel, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import FormField from "../FormField/FormField";
import { useCustomTheme } from "../../Context/ThemeContext";
import CloseIcon from "@mui/icons-material/Close";

const TicketDepartmentTransferForm = ({ open, setOpen, ticket }) => {
	const [departments, setDepartments] = useState([]);
	const [formData, setFormData] = useState({
		department: null,
		internalNotes: "",
		maintainRefer: false,
	});
	const [formErrors, setFormErrors] = useState({
		department: false,
		internalNotes: false,
		maintainRefer: false,
	});
	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "100%",
		minWidth: "600px",
		maxWidth: "30vw",
		bgcolor: "background.paper",
		boxShadow: 24,
		p: 4,
		borderRadius: 2,
	};
	const { flexCol, flexRow } = useCustomTheme();

	const handleClose = () => setOpen(false);

	const handleFormChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		if (formErrors[name]) {
			setFormErrors((prev) => ({ ...prev, [name]: false }));
		}
	};

	const handleSubmit = () => {};

	return (
		<Modal
			aria-labelledby="spring-modal-title"
			aria-describedby="spring-modal-description"
			open={open}
			onClose={handleClose}
			closeAfterTransition
			slotProps={{
				backdrop: {
					TransitionComponent: Fade,
				},
			}}>
			<Fade in={open}>
				<Box sx={style}>
					<Box
						sx={{
							...flexRow,
							justifyContent: "space-between",
							width: "100%",
						}}>
						<PageHeader
							title={`Ticket #${ticket.ticket_number}: Transfer`}
							subtitle={"The Ticket will be transfered to the selected department"}
						/>
						<Tooltip title="Close the Form">
							<IconButton size="small" onClick={handleClose}>
								<CloseIcon />
							</IconButton>
						</Tooltip>
					</Box>

					<Box
						sx={{
							flexGrow: 1,
							display: "flex",
							flexDirection: "column",
							gap: 2,
							overflowY: "auto",
							px: 2,
							pt: 1,
						}}>
						<FormField
							type="autocomplete"
							label="Department"
							name="department"
							value={formData.department}
							error={formErrors.department}
							onChange={handleFormChange}
							options={departments}
							showRequired={true}
						/>
						<FormField
							type={"textarea"}
							label={"Internal Notes"}
							name={"internalNotes"}
							value={formData.internalNotes}
							error={formErrors.internalNotes}
							onChange={handleFormChange}
						/>
						<Box display="flex" alignItems="center">
							<FormControlLabel
								control={
									<Checkbox
										checked={formData.maintainRefer}
										onChange={handleFormChange}
										name="maintainRefer"
									/>
								}
								label="Maintain referrer access to current department"
							/>
						</Box>
					</Box>
					<Box display="flex" justifyContent="center" mt={2} columnGap={1}>
						<Button variant="outlined" onClick={handleClose}>
							Cancel
						</Button>
						<Button variant="contained" color="primary" onClick={() => handleSubmit(false)}>
							Transfer
						</Button>
					</Box>
				</Box>
			</Fade>
		</Modal>
	);
};

export default TicketDepartmentTransferForm;
