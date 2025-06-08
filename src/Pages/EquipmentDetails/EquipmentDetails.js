import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Link, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../Components/PageHeader/PageHeader";
import { usePageTitle } from "../../Context/PageTitleContext";
import { useEffect } from "react";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import ErrorAlertWrapper from "../../Components/ErrorAlertWrapper/ErrorAlertWrapper";
import { useState } from "react";
import { fetchEquipmentByIdService } from "../../Services/equipmentService";
import TabPanel from "../../Components/TabPanel/TabPanel";
import { useCustomTheme } from "../../Context/ThemeContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DocumentCard from "../../Components/DocumentCard/DocumentCard";

const EquipmentDetails = () => {
	const { eq_id } = useParams();
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [equipment, setEquipment] = useState(null);
	const [equipmentDocs, setEquipmentDocs] = useState(null);
	const [parentEquipmentDocs, setParentEquipmentDocs] = useState(null);
	const [tabIndex, setTabIndex] = useState(0);
	const [expanded, setExpanded] = useState("equipment");

	const handleTabChange = (event, newValue) => {
		setTabIndex(newValue);
	};

	const handleAccordianChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	useEffect(() => {
		fetchEquipmentDetails();
	}, []);

	useEffect(() => {
		if (equipment) {
			setActiveTitle({
				title: `Equipment: ${equipment.equipment}`,
				subtitle: equipment?.notes || "",
			});
		}
	}, [equipment]);

	const fetchEquipmentDetails = async () => {
		try {
			const response = await fetchEquipmentByIdService(eq_id);
			if (response.status) {
				setEquipment(response.data);
				const { docs, parentDocs } = extractKnowledgebaseDocs(response.data);
				setEquipmentDocs(docs);
				setParentEquipmentDocs(parentDocs);
				setError(null);
				setLoading(false);
			} else {
				setLoading(false);
				setEquipmentDocs(null);
				setParentEquipmentDocs(null);
				setEquipment(null);
				setError("Failed to Fetch Equipment Details.");
			}
		} catch (error) {
			setLoading(false);
			setEquipmentDocs(null);
			setParentEquipmentDocs(null);
			setEquipment(null);
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

	if (loading) {
		return <LoadingWrapper minHeight={"400px"} />;
	}

	if (error && !loading) {
		return <ErrorAlertWrapper minHeight={"400px"} error={error} />;
	}

	return (
		<Box p={2} px={4} width={"100%"}>
			<Tabs
				sx={{ borderBottom: "1px solid #eee" }}
				value={tabIndex}
				onChange={handleTabChange}
				aria-label="Profile Tabs"
				textColor="primary"
				indicatorColor="primary">
				<Tab label="Equipment Details" />
				<Tab label="Documents" />
				<Tab label="Provisions" />
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
								Equipment Details
							</Typography>
							<Typography variant="body1" m={0}>
								Basic Details of the equipment
							</Typography>
						</Box>
					</Box>
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
								Equipment Provisions
							</Typography>
							<Typography variant="body1" m={0}>
								List of all the customers this equipment has been provisioned
							</Typography>
						</Box>
					</Box>
				</Box>
			</TabPanel>
		</Box>
	);
};

export default EquipmentDetails;
