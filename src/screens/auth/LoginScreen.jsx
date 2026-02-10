import React, { useState } from "react";
import { Form, Button, Grid } from "antd";
import { LogIn } from "lucide-react";
import { useNotification } from "../../components/notification/NotificationProvider";
import FormInput from "../../components/inputs/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useApi } from "../../hooks/useApi";

const { useBreakpoint } = Grid;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { md } = useBreakpoint();
  const isMobile = !md;
  const { notify } = useNotification();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Hook useApi para el endpoint de login
  const { postData } = useApi("/auth/login", {}, false);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const data = await postData(values, false);

      console.log("Respuesta completa del API:", data);

      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        id_empresa: data.id_empresa,
      };

      console.log("userData construido:", userData);

      // Primero hacer login
      login(userData, data.token);

      notify({
        type: "success",
        title: "Inicio de sesión exitoso",
        description: `Bienvenido ${userData.name}`,
      });

      // Luego redirigir según el rol
      const roleRoutes = {
        admin: "/admin/dashboard",
        propietario: "/propietario/dashboard",
        estudiante: "/estudiante/dashboard",
      };

      setTimeout(() => {
        navigate(roleRoutes[userData.role] || "/login");
      });
    } catch (error) {
      console.error("Error:", error);
      notify({
        type: "error",
        title: "Error al iniciar sesión",
        description: error.message || "Credenciales incorrectas",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-800 p-4 md:p-6 flex items-center justify-center">
      <div
        className={`w-full dark:bg-zinc-900 bg-white rounded-2xl overflow-hidden shadow-xl flex min-h-0
          ${isMobile ? "max-w-full flex-col" : "max-w-250 flex-row min-h-150"}`}>
        {md && (
          <div className="flex-[1.2] relative min-h-75 md:min-h-0">
            <img
              src="https://th.bing.com/th/id/OIG1.1S9SKh9A4xQsCUjoHW5M?pid=ImgDetMain&o=7&rm=3"
              alt="Login visual"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className={`flex-1 flex flex-col justify-center ${isMobile ? "p-8" : "p-12"}`}>
          <div className="text-center mb-8">
            <h1
              className={`font-bold text-black dark:text-white mb-2 ${isMobile ? "text-2xl" : "text-3xl"}`}>
              Inicio de sesión
            </h1>
            <p className="text-slate-500 dark:text-gray-300">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          <Form onFinish={handleSubmit} layout="vertical">
            <FormInput
              name="email"
              label="Correo electrónico"
              placeholder="ejemplo@gmail.com"
              rules={[
                { required: true, message: "Ingresa tu correo" },
                { type: "email", message: "Correo no válido" },
              ]}
              inputProps={{
                size: "large",
              }}
            />
            <FormInput
              name="password"
              label="Contraseña"
              placeholder="••••••••"
              rules={[{ required: true, message: "Ingresa tu contraseña" }]}
              formItemProps={{
                style: { marginBottom: 8 },
              }}
              inputProps={{
                type: "password",
                size: "large",
              }}
            />
            <div className="text-right mb-6">
              <Link
                to="/forgot-password"
                className="text-lime-600! font-medium! hover:text-lime-700!">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<LogIn size={18} />}
                className="bg-lime-500! border-none! h-12! font-semibold! hover:bg-lime-600!">
                Ingresar
              </Button>
            </Form.Item>
            <div className="text-center mt-4">
              <p className="m-0">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-lime-600! font-semibold! hover:text-lime-700!">
                  Regístrate
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}