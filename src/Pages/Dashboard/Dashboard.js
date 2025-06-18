import React, { useEffect } from "react";
import { usePageTitle } from "../../Context/PageTitleContext";

const Dashboard = () => {
	const { setActiveTitle } = usePageTitle();
	useEffect(() => {
		setActiveTitle({
			title: "Dashboard",
			activeKey: "dashboard",
			subtitle: "Manage your service tickets efficiently",
		});
	}, []);
	return <div>Dashboard</div>;
};

export default Dashboard;
