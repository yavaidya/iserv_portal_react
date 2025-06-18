import React from "react";
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, Paper } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import { format } from "date-fns";

const EVENT_LABELS = {
	created: "Ticket Created",
	due_date_changed: "Due Date Changed",
	priority_changed: "Priority Changed",
	status_changed: "Status Changed",
	createdAt_changed: "Created Date Modified",
	reassigned_to: "Reassigned To",
	item_added: "Item Added",
	items_deleted: "Items Deleted",
};

const getEventDescription = (event) => {
	const label = EVENT_LABELS[event.event_type] || event.event_type;
	const formattedDate = (val) => format(new Date(val), "PPP");

	switch (event.event_type) {
		case "due_date_changed":
		case "createdAt_changed":
			return `${label} to ${formattedDate(event.value)}`;
		case "priority_changed":
		case "status_changed":
			return `${label} to "${event.value}"`;
		case "reassigned_to":
			return `${label} to Staff ID ${event.value}`;
		default:
			return event.value || label;
	}
};

const TicketEventTimeline = ({ events }) => {
	return (
		<Box sx={{ width: "100%", maxHeight: "500px", overflowY: "auto" }}>
			<List>
				{events.map((event, index) => {
					const actor = event.staff_actor || event.user_actor;
					const actorName = actor ? `${actor.firstname} ${actor.lastname}` : "System";

					return (
						<React.Fragment key={event.id}>
							<ListItem alignItems="flex-start">
								<ListItemAvatar>
									<Avatar>{actor ? actor.firstname?.[0] : <PersonIcon fontSize="small" />}</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={
										<Typography variant="body1" fontWeight="bold">
											{getEventDescription(event)}
										</Typography>
									}
									secondary={
										<>
											<Typography variant="body2" color="text.secondary">
												By {actorName} on {format(new Date(event.createdAt), "PPPp")}
											</Typography>
										</>
									}
								/>
							</ListItem>
							{index < events.length - 1 && <Divider component="li" />}
						</React.Fragment>
					);
				})}
			</List>
		</Box>
	);
};

export default TicketEventTimeline;
