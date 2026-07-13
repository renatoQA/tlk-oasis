import { requireSession } from "@/lib/session";
import { Sidebar } from "@/components/layout/sidebar";
import { Topnav } from "@/components/layout/topnav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.user.role} />
      <div className="flex flex-1 flex-col">
        <Topnav name={session.user.name} role={session.user.role} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
