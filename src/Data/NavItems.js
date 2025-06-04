import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FolderCopyRoundedIcon from "@mui/icons-material/FolderCopyRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import RecentActorsRoundedIcon from "@mui/icons-material/RecentActorsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import ContactMailRoundedIcon from "@mui/icons-material/ContactMailRounded";
import SwitchAccountRoundedIcon from "@mui/icons-material/SwitchAccountRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import HomeRepairServiceRoundedIcon from "@mui/icons-material/HomeRepairServiceRounded";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import TopicRoundedIcon from "@mui/icons-material/TopicRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import PermContactCalendarRoundedIcon from "@mui/icons-material/PermContactCalendarRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import Home from "../Pages/Home/Home";
import Dashboard from "../Pages/Dashboard/Dashboard";
export const adminMenu = [
	{
		block: "Reports",
		items: [
			{
				title: "Dashboard",
				subtitle: "Service health and ticketing overview",
				path: "/dashboard",
				component: <Dashboard />,
				icon: <DashboardRoundedIcon />,
			},
			{
				title: "AI Assistant",
				subtitle: "Smart ticket insights and recommendations",
				path: "/analytics",
				component: <Home />,
				icon: <AutoAwesomeRoundedIcon />,
			},
		],
	},
	{
		block: "Operations",
		item: [
			{
				title: "Tickets",
				subtitle: "Manage maintenance and repair tasks",
				path: "/tickets",
				component: <Home />,
				icon: <StickyNote2RoundedIcon />,
			},
			{
				title: "Tasks",
				subtitle: "Ticket assignments and progress",
				path: "/Tasks",
				icon: <FormatListBulletedRoundedIcon />,
			},
			{
				title: "Quotes",
				subtitle: "Billing and service charge records",
				path: "/quotes",
				component: <Home />,
				icon: <ReceiptRoundedIcon />,
			},
			{
				title: "Knowledgebase",
				subtitle: "Service manuals and compliance files",
				icon: <TopicRoundedIcon />,
				children: [
					{
						title: "Documents",
						subtitle: "View and manage service documents",
						path: "/documents",
						icon: <DescriptionRoundedIcon />,
						component: <Home />,
					},
					{
						title: "Categories",
						subtitle: "Organize document types",
						path: "/document-categories",
						icon: <FolderCopyRoundedIcon />,
						component: <Home />,
					},
				],
			},
		],
	},
	{
		block: "Service Scheduling",
		items: [
			{
				title: "Appointments",
				subtitle: "Schedule service visits and inspections",
				path: "/appointments",
				component: <Home />,
				icon: <EventRoundedIcon />,
			},
		],
	},
	{
		block: "Field Operations",
		item: [
			{
				title: "Organizations",
				subtitle: "Manage OEMs and manufacturer accounts",
				icon: <ContactMailRoundedIcon />,
				children: [
					{
						title: "Customers",
						component: <Home />,
						subtitle: "List of registered clients",
						path: "/customers",
						icon: <SwitchAccountRoundedIcon />,
					},
					{
						title: "Users",
						subtitle: "Customer contacts and team members",
						component: <Home />,

						path: "/users",
						icon: <PeopleRoundedIcon />,
					},
				],
			},
			{
				title: "Equipments",
				subtitle: "Track machines and assets under service",
				path: "/equipments",
				component: <Home />,

				icon: <PrecisionManufacturingRoundedIcon />,
			},
			{
				title: "Provisions",
				subtitle: "Allocated resources and parts",
				path: "/provisions",
				component: <Home />,

				icon: <HomeRepairServiceRoundedIcon />,
			},
		],
	},
	{
		block: "Service Hub",
		item: [
			{
				title: "Engineers",
				subtitle: "Manage field engineers and assignments",
				icon: <TopicRoundedIcon />,
				children: [
					{
						title: "Staff",
						subtitle: "Service engineers and internal team",
						path: "/staff",
						icon: <PeopleAltRoundedIcon />,
					},
					{
						title: "Departments",
						subtitle: "Group engineers by service function",
						path: "/departments",
						icon: <RecentActorsRoundedIcon />,
					},
					{
						title: "Roles",
						subtitle: "Access control and responsibilities",
						path: "/roles",
						icon: <SecurityRoundedIcon />,
					},
				],
			},
		],
	},
];

export const manageMenu = [
	{
		block: "Reports",
		items: [
			{
				title: "Dashboard",
				path: "/dashboard",
				icon: <DashboardRoundedIcon />,
			},
			{
				title: "AI Assistant",
				path: "/dashboard",
				icon: <AutoAwesomeRoundedIcon />,
			},
		],
	},
	{
		block: "Operations",
		item: [
			{
				title: "Work Orders",
				path: "/work-orders",
				icon: <StickyNote2RoundedIcon />,
			},
			{
				title: "Invoices",
				path: "/invoices",
				icon: <ReceiptRoundedIcon />,
			},
			{
				title: "Documents",
				icon: <TopicRoundedIcon />,
				children: [
					{
						title: "Categories",
						path: "/document-categories",
						icon: <FolderCopyRoundedIcon />,
					},
					{
						title: "Documents",
						path: "/documents",
						icon: <DescriptionRoundedIcon />,
					},
				],
			},
		],
	},
	{
		block: "Field Operations",
		item: [
			{
				title: "Customers",
				icon: <ContactMailRoundedIcon />,
				children: [
					{
						title: "Customers",
						path: "/customers",
						icon: <SwitchAccountRoundedIcon />,
					},
					{
						title: "Users",
						path: "/users",
						icon: <PeopleRoundedIcon />,
					},
				],
			},
			{
				title: "Equipments",
				path: "/equipments",
				icon: <PrecisionManufacturingRoundedIcon />,
			},
			{
				title: "Provisions",
				path: "/provisions",
				icon: <HomeRepairServiceRoundedIcon />,
			},
		],
	},
	{
		block: "Appointments",
		items: [
			{
				title: "Appointments",
				path: "/appointments",
				icon: <EventRoundedIcon />,
			},
			{
				title: "Calender",
				path: "/calender",
				icon: <CalendarMonthRoundedIcon />,
			},
		],
	},
];

export const customerMenu = [
	{
		block: "Reports",
		items: [
			{
				title: "Dashboard",
				path: "/dashboard",
				icon: <DashboardRoundedIcon />,
			},
			{
				title: "AI Assistant",
				path: "/dashboard",
				icon: <AutoAwesomeRoundedIcon />,
			},
		],
	},
	{
		block: "Operations",
		item: [
			{
				title: "Work Orders",
				path: "/work-orders",
				icon: <StickyNote2RoundedIcon />,
			},
			{
				title: "Invoices",
				path: "/invoices",
				icon: <ReceiptRoundedIcon />,
			},
			{
				title: "Documents",
				icon: <TopicRoundedIcon />,
				children: [
					{
						title: "Categories",
						path: "/document-categories",
						icon: <FolderCopyRoundedIcon />,
					},
					{
						title: "Documents",
						path: "/documents",
						icon: <DescriptionRoundedIcon />,
					},
				],
			},
			{
				title: "Equipments",
				path: "/equipments",
				icon: <PrecisionManufacturingRoundedIcon />,
			},
		],
	},
	{
		block: "Appointments",
		items: [
			{
				title: "Appointments",
				path: "/appointments",
				icon: <EventRoundedIcon />,
			},
			{
				title: "Calender",
				path: "/calender",
				icon: <CalendarMonthRoundedIcon />,
			},
		],
	},
];
