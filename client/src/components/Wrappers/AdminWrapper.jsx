import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminWrapper = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "super_admin") {
    toast.error("You are not authorized to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminWrapper;
