import React, { useEffect } from "react";

export default function NexManageLoader() {

  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div
      className="
        fixed top-0 left-0 
        w-screen h-screen 
        flex flex-col items-center justify-center
        bg-linear-to-br from-slate-900 via-slate-800 to-slate-900
        text-white 
        z-99999 
        animate-fadeIn
        pointer-events-auto
        
        
      "
    >

      {/* Animated Circle */}
      <div className="
        w-20 h-20 mb-6 
        rounded-full 
        border-4 border-slate-600 border-t-blue-500 
        animate-spin-slow shadow-lg
      "></div>

      {/* Logo Text */}
      <h1 className="text-2xl font-semibold tracking-wide flex items-center gap-2">
        <span className="animate-pulse text-blue-400">●</span>
        <span className="loaderText">NexManage</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-slate-300 text-sm animate-fadeInSlow">
        Loading your workspace...
      </p>
    </div>
  );
}
