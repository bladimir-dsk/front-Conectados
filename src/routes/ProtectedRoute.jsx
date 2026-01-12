import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Si requiere un rol específico y el usuario no lo tiene
    if (requiredRole && user?.role !== requiredRole) {
        // Redirigir según el rol del usuario
        let redirectPath;
        
        switch (user?.role) {
            case 'admin':
                redirectPath = '/admin/dashboard';
                break;
            case 'propietario':
                redirectPath = '/propietario/dashboard';
                break;
            case 'estudiante':
                redirectPath = '/estudiante/dashboard';
                break;
            default:
                redirectPath = '/';
        }
        
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};