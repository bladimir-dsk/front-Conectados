import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingFallback from "../components/fallbacks/LoadingFallback";
import {
  DashboardStudent,
  ReservationStudent,
  DocumentationStudent,
  ProfileStudent,
  SearchStudent,
  Login,
  Register,
  AdminDashboard,
  AdminOwners,
  AdminStudentAdministration,
  AdminStudentDocumentation,
  AdminOwnersProperties,
  AdminServices,
  AdminAccommodationsScreen,
  DashboardOwners,
  OwnersAccommodationsScreen,
  AdminStudentSchool,
  AdminProfile,
  OwnersRentsScreen,
  AdminRents,
  FavoritesStudent,
} from "./lazyRoutes.js";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminLayout from "../components/layouts/AdminLayout";
import OwnerLayout from "../components/layouts/OwnerLayout";
import StudentLayout from "../components/layouts/StudentLayout";

export default function RouteApp() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas - Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="propietarios" element={<AdminOwners />} />
          <Route path="propietarios/:ownerId/propiedades" element={<AdminOwnersProperties />} />
          <Route path="estudiantes/administracion" element={<AdminStudentAdministration />} />
          <Route path="estudiantes/documentacion" element={<AdminStudentDocumentation />} />
          <Route path="servicios-alojamiento" element={<AdminServices />} />
          <Route path="alojamientos" element={<AdminAccommodationsScreen />} />
          <Route path="escuelas" element={<AdminStudentSchool />} />
          <Route path="perfil" element={<AdminProfile />} />
          <Route path="rentas" element={<AdminRents />} />
          {/* <Route path="dashboard" element={<Dashboard />} />
          <Route path="reservas" element={<Reservas />} /> */}
        </Route>

        {/* Rutas protegidas - Propietario */}
        <Route
          path="/propietario"
          element={
            <ProtectedRoute requiredRole="propietario">
              <OwnerLayout />
            </ProtectedRoute>
          }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOwners />} />
          <Route path="alojamientos" element={<OwnersAccommodationsScreen />} />
          <Route path="rentas" element={<OwnersRentsScreen />} />
        </Route>

        {/* Rutas protegidas - Estudiante */}
        <Route
          path="/estudiante"
          element={
            <ProtectedRoute requiredRole="estudiante">
              <StudentLayout />
            </ProtectedRoute>
          }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardStudent />} />
          {/* <Route path="buscar" element={<BuscarHabitaciones />} />*/}

          <Route path="profile" element={<ProfileStudent />} />
          <Route path="favoritos" element={<FavoritesStudent />} />

          <Route path="reservas" element={<ReservationStudent />} />

          <Route path="documentation" element={<DocumentationStudent />} />

          <Route path="search">
            <Route index element={<SearchStudent />} />
            <Route path=":roomId" element={<SearchStudent />} />
          </Route>
        </Route>

        {/* Ruta raíz - redirige a login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
