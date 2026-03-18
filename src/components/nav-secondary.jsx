"use client"

import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({ items, ...props }) {
  const pathname = usePathname()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className={`
                    group relative overflow-hidden px-4 py-5
                    transition-all duration-300 ease-in-out
                    hover:bg-[#c8ad93]/10 hover:translate-x-1
                    active:scale-95 active:duration-75
                    ${isActive 
                      ? "bg-[#c8ad93]/10 text-[#1e3753] font-semibold shadow-[inset_0_0_0_1px_rgba(200,173,147,0.2)]" 
                      : "text-[#101828] opacity-70"
                    }
                  `}
                >
                  <a href={item.url} className="flex items-center gap-3">
                    {/* Indicator line */}
                    <span
                      className={`
                        absolute left-0 top-1/2 -translate-y-1/2
                        w-[3px] rounded-r-full bg-[#c8ad93]
                        transition-all duration-300
                        ${isActive ? "h-5 opacity-100" : "h-0 opacity-0 group-hover:h-4 group-hover:opacity-50"}
                      `}
                    />
                    
                    <item.icon
                      className={`
                         transition-all duration-300
                        group-hover:text-[#c8ad93]
                        ${isActive ? "text-[#c8ad93]" : "text-[#1e3753]"}
                      `}
                    />
                    
                    <span className="text-md font-medium ">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}