import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Link,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../Components/PageHeader/PageHeader";
import { usePageTitle } from "../../Context/PageTitleContext";
import { useEffect } from "react";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../../Components/ErrorAlertWrapper/ErrorAlertWrapper";
import { useState } from "react";
import { fetchEquipmentByIdService, fetchEquipmentProvisionByIdService } from "../../Services/equipmentService";
import TabPanel from "../../Components/TabPanel/TabPanel";
import { useCustomTheme } from "../../Context/ThemeContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DocumentCard from "../../Components/DocumentCard/DocumentCard";
import QRCode from "../../Components/QRCode/QRCode";
import { formatDate } from "../../Services/globalServiceUtils";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
const ProvisionDetails = () => {
	const { prov_id } = useParams();
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [equipment, setEquipment] = useState(null);
	const [provision, setProvision] = useState(null);
	const [equipmentDocs, setEquipmentDocs] = useState(null);
	const [parentEquipmentDocs, setParentEquipmentDocs] = useState(null);
	const [tabIndex, setTabIndex] = useState(0);
	const [expanded, setExpanded] = useState("equipment");
	const navigate = useNavigate();
	const handleTabChange = (event, newValue) => {
		setTabIndex(newValue);
	};

	const handleNavigateBack = () => {
		navigate("/provisions");
	};

	const handleAccordianChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	useEffect(() => {
		fetchEquipmentDetails();
	}, []);

	useEffect(() => {
		if (provision) {
			setActiveTitle({
				title: `Provision: ${provision.serial_number}`,
				subtitle: "",
			});
		}
	}, [provision]);

	const fetchEquipmentDetails = async () => {
		try {
			const response = await fetchEquipmentProvisionByIdService(prov_id);
			if (response.status) {
				setProvision(response.data);
				const { docs, parentDocs } = extractKnowledgebaseDocs(response.data.equipment);
				setEquipmentDocs(docs);
				setParentEquipmentDocs(parentDocs);
				setError(null);
				setLoading(false);
			} else {
				setLoading(false);
				setEquipmentDocs(null);
				setParentEquipmentDocs(null);
				setProvision(null);
				setError("Failed to Fetch Equipment Details.");
			}
		} catch (error) {
			setLoading(false);
			setEquipmentDocs(null);
			setParentEquipmentDocs(null);
			setProvision(null);
			setError("Failed to Fetch Equipment Details.");
		}
	};

	const extractKnowledgebaseDocs = (equipment, seenKbIds = new Set()) => {
		const groupByCategory = (docs) => {
			const categoryMap = {};

			docs.forEach((doc) => {
				const kbId = doc.kb_id;
				if (!kbId || seenKbIds.has(kbId)) return; // Skip if already seen or no kb_id
				seenKbIds.add(kbId);

				const catId = doc.category_id || "uncategorized";
				if (!categoryMap[catId]) {
					categoryMap[catId] = {
						category_id: catId,
						category_name: doc.category?.name || "Uncategorized",
						docs: [],
					};
				}

				categoryMap[catId].docs.push(doc);
			});

			return Object.values(categoryMap);
		};

		const currentDocs = equipment.eq_docs?.map((d) => d.knowledgebase).filter(Boolean) || [];
		const groupedDocs = groupByCategory(currentDocs);

		let parentDocs = [];
		if (equipment.parent_equipment) {
			const parentResult = extractKnowledgebaseDocs(equipment.parent_equipment, seenKbIds);
			parentDocs = [...parentResult.docs, ...parentResult.parentDocs];
		}

		return {
			docs: groupedDocs,
			parentDocs,
		};
	};

	const InfoRow = ({ label, value, chip }) => (
		<Box display="flex" justifyContent="space-between" mb={1}>
			<Typography fontWeight={"bold"}>{label}</Typography>
			{chip ? chip : <Typography>{value || "-"}</Typography>}
		</Box>
	);

	if (loading) {
		return <LoadingWrapper minHeight={"400px"} />;
	}

	if (error && !loading) {
		return <ErrorAlertWrapper minHeight={"400px"} error={error} />;
	}

	return (
		<Box p={2} px={4} width={"100%"}>
			<Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
				<Button variant="outlined" onClick={handleNavigateBack} startIcon={<ArrowBackIcon />}>
					Back
				</Button>
				<Box sx={{ ...flexRow, justifyContent: "flex-end", alignItems: "center", columnGap: 1 }}>
					<Button variant="contained" startIcon={<ModeEditIcon />}>
						Edit Provision
					</Button>
					<Button variant="contained" startIcon={<DeleteIcon />}>
						Delete
					</Button>
				</Box>
			</Box>
			<Box width="100%" mx="auto" my={2}>
				<Box display="flex" flexWrap="wrap" gap={2} mb={2}>
					<Box
						flex={1}
						minWidth={300}
						borderRadius={3}
						sx={{ background: (theme) => theme.palette.background.paper }}
						boxShadow="0 1px 4px rgba(0,0,0,0.08)"
						py={2}
						px={3}>
						<InfoRow label="Customer" value={provision?.organization?.name} />
						<InfoRow label="Serial Number" value={provision.serial_number} />
						<InfoRow label="Commission Date" value={formatDate(provision.commission_date)} />
						<InfoRow label="Customer Address" value={provision?.organization?.address || "-"} />
					</Box>

					<Box
						flex={1}
						minWidth={300}
						borderRadius={3}
						boxShadow="0 1px 4px rgba(0,0,0,0.08)"
						sx={{ background: (theme) => theme.palette.background.paper }}
						py={2}
						px={3}>
						<InfoRow label="Equipment Name" value={provision?.equipment?.equipment || "NA"} />
						<InfoRow label="Listing Type" value={provision.ispublic ? "Public" : "Private"} />
						<InfoRow
							label="Equipment Status"
							chip={
								<Chip
									sx={{ minWidth: "75px", textAlign: "center" }}
									label={provision?.equipment?.status === 1 ? "Active" : "Inactive"}
									color={provision?.equipment?.status === 1 ? "success" : "default"}
									size="small"
								/>
							}
						/>
						<InfoRow
							label="Provision Status"
							chip={
								<Chip
									sx={{ minWidth: "75px", textAlign: "center" }}
									label={provision.status_id === 1 ? "Active" : "Inactive"}
									color={provision.status_id === 1 ? "success" : "default"}
									size="small"
								/>
							}
						/>
					</Box>
				</Box>

				{/* Notes Box */}
			</Box>
			<Box
				sx={{ background: (theme) => theme.palette.background.paper }}
				borderRadius={3}
				minHeight={"400px"}
				boxShadow="0 1px 4px rgba(0,0,0,0.08)"
				mb={2}
				py={2}
				px={3}>
				<Tabs
					sx={{ borderBottom: "1px solid #eee" }}
					value={tabIndex}
					onChange={handleTabChange}
					aria-label="Profile Tabs"
					textColor="primary"
					indicatorColor="primary">
					<Tab label="Documents" />
					<Tab label="Tickets" />
					<Tab label="QR Code" />
				</Tabs>

				<TabPanel value={tabIndex} index={0}>
					<Box
						sx={{
							...flexCol,
							justifyContent: "flex-start",
							alignItems: "flex-start",
							width: "100%",
							rowGap: 2,
						}}>
						<Box
							display="flex"
							flexDirection="row"
							justifyContent="flex-start"
							alignItems="center"
							width="100%">
							<Box>
								<Typography variant="h5" fontWeight={"bold"}>
									Equipment Documents
								</Typography>
								<Typography variant="body1" m={0}>
									List of all the documents assigned to this equipment or its parents
								</Typography>
							</Box>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="flex-start"
							alignItems="flex-start"
							width="100%">
							{equipmentDocs.length > 0 ? (
								equipmentDocs.map((category, index) => {
									const panelId = `equipment-${index}`;
									return (
										<Accordion
											key={panelId}
											sx={{ width: "100%" }}
											elevation={3}
											expanded={true}
											onChange={handleAccordianChange(panelId)}>
											<AccordionSummary
												sx={{ borderBottom: "1px solid #eee" }}
												expandIcon={<ExpandMoreIcon />}
												aria-controls={`${panelId}-content`}
												id={`${panelId}-header`}>
												<Typography variant="h6" fontWeight="bold" margin={0}>
													{category.category_name}
												</Typography>
											</AccordionSummary>
											<AccordionDetails sx={{ p: 2 }}>
												{category.docs.map((doc) => (
													<>
														<Box>
															<DocumentCard
																data={doc}
																showCategory={false}
																showDelete={false}
																key={`${doc.title}_${doc.id}`}
															/>
														</Box>
													</>
												))}
											</AccordionDetails>
										</Accordion>
									);
								})
							) : (
								<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
									No Assigned Documents
								</Alert>
							)}
						</Box>

						{parentEquipmentDocs.length > 0 && (
							<Box
								display="flex"
								flexDirection="column"
								justifyContent="flex-start"
								alignItems="flex-start"
								width="100%">
								<Box mb={2}>
									<Typography variant="h5" fontWeight={"bold"}>
										Parent Equipment Documents
									</Typography>
									<Typography variant="body1" m={0}>
										List of all the documents inherited from the parent equipment
									</Typography>
								</Box>
								{parentEquipmentDocs.map((category, index) => {
									const panelId = `parent-${index}`;
									return (
										<Accordion
											key={panelId}
											sx={{ width: "100%" }}
											expanded={expanded === panelId}
											onChange={handleAccordianChange(panelId)}>
											<AccordionSummary
												expandIcon={<ExpandMoreIcon />}
												aria-controls={`${panelId}-content`}
												id={`${panelId}-header`}>
												<Typography variant="body1" fontWeight="bold">
													{category.category_name}
												</Typography>
											</AccordionSummary>
											<AccordionDetails>
												{category.docs.map((doc) => (
													<>
														<Box>
															<DocumentCard
																data={doc}
																showCategory={false}
																showDelete={false}
																key={`${doc.title}_${doc.id}`}
															/>
														</Box>
													</>
												))}
											</AccordionDetails>
										</Accordion>
									);
								})}
							</Box>
						)}
					</Box>
				</TabPanel>

				<TabPanel value={tabIndex} index={1}>
					<Box
						sx={{
							...flexCol,
							justifyContent: "flex-start",
							alignItems: "flex-start",
							width: "100%",
							rowGap: 2,
						}}>
						<Box
							display="flex"
							flexDirection="row"
							justifyContent="flex-start"
							alignItems="center"
							width="100%">
							<Box>
								<Typography variant="h5" fontWeight={"bold"}>
									Equipment Tickets
								</Typography>
								<Typography variant="body1" m={0}>
									List of all the Tickets for this Equipment
								</Typography>
							</Box>
						</Box>
						<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
							No Tickets for this Equipment
						</Alert>
					</Box>
				</TabPanel>

				<TabPanel value={tabIndex} index={2}>
					<Box
						sx={{
							...flexCol,
							justifyContent: "flex-start",
							alignItems: "flex-start",
							width: "100%",
							rowGap: 2,
						}}>
						<Box
							display="flex"
							flexDirection="row"
							justifyContent="flex-start"
							alignItems="center"
							width="100%">
							<Box>
								<Typography variant="h5" fontWeight={"bold"}>
									Equipment QR Code
								</Typography>
								<Typography variant="body1" m={0}>
									This QR Code can be used from Mobile App to see the equipment Details
								</Typography>
							</Box>
						</Box>
						<Box
							sx={{
								...flexRow,
								justifyContent: "flex-start",
								alignItems: "flex-start",
								width: "100%",
								mt: 2,
							}}>
							<QRCode data={provision.serial_number} />
						</Box>
					</Box>
				</TabPanel>
			</Box>
			<Box
				sx={{ background: (theme) => theme.palette.background.paper }}
				borderRadius={3}
				boxShadow="0 1px 4px rgba(0,0,0,0.08)"
				py={2}
				px={3}>
				<Typography fontWeight={"bold"} variant="h6" gutterBottom>
					Notes
				</Typography>
				<Divider flexItem sx={{ mt: "2px", mb: "10px" }} />
				<Typography>{provision.notes || "-"}</Typography>
			</Box>
		</Box>
	);
};

export default ProvisionDetails;
