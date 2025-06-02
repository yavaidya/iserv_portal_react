import { BrowserRouter, Route, Router, Routes } from "react-router-dom";

import "./App.css";
import i18n from "./i18n";

import { I18nextProvider } from "react-i18next";
import { ThemeContextProvider } from "./Context/ThemeContext";
import { PageTitleProvider } from "./Context/PageTitleContext";
import ErrorBoundary from "./CentralError";
import { AuthProvider } from "./Context/AuthContext";

import ProtectedRoute from "./ProtectedRoute";

import HorizontalLayout from "./Layout/HorizontalLayout/HorizontalLayout";
import Login from "./Pages/Auth/Login/Login";
import ManagerLogin from "./Pages/Auth/ManagerLogin/ManagerLogin";
import Logout from "./Pages/Auth/Logout/Logout";

const AppProviders = ({ children }) => (
	<ErrorBoundary>
		<AuthProvider>
			<ThemeContextProvider>
				<PageTitleProvider>{children}</PageTitleProvider>
			</ThemeContextProvider>
		</AuthProvider>
	</ErrorBoundary>
);

const AppRoutes = () => (
	<Routes>
		<Route path="/login" element={<Login />} />
		<Route path="/staff/login" element={<ManagerLogin />} />
		<Route element={<ProtectedRoute />}>
			<Route path="/*" element={<HorizontalLayout />} />
		</Route>
		<Route path="/logout" element={<Logout />} />
	</Routes>
);

const App = () => {
	return (
		<I18nextProvider i18n={i18n}>
			<AppProviders>
				<AppRoutes />
			</AppProviders>
		</I18nextProvider>
	);
};

const AppWithRouter = () => (
	<BrowserRouter>
		<App />
	</BrowserRouter>
);

export default AppWithRouter;
