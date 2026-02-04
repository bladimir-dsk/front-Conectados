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

export const DocumentationStudent = lazy(
  () =>
    import("../screens/estudiantes/documentation/DocumentationStudent_Screen"),
);

export const ProfileStudent = lazy(
  () => import("../screens/estudiantes/profile/ProfileStudent_Screen"),
);

export const SearchStudent = lazy(
  () => import("../screens/estudiantes/search/SearchStudent_Screen"),
);

// Componentes privados (necesitan autenticacion) ADMIN

export const AdminDashboard = lazy(
  () => import("../screens/admin/dashboard/DashboardScreen_Admin"),
);
export const AdminOwners = lazy(
  () => import("../screens/admin/owners/OwnersScreen_Admin"),
);
export const AdminOwnersProperties = lazy(
  () =>
    import("../screens/admin/owners/properties/OwnersPropertiesScreen_Admin"),
);
export const AdminStudentAdministration = lazy(
  () =>
    import("../screens/admin/students/administration/StudentAdministrationScreen_Admin"),
);
export const AdminStudentDocumentation = lazy(
  () =>
    import("../screens/admin/students/documentation/StudentDocumentationScreen_Admin"),
);
// Componentes privados (necesitan autenticacion) PROPIETARIOS
