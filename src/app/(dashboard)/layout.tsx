import { requireSession } from "@/lib/session";
import { Sidebar } from "@/components/layout/sidebar";
import { Topnav } from "@/components/layout/topnav";
import { SidebarProvider } from "@/components/layout/sidebar-provider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar role={session.user.role} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topnav name={session.user.name} role={session.user.role} />
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
