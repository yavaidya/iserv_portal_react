import { Box, CircularProgress, Skeleton } from "@mui/material";
import React from "react";
import { useCustomTheme } from "../../Context/ThemeContext";

const LoadingWrapper = ({ minHeight, minWidth = "100%", mode = "skeleton" }) => {
	const { flexCol, flexRow } = useCustomTheme();

	const renderSkeleton = () => {
		return (
			<>
				<Box
					p={2}
					px={4}
					sx={{
						...flexCol,
						justifyContent: mode === "circular" ? "center" : "flex-start",
						alignItems: mode === "circular" ? "center" : "flex-start",
						minHeight,
						width: "100%",
						rowGap: "15px",
						minWidth,
					}}>
					<Box
						sx={{
							...flexRow,
							justifyContent: "space-between",
							alignItems: "flex-start",
							height: "30px",
							width: "100%",
						}}>
						<Skeleton animation="wave" variant="rounded" width={"315px"} height={"100%"} />
						<Skeleton animation="wave" variant="rounded" width={"400px"} height={"100%"} />
					</Box>
					<Skeleton
						animation="wave"
						variant="rounded"
						width={"100%"}
						height={"100%"}
						sx={{ minHeight: "40px" }}
					/>
					<Skeleton
						animation="wave"
						variant="rounded"
						width={"80%"}
						height={"100%"}
						sx={{ minHeight: "40px" }}
					/>
					<Skeleton
						animation="wave"
						variant="rounded"
						width={"60%"}
						height={"100%"}
						sx={{ minHeight: "40px" }}
					/>
					<Skeleton
						animation="wave"
						variant="rounded"
						width={"40%"}
						height={"100%"}
						sx={{ minHeight: "40px" }}
					/>
				</Box>
			</>
		);
	};

	return (
		<Box
			sx={{
				...flexCol,
				justifyContent: mode === "circular" ? "center" : "flex-start",
				alignItems: mode === "circular" ? "center" : "flex-start",
				minHeight,
				width: "100%",
				minWidth,
			}}>
			{mode === "circular" ? <CircularProgress /> : renderSkeleton()}
		</Box>
	);
};

export default LoadingWrapper;
