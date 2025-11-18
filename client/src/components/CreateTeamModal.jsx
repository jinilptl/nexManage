import React, { useEffect } from "react";
import { X } from "lucide-react";
import { createTeamService, updateTeamService } from "../services/teamsOperations/teamsServices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateTeamModal({ open, setOpen,mode }) {
  if (!open) return null;
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const token=localStorage.getItem("token");
  const teamdata=useSelector((state)=>state.teams.selectedTeam.data)
  

  
  
  const [inputData, setInputData] = React.useState({
    teamName: "",
    description: "",
  });

  useEffect(()=>{
    if(mode==="update" && teamdata){
      setInputData({
        teamName:teamdata?.teamName,
        description:teamdata?.description
      })
    }
  },[mode,teamdata])

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("input data is ---> ", inputData);
    
    if(mode==="update"){
      // Dispatch update team action here
      dispatch( updateTeamService(teamdata._id,inputData,token,setOpen)
)
    }
    else{
      dispatch(createTeamService(inputData,token,setOpen))
    }
    setInputData({
      teamName: "",
      description: "",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop:blur-none">
      {/* Background blur overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-white w-[90%] sm:w-[420px] rounded-lg shadow-lg p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
           {mode === "update" ? "Update Team" : "Create New Team"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-gray-700">Team Name</label>
            <input
              type="text"
              value={inputData.teamName}
              onChange={handleOnChange}
               
              name="teamName"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none"
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Description</label>
            <textarea
            value={inputData.description}
            onChange={handleOnChange} 
            name="description"
            
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none"
              placeholder="Short team description"
              rows="3"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm rounded-md border bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>

            <button type="submit"  className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
              {mode === "update" ? "Update Team" : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
