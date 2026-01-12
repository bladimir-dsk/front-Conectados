// import Sidebar from '../components/admin/Sidebar';

export default function AdminLayout() {
    return (
        <div className="flex h-screen">
            {/* <Sidebar /> */}
            <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
                {/* <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="habitaciones" element={<Habitaciones />} />
                    <Route path="estudiantes" element={<Estudiantes />} />
                    <Route path="propietarios" element={<Propietarios />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes> */}
            </main>
        </div>
    );
}