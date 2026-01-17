"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Archive, Armchair, ShoppingCart, Tag, View, Warehouse } from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Furnitures",
      url: "/dashboard/admin/furnitures",
      icon: Armchair,
    },
    {
      title: "Inventory",
      url: "/dashboard/admin/inventory",
      icon: Warehouse,
    },
    {
      title: "Sales",
      url: "/dashboard/admin/sales",
      icon: Tag ,
    },
    {
      title: "Orders",
      url: "/dashboard/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Analytics",
      url: "/dashboard/admin/analytics",
      icon: IconChartBar,
    },
    {
      title: "Users",
      url: "/dashboard/admin/users",
      icon: IconUsers,
    },


    {
      title: "Reviews",
      url: "/dashboard/admin/reviews",
      icon: View,
    // },  {
    //   title: "Reviews",
    //   url: "/dashboard/admin/reviews",
    //   icon: View,
    },

  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],


  documents: [
    {
      name: "Archive",
      url: "/dashboard/admin/archive",
      icon: Archive,
    },
    {
      name: "Data",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
             {/* <SidebarGroupLabel className="flex justify-center">
            <img src="/images/logo/elan.png" alt="" className="h-15 my-3" />
          </SidebarGroupLabel> */}
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 h-full">
              <a href="/">
    <img src="/images/logo/elan.png" alt="" className="h-15 m-auto " />
                   </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="text-[#101828]" >
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
