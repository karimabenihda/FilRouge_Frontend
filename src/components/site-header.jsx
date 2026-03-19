"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/admin/furnitures": "Furnitures",
  "/dashboard/admin/inventory": "Inventory",
  "/dashboard/admin/sales": "Sales",
  "/dashboard/admin/orders": "Orders",
  "/dashboard/admin/analytics": "Analytics",
  "/dashboard/admin/users": "Users",
    "/dashboard/admin/settings": "Profile",

}

export function SiteHeader() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || "Dashboard"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="text-[#101828] -ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium text-[#101828]">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <a href="/" rel="noopener noreferrer" target="_blank">
            <img src="/images/logo/elan.png" className="h-9" alt="" />
          </a>
        </div>
      </div>
    </header>
  )
}