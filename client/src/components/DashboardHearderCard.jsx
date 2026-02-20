import React from "react";

const DashboardHearderCard = ({
  heading,
  mainIcon,
  data,
  text,
  textColor,
  bgColor,
}) => {
  return (
    <div className={`${bgColor} rounded-xl p-4 shadow-sm text-white`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/90">{heading}</h3>
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
          {mainIcon}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-white">
          {typeof data === "number" || typeof data === "string"
            ? data
            : Array.isArray(data)
              ? data.length
              : (data?.count ?? 0)}
        </div>
        <p className="text-xs text-white/80 mt-1 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default DashboardHearderCard;
