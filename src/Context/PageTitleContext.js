// src/Context/MenuContext.js
import { createContext, useContext, useState } from "react";

export const PageTitleContext = createContext();

export const PageTitleProvider = ({ children }) => {
	const [activeTitle, setActiveTitle] = useState({
		title: "Dashboard",
		subtitle: "Welcome to the dashboard",
	});

	return <PageTitleContext.Provider value={{ activeTitle, setActiveTitle }}>{children}</PageTitleContext.Provider>;
};

export const usePageTitle = () => useContext(PageTitleContext);
