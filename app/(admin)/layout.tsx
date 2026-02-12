import type { ReactNode } from "react";
import { cookies } from "next/headers"; // Import cookies helper
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AdminAuthForm } from "@/components/elements/blocks/AdminAuth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 1. Retrieve the cookies
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get("adminauth");
  const sessionHash = cookieStore.get("adminsessionhash");

  // 2. Logic: Check if cookies exist and the hash matches your expected value
  // Note: Replace 'your_expected_sha256_hash' with your actual logic or env variable
  const isAuthenticated = adminAuth && sessionHash?.value === "b59a0c49e1e81df1810413beb101b0eb02065612d6a86e36f622a113b334ac4b";

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <AdminAuthForm />
      </div>
    );
  }

  // 3. Authenticated Layout
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-5">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}