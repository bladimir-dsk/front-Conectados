import React, { useState } from "react";
import { Form, Input, Button, Grid, Alert } from "antd";
import { Mail, Lock, LogIn } from "lucide-react";

const { useBreakpoint } = Grid;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { md } = useBreakpoint();
  const isMobile = !md;
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  const handleSubmit = async (values) => {
    setLoading(true);
    setShowAlert(false);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setAlertType("error");
        setAlertMessage("Error del servidor");
        setAlertDescription(data.message || "No se pudo iniciar sesión");
        setShowAlert(true);
      }
    } catch {
      setAlertType("warning");
      setAlertMessage("Error de conexión");
      setAlertDescription(
        "No se pudo conectar con el servidor. Verifica tu conexión a internet."
      );
      setShowAlert(true);
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
          <div
            style={{
              flex: 1.2,
              position: "relative",
              minHeight: isMobile ? 300 : "auto",
            }}
          >
            <img
              src="https://th.bing.com/th/id/OIG1.1S9SKh9A4xQsCUjoHW5M?pid=ImgDetMain&o=7&rm=3"
              alt="Login visual"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
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
            <h1
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: "bold",
                color: "#1a2e05",
                marginBottom: 8,
              }}
            >
              Inicio de sesión
            </h1>
            <p style={{ color: "#64748b" }}>
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {showAlert && (
            <Alert
              message={alertMessage}
              description={alertDescription}
              type={alertType}
              showIcon
              closable
              onClose={() => setShowAlert(false)}
              style={{ marginBottom: 24 }}
            />
          )}

          <Form onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="email"
              label="Correo electrónico"
              rules={[
                { required: true, message: "Ingresa tu email" },
                { type: "email", message: "Email no válido" },
              ]}
            >
              <Input
                prefix={<Mail size={18} style={{ color: "#84cc16" }} />}
                placeholder="john.doe@gmail.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Contraseña"
              rules={[{ required: true, message: "Ingresa tu contraseña" }]}
            >
              <Input.Password
                prefix={<Lock size={18} style={{ color: "#84cc16" }} />}
                placeholder="••••••••"
                size="large"
              />
            </Form.Item>

            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <a
                href="/forgot-password"
                style={{ color: "#65a30d", fontWeight: 500 }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Form.Item>
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
            </Form.Item>

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
