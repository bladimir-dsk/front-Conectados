import React, { useState, useRef, useEffect } from "react";
import {
    User,
    LogOut,
    ChevronDown,
    Moon,
    Sun,
    LayoutDashboard,
    Search,
    CalendarCheck,
    FileText,
    Heart,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

const navigationItems = [
    { key: "/estudiante/dashboard", icon: LayoutDashboard, label: "Inicio" },
    { key: "/estudiante/search", icon: Search, label: "Buscar" },
    { key: "/estudiante/favoritos", icon: Heart, label: "Favoritos" },
    { key: "/estudiante/reservas", icon: CalendarCheck, label: "Mis reservas" },
    { key: "/estudiante/documentation", icon: FileText, label: "Mi documentación" },
];

export default function StudentNavbar({ selectedFilterKeys, setSelectedFilterKeys }) {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const dropdownRef = useRef(null);
    const filterRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (key) => location.pathname.startsWith(key);

    const userMenuItems = [
        {
            key: "profile",
            icon: <User size={16} />,
            label: "Mi perfil",
            onClick: () => { navigate("/estudiante/profile"); setDropdownOpen(false); },
        },
        {
            key: "darkmode",
            icon: darkMode ? <Sun size={16} /> : <Moon size={16} />,
            label: darkMode ? "Modo claro" : "Modo oscuro",
            onClick: () => { toggleDarkMode(); setDropdownOpen(false); },
        },
        {
            key: "logout",
            icon: <LogOut size={16} />,
            label: "Cerrar sesión",
            onClick: () => { handleLogout(); setDropdownOpen(false); },
            danger: true,
            divider: true,
        },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
            if (filterRef.current && !filterRef.current.contains(event.target)) setFilterOpen(false);
        };
        if (dropdownOpen || filterOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen, filterOpen]);


    return (
        <>
            <header
                className="px-4 flex items-center fixed top-0 left-0 right-0 z-40"
                style={{
                    height: "64px",
                    backgroundColor: "#84cc16",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                {/* Logo */}
                <img src="/LogoPrincipal-Horizontal.webp" alt="Logo" className="h-9" />

                {/* Navigation links — solo desktop (lg+) */}
                <nav className="hidden lg:flex items-center h-full gap-1 absolute left-1/2 -translate-x-1/2">
                    {navigationItems.map(({ key, icon: Icon, label }) => {
                        const active = isActive(key);
                        return (
                            <button
                                key={key}
                                onClick={() => navigate(key)}
                                className="flex items-center gap-2 px-3 h-full text-sm font-medium transition-all relative"
                                style={{ color: active ? "black" : "rgba(0,0,0,0.6)" }}
                                onMouseEnter={(e) => !active && (e.currentTarget.style.color = "black")}
                                onMouseLeave={(e) => !active && (e.currentTarget.style.color = "rgba(0,0,0,0.6)")}
                            >
                                <Icon size={17} />
                                {label}
                                {active && (
                                    <span
                                        className="absolute bottom-3 left-2 right-1 h-0.5 rounded-full"
                                        style={{ backgroundColor: "black" }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-2 ml-auto">

                    {/* User dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 cursor-pointer rounded-lg transition-colors p-2"
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <div className="hidden sm:flex flex-col text-right space-y-0.5">
                                <span className="text-sm font-medium text-black">{user?.name || "Estudiante"}</span>
                                <span className="text-xs text-gray-700">Estudiante</span>
                            </div>
                            <div
                                className="rounded-full flex items-center justify-center"
                                style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.25)" }}
                            >
                                <span className="text-black font-semibold">
                                    {user?.name?.charAt(0).toUpperCase() || "E"}
                                </span>
                            </div>
                            <ChevronDown size={16} className="text-black" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-lg shadow-lg py-1 z-50">
                                {userMenuItems.map((item) => (
                                    <React.Fragment key={item.key}>
                                        {item.divider && (
                                            <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                                        )}
                                        <button
                                            onClick={item.onClick}
                                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${item.danger
                                                ? "text-red-600 hover:bg-red-100 dark:hover:bg-red-500/50"
                                                : "text-gray-700 dark:text-gray-200 hover:bg-lime-100 dark:hover:bg-lime-500/50"
                                                }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </button>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ── BOTTOM NAV — mobile y tablet (< lg) ── */}
            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center"
                style={{
                    height: "64px",
                    backgroundColor: "#84cc16",
                    boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
                }}>
                {navigationItems.map(({ key, icon: Icon, label }) => {
                    const active = isActive(key);
                    return (
                        <button
                            key={key}
                            onClick={() => navigate(key)}
                            className="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all relative"
                            style={{ color: active ? "black" : "rgba(0,0,0,0.5)" }}
                        >
                            {active && (
                                <span
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-b-full"
                                    style={{ backgroundColor: "black" }}
                                />
                            )}
                            <Icon size={active ? 22 : 20} />
                            {/* Solo muestra el label en sm+ */}
                            <span className="hidden sm:block text-xs leading-none">{label}</span>
                        </button>
                    );
                })}
            </nav>
        </>
    );
}