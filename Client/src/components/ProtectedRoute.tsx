import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: number[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    
    const { auth } = useAuth();

    if (!auth) {
        // Not logged in
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(auth.roleCode)) {
        // Logged in but doesn't have permission
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}