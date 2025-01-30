import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAdminRoute?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAdminRoute = false,
  children,
}) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Если пользователь не авторизован
  if (!token || (!isAdminRoute && !isAdmin)) {
    return <Navigate to="/login" replace />;
  }

  // Если все проверки пройдены, отрисовываем дочерние компоненты
  return <>{children}</>;
};

export default ProtectedRoute;
