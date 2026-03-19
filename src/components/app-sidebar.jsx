"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { IconChartBar, IconDashboard, IconUsers,IconUser } from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Armchair, ShoppingCart, Tag, Warehouse } from "lucide-react";

const navItems = {
  main: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Furnitures", url: "/dashboard/admin/furnitures", icon: Armchair },
    { title: "Inventory", url: "/dashboard/admin/inventory", icon: Warehouse },
  ],
  secondary: [
    { title: "Sales", url: "/dashboard/admin/sales", icon: Tag },
    { title: "Orders", url: "/dashboard/admin/orders", icon: ShoppingCart },
    { title: "Analytics", url: "/dashboard/admin/analytics", icon: IconChartBar },
    { title: "Users", url: "/dashboard/admin/users", icon: IconUsers },
    { title: "Profile", url: "/dashboard/admin/settings", icon: IconUser },

  ],
};

export function AppSidebar({ ...props }) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [user, setUser] = React.useState({
    name: "Loading...",
    email: "",
    avatar: "",
  });

  React.useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));


        const firstName = payload.user_firstname || "";
        const lastName = payload.user_lastname || "";
        const email = payload.user_email || "";

        setUser({
          name: `${firstName} ${lastName}`.trim() || "Admin",
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=c8ad93&color=fff`,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.warn("No token found in localStorage");
    }
  }, []);

  if (!mounted) return null;

  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r border-[#c8ad93]/10">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-20 hover:bg-transparent">
              <a href="/dashboard">
                <img src="/images/logo/elan.png" alt="Logo" className="h-12 m-auto" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="text-[#101828] px-2">
        <NavMain items={navItems.main} activepath={pathname} />
        <NavSecondary items={navItems.secondary} activepath={pathname} />
      </SidebarContent>

      <SidebarFooter className="border-t border-[#c8ad93]/10">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}