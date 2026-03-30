import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell() {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[18rem_1fr]">
        <Sidebar />
        <main className="space-y-4">
          <Topbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
