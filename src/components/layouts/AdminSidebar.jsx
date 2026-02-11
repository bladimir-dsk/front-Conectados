import React from "react";
import { Layout, Menu, Drawer, Button, Tooltip } from "antd";
import {
  LayoutDashboard,
  Home,
  Users,
  Moon,
  Sun,
  CircleUser,
  UserRoundPen,
  Tag,
  Wrench,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

const { Sider } = Layout;

export default function AdminSidebar({
  collapsed,
  onCollapse,
  isMobile,
  open,
  onClose,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  // Colores estáticos para el sidebar
  const SIDEBAR_COLORS = {
    background: "#84cc16",
    backgroundHover: "#9cd522",
    backgroundActive: "#a3dc2a",
    submenuBg: "#7ABD13",
    text: "#111214",
    textSecondary: "#f0f0f0", 
    border: "#73b012",
    menuSelected: "#61990C",
  };

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      key: "/admin/propietarios",
      icon: <CircleUser size={18} />,
      label: "Propietarios",
    },
        {
      key: "/admin/alojamientos",
      icon: <Home size={18} />,
      label: "Alojamientos",
    },
    {
      key: "/admin/servicios-alojamiento",
      icon: <Wrench size={18}/>,
      label: "Servicios"
    },
    {
      key: "estudiantes",
      icon: <UserRoundPen size={18} />,
      label: "Estudiantes",
      children: [
        { key: "/admin/estudiantes/administracion", label: "Administración" },
        { key: "/admin/estudiantes/documentacion", label: "Documentación" }
      ]
    },
    {
      key: "/admin/usuarios",
      icon: <Users size={18} />,
      label: "Usuarios",
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) {
      onClose();
    }
  };

  const getSelectedKey = () => {
    const currentPath = location.pathname;

    // Verificar coincidencia exacta
    const exactMatch = menuItems.find((item) => item.key === currentPath);
    if (exactMatch) return [currentPath];

    // Verificar hijos de submenús
    for (const item of menuItems) {
      if (item.children) {
        const childMatch = item.children.find(
          (child) => child.key === currentPath,
        );
        if (childMatch) return [childMatch.key];
      }
    }

    let bestMatch = null;
    let longestMatch = 0;

    menuItems.forEach((item) => {
      if (item.key && currentPath.startsWith(item.key)) {
        if (item.key.length > longestMatch) {
          longestMatch = item.key.length;
          bestMatch = item.key;
        }
      }

      // También verificar en los hijos
      if (item.children) {
        item.children.forEach((child) => {
          if (child.key && currentPath.startsWith(child.key)) {
            if (child.key.length > longestMatch) {
              longestMatch = child.key.length;
              bestMatch = child.key;
            }
          }
        });
      }
    });

    if (bestMatch) return [bestMatch];

    // Default
    return ["/admin/dashboard"];
  };

  const getOpenKeys = () => {
    for (const item of menuItems) {
      if (item.children) {
        const childMatch = item.children.find(
          (child) => child.key === location.pathname,
        );
        if (childMatch) return [item.key];
      }
    }
    return [];
  };

  // Estilos CSS en línea para sobrescribir Ant Design
  const menuStyles = `
        .custom-sidebar-menu.ant-menu-dark {
            background-color: ${SIDEBAR_COLORS.background} !important;
        }
        .custom-sidebar-menu.ant-menu-dark .ant-menu-item {
            background-color: ${SIDEBAR_COLORS.background} !important;
            color: ${SIDEBAR_COLORS.text} !important;
        }
        .custom-sidebar-menu.ant-menu-dark .ant-menu-item:hover {
            background-color: ${SIDEBAR_COLORS.backgroundHover} !important;
            color: ${SIDEBAR_COLORS.text} !important;
        }
        .custom-sidebar-menu.ant-menu-dark .ant-menu-item-selected {
            background-color: ${SIDEBAR_COLORS.menuSelected} !important;
            color: ${SIDEBAR_COLORS.text} !important;
        }
        .custom-sidebar-menu.ant-menu-dark .ant-menu-item-selected:hover {
            background-color: ${SIDEBAR_COLORS.menuSelected} !important;
        }
        .custom-sidebar-menu.ant-menu-dark .ant-menu-item-active {
            background-color: ${SIDEBAR_COLORS.backgroundHover} !important;
        }
        
        /* Títulos de submenú */
        .custom-sidebar-menu.ant-menu-dark .ant-menu-submenu-title {
            background-color: ${SIDEBAR_COLORS.background} !important;
            color: ${SIDEBAR_COLORS.text} !important;
        }
        
        .custom-sidebar-menu.ant-menu-dark .ant-menu-submenu-title:hover {
            background-color: ${SIDEBAR_COLORS.backgroundHover} !important;
            color: ${SIDEBAR_COLORS.text} !important;
        }
        
        /* Submenú abierto */
        .custom-sidebar-menu.ant-menu-dark .ant-menu-submenu-open > .ant-menu-submenu-title {
            background-color: ${SIDEBAR_COLORS.backgroundHover} !important;
            color: ${SIDEBAR_COLORS.text} !important;
        }
        
        /* Contenedor de items del submenú */
        .custom-sidebar-menu.ant-menu-dark .ant-menu-sub.ant-menu-inline {
            background-color: ${SIDEBAR_COLORS.submenuBg} !important;
        }
        
        /* Items dentro del submenú */
        .custom-sidebar-menu.ant-menu-dark .ant-menu-sub .ant-menu-item {
            background-color: transparent !important;
            color: ${SIDEBAR_COLORS.text} !important;
        }
        
        .custom-sidebar-menu.ant-menu-dark .ant-menu-sub .ant-menu-item:hover {
            background-color: ${SIDEBAR_COLORS.backgroundActive} !important;
            color: ${SIDEBAR_COLORS.text} !important;
        }
        
        .custom-sidebar-menu.ant-menu-dark .ant-menu-sub .ant-menu-item-selected {
            background-color: ${SIDEBAR_COLORS.menuSelected} !important;
            color: ${SIDEBAR_COLORS.textSecondary} !important;
        }
        
        /* Flecha del submenú */
        .custom-sidebar-menu.ant-menu-dark .ant-menu-submenu-arrow {
            color: ${SIDEBAR_COLORS.text} !important;
        }
    `;

  const sidebarContent = (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: SIDEBAR_COLORS.background,
        color: SIDEBAR_COLORS.text,
      }}
    >
      <style>{menuStyles}</style>

      {/* Header del Sidebar */}
      <div
        className="h-16 flex items-center justify-center px-4"
        style={{
          borderBottom: `1px solid ${SIDEBAR_COLORS.border}`,
          backgroundColor: SIDEBAR_COLORS.background,
        }}
      >
        {!collapsed || isMobile ? (
          <img
            src="/LogoPrincipal-Horizontal.webp"
            alt="Logo"
            className="h-10"
          />
        ) : (
          <div className="text-[#111214] text-xl font-bold">C</div>
        )}
      </div>

      {/* Menu */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: SIDEBAR_COLORS.background }}
      >
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          theme="dark"
          className="custom-sidebar-menu"
          style={{
            border: 0,
            backgroundColor: SIDEBAR_COLORS.background,
          }}
        />
      </div>

      {/* Botón de cambio de tema */}
      <div
        className="p-4 flex items-center justify-center"
        style={{
          borderTop: `1px solid ${SIDEBAR_COLORS.border}`,
          backgroundColor: SIDEBAR_COLORS.background,
        }}
      >
        <Button
          type="primary"
          size="large"
          className="rounded-lg shadow-lg"
          icon={darkMode ? <Sun size={20} /> : <Moon size={20} />}
          onClick={toggleDarkMode}
          style={{
            color: "black",
            width: collapsed && !isMobile ? "100%" : "auto",
            display: "flex",
            backgroundColor: "#C7DC5B",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {(!collapsed || isMobile) && (
            <span>{darkMode ? "Modo claro" : "Modo oscuro"}</span>
          )}
        </Button>
      </div>
    </div>
  );

  // Renderizar Drawer en móvil
  if (isMobile) {
    return (
      <Drawer
        placement="left"
        onClose={onClose}
        open={open}
        closable={false}
        size={280}
        styles={{
          body: {
            padding: 0,
            backgroundColor: SIDEBAR_COLORS.background,
          },
          header: { display: "none" },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // Renderizar Sider en desktop
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      width={200}
      trigger={null}
      collapsedWidth={80}
      theme="dark"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: SIDEBAR_COLORS.background,
      }}
    >
      {sidebarContent}
    </Sider>
  );
}
