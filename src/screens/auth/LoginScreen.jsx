import { useState } from "react";
import { Form, Button, Grid } from "antd";
import { Building2, Home, LogIn, Phone } from "lucide-react";
import { useNotification } from "../../components/notification/NotificationProvider";
import FormInput from "../../components/inputs/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useApi } from "../../hooks/useApi";
import image from "/login.webp";
import logo from "/LogoPrincipal-Horizontal.webp";
import PrivacyPolicyModal from "./modals/PrivacyPolicyModal";

const { useBreakpoint } = Grid;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { md } = useBreakpoint();
  const isMobile = !md;
  const { notify } = useNotification();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Hook useApi para el endpoint de login
  const { postData } = useApi("/auth/login", {}, false);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const data = await postData(values, false);

      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        id_empresa: data.id_empresa,
      };

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
        propietario: "/propietario/alojamientos",
        estudiante: "/estudiante/dashboard",
      };

      setTimeout(() => {
        navigate(roleRoutes[userData.role] || "/login");
      });
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "Credenciales incorrectas";

      notify({
        type: "error",
        description: backendMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-800 p-4 md:p-6 flex items-center justify-center">
      <div
        className={`w-full dark:bg-zinc-900 bg-white rounded-2xl overflow-hidden shadow-xl flex min-h-0
          ${isMobile ? "max-w-full flex-col" : "max-w-250 flex-row min-h-150"}`}
      >
        {md && (
          <div
            className="flex-[1.2] relative flex items-center justify-center
  bg-linear-to-br from-lime-400 via-lime-500 to-green-600 overflow-hidden"
          >
            <Home className="absolute top-10 left-10 w-16 h-16 text-white/10" />
            <Phone className="absolute bottom-10 right-10 w-16 h-16 text-white/10" />
            <Building2 className="absolute top-1/2 left-20 w-20 h-20 text-white/10" />

            <div className="absolute w-72 h-72 bg-white/10 blur-3xl rounded-full" />

            <div className="relative flex flex-col items-center text-center px-6">
              <img src={logo} alt="Logo" className="w-56 mb-6 drop-shadow-md" />

              <img
                src={image}
                className="max-w-[95%] object-contain
    drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)] mb-6"
              />

              <h2 className="text-white text-2xl font-bold mb-2">
                Encuentra tu alojamiento ideal
              </h2>

              <p className="text-white/80 text-sm max-w-xs">
                Plataforma diseñada para estudiantes que buscan un lugar cómodo,
                seguro y cercano a su universidad.
              </p>
            </div>
          </div>
        )}

        <div
          className={`flex-1 flex flex-col justify-center ${isMobile ? "p-8" : "p-12"}`}
        >
          <div className="text-center mb-8">
            <h1
              className={`font-bold text-black dark:text-white mb-2 ${isMobile ? "text-2xl" : "text-3xl"}`}
            >
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
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<LogIn size={18} />}
                className="bg-lime-500! border-none! h-12! font-semibold! hover:bg-lime-600!"
              >
                Ingresar
              </Button>
            </Form.Item>
            <div className="text-center mt-4">
              <p className="m-0">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-lime-600! font-semibold! hover:text-lime-700!"
                >
                  Regístrate
                </Link>
              </p>
              <p className="m-0 mt-2">
                <button
                  type="button"
                  onClick={() => setPrivacyModalOpen(true)}
                  className="text-slate-400 dark:text-gray-500 text-xs hover:text-lime-600! dark:hover:text-lime-400! underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-0"
                >
                  Política de privacidad
                </button>
              </p>
            </div>
          </Form>
        </div>
      </div>
      <PrivacyPolicyModal
        visible={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
    </div>
  );
}
