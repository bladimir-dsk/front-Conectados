import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingFallback from "../components/fallbacks/LoadingFallback";
import { Login, Register } from "./lazyRoutes";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminLayout from "../components/layouts/AdminLayout";

const Dashboard = () => <div>Dashboard</div>;
const Reservas = () => <div>Reservas</div>;

export default function RouteApp() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas - Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reservas" element={<Reservas />} />
        </Route>

        {/* Rutas protegidas - Propietario */}
        {/* <Route
          path="/propietario/*"
          element={
            <ProtectedRoute requiredRole="propietario">
              <PropietarioLayout />
            </ProtectedRoute>
          }
        /> */}

        {/* Rutas protegidas - Estudiante */}
        {/* <Route
          path="/estudiante/*"
          element={
            <ProtectedRoute requiredRole="estudiante">
              <EstudianteLayout />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Suspense>
  );
}
