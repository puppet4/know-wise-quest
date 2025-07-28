import { useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Star, 
  Clock, 
  Tag,
  Home,
  Settings,
  Archive
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "首页", url: "/", icon: Home },
  { title: "搜索", url: "/search", icon: Search },
  { title: "收藏夹", url: "/favorites", icon: Star },
  { title: "最近访问", url: "/recent", icon: Clock },
];

const categoryItems = [
  { title: "所有标签", url: "/tags", icon: Tag },
  { title: "已归档", url: "/archive", icon: Archive },
  { title: "设置", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      className="border-r border-border/50 bg-card"
      collapsible="icon"
    >
      <SidebarContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-primary">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-foreground">知识库</h2>
                <p className="text-xs text-muted-foreground">智慧管理平台</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Button */}
        <div className="p-4">
          <Button 
            variant="gradient" 
            className={`w-full ${isCollapsed ? "px-2" : "px-4"}`}
            size={isCollapsed ? "sm" : "default"}
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">新建知识</span>}
          </Button>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            导航
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            分类管理
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categoryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
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