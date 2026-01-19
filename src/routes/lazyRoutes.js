import { lazy } from "react";

// componentes publicos

export const Login = lazy(() => import("../screens/auth/LoginScreen"));

export const Register = lazy(() => import("../screens/auth/RegisterScreen"));

// Componentes privados (necesitan autenticacion) ESTUDIANTES
export const DashboardStudent = lazy(
  () => import("../screens/estudiantes/dashboard/DashboardStudent_Screen"),
);

// Componentes privados (necesitan autenticacion) ADMIN

// Componentes privados (necesitan autenticacion) PROPIETARIOS
