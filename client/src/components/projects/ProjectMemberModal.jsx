import React, { useEffect, useState } from "react";
import { X, Mail, UserCog } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addProjectMemberService, updateProjectMemberService } from "../../services/projectsOperations/projectsServices";

export default function ProjectMemberModal({
  open,
  onClose,
  mode = "add", 
  onSubmit,
  member = null, 
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("contributor");
  const projectId=useSelector((state)=>state.projects.selectedProject.id)
  const { token } = useSelector((state) => state.auth);
  const dispatch=useDispatch()

  

  
  useEffect(()=>{
    if(mode==="edit" &&member){
        setEmail(member.user?.email||"");
        setRole(member.roleInProject||"contributor")
    }else{
        setEmail("")
        setRole("contributor")
    }
  },[mode,member])
  


  if (!open) return null;

  const roleOptions = [
    "project-manager",
    "developer",
    "tester",
    "designer",
    "qa",
    "reviewer",
    "contributor",
  ];

  const handleSubmit = () => {
    if (mode === "add" && !email.trim()) {
      return toast.error("Please enter email");
    }

  
    console.log("member data is ---> ",email,role);
   if(mode==="add"){
     dispatch(addProjectMemberService(projectId,{email,roleInProject:role},token,onClose))
   }else{
    dispatch(updateProjectMemberService(projectId,member.user._id,{email,roleInProject:role},token,onClose))
   }
    
    
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative animate-slideUp">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {mode === "add" ? "Add Member" : "Update Member"}
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          {mode === "add"
            ? "Enter member details to add them to this project."
            : "Modify the member’s role in the project."}
        </p>

        <div className="space-y-5">

          {/* EMAIL FIELD — Only in Add Mode */}
          {mode === "add" && (
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter user email"
                  className="w-full pl-10 pr-3 py-2 rounded-md shadow-sm border border-gray-300 focus:ring-2 ring-blue-500 outline-none text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* EMAIL DISPLAY (Disabled in Edit Mode) */}
          {mode === "edit" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email (cannot change)
              </label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  disabled
                  value={email}
                  className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* ROLE SELECT FIELD */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <UserCog className="w-4 h-4" /> Role
            </label>
            <select
              className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 shadow-sm text-sm focus:ring-2 ring-blue-500 outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/-/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            {mode === "add" ? "Add Member" : "Update Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
