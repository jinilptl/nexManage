import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { clearAuth } from "../../Redux_Config/Slices/authSlice";

const ProtectedWrapper = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      dispatch(clearAuth());
      toast.error("Session expired. Please login again.");
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error("Invalid token in protected Wrapper:", error);
    dispatch(clearAuth());
    toast.error("Invalid token. Please login again.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedWrapper;

