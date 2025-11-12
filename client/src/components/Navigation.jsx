import React, { useState } from "react";
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
} from "lucide-react";

export default function Navigation({collapsed,setCollapsed}) {
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Projects", icon: FolderKanban },
    { label: "Teams", icon: Users },
    { label: "Analytics", icon: BarChart3 },
    { label: "Notifications", icon: Bell },
    { label: "Settings", icon: Settings },
  ];

  return (
    <>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white border-b border-slate-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="font-semibold">NexManage</span>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="text-white hover:bg-slate-700 p-2 rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>



      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex fixed left-0 top-0 h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header */}
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
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-md text-white hover:bg-slate-700 ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 ${
                collapsed
                  ? "justify-center"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="relative p-2 border-t border-slate-700">
          <button
            onClick={toggleUserMenu}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700 transition-colors w-full ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
              J
            </div>
            {!collapsed && (
              <div className="flex-1 text-left">
                <div className="text-sm">Jinil Patel</div>
                <div className="text-xs text-slate-400">Admin</div>
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute bottom-14 left-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg text-sm animate-fadeIn">
              <div className="px-4 py-2 font-semibold border-b border-slate-700">
                My Account
              </div>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <div className="border-t border-slate-700" />
              <button className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2 text-red-500">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => {
            setMobileOpen(false);
            setUserMenuOpen(false);
          }}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-linear-to-b from-slate-900 to-slate-800 text-white z-50 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="font-semibold">NexManage</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white hover:bg-slate-700 p-2 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Nav */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Drawer User Section */}
        <div className="relative p-2 border-t border-slate-700">
          <button
            onClick={toggleUserMenu}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700 transition-colors w-full"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
              J
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm">Jinil Patel</div>
              <div className="text-xs text-slate-400">Admin</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown inside Drawer */}
          {userMenuOpen &&(
            <div className="absolute bottom-14 left-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg text-sm animate-fadeIn">
              <div className={`px-4  py-2 font-semibold border-b border-slate-700`}>
                My Account
              </div>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile 
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <div className="border-t border-slate-700" />
              <button className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2 text-red-500">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}


         
          
        </div>
      </div>
    </>
  );
}
