import { Box, Typography } from "@mui/material";
import React from "react";
import { usePageTitle } from "../../Context/PageTitleContext";

const PageTitle = () => {
	const { activeTitle } = usePageTitle();
	return (
		<Box>
			<Typography variant="h3" fontWeight={"bold"}>
				{activeTitle.title}
			</Typography>
			{activeTitle.subtitle !== "" && (
				<Typography variant="subtitle1" color="textSecondary">
					{activeTitle.subtitle}
				</Typography>
			)}
			<Box
				sx={{
					mt: 1,
					background: (theme) => theme.palette.primary.main,
					width: "100px",
					height: "4px",
				}}></Box>
		</Box>
	);
};

export default PageTitle;
