import React from 'react';
import logo from '/Logo-Principal.webp';

export default function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                {/* Logo con animación */}
                <div className="relative mb-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 border-4 border-green-200 dark:border-green-900 rounded-full animate-ping"></div>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <img
                            src={logo}
                            alt="ConectaDOS Logo"
                            className="w-24 animate-pulse"
                        />
                    </div>
                </div>

                {/* Texto */}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Cargando...
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Por favor espera un momento...
                </p>

            </div>

            {/* CSS para animación de progreso */}
            <style>{`
                @keyframes progress {
                    0% {
                        width: 0%;
                        margin-left: 0%;
                    }
                    50% {
                        width: 75%;
                        margin-left: 0%;
                    }
                    100% {
                        width: 0%;
                        margin-left: 100%;
                    }
                }
                
                .animate-progress {
                    animation: progress 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
