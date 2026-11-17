import { Navigate, Outlet, useLocation } from "react-router-dom";
import useActivityAuth from "../hooks/useActivityAuth.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

export function ActivityProtectedRoute() {
  const { isAuthenticated, status } = useActivityAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ACTIVITY_PROVIDER_ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}

export default ActivityProtectedRoute;

