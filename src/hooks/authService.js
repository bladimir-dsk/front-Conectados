import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token a las peticiones
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginAPI = async (email, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email,
            pwdPassword: password,
        });

        const { token, email: userEmail, role, nombre, id_empresa, id } = response.data;

        // Guardar token en localStorage
        localStorage.setItem('token', token);

        return {
            success: true,
            user: {
                id,
                name: nombre,
                email: userEmail,
                role,
                id_empresa,
            },
            token,
        };
    } catch (error) {
        // Manejo de errores específicos
        if (error.response) {
            // El servidor respondió con un código de error
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data?.error;

            if (status === 401) {
                return {
                    success: false,
                    message: message || 'Credenciales incorrectas',
                };
            } else if (status === 404) {
                return {
                    success: false,
                    message: 'Usuario no encontrado',
                };
            } else if (status === 400) {
                return {
                    success: false,
                    message: message || 'Datos inválidos',
                };
            } else {
                return {
                    success: false,
                    message: message || 'Error en el servidor',
                };
            }
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta
            return {
                success: false,
                message: 'No se pudo conectar con el servidor',
            };
        } else {
            // Error al configurar la petición
            return {
                success: false,
                message: 'Error al realizar la petición',
            };
        }
    }
};

/**
 * Cierra la sesión del usuario
 */
export const logoutAPI = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions-storage');
};

export default axiosInstance;