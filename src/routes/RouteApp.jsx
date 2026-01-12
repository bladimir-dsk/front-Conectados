import React, { Suspense } from 'react'
import LoadingFallback from '../components/fallbacks/LoadingFallback'
import { Route, Routes } from 'react-router-dom'
import { Login } from './lazyRoutes'
import { ProtectedRoute } from './ProtectedRoute'
import AdminLayout from '../components/layouts/AdminLayout'

export default function RouteApp() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Rutas pública*/}
                <Route path='/' element={<Login />} />

                {/* Rutas protegidas - Admin */}
                {/* <Route
                    path='/admin/*' element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminLayout />
                        </ProtectedRoute>
                    } /> */}

                {/* Rutas protegidas - Propietario */}
                {/* <Route
                    path='/propietario/*'
                    element={
                        <ProtectedRoute requiredRole="propietario">
                            <PropietarioLayout />
                        </ProtectedRoute>
                    }
                /> */}

                {/* Rutas protegidas - Estudiante */}
                {/* <Route
                    path='/estudiante/*'
                    element={
                        <ProtectedRoute requiredRole="estudiante">
                            <EstudianteLayout />
                        </ProtectedRoute>
                    }
                /> */}

            </Routes>
        </Suspense>
    )
}
