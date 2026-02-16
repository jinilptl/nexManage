import React from "react";

const DashboardHearderCard = ({ heading, mainIcon, data, text, textColor }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm  ">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">{heading}</h3>
        {mainIcon}
      </div>
      <div className="mt-3 text-2xl font-semibold text-gray-900">
        {typeof data === "number" || typeof data === "string"
          ? data
          : Array.isArray(data)
            ? data.length
            : (data?.count ?? 0)}
      </div>

      {/* <p className={`text-xs ${textColor} mt-1 flex items-center gap-1`}>
            {text}
          </p> */}
    </div>
  );
};

export default DashboardHearderCard;
