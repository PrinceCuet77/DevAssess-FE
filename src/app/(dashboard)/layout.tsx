import ThemeToggle from '@/components/shared/theme-toggle';
import UserNav from '@/components/shared/user-nav';
import AuthGuard from '@/components/auth/auth-guard';
import AppSidebar from '@/components/layout/dashboard/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className='sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <SidebarTrigger />
            <div className='flex items-center gap-2'>
              <ThemeToggle />
              <UserNav />
            </div>
          </header>

          <main className='flex flex-1 flex-col'>
            <AuthGuard>{children}</AuthGuard>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
