import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutService } from "../../../services/authOperations/authServices";

export default function LogoutModal({ open, onClose }) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
      return () => document.body.classList.remove("modal-open");
    }
  }, [open]);

  const handleLogout = () => {
    dispatch(logoutService(token, navigate));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-sm modal-content-enter">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Are you sure you want to logout?
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          You will need to log in again next time.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
