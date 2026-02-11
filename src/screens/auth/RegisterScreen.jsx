import React, { useState } from "react";
import { Form, Button, Grid } from "antd";
import { UserPlus } from "lucide-react";
import { useNotification } from "../../components/notification/NotificationProvider";
import FormInput from "../../components/inputs/FormInput";
import { useNavigate, Link } from "react-router-dom";

const { useBreakpoint } = Grid;

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const { md } = useBreakpoint();
  const isMobile = !md;
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      notify({
        type: "error",
        title: "Error de validación",
        description: "Las contraseñas no coinciden",
      });
      return;
    }

    const userData = {
      name: `${values.names} ${values.firstLastName}`,
      firstName: values.firstLastName,
      middleName: values.secondLastName || "",
      email: values.email,
      password: values.password,
      code: values.code,
      phone: values.phone,
    };

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(userData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        notify({
          type: "success",
          title: "Registro exitoso",
          description: data.message || "Tu cuenta ha sido creada correctamente",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        notify({
          type: "error",
          title: "Error en el registro",
          description:
            data.message || `Error ${response.status}: ${response.statusText}`,
        });
      }
    } catch (error) {
      notify({
        type: "warning",
        title: "Error de conexión",
        description: error.message || "No se pudo conectar con el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-800 p-4 md:p-6 flex items-center justify-center">
      <div
        className={`w-full dark:bg-zinc-900 bg-white rounded-2xl overflow-hidden shadow-xl flex
          ${isMobile ? "max-w-full flex-col" : "max-w-240 flex-row min-h-140"}`}
      >
        {/* Formulario */}
        <div
          className={`flex-1 flex flex-col justify-center ${isMobile ? "p-6" : "px-10 py-8"}`}
        >
          <div className="text-center mb-4">
            <h1
              className={`font-bold text-black dark:text-white mb-1 ${isMobile ? "text-2xl" : "text-3xl"}`}
            >
              Crear cuenta
            </h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Completa el formulario para registrarte
            </p>
          </div>

          <Form
            onFinish={handleSubmit}
            layout="vertical"
            size="middle"
            className="[&_.ant-form-item]:mb-2!"
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <FormInput
                  name="firstLastName"
                  label="Primer apellido"
                  placeholder="González"
                  rules={[
                    { required: true, message: "Ingresa tu primer apellido" },
                    {
                      pattern: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/,
                      message: "Solo se permiten letras",
                    },
                  ]}
                />
              </div>
              <div className="flex-1">
                <FormInput
                  name="secondLastName"
                  label="Segundo apellido"
                  placeholder="Pérez"
                  rules={[
                    {
                      pattern: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/,
                      message: "Solo se permiten letras",
                    },
                  ]}
                />
              </div>
            </div>

            <FormInput
              name="names"
              label="Nombres"
              placeholder="Juan Carlos"
              rules={[
                { required: true, message: "Ingresa tus nombres" },
                {
                  pattern: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/,
                  message: "Solo se permiten letras",
                },
              ]}
            />

            <FormInput
              name="email"
              label="Correo electrónico"
              placeholder="juan.gonzalez@gmail.com"
              rules={[
                { required: true, message: "Ingresa tu email" },
                { type: "email", message: "Email no válido" },
              ]}
            />

            <div className="flex gap-3">
              <div className="flex-1">
                <FormInput
                  name="code"
                  label="Código"
                  placeholder="99"
                  rules={[
                    { required: true, message: "Ingresa tu código" },
                    { pattern: /^\d{2}$/, message: "2 dígitos" },
                  ]}
                  inputProps={{ maxLength: 2 }}
                />
              </div>
              <div className="flex-1">
                <FormInput
                  name="phone"
                  label="Teléfono"
                  placeholder="9991234567"
                  rules={[
                    { required: true, message: "Ingresa tu teléfono" },
                    { pattern: /^\d+$/, message: "Solo números" },
                    { len: 10, message: "Debe tener 10 dígitos" },
                  ]}
                  inputProps={{ maxLength: 10 }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <FormInput
                  name="password"
                  label="Contraseña"
                  placeholder="••••••••"
                  rules={[
                    { required: true, message: "Ingresa tu contraseña" },
                    { min: 6, message: "Mínimo 6 caracteres" },
                  ]}
                  inputProps={{ type: "password" }}
                />
              </div>
              <div className="flex-1">
                <FormInput
                  name="confirmPassword"
                  label="Confirmar contraseña"
                  placeholder="••••••••"
                  rules={[
                    { required: true, message: "Confirma tu contraseña" },
                  ]}
                  inputProps={{ type: "password" }}
                />
              </div>
            </div>

            <Form.Item className="mt-4! mb-0!">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<UserPlus size={16} />}
                className="bg-lime-500! border-none! h-10! font-semibold! hover:bg-lime-600!"
              >
                Registrarse
              </Button>
            </Form.Item>

            <div className="text-center text-gra-500 pt-4 border-t border-slate-200 dark:border-gray-500 mt-4">
              <p className="m-0 text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-lime-600! font-semibold! hover:text-lime-700!"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </Form>
        </div>

        {/* Imagen */}
        {md && (
          <div className="flex-[1.1] relative">
            <img
              src="https://th.bing.com/th/id/OIG1.1S9SKh9A4xQsCUjoHW5M?pid=ImgDetMain&o=7&rm=3"
              alt="Registro visual"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
