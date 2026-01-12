// src/screens/auth/LoginScreen.jsx
import React, { useState } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Error en el inicio de sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Columna izquierda con imagen */}
      <div className="hidden lg:flex lg:w-1/2 bg-lime-50 flex-col items-center justify-center p-12">
        {/* Imagen decorativa */}
        <div className="max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Bienvenido de vuelta
            </h2>
            <p className="text-gray-600">
              Accede a todas las funcionalidades de nuestra plataforma y gestiona tu cuenta de manera segura.
            </p>
          </div>

          {/* Imagen placeholder - reemplaza con tu imagen real */}
          <div className="bg-gradient-to-br from-lime-100 to-green-100 rounded-2xl p-8 shadow-inner">
            <div className="flex flex-col items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-lime-200 to-green-300 rounded-full flex items-center justify-center mb-6">
                {/* Icono de login o imagen */}
                <svg className="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <p className="text-gray-700 text-center">
                Inicia sesión para acceder a tu panel de control personalizado
              </p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lime-600 font-bold text-xl">100%</div>
              <div className="text-gray-600 text-sm">Seguro</div>
            </div>
            <div className="text-center">
              <div className="text-lime-600 font-bold text-xl">24/7</div>
              <div className="text-gray-600 text-sm">Soporte</div>
            </div>
            <div className="text-center">
              <div className="text-lime-600 font-bold text-xl">1000+</div>
              <div className="text-gray-600 text-sm">Usuarios</div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna derecha con formulario */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo o marca */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lime-100 mb-4">
              <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Inicio de sesión
            </h1>
            <p className="text-gray-500">
              Inicia sesión para acceder a tu cuenta.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* Campo de email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-300 transition duration-200"
                placeholder="john.doe@gmail.com"
                required
              />
            </div>

            {/* Campo de contraseña */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-lime-600 hover:text-lime-800 hover:underline font-medium"
                >
                  ¿Has olvidado tu contraseña?
                </a>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-300 transition duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Botón de ingresar */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 mt-6 ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed text-gray-700'
                  : 'bg-lime-500 hover:bg-lime-600 text-white shadow-sm hover:shadow-md'
              }`}
            >
              {loading ? 'Cargando...' : 'Ingresar'}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-sm">o</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Botones sociales (opcional) */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              Facebook
            </button>
            <button className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              Google
            </button>
          </div>

          {/* Enlace de registro */}
          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{' '}
              <a
                href="/register"
                className="text-lime-600 font-medium hover:text-lime-800 hover:underline"
              >
                Regístrate
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}