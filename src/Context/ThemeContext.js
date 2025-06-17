// ThemeContext.js
import React, { createContext, useState, useMemo, useEffect, useContext } from "react";
import { alpha, createTheme, ThemeProvider } from "@mui/material/styles";
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
						default: mode === "light" ? "#f9fafc" : "#424242",
						paper: mode === "light" ? "#ffffff" : "#303030",
					},
					text: {
						primary: mode === "light" ? "#000000" : "#ffffff",
					},
					customBorder: mode === "light" ? "#eee" : "transparent",
				},
				typography: {
					fontFamily,
					fontSize: 12,

					h1: {
						fontSize: "28px",
						fontWeight: 600,
					},
					h2: {
						fontSize: "24px",
						fontWeight: 600,
					},
					h3: {
						fontSize: "20px",
						fontWeight: 500,
					},
					h4: {
						fontSize: "18px",
						fontWeight: 500,
					},
					h5: {
						fontSize: "16px",
						fontWeight: 500,
					},
					h6: {
						fontSize: "14px",
						fontWeight: 500,
					},
					body1: {
						fontSize: "12px",
					},
					body2: {
						fontSize: "12px",
					},
					caption: {
						fontSize: "12px",
					},
					subtitle1: {
						fontSize: "12px",
						fontWeight: 500,
					},
					subtitle2: {
						fontSize: "11px",
						fontWeight: 500,
					},
				},
				components: {
					MuiCssBaseline: {
						styleOverrides: {
							body: { fontFamily },
							"*": { fontFamily },
						},
					},
					MuiButton: {
						styleOverrides: {
							root: {
								borderRadius: "10px",
								textTransform: "none",
								fontWeight: 500,
								fontSize: "13px",
								paddingInline: 20,
							},

							// Override for contained variant (any color)
							contained: {},

							containedPrimary: {
								backgroundColor: themeColors[accentColor].main,
								color: themeColors[accentColor].contrastText,
								"&:hover": {
									backgroundColor: themeColors[accentColor].dark,
								},
							},

							containedSecondary: {
								backgroundColor: "#6C757D",
								color: "#fff",
								"&:hover": {
									backgroundColor: "#545b62",
								},
							},

							// Override for outlined variant
							outlined: {
								borderWidth: 2,
							},

							outlinedPrimary: {
								border: "0.5px solid",
								borderColor: themeColors[accentColor].main,
								color: themeColors[accentColor].main,
								"&:hover": {
									borderColor: themeColors[accentColor].main,
									backgroundColor: themeColors[accentColor].main,
									color: themeColors[accentColor].contrastText,
								},
							},

							// Override for text variant
							textPrimary: {
								color: themeColors[accentColor].main,
								"&:hover": {
									backgroundColor: alpha(themeColors[accentColor].light, 0.1),
								},
							},
						},
					},
					MuiOutlinedInput: {
						styleOverrides: {
							root: {
								borderRadius: "10px",
								background: `${mode === "light" ? "#ffffff" : "#424242"} !important`,
							},
							input: {
								background: "transparent !important",
							},
						},
					},
					MuiInputBase: {
						styleOverrides: {
							root: {
								background: mode === "light" ? "#ffffff" : "#424242",
							},
							input: {
								background: "transparent",
							},
						},
					},
					MuiPickersOutlinedInput: {
						styleOverrides: {
							root: {
								borderRadius: "10px",
								background: `${mode === "light" ? "#ffffff" : "#424242"} !important`,
							},
							input: {
								background: "transparent !important",
							},
						},
					},
					MuiAlert: {
						styleOverrides: {
							root: {
								borderRadius: "10px",
							},
						},
					},
					// MuiFilledInput: {
					// 	styleOverrides: {
					// 		root: {
					// 			borderRadius: "10px",
					// 			boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",
					// 			backgroundColor: mode === "light" ? "#ffffff" : "#424242",

					// 			"&:before, &:after": {
					// 				border: "none",
					// 			},
					// 			"&.Mui-focused:after": {
					// 				border: "2px solid",
					// 				borderColor: themeColors[accentColor].main,
					// 			},
					// 		},
					// 		input: {
					// 			borderRadius: "10px",

					// 			background: "transparent",
					// 		},
					// 	},
					// },
					// MuiInput: {
					// 	styleOverrides: {
					// 		root: {
					// 			borderRadius: "10px",
					// 			boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",

					// 			background: mode === "light" ? "#ffffff" : "#424242",
					// 			"&:before, &:after": {
					// 				border: "none",
					// 			},
					// 			"&.Mui-focused:after": {
					// 				border: "2px solid",
					// 				borderColor: themeColors[accentColor].main,
					// 			},
					// 		},
					// 		input: {
					// 			borderRadius: "10px",

					// 			background: "transparent",
					// 		},
					// 	},
					// },
					// MuiSelect: {
					// 	styleOverrides: {
					// 		root: {
					// 			borderRadius: "10px",
					// 			boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",

					// 			background: mode === "light" ? "#ffffff" : "#424242",
					// 		},
					// 	},
					// },
					// MuiAutocomplete: {
					// 	styleOverrides: {
					// 		inputRoot: {
					// 			borderRadius: "10px !important",
					// 			boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",

					// 			background: mode === "light" ? "#ffffff" : "#424242",
					// 		},
					// 		paper: {
					// 			borderRadius: "10px",
					// 		},
					// 	},
					// },
					// MuiPickersDay: {
					// 	styleOverrides: {
					// 		root: {
					// 			borderRadius: "10px",
					// 		},
					// 	},
					// },
					// MuiPickersPopper: {
					// 	styleOverrides: {
					// 		paper: {
					// 			borderRadius: "10px",
					// 			background: mode === "light" ? "#ffffff" : "#424242",
					// 			boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",
					// 		},
					// 	},
					// },
					// MuiCalendarPicker: {
					// 	styleOverrides: {
					// 		root: {
					// 			borderRadius: "10px",
					// 			background: mode === "light" ? "#ffffff" : "#424242",
					// 		},
					// 	},
					// },
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
				theme,
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
