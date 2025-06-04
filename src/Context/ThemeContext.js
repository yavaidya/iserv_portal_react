// ThemeContext.js
import React, { createContext, useState, useMemo, useEffect, useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { fonts, themeColors } from "../Data/ThemeColors";
export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
	const defaultFontKey = localStorage.getItem("fontFamilyKey") || "Poppins";
	const [mode, setMode] = useState(localStorage.getItem("themeMode") || "light");
	const [accentColor, setAccentColor] = useState(localStorage.getItem("accentColor") || "blue");
	const [fontKey, setFontKey] = useState(defaultFontKey); // key from fonts
	const fontFamily = fonts[fontKey];

	const flexRow = {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "flex-start",
	};

	const flexCol = {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start",
	};

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
					primary: themeColors[accentColor],
					background: {
						default: mode === "light" ? "#f9fafc" : "#303030",
						paper: mode === "light" ? "#ffffff" : "#424242",
					},
					text: {
						primary: mode === "light" ? "#000000" : "#ffffff",
					},
					customBorder: mode === "light" ? "#eee" : "transparent",
				},
				typography: {
					fontFamily,
					fontSize: 12,
					h1: { fontSize: "28px", fontWeight: 600, lineHeight: "36px" },
					h2: { fontSize: "24px", fontWeight: 600, lineHeight: "32px" },
					h3: { fontSize: "20px", fontWeight: 500, lineHeight: "28px" },
					h4: { fontSize: "18px", fontWeight: 500, lineHeight: "26px" },
					h5: { fontSize: "16px", fontWeight: 500, lineHeight: "24px" },
					h6: { fontSize: "14px", fontWeight: 500, lineHeight: "22px" },
					body1: { fontSize: "12px", lineHeight: "20px" },
					body2: { fontSize: "12px", lineHeight: "18px" },
					caption: { fontSize: "14px", lineHeight: "20px" },
					subtitle1: { fontSize: "12px", fontWeight: 500, lineHeight: "18px" },
					subtitle2: { fontSize: "11px", fontWeight: 500, lineHeight: "16px" },
				},
				components: {
					MuiCssBaseline: {
						styleOverrides: {
							body: { fontFamily },
							"*": { fontFamily },
						},
					},
				},
			}),
		[mode, accentColor, fontFamily]
	);

	useEffect(() => {
		const root = document.documentElement;

		root.style.setProperty("--bg-default", theme.palette.background.default);
		root.style.setProperty("--bg-paper", theme.palette.background.paper);

		root.style.setProperty("--primary-main", theme.palette.primary.main);
		root.style.setProperty("--primary-light", theme.palette.primary.light);
		root.style.setProperty("--primary-dark", theme.palette.primary.dark);
		root.style.setProperty("--primary-contrast-text", theme.palette.primary.contrastText);
		root.style.setProperty("--primary-hover", theme.palette.primary.light);
		root.style.setProperty("--primary-selected", theme.palette.primary.dark);
		root.style.setProperty("--primary-disabled", theme.palette.primary.light);

		root.style.setProperty("--secondary-main", theme.palette.secondary.main);
		root.style.setProperty("--secondary-light", theme.palette.secondary.light);
		root.style.setProperty("--secondary-dark", theme.palette.secondary.dark);
		root.style.setProperty("--secondary-contrast-text", theme.palette.secondary.contrastText);

		root.style.setProperty("--font-family", theme.typography.fontFamily);
		root.style.setProperty("--font-size-base", `${theme.typography.fontSize}px`);
		root.style.setProperty("--font-size-h1", theme.typography.h1.fontSize);
		root.style.setProperty("--font-size-h2", theme.typography.h2.fontSize);
		root.style.setProperty("--font-size-h3", theme.typography.h3.fontSize);
		root.style.setProperty("--font-size-body1", theme.typography.body1.fontSize);
		root.style.setProperty("--font-size-body2", theme.typography.body2.fontSize);
	}, [theme, fontFamily]);

	useEffect(() => {
		localStorage.setItem("themeMode", mode);
		localStorage.setItem("accentColor", accentColor);
		localStorage.setItem("fontFamily", fontKey);
	}, [mode, accentColor, fontKey]);

	const toggleMode = () => setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
	const changeAccentColor = (color) => setAccentColor(color);
	const changeFont = (newFontKey) => {
		if (fonts[newFontKey]) {
			setFontKey(newFontKey);
		}
	};

	return (
		<ThemeContext.Provider
			value={{
				toggleMode,
				changeAccentColor,
				changeFont,
				mode,
				accentColor,
				flexCol,
				flexRow,
				fontKey,
				fontOptions: Object.keys(fonts),
			}}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeContext.Provider>
	);
};

export const useCustomTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useCustomTheme must be used within a ThemeContextProvider");
	return context;
};
