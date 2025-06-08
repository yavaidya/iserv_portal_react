import React from "react";
import { useState } from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import { usePageTitle } from "../../Context/PageTitleContext";
import { useEffect } from "react";
import CustomDatagrid from "../CustomDatagrid/CustomDatagrid";
import { Box, Drawer } from "@mui/material";

const EntityWrapper = ({ ...props }) => {
	const [useDrawer, setUserDrawer] = useState(true);
	const { setActiveTitle } = usePageTitle();
	const { flexCol, flexRow } = useCustomTheme();
	const [datagridRows, setDatagridRows] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setActiveTitle({
			title: props.title,
			subtitle: props.subtitle,
		});
		setDatagridRows(props.data);
	}, []);

	useEffect(() => {
		console.log("Use Drawer: ", useDrawer, " Form Open: ", props.formProps.formOpen);
	}, [useDrawer]);
	return (
		<Box p={2} px={4} width={"100%"}>
			{useDrawer && (
				<>
					<CustomDatagrid
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

					{/* Stepper form in Drawer */}
					<Drawer anchor={"right"} sx={{ width: "45vh" }} open={props.formProps.formOpen}>
						{props.FormComponent && (
							<props.FormComponent
								{...props.formProps}
								drawerForm={useDrawer}
								setDrawerForm={setUserDrawer}
							/>
						)}
					</Drawer>
				</>
			)}
			{props.formProps.formOpen && !useDrawer && (
				<Box sx={{ minHeight: "600px" }}>
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
