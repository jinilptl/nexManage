import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedWrapper = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  console.log("token is ", token);
  if (!token) {
    toast.error("Please login to access this page");

    return <Navigate to="/" replace />;
  }

  // we decode the token and check for expiry
  try {
    const decodedToken = jwtDecode(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      toast.error("Session expired. Please login again.");
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error("Invalid token in protected Wrapper:", error);
    toast.error("Invalid token. Please login again.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedWrapper;
