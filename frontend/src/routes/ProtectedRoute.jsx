import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  if (!token) return <Navigate to="/login" replace />;

  let role = null;
  if (userString) {
    try {
      const userObj = JSON.parse(userString);
      role = userObj.role;
    } catch (error) {
      console.error("Failed to parse user from local storage:", error);
    }
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
