import axios from "axios";

// Configuración de la instancia de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  // ❌ NO establecer Content-Type aquí - lo manejamos en el interceptor
  // headers: {
  //     'Content-Type': 'application/json',
  // },
});

// Interceptor de peticiones - AGREGAR TOKEN AUTOMÁTICAMENTE
api.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No hay token en localStorage");
    }

    // 🔑 CLAVE: Solo establecer Content-Type si NO es FormData
    // Si es FormData, Axios automáticamente establecerá:
    // Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    // Si ES FormData, no tocamos el Content-Type y Axios lo maneja

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      // Limpiar localStorage y redirigir al login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirigir al login (ajusta la ruta según tu app)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
