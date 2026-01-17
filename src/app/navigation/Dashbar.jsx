"use client";
import React from "react";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", icon: Home },
  { title: "Inbox", icon: Inbox },
  { title: "Calendar", icon: Calendar },
  { title: "Search", icon: Search },
  { title: "Settings", icon: Settings },
];

function Dashbar({ activeItem, onSelect }) {
  return (
    <Sidebar>
      <SidebarContent className="bg-[#1e3753]">
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-center">
            <img src="/images/logo/elan.png" alt="" className="h-15 my-3" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-8">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      className={`flex items-center gap-2 w-full p-4 text-left ${
                        activeItem === item.title
                          ? "bg-gray-700 text-white font-bold"
                          : "text-gray-200"
                      }`}
                      onClick={() => onSelect(item.title)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default Dashbar;
