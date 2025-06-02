import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const GlobalSearch = ({ width = 400 }) => {
	const [query, setQuery] = useState("");

	const handleSearch = (input = query) => {
		// Trigger your search logic here
		console.log("Searching for:", input);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<Box sx={{ maxWidth: width, width: width }}>
			<TextField
				fullWidth
				placeholder="Search..."
				variant="outlined"
				value={query}
				size="small"
				width={"100%"}
				onChange={(e) => setQuery(e.target.value)}
				onInput={(e) => handleSearch(e.target.value)}
				onKeyPress={handleKeyPress}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<IconButton onClick={handleSearch} edge="start">
								<SearchIcon />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
		</Box>
	);
};

export default GlobalSearch;
