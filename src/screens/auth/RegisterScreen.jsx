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
        }
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
    <div
      style={{
        minHeight: "100vh",
        background: "#f7fee7",
        padding: isMobile ? 16 : 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 1100,
          background: "white",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          minHeight: isMobile ? "auto" : 650,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: isMobile ? 32 : 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h1
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: "bold",
                color: "#1a2e05",
                marginBottom: 8,
              }}
            >
              Crear cuenta
            </h1>
            <p style={{ color: "#64748b" }}>
              Completa el formulario para registrarte
            </p>
          </div>

          <Form onFinish={handleSubmit} layout="vertical">
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
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
                  inputProps={{
                    size: "large",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
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
                  inputProps={{
                    size: "large",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
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
                inputProps={{
                  size: "large",
                }}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <FormInput
                name="email"
                label="Correo electrónico"
                placeholder="juan.gonzalez@gmail.com"
                rules={[
                  { required: true, message: "Ingresa tu email" },
                  { type: "email", message: "Email no válido" },
                ]}
                inputProps={{
                  size: "large",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <FormInput
                  name="phone"
                  label="Teléfono"
                  placeholder="9991234567"
                  rules={[
                    { required: true, message: "Ingresa tu teléfono" },
                    {
                      pattern: /^\d+$/,
                      message: "Solo se permiten números",
                    },
                    {
                      len: 10,
                      message: "Debe tener exactamente 10 dígitos",
                    },
                  ]}
                  inputProps={{
                    size: "large",
                    maxLength: 10,
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormInput
                  name="code"
                  label="Código"
                  placeholder="99"
                  rules={[
                    { required: true, message: "Ingresa tu código" },
                    {
                      pattern: /^\d{2}$/,
                      message: "Debe tener exactamente 2 dígitos",
                    },
                  ]}
                  inputProps={{
                    size: "large",
                    maxLength: 2,
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <FormInput
                  name="password"
                  label="Contraseña"
                  placeholder="••••••••"
                  rules={[
                    { required: true, message: "Ingresa tu contraseña" },
                    { min: 6, message: "Mínimo 6 caracteres" },
                  ]}
                  inputProps={{
                    type: "password",
                    size: "large",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormInput
                  name="confirmPassword"
                  label="Confirmar contraseña"
                  placeholder="••••••••"
                  rules={[
                    { required: true, message: "Confirma tu contraseña" },
                  ]}
                  inputProps={{
                    type: "password",
                    size: "large",
                  }}
                />
              </div>
            </div>

            <Form.Item style={{ marginTop: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<UserPlus size={18} />}
                style={{
                  background: "#84cc16",
                  border: "none",
                  height: 48,
                  fontWeight: 600,
                }}
              >
                Registrarse
              </Button>
            </Form.Item>

            <div
              style={{
                textAlign: "center",
                color: "#64748b",
                paddingTop: 20,
                borderTop: "1px solid #e2e8f0",
                marginTop: 20,
              }}
            >
              <p style={{ margin: 0 }}>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" style={{ color: "#65a30d", fontWeight: 600 }}>
                  Inicia sesión
                </Link>
              </p>
            </div>
          </Form>
        </div>

        {md && (
          <div
            style={{
              flex: 1.2,
              position: "relative",
              minHeight: isMobile ? 300 : "auto",
            }}
          >
            <img
              src="https://th.bing.com/th/id/OIG1.1S9SKh9A4xQsCUjoHW5M?pid=ImgDetMain&o=7&rm=3"
              alt="Registro visual"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
