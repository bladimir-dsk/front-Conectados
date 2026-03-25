import { Layout, Menu, Drawer, Button } from "antd";
import {
  LayoutDashboard,
  Home,
  DollarSign,
  File,
  Moon,
  Sun,
  House,
  Building2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

const { Sider } = Layout;

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

const menuStyles = `
  .owner-sidebar-menu.ant-menu-dark {
    background-color: ${SIDEBAR_COLORS.background} !important;
  }
  .owner-sidebar-menu.ant-menu-dark .ant-menu-item {
    background-color: ${SIDEBAR_COLORS.background} !important;
    color: ${SIDEBAR_COLORS.text} !important;
  }
  .owner-sidebar-menu.ant-menu-dark .ant-menu-item:hover {
    background-color: ${SIDEBAR_COLORS.backgroundHover} !important;
    color: ${SIDEBAR_COLORS.text} !important;
  }
  .owner-sidebar-menu.ant-menu-dark .ant-menu-item-selected {
    background-color: ${SIDEBAR_COLORS.menuSelected} !important;
    color: ${SIDEBAR_COLORS.text} !important;
  }
  .owner-sidebar-menu.ant-menu-dark .ant-menu-submenu-title {
    background-color: ${SIDEBAR_COLORS.background} !important;
    color: ${SIDEBAR_COLORS.text} !important;
  }
  .owner-sidebar-menu.ant-menu-dark .ant-menu-submenu-title:hover {
    background-color: ${SIDEBAR_COLORS.backgroundHover} !important;
  }
  .owner-sidebar-menu.ant-menu-dark .ant-menu-sub.ant-menu-inline {
    background-color: ${SIDEBAR_COLORS.submenuBg} !important;
  }
  .owner-sidebar-menu.ant-menu-dark .ant-menu-sub .ant-menu-item {
    background-color: transparent !important;
    color: ${SIDEBAR_COLORS.text} !important;
  }
  .owner-sidebar-menu.ant-menu-dark .ant-menu-sub .ant-menu-item:hover {
    background-color: ${SIDEBAR_COLORS.backgroundActive} !important;
  }
  .owner-sidebar-menu.ant-menu-dark .ant-menu-sub .ant-menu-item-selected {
    background-color: ${SIDEBAR_COLORS.menuSelected} !important;
    color: ${SIDEBAR_COLORS.textSecondary} !important;
  }
  .owner-sidebar-menu.ant-menu-dark .ant-menu-submenu-arrow {
    color: ${SIDEBAR_COLORS.text} !important;
  }
`;

export default function OwnerSidebar({
  collapsed,
  onCollapse,
  isMobile,
  open,
  onClose,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const menuItems = [
    // { key: "/propietario/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    {
      key: "/propietario/alojamientos",
      icon: <Building2 size={18} />,
      label: "Mis alojamientos",
    },
    {
      key: "/propietario/rentas",
      icon: <House size={18} />,
      label: "Mis Rentas",
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) onClose();
  };

  const getSelectedKey = () => {
    const exact = menuItems.find((i) => i.key === location.pathname);
    if (exact) return [exact.key];

    let best = null,
      longest = 0;
    menuItems.forEach((i) => {
      if (
        i.key &&
        location.pathname.startsWith(i.key) &&
        i.key.length > longest
      ) {
        longest = i.key.length;
        best = i.key;
      }
    });
    return best ? [best] : ["/propietario/dashboard"];
  };

  const sidebarContent = (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: SIDEBAR_COLORS.background }}
    >
      <style>{menuStyles}</style>

      {/* Header */}
      <div
        className="h-16 flex items-center justify-center px-4"
        style={{ borderBottom: `1px solid ${SIDEBAR_COLORS.border}` }}
      >
        {!collapsed || isMobile ? (
          <img
            src="/LogoPrincipal-Horizontal.webp"
            alt="Logo"
            className="h-10"
          />
        ) : (
          <div className="text-white text-xl font-bold">C</div>
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
          items={menuItems}
          onClick={handleMenuClick}
          theme="dark"
          className="owner-sidebar-menu"
          style={{ border: 0, backgroundColor: SIDEBAR_COLORS.background }}
          inlineCollapsed={collapsed && !isMobile}
        />
      </div>

      {/* Theme toggle */}
      <div
        className="p-4 flex items-center justify-center"
        style={{ borderTop: `1px solid ${SIDEBAR_COLORS.border}` }}
      >
        <Button
          type="primary"
          size="large"
          icon={darkMode ? <Sun size={20} /> : <Moon size={20} />}
          onClick={toggleDarkMode}
          style={{
            backgroundColor: "#C7DC5B",
            borderColor: "#b5c94f",
            color: "black",
            width: collapsed && !isMobile ? "100%" : "auto",
            display: "flex",
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

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        onClose={onClose}
        open={open}
        closable={false}
        width={280}
        styles={{
          body: { padding: 0, backgroundColor: SIDEBAR_COLORS.background },
          header: { display: "none" },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
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
