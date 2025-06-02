import { alpha, Box, Button, Card, CardContent, Link, Typography } from "@mui/material";
import React from "react";
import { useCustomTheme } from "../../../Context/ThemeContext";

const SupportHome = () => {
	const { flexCol, flexRow } = useCustomTheme();
	return (
		<Box
			height={"100%"}
			sx={{
				...flexCol,
				justifyContent: "center",
				rowGap: 4,
				alignItems: "flex-start",
				width: "70%",
				p: 6,
			}}>
			<Typography variant="h1" fontSize={"42px"} fontWeight={"bold"} color="#fff">
				Welcome Back!
			</Typography>
			<Typography variant="h6" textAlign={"left"} color="#fff">
				In order to streamline support requests and better serve you, we utilize a support ticket system. Every
				support request is assigned a unique ticket number which you can use to track the progress and responses
				online. For your reference we provide complete archives and history of all your support requests. A
				valid email address is required to submit a ticket.
			</Typography>
			<Box display="flex" flexDirection={"row"} gap={3} mb={2} sx={{ width: "70%" }}>
				<Card
					className="support-home-card"
					sx={{
						background: (theme) => alpha(theme.palette.background.paper, 0.95),
						// borderRadius: "20px",
					}}>
					<CardContent>
						<Typography variant="h6">Contact</Typography>
						<Box className="card-divider"></Box>
						<Typography variant="body1" fontWeight="bold">
							Tech Support:
						</Typography>
						<Link href="tel:(804) 399-0051" underline="hover">
							<Typography variant="body2">+1 (804) 399-0051</Typography>
						</Link>

						<Typography variant="body1" fontWeight="bold" mt={2}>
							24 Hr Support:
						</Typography>
						<Link href="tel:(804) 399-0051" underline="hover">
							<Typography variant="body2">+1 (804) 399-0051</Typography>
						</Link>
					</CardContent>
				</Card>

				<Card
					className="support-home-card"
					sx={{
						background: (theme) => alpha(theme.palette.background.paper, 0.95),
						// borderRadius: "20px",
					}}>
					<CardContent>
						<Typography variant="h6">Ticket Status</Typography>
						<Box className="card-divider"></Box>
						<Typography variant="body2">Track and manage issues efficiently.</Typography>

						<Button variant="contained" color="primary" sx={{ mt: 6 }}>
							Check Status
						</Button>
					</CardContent>
				</Card>

				<Card
					className="support-home-card"
					sx={{
						background: (theme) => alpha(theme.palette.background.paper, 0.95),
						// borderRadius: "20px",
					}}>
					<CardContent
						sx={{
							display: "flex",
							justifyContent: "space-between",
							flexDirection: "column",
							alignItems: "flex-start",
							height: "100%",
						}}>
						<Typography variant="h6">Support Ticket</Typography>
						<Box className="card-divider"></Box>
						<Typography variant="body2">Initiate a new ticket to track issues.</Typography>
						<Button variant="contained" color="primary" sx={{ mt: 6 }}>
							Open New Ticket
						</Button>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};

export default SupportHome;
