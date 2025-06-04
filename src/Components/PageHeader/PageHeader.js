import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

const PageHeader = ({ title, subtitle, helpContent = "" }) => {
	return (
		<Box mb={4}>
			<Box display="flex" alignItems="center">
				<Typography variant="h3" fontWeight="bold">
					{title}
				</Typography>
				{(helpContent || subtitle) && (
					<Tooltip
						title={
							<Box>
								<Typography fontWeight="bold">Info</Typography>
								<Typography variant="body2">{helpContent ? helpContent : subtitle}</Typography>
							</Box>
						}
						arrow
						placement="right">
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								color: "#aaa",
								cursor: "pointer",
								transition: "color 0.3s",
								ml: "5px",
								"&:hover": {
									color: (theme) => theme.palette.primary.main,
								},
							}}>
							<HelpIcon fontSize="small" />
						</Box>
					</Tooltip>
				)}
			</Box>

			{subtitle !== "" && (
				<Typography variant="subtitle1" color="textSecondary">
					{subtitle}
				</Typography>
			)}

			<Box
				sx={{
					mt: 1,
					background: (theme) => theme.palette.primary.main,
					width: "80px",
					height: "4px",
				}}
			/>
		</Box>
	);
};

export default PageHeader;
