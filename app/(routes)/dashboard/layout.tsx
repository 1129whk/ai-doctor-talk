import React from "react";
import AppHeader from "@/components/common/AppHeader";
import AppFooter from "@/components/common/AppFooter";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <div className="px-10 md:px-20 lg:px-40 py-10 flex-grow">{children}</div>
      <AppFooter />
    </div>
  );
}

export default DashboardLayout;
