import React from "react";

export default function ModalSmallLoader() {
  return (
    <div className="w-full flex justify-center py-3 ">
      <div className="flex items-center gap-2">

        {/* Small Spinner */}
        <div className="
          w-4 h-4 
          border-2 border-blue-500 border-t-transparent 
          rounded-full 
          animate-spin
        "></div>

        <span className="text-sm font-medium text-gray-600 tracking-wide">
          Loading…
        </span>
      </div>
    </div>
  );
}
