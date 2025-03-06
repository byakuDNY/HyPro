import {
  CheckCircle,
  CircleOff,
  Home,
  LayoutGrid,
  Settings,
  Timer,
  Users,
} from "lucide-react";

export const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/pricing" },
];

export const SIDEBAR_ITEMS = [
  {
    header: "Main Navigation",
    links: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: Home,
      },
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
      {
        title: "Organizations",
        href: "/organizations",
        icon: Users,
      },
    ],
  },
  {
    header: "Other",
    links: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
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
