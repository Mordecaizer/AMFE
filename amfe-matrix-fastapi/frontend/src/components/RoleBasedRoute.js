import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RoleBasedRoute = ({ component: Component, allowedRoles, exact, path, ...rest }) => {
    const { user } = useContext(AuthContext);

    console.log('🔍 RoleBasedRoute - Debug:', {
        path,
        hasUser: !!user,
        hasToken: !!user?.token,
        userRole: user?.user?.role,
        allowedRoles
    });

    return (
        <Route
            exact={exact}
            path={path}
            {...rest}
            render={props => {
                // Verificar si el usuario está autenticado
                if (!user || !user.token) {
                    console.log('🚫 No autenticado, redirigiendo a login');
                    return <Redirect to="/login" />;
                }

                // Verificar roles si se especifican
                if (allowedRoles && user.user && !allowedRoles.includes(user.user.role)) {
                    console.log('🚫 Rol no autorizado, redirigiendo');
                    return <Redirect to="/matrices" />;
                }

                console.log('✅ Acceso autorizado');
                return <Component {...props} />;
            }}
        />
    );
};

export default RoleBasedRoute;