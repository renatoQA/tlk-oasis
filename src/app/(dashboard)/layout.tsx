import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/layout/sidebar";
import { Topnav } from "@/components/layout/topnav";
import { SidebarProvider } from "@/components/layout/sidebar-provider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { photoUrl: true },
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar role={session.user.role} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topnav name={session.user.name} role={session.user.role} photoUrl={user?.photoUrl} />
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
