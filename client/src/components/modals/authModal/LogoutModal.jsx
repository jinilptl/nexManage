import { LogOut, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutService } from "../../../services/authOperations/authServices";
import useScrollLock from "../../../hooks/useScrollLock";

export default function LogoutModal({ open, onClose }) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useScrollLock(open);

  const handleLogout = () => {
    dispatch(logoutService(token, navigate));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-slate-500 to-gray-700" />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <LogOut size={19} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-gray-900">Sign Out</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Are you sure you want to sign out? You'll need to log in again to access your account.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Stay Signed In
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-gray-300"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
