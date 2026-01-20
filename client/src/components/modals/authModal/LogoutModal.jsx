import { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutService } from "../../../services/authOperations/authServices";

export default function LogoutModal({ open, onClose }) {
  if (!open) return null;
  const token = useSelector((state)=>state.auth.token);

  const dispatch = useDispatch();
  const navigate=useNavigate();
   const handleLogout = ()=>{
    //
    dispatch(logoutService(token , navigate))
   }
  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-sm shadow-xl">

        <h2 className="text-lg font-semibold text-gray-800">
          Are you sure you want to logout?
        </h2>

        <p className="text-gray-500 mt-1 text-sm">
          You will need to log in again next time.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
