import React, { useState } from "react";
import { Box, Typography, useTheme, Card, CardContent, CardHeader, Divider } from "@mui/material";
import { ControlledBoard, moveCard } from "@caldwell619/react-kanban";
import "@caldwell619/react-kanban/dist/styles.css";

const initialBoard = {
	columns: [
		{
			id: 1,
			title: "Backlog",
			cards: [
				{ id: 1, title: "Setup project", description: "Initialize repo and base setup" },
				{ id: 2, title: "Design wireframes", description: "Figma mockups for dashboard" },
				{ id: 3, title: "API planning", description: "Document REST endpoints" },
			],
		},
		{
			id: 2,
			title: "In Progress",
			cards: [{ id: 4, title: "Build login page", description: "Form + validation" }],
		},
		{
			id: 3,
			title: "Review",
			cards: [
				{ id: 5, title: "Fix UI bugs", description: "Header spacing issues" },
				{ id: 6, title: "Test flows", description: "Verify user signup, login, logout" },
			],
		},
		{
			id: 4,
			title: "Done",
			cards: [
				{ id: 7, title: "Setup CI/CD", description: "Configured GitHub Actions" },
				{ id: 8, title: "Deployed to staging", description: "Accessible at dev.example.com" },
			],
		},
		{
			id: 5,
			title: "Done",
			cards: [
				{ id: 9, title: "Setup CI/CD", description: "Configured GitHub Actions" },
				{ id: 10, title: "Deployed to staging", description: "Accessible at dev.example.com" },
			],
		},
	],
};

const KanbanBoardComponent = () => {
	const theme = useTheme();
	const [board, setBoard] = useState({ ...initialBoard });

	const handleCardMove = (_card, source, destination) => {
		setBoard((currentBoard) => moveCard(currentBoard, source, destination));
	};

	return (
		<Box
			sx={{
				backgroundColor: theme.palette.background.default,
				p: 4,
				overflowX: "auto",
			}}>
			<Typography variant="h4" color="primary" gutterBottom>
				Project Kanban Board
			</Typography>

			<ControlledBoard
				onCardDragEnd={handleCardMove}
				disableColumnDrag
				renderColumnHeader={(column) => (
					<Box
						sx={{
							p: 2,
							mb: 1,
							borderRadius: 2,
							backgroundColor: theme.palette.primary.main,
							color: theme.palette.primary.contrastText,
							textAlign: "center",
						}}>
						<Typography variant="h6">{column.title}</Typography>
					</Box>
				)}
				renderCard={(card, { dragging }) => (
					<Card
						variant="outlined"
						sx={{
							width: "100%",
							minWidth: 230,
							mb: 2,
							transition: "transform 0.2s ease, box-shadow 0.2s ease",
							boxShadow: dragging ? theme.shadows[6] : theme.shadows[1],
							"&:hover": {
								transform: "scale(1.02)",
								boxShadow: theme.shadows[4],
							},
							borderRadius: 2,
						}}>
						<CardHeader
							titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
							title={card.title}
						/>
						<Divider />
						<CardContent>
							<Typography variant="body2" color="text.secondary">
								{card.description}
							</Typography>
						</CardContent>
					</Card>
				)}
				style={{
					display: "flex",
					width: "100%",
				}}>
				{/* Pass the full board object as children */}
				{board}
			</ControlledBoard>
		</Box>
	);
};

export default KanbanBoardComponent;
