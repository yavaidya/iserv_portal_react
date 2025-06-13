import React from "react";
import { useState } from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import { usePageTitle } from "../../Context/PageTitleContext";
import { useEffect } from "react";
import CustomDatagrid from "../CustomDatagrid/CustomDatagrid";
import { Alert, Box, Button, Drawer } from "@mui/material";
import LoadingWrapper from "../LoadingWrapper/LoadingWrapper";

const EntityWrapper = ({ ...props }) => {
	const [useDrawer, setUserDrawer] = useState(true);
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [datagridRows, setDatagridRows] = useState([]);
	const [error, setError] = useState(props?.error || null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setActiveTitle({
			title: props.title,
			subtitle: props.subtitle,
		});
		setDatagridRows(props.data);
	}, []);

	useEffect(() => {
		// if (datagridRows.length > 0 && !error) {
		setLoading(false);
		// }
	}, [datagridRows]);

	if (loading) {
		return <LoadingWrapper minHeight={"400px"} />;
	}

	return (
		<Box p={2} px={4} width={"100%"}>
			{useDrawer && (
				<>
					{datagridRows.length > 0 ? (
						<CustomDatagrid
							listLoading={props.listLoading}
							data={datagridRows}
							columns={props.columns}
							rowIdField={props.rowIdField}
							onSelect={props.onSelect}
							rowClick={true}
							onRowClick={props.onRowClick}
							pageSize={10}
							pageSizeOptions={[5, 10, 25, 50]}
							checkboxSelection={true}
							customButtons={props.customButtons}
							sortBy={props.sortBy}
							handleEdit={props.handleEdit ? props.handleEdit : null}
							handleDelete={props.handleDelete ? props.handleDelete : null}
							handleDuplicate={props.handleDuplicate ? props.handleDuplicate : null}
						/>
					) : (
						<Box
							sx={{
								...flexCol,
								justifyContent: "center",
								alignItems: "center",
								minHeight: "500px",
								width: "100%",
								rowGap: 2,
							}}>
							<Alert severity="info">No {props.title} Found</Alert>
							{props.customButtons &&
								props.customButtons.map((button, index) => (
									<Button
										key={index}
										startIcon={button?.icon}
										variant="contained"
										color="primary"
										onClick={button.onClick}>
										{button.label}{" "}
										{button?.upload && (
											<input
												type="file"
												hidden
												onChange={button?.handleFileChange}
												accept={button?.acceptedFile} // Adjust file types as needed
											/>
										)}
									</Button>
								))}
						</Box>
					)}

					{/* Stepper form in Drawer */}
					<Drawer anchor={"right"} sx={{ width: "50vw" }} open={props.formProps.formOpen}>
						<Box width={"50vw"}>
							{props.FormComponent && (
								<props.FormComponent
									{...props.formProps}
									drawerForm={useDrawer}
									setDrawerForm={setUserDrawer}
								/>
							)}
						</Box>
					</Drawer>
				</>
			)}
			{props.formProps.formOpen && !useDrawer && (
				<Box
					sx={{
						minHeight: "600px",
						background: (theme) => theme.palette.background.paper,
						borderRadius: "10px",
						boxShadow: "0 0 5px 2px rgba(0,0,0,0.1)",
						p: 3,
					}}>
					{props.FormComponent && (
						<props.FormComponent
							{...props.formProps}
							drawerForm={useDrawer}
							setDrawerForm={setUserDrawer}
						/>
					)}
				</Box>
			)}
		</Box>
	);
};

export default EntityWrapper;
