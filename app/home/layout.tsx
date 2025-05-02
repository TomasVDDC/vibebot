import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import PagePrimaryBar from "@/components/PagePrimaryBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col w-full">
        <PagePrimaryBar />
        {children}
      </main>
    </SidebarProvider>
  );
}
