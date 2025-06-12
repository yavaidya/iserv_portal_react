import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Box,
	Card,
	CardContent,
	Chip,
	Grid,
	Link,
	Tab,
	Tabs,
	Tooltip,
	Button,
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
import { fetchCustomerByIdService } from "../../Services/customerService";
import CustomDatagrid from "../../Components/CustomDatagrid/CustomDatagrid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
const CustomerDetails = () => {
	const { cus_id } = useParams();
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [customer, setCustomer] = useState(null);
	const [provisions, setProvisions] = useState(null);
	const [equipmentDocs, setEquipmentDocs] = useState(null);
	const [parentEquipmentDocs, setParentEquipmentDocs] = useState(null);
	const [tabIndex, setTabIndex] = useState(0);
	const [expanded, setExpanded] = useState("equipment");
	const [orgUsers, setOrgUsers] = useState([]);
	const [orgSites, setOrgSites] = useState([]);
	const [orgProvisions, setOrgProvisions] = useState([]);
	const navigate = useNavigate();
	const handleTabChange = (event, newValue) => {
		setTabIndex(newValue);
	};

	const handleAccordianChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const handleNavigateBack = () => {
		navigate("/customers");
	};

	useEffect(() => {
		fetchCustomerDetails();
	}, []);

	useEffect(() => {
		if (customer) {
			setActiveTitle({
				title: `Customer: ${customer.name}`,
				subtitle: customer.address,
			});
		}
	}, [customer]);

	const fetchCustomerDetails = async () => {
		try {
			const response = await fetchCustomerByIdService(cus_id);
			if (response.status) {
				setCustomer(response.data);
				const org_users = response.data.org_users.map((user) => ({
					id: user.id,
					name: user.name,
					phone: user?.phone || "NA",
					email: user?.emails[0]?.address || "NA",
					registered: formatDate(user?.account?.registered) || "Locked (Pending Activation)",
					created: user.createdAt,
				}));
				setOrgUsers(org_users);

				const org_sites = response.data.org_sites.map((site) => ({
					id: site.site_id,
					name: site.site_name,
					phone: site?.phone || "NA",
					address: site?.site_address || "NA",
					created: site.createdAt,
				}));
				setOrgSites(org_sites);

				const org_provisions = response.data.org_equipments.map((prov) => ({
					id: prov.id,
					serial_number: prov.serial_number,
					status: prov?.status_id || 0,
					equipment_name: prov?.equipment?.equipment || "",
					created: prov.createdAt,
					updated: prov.updatedAt,
					data: prov,
				}));
				setOrgProvisions(org_provisions);
				// const { docs, parentDocs } = extractKnowledgebaseDocs(response.data.equipment);
				// setEquipmentDocs(docs);
				// setParentEquipmentDocs(parentDocs);
				setError(null);
				setLoading(false);
			} else {
				setLoading(false);
				setEquipmentDocs(null);
				setParentEquipmentDocs(null);
				setCustomer(null);
				setError("Failed to Fetch Customer Details.");
			}
		} catch (error) {
			setLoading(false);
			setEquipmentDocs(null);
			setParentEquipmentDocs(null);
			setCustomer(null);
			setError("Failed to Fetch Customer Details.");
		}
	};

	const org_users_column = [
		{
			field: "name",
			headerName: "Name",
			flex: 1,
			renderCell: (params) => (
				<Tooltip title="View User Details">
					<span
						style={{
							cursor: "pointer",
							fontWeight: "bold",
						}}
						onMouseEnter={(e) => (e.target.style.fontWeight = "bold")}
						onMouseLeave={(e) => (e.target.style.fontWeight = "bold")}>
						{params.value}
					</span>
				</Tooltip>
			),
		},
		{
			field: "email",
			headerName: "email",
			width: 350,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "phone",
			headerName: "phone",
			width: 150,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "registered",
			headerName: "Status",
			width: 200,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "created",
			headerName: "Created",
			width: 200,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => formatDate(params.value),
		},
	];

	const org_sites_column = [
		{
			field: "name",
			headerName: "Site Name",
			flex: 1,
			renderCell: (params) => (
				<Tooltip title="View Site Details">
					<span
						style={{
							cursor: "pointer",
							fontWeight: "bold",
						}}
						onMouseEnter={(e) => (e.target.style.fontWeight = "bold")}
						onMouseLeave={(e) => (e.target.style.fontWeight = "bold")}>
						{params.value}
					</span>
				</Tooltip>
			),
		},
		{
			field: "address",
			headerName: "Site Address",
			width: 400,
			align: "center",
			headerAlign: "center",
		},
		{
			field: "created",
			headerName: "Created",
			width: 200,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => formatDate(params.value),
		},
	];

	const org_provisions_column = [
		{
			field: "equipment_name",
			headerName: "Equipment Name",
			flex: 1,
			renderCell: (params) => (
				<Tooltip title="View Details">
					<span
						style={{
							cursor: "pointer",
							fontWeight: "bold",
						}}
						onMouseEnter={(e) => (e.target.style.fontWeight = "bold")}
						onMouseLeave={(e) => (e.target.style.fontWeight = "bold")}>
						{params.value}
					</span>
				</Tooltip>
			),
		},
		{
			field: "status",
			headerName: "Status",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === "1" || params.value === 1 ? <span>Active</span> : <span>Inactive</span>,
		},
		{
			field: "serial_number",
			headerName: "Serial #",
			width: 150,
			align: "center",
			headerAlign: "center",
			renderCell: (params) =>
				params.value === "" ? <span style={{ fontSize: "10px", color: "gray" }}>N/A</span> : params.value,
		},
		{
			field: "updated",
			headerName: "Last Update",
			width: 200,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => formatDate(params.value),
		},
		{
			field: "created",
			headerName: "Created",
			width: 200,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => formatDate(params.value),
		},
	];

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
				<Button variant="text" onClick={handleNavigateBack} startIcon={<ArrowBackIcon />}>
					Back
				</Button>
				<Box sx={{ ...flexRow, justifyContent: "flex-end", alignItems: "center", columnGap: 1 }}>
					<Button variant="contained" startIcon={<ModeEditIcon />}>
						Edit Customer
					</Button>
					<Button variant="contained" startIcon={<DeleteIcon />}>
						Delete
					</Button>
				</Box>
			</Box>
			{/* <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" width="100%">
				<Box>
					<Typography variant="h5" fontWeight={"bold"}>
						Customer Details:
					</Typography>
				</Box>
			</Box> */}
			<Box width="100%" mx="auto" my={2}>
				{/* Top Row: Two Side-by-Side Boxes */}
				<Box display="flex" flexWrap="wrap" gap={2} mb={2}>
					{/* Left Box */}
					<Box
						flex={1}
						minWidth={300}
						border="1px solid #eee"
						borderRadius={2}
						boxShadow="0 1px 4px rgba(0,0,0,0.08)"
						p={2}>
						<InfoRow label="Customer Name" value={customer?.name} />
						<InfoRow
							label="Website"
							value={
								<Link href={customer?.website || "#"} underline="hover">
									{customer?.website || "N/A"}
								</Link>
							}
						/>
						<InfoRow label="Customer Address" value={customer?.address || "N/A"} />
						<InfoRow label="Manager" value={customer?.org_manager?.name || "No Manager"} />
						<InfoRow label="Created On" value={formatDate(customer.createdAt)} />
					</Box>

					{/* Right Box */}
					<Box
						flex={1}
						minWidth={300}
						border="1px solid #eee"
						borderRadius={2}
						boxShadow="0 1px 4px rgba(0,0,0,0.08)"
						p={2}>
						<InfoRow
							label="Status"
							chip={
								<Chip
									label={customer.status === 1 ? "Active" : "Inactive"}
									color={customer.status === 1 ? "success" : "default"}
									size="small"
								/>
							}
						/>
						<InfoRow
							label="Provisioned Equipment"
							value={
								<Link onClick={() => setTabIndex(1)} sx={{ cursor: "pointer" }} underline="hover">
									{customer?.org_equipments?.length || "NA"} Equipments
								</Link>
							}
						/>
						<InfoRow
							label="Customer Sites"
							value={
								<Link onClick={() => setTabIndex(4)} sx={{ cursor: "pointer" }} underline="hover">
									{customer?.org_sites?.length || "NA"} Sites
								</Link>
							}
						/>
						<InfoRow
							label="Customer Users"
							value={
								<Link onClick={() => setTabIndex(3)} sx={{ cursor: "pointer" }} underline="hover">
									{customer?.org_users?.length || "NA"} Users
								</Link>
							}
						/>
						<InfoRow label="Last Updated" value={formatDate(customer?.updatedAt) || "-"} />
					</Box>
				</Box>

				{/* Notes Box */}
				<Box border="1px solid #eee" borderRadius={2} boxShadow="0 1px 4px rgba(0,0,0,0.08)" p={2}>
					<Typography fontWeight={"bold"} gutterBottom>
						Notes
					</Typography>
					<Typography>{customer.notes || "-"}</Typography>
				</Box>
			</Box>
			<Tabs
				sx={{ borderBottom: "1px solid #eee" }}
				value={tabIndex}
				onChange={handleTabChange}
				aria-label="Profile Tabs"
				textColor="primary"
				indicatorColor="primary">
				<Tab label="Tickets" />
				<Tab label="Provisions" />
				<Tab label="Documents" />
				<Tab label="Users" />
				<Tab label="Sites" />
			</Tabs>

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
								Customer Equipment Documents
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
						{equipmentDocs && equipmentDocs.length > 0 ? (
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

					{parentEquipmentDocs && parentEquipmentDocs.length > 0 && (
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
								Customer Tickets
							</Typography>
							<Typography variant="body1" m={0}>
								List of all the Tickets for this Customer
							</Typography>
						</Box>
					</Box>
					<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
						No Tickets for this Customer
					</Alert>
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
								Equipment Provisions
							</Typography>
							<Typography variant="body1" m={0}>
								List of all the Equipments Provisioned to the Customer
							</Typography>
						</Box>
					</Box>

					{orgProvisions.length > 0 ? (
						<CustomDatagrid
							data={orgProvisions}
							columns={org_provisions_column}
							rowIdField={"id"}
							rowClick={true}
							pageSize={10}
							pageSizeOptions={[5, 10, 25, 50]}
							checkboxSelection={true}
							sortBy={[{ field: "created", sort: "desc" }]}
						/>
					) : (
						<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
							No Provisions for this Customer
						</Alert>
					)}
				</Box>
			</TabPanel>
			<TabPanel value={tabIndex} index={3}>
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
								Customer Users
							</Typography>
							<Typography variant="body1" m={0}>
								List of all the Users of the Customer
							</Typography>
						</Box>
					</Box>
					{orgUsers.length > 0 ? (
						<CustomDatagrid
							data={orgUsers}
							columns={org_users_column}
							rowIdField={"id"}
							rowClick={true}
							pageSize={10}
							pageSizeOptions={[5, 10, 25, 50]}
							checkboxSelection={true}
							sortBy={[{ field: "created", sort: "desc" }]}
						/>
					) : (
						<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
							No Users Available for the Customer
						</Alert>
					)}
				</Box>
			</TabPanel>
			<TabPanel value={tabIndex} index={4}>
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
								Customer Sites
							</Typography>
							<Typography variant="body1" m={0}>
								List of all the Sites of the Customer
							</Typography>
						</Box>
					</Box>

					{orgSites.length > 0 ? (
						<CustomDatagrid
							data={orgSites}
							columns={org_sites_column}
							rowIdField={"id"}
							rowClick={true}
							pageSize={10}
							pageSizeOptions={[5, 10, 25, 50]}
							checkboxSelection={true}
							sortBy={[{ field: "created", sort: "desc" }]}
						/>
					) : (
						<Alert severity="info" sx={{ width: "100%", mt: 1 }}>
							No Sites Available for the Customer
						</Alert>
					)}
				</Box>
			</TabPanel>
		</Box>
	);
};

export default CustomerDetails;
