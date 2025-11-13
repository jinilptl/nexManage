
import { Outlet } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
     const [mobileOpen, setMobileOpen] = useState(false);
     useEffect(()=>{
      console.log("collaps is --> ", collapsed);

      console.log("is mobile open value --> ", mobileOpen);
      
      
     },[collapsed,mobileOpen])
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Navigation collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content */}
      <div className={`flex-1 ${mobileOpen ? "ml-0" : collapsed ? "md:ml-20" : "md:ml-64"} transition-all duration-300`}>
        <div className="pt-16 md:pt-0 px-4 md:px-8 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
