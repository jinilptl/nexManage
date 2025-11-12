
import { Outlet } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { useState } from "react";

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Navigation collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 ${collapsed ? "ml-20" : "ml-64"} transition-all duration-300 border`}>
        <div className="pt-16 md:pt-0 px-4 md:px-8 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
