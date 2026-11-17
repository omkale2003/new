import { useState } from "react";
import { Outlet } from "react-router-dom";
import ActivityProviderSidebar from "./components/ActivityProviderSidebar.jsx";
import ActivityProviderHeader from "./components/ActivityProviderHeader.jsx";
import ActivityMobileSidebar from "./components/ActivityMobileSidebar.jsx";

export function ActivityProviderLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <ActivityProviderSidebar />

      <ActivityMobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <ActivityProviderHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1440px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ActivityProviderLayout;

