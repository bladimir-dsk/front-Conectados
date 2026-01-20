import { lazy } from "react";

// componentes publicos

export const Login = lazy(() => import("../screens/auth/LoginScreen"));

export const Register = lazy(() => import("../screens/auth/RegisterScreen"));

// Componentes privados (necesitan autenticacion) ESTUDIANTES
export const DashboardStudent = lazy(
  () => import("../screens/estudiantes/dashboard/DashboardStudent_Screen"),
);

export const ReservationStudent = lazy(
  () => import("../screens/estudiantes/reservation/ReservationStudent_Screen"),
);

// Componentes privados (necesitan autenticacion) ADMIN

// Componentes privados (necesitan autenticacion) PROPIETARIOS
