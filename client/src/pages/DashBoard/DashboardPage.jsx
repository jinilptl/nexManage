import { Outlet } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfileService } from "../../services/authOperations/authServices";

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Dashboard | NexManage";
  }, []);

  const token =
    useSelector((state) => state.auth.token) ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(getMyProfileService(token));
    }
  }, [token, dispatch]);

  return (
    <div className="min-h-screen w-full flex bg-gray-50 overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
      >
        Skip to main content
      </a>

      <Navigation
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <main
        id="main-content"
        className={`flex-1 min-w-0 ${mobileOpen ? "ml-0" : collapsed ? "md:ml-20" : "md:ml-64"} transition-all duration-300`}
      >
        <div className="pt-16 md:pt-0 px-4 md:px-8 py-6 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
