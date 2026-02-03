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

export default function AdminNavbar({ collapsed, onToggle, isMobile }) {
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
      label: "Perfil",
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
      className="bg-white dark:bg-zinc-900 px-4 flex items-center fixed top-0 right-0 z-40"
      style={{
        height: "64px",
        width: isMobile
          ? "100%"
          : collapsed
            ? "calc(100% - 80px)"
            : "calc(100% - 200px)",
        transition: "width 0.2s",
        left: isMobile ? 0 : "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Toggle sidebar button */}
      <button
        onClick={onToggle}
        className="text-gray-600 dark:hover:text-white! transition-colors p-2 rounded-lg hover:bg-lime-500/50"
      >
        {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
      </button>
      {/* Acciones de la derecha */}
      <div className="flex items-center ml-auto">
        {/* Usuario */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 cursor-pointer rounded-lg transition-colors p-2 hover:bg-lime-500/50"
          >
            <div className="flex flex-col text-right space-y-1">
              <span className="text-sm font-medium text-gray-900 dark:text-[#84cc16]">
                {user?.name || "Admin"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-200">
                Administrador
              </span>
            </div>
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "40px",
                height: "40px",
                background: "#84cc16",
              }}
            >
              <User size={16} className="text-white" />
            </div>
            <ChevronDown size={16} className="dark:text-white text-black" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-lg shadow-lg py-1">
              {userMenuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    item.danger
                      ? "text-red-600! hover:bg-red-200 dark:hover:bg-red-500/50"
                      : "text-gray-700 hover:bg-lime-200 dark:hover:bg-lime-500/50"
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
