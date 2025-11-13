import React from 'react'

const DashboardHearderCard = ({heading,mainIcon,data,text,textColor}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm  ">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-600">{heading}</h4>
            {mainIcon}
          </div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">
            {data}
          </div>
          <p className={`text-xs ${textColor} mt-1 flex items-center gap-1`}>
            {text}
          </p>
        </div>
  )
}

export default DashboardHearderCard