import { createContext, useState, useEffect } from 'react';

// Crear el contexto y exportarlo para que pueda ser importado por useTheme.js
export const ThemeContext = createContext();

// Componente proveedor del tema
export default function ThemeProvider({ children }) {
    // Solo usa localStorage, ignora la preferencia del sistema
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('darkMode') === 'true'
    );

    useEffect(() => {
        // Aplicar el tema al documento HTML
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Guardar en localStorage
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    // Función para alternar el modo oscuro
    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}