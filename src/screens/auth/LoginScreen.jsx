import React, { useState } from "react";
import { Form, Button, Grid } from "antd";
import { Mail, Lock, LogIn } from "lucide-react";
import { useNotification } from "../../components/notification/NotificationProvider";
import FormInput from "../../components/inputs/FormInput";

const { useBreakpoint } = Grid;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { md } = useBreakpoint();
  const isMobile = !md;
  const { notify } = useNotification();

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        notify({
          type: "success",
          title: "Inicio de sesión exitoso",
          description: "Bienvenido, redirigiendo al dashboard...",
        });

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1200);
      } else {
        notify({
          type: "error",
          title: "Error al iniciar sesión",
          description: data.message || "Credenciales incorrectas",
        });
      }
    } catch {
      notify({
        type: "warning",
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Intenta nuevamente.",
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
          maxWidth: isMobile ? "100%" : 1000,
          background: "white",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          minHeight: isMobile ? "auto" : 600,
        }}
      >
        {md && (
          <div style={{ flex: 1.2, position: "relative" }}>
            <img
              src="https://th.bing.com/th/id/OIG1.1S9SKh9A4xQsCUjoHW5M?pid=ImgDetMain&o=7&rm=3"
              alt="Login visual"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <div
          style={{
            flex: 1,
            padding: isMobile ? 32 : 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: "bold" }}>
              Inicio de sesión
            </h1>
            <p style={{ color: "#64748b" }}>
              Ingresa tus credenciales para acceder
            </p>
          </div>

          <Form onFinish={handleSubmit} layout="vertical">
            <FormInput
              name="email"
              label="Correo electrónico"
              placeholder="john.doe@gmail.com"
              rules={[
                { required: true, message: "Ingresa tu email" },
                { type: "email", message: "Email no válido" },
              ]}
              inputProps={{
                size: "large",
                prefix: <Mail size={18} style={{ color: "#84cc16" }} />,
              }}
            />

            <FormInput
              name="password"
              label="Contraseña"
              placeholder="••••••••"
              rules={[{ required: true, message: "Ingresa tu contraseña" }]}
              inputProps={{
                type: "password",
                size: "large",
                prefix: <Lock size={18} style={{ color: "#84cc16" }} />,
              }}
            />

            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <a
                href="/forgot-password"
                style={{ color: "#65a30d", fontWeight: 500 }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              icon={<LogIn size={18} />}
              style={{
                background: "#84cc16",
                border: "none",
                height: 48,
                fontWeight: 600,
              }}
            >
              Ingresar
            </Button>

            <div
              style={{
                textAlign: "center",
                color: "#64748b",
                paddingTop: 20,
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <p style={{ margin: 0 }}>
                ¿No tienes una cuenta?{" "}
                <a
                  href="/register"
                  style={{ color: "#65a30d", fontWeight: 600 }}
                >
                  Regístrate
                </a>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
