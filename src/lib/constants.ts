import {
  CheckCircle,
  CircleOff,
  Home,
  LayoutGrid,
  Timer,
  Users,
} from "lucide-react";

export const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/pricing" },
];

export const SIDEBAR_ITEMS = [
  {
    header: "Dashboard",
    links: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    header: "Clients & Projects",
    links: [
      {
        title: "Clients",
        href: "/clients",
        icon: Users,
      },
      {
        title: "Projects",
        href: "/projects",
        icon: LayoutGrid,
      },
    ],
  },
  {
    header: "Organizations",
    links: [
      {
        title: "Organizations",
        href: "/organizations",
        icon: Users,
      },
    ],
  },
  {
    header: "Finance",
    // links: [
    //   {
    //     title: "Invoices",
    //     href: "/dashboard/invoices",
    //     icon: DollarSign,
    //   },
    //   {
    //     title: "Payments",
    //     href: "/dashboard/payments",
    //     icon: Handshake,
    //   },
    // ],
  },
  {
    header: "Team",
    // links: [
    //   {
    //     title: "Members",
    //     href: "/dashboard/members",
    //     icon: User2,
    //   },
    //   {
    //     title: "Roles",
    //     href: "/dashboard/roles",
    //     icon: Lock,
    //   },
    // ],
  },
  {
    header: "Communication",
    // links: [
    //   {
    //     title: "Emails",
    //     href: "/dashboard/emails",
    //     icon: Inbox,
    //   },
    //   {
    //     title: "Bulk Emails",
    //     href: "/dashboard/bulk-emails",
    //     icon: Lock,
    //   },
    // ],
  },
  {
    header: "Portfolio",
    // links: [
    //   {
    //     title: "Generate Portfolio",
    //     href: "/dashboard/generate-portfolio",
    //     icon: Inbox,
    //   },
    // ],
  },
  {
    header: "Brand",
    // links: [
    //   {
    //     title: "Settings",
    //     href: "/dashboard/settings",
    //     icon: Settings,
    //   },
    //   {
    //     title: "File Manager",
    //     href: "/dashboard/file-manager",
    //     icon: Lock,
    //   },
    // ],
  },
  {
    header: "Reports",
    // links: [
    //   {
    //     title: "Project Progress",
    //     href: "/dashboard/project-progress",
    //     icon: Inbox,
    //   },
    //   {
    //     title: "Financial Summary",
    //     href: "/dashboard/financial-summary",
    //     icon: Inbox,
    //   },
    //   {
    //     title: "Time Tracking",
    //     href: "/dashboard/time-tracking",
    //     icon: Inbox,
    //   },
    // ],
  },
  {
    header: "Settings",
    // links: [
    //   {
    //     title: "Account Settings",
    //     href: "/dashboard/account-settings",
    //     icon: Inbox,
    //   },
    //   {
    //     title: "Notifications",
    //     href: "/dashboard/notifications",
    //     icon: Inbox,
    //   },
    //   {
    //     title: "Integrations",
    //     href: "/dashboard/integrations",
    //     icon: Inbox,
    //   },
    // ],
  },
];

export const PROJECT_STATUSES = [
  {
    value: "active",
    label: "Active",
    icon: Timer,
  },
  {
    value: "inactive",
    label: "Inactive",
    icon: Timer,
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CircleOff,
  },
];
