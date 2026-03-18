"use client"

import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({ items }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
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
                    group relative overflow-hidden px-4 py-6
                    transition-all duration-300 ease-in-out
                    /* Hover State */
                    hover:bg-[#c8ad93]/10 hover:translate-x-1
                    /* Active/Click State */
                    active:scale-95 active:duration-75
                    /* Focused/Selected State */
                    ${isActive 
                      ? "bg-[#c8ad93]/15 text-[#1e3753] font-bold" 
                      : "text-[#101828] opacity-80"
                    }
                  `}
                >
                  <a href={item.url} className="flex items-center gap-3">
                    {/* Animated gold border indicator */}
                    <span
                      className={`
                        absolute left-0 top-1/2 -translate-y-1/2
                        w-[4px] rounded-r-full bg-[#c8ad93]
                        transition-all duration-500 ease-out
                        ${isActive ? "h-6 opacity-100" : "h-0 opacity-0 group-hover:h-4 group-hover:opacity-50"}
                      `}
                    />
                    
                    {item.icon && (
                      <item.icon
                        className={`
                         transition-all duration-300
                          group-hover:scale-125 group-hover:text-[#c8ad93]
                          ${isActive ? "scale-110 text-[#c8ad93] drop-shadow-sm" : "text-[#1e3753]"}
                        `}
                      />
                    )}
                    
                    <span className="transition-colors duration-300 font-medium group-hover:text-[#1e3753]">
                      {item.title}
                    </span>
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