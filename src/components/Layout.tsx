import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 flex items-center border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-4 px-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-foreground hidden sm:block">知识库管理系统</h1>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}