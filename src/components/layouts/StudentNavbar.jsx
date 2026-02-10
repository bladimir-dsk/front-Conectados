import React, { useState, useRef, useEffect } from "react";
import {
    User,
    LogOut,
    ChevronDown,
    ChevronsRight,
    ChevronsLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function StudentNavbar({ collapsed, onToggle, isMobile }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const userMenuItems = [
        {
            key: "profile",
            icon: <User size={16} />,
            label: "Mi perfil",
            onClick: () => {
                navigate("/estudiante/profile");
                setDropdownOpen(false);
            },
        },
        {
            key: "logout",
            icon: <LogOut size={16} />,
            label: "Cerrar sesión",
            onClick: () => {
                handleLogout();
                setDropdownOpen(false);
            },
            danger: true,
        },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <header
            className="px-4 flex items-center fixed top-0 right-0 z-40"
            style={{
                height: "64px",
                backgroundColor: "#84cc16",
                width: isMobile
                    ? "100%"
                    : collapsed
                        ? "calc(100% - 80px)"
                        : "calc(100% - 240px)",
                transition: "width 0.2s",
                left: isMobile ? 0 : "auto",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            {/* Toggle sidebar button */}
            <button
                onClick={onToggle}
                className="transition-colors p-2 rounded-lg text-black!"
                style={{ color: "white" }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }
            >
                {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
            </button>

            {/* Right actions */}
            <div className="flex items-center ml-auto">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 cursor-pointer rounded-lg transition-colors p-2"
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "transparent")
                        }
                    >
                        {!isMobile && (
                            <div className="flex flex-col text-right space-y-0.5">
                                <span className="text-sm font-medium text-black">
                                    {user?.name || "Estudiante"}
                                </span>
                                <span className="text-xs text-gray-700" >
                                    Estudiante
                                </span>
                            </div>
                        )}
                        <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                                width: "40px",
                                height: "40px",
                                background: "rgba(255,255,255,0.25)",
                            }}
                        >
                            <span className="text-black font-semibold">
                                {user?.name?.charAt(0).toUpperCase() || "E"}
                            </span>
                        </div>
                        <ChevronDown size={16} className="text-black" />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-lg shadow-lg py-1 z-50">
                            {userMenuItems.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={item.onClick}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${item.danger
                                            ? "text-red-600 hover:bg-red-100 dark:hover:bg-red-500/50"
                                            : "text-gray-700 dark:text-gray-200 hover:bg-lime-100 dark:hover:bg-lime-500/50"
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}