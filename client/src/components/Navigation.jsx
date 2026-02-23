import React, { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Menu,
  X,
  UserPlus,
} from "lucide-react";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import LogoutModal from "./modals/authModal/LogOutModal";
import { useSelector } from "react-redux";
import Avatar from "./common/Avatar";

export default function Navigation({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const location = useLocation();

  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuOpen &&
        (!desktopMenuRef.current || !desktopMenuRef.current.contains(event.target)) &&
        (!mobileMenuRef.current || !mobileMenuRef.current.contains(event.target))
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "super_admin" || user?.role === "admin";
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Projects", icon: FolderKanban, to: "/dashboard/projects" },
    { label: "Teams", icon: Users, to: "/dashboard/teams" },
    {
      label: "Members",
      icon: Users,
      to: "/dashboard/members",
      adminOnly: true,
    },
    { label: "Analytics", icon: BarChart3, to: "/dashboard/analytics" },
    // { label: "Notifications", icon: Bell, to: "/dashboard/notifications" },
    {
      label: "Invite Members",
      icon: UserPlus,
      to: "/dashboard/invite-members",
      adminOnly: true,
    },
    { label: "Settings", icon: Settings, to: "/dashboard/settings" },
  ];

  return (
    <>
      <div className="md:hidden  fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white border-b border-slate-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="font-semibold">NexManage</span>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="text-white hover:bg-slate-700 p-2 rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        className={`hidden md:flex fixed cursor-pointer z-2000 left-0 top-0 h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"
          }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-5 h-5" />
              </div>
              <span className="font-semibold text-base">NexManage</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-md text-white hover:bg-slate-700 ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto sidebar-scroll">
          {menuItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item, idx) => (
              <Link
                to={item.to}
                key={idx}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 ${collapsed
                  ? "justify-center"
                  : "text-slate-200 hover:bg-slate-700 hover:text-white"
                  } ${location.pathname === item.to ? "bg-slate-700 text-white" : ""}`}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            ))}
        </nav>

        <div ref={desktopMenuRef} className="relative p-2 border-t border-slate-700">
          <button
            onClick={toggleUserMenu}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700 transition-colors w-full ${collapsed ? "justify-center" : ""
              }`}
          >
            <Avatar user={user} className="w-8 h-8 text-sm text-[12px] shadow-sm border border-slate-700 font-bold" />
            {!collapsed && (
              <div className="flex-1 text-left">
                <div className="text-sm">
                  {user.name[0].toUpperCase() + user.name.slice(1)}
                </div>
                <div className="text-xs text-slate-400">{user.role}</div>
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute bottom-16 left-2 w-60 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-4 bg-slate-800/50 border-b border-slate-700/50">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5 opacity-80">{user.email}</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setLogoutModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 flex items-center gap-3 text-red-400 hover:text-red-300 transition-all group"
                >
                  <div className="p-1.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => {
            setMobileOpen(false);
            setUserMenuOpen(false);
          }}
        />
      )}

      <div
        className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-linear-to-b from-slate-900 to-slate-800 text-white z-50 flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="font-semibold">NexManage</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="text-white hover:bg-slate-700 p-2 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto sidebar-scroll">
          {menuItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors ${location.pathname === item.to ? "bg-slate-700 text-white" : ""
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
        </nav>

        <div ref={mobileMenuRef} className="relative p-2 border-t border-slate-700">
          <button
            onClick={toggleUserMenu}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700 transition-colors w-full cursor-pointer"
          >
            <Avatar user={user} className="w-8 h-8 text-sm text-[12px] shadow-sm border border-slate-700 font-bold" />
            <div className="flex-1 text-left">
              <div className="text-sm">
                {user.name[0].toUpperCase() + user.name.slice(1)}
              </div>
              <div className="text-xs text-slate-300">{user.role}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>

          {userMenuOpen && (
            <div className="absolute bottom-20 left-4 right-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-4 bg-slate-800/50 border-b border-slate-700/50">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5 opacity-80">{user.email}</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setLogoutModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 flex items-center gap-3 text-red-400 hover:text-red-300 transition-all group"
                >
                  <div className="p-1.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <LogoutModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />
    </>
  );
}
