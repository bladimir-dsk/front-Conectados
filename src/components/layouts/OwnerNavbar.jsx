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

export default function OwnerNavbar({ collapsed, onToggle, isMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenuItems = [
    // {
    //     key: "profile",
    //     icon: <User size={16} />,
    //     label: "Mi perfil",
    // },
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
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      {/* Toggle */}
      <button
        onClick={onToggle}
        className="text-gray-600 dark:text-gray-300 transition-colors p-2 rounded-lg hover:bg-lime-500/50"
      >
        {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
      </button>

      {/* Título panel */}
      {(!collapsed || isMobile) && (
        <span className="ml-2 font-semibold text-lime-600 dark:text-[#84cc16] hidden sm:block">
          Panel del propietario
        </span>
      )}

      {/* Derecha: usuario */}
      <div className="flex items-center ml-auto">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 cursor-pointer rounded-lg transition-colors p-2 hover:bg-lime-500/50"
          >
            <div className="flex flex-col text-right space-y-1">
              <span className="text-sm font-medium text-gray-900 dark:text-[#84cc16]">
                {user?.name || "Propietario"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Propietario
              </span>
            </div>
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 40, height: 40, background: "#84cc16" }}
            >
              <User size={16} className="text-white" />
            </div>
            <ChevronDown size={16} className="dark:text-white text-black" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-lg shadow-lg py-1 z-50">
              {userMenuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    item.danger
                      ? "text-red-600 hover:bg-red-100 dark:hover:bg-red-500/30"
                      : "text-gray-700 dark:text-gray-200 hover:bg-lime-200 dark:hover:bg-lime-500/50"
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
