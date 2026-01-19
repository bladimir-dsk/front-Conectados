import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, Avatar, Dropdown } from "antd";
import {
  LayoutDashboard,
  Home,
  Menu as MenuIcon,
  LogOut,
  User,
  DollarSign,
} from "lucide-react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const { Header, Sider, Content } = Layout;

export default function OwnerLayout() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: "/propietario/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      key: "/propietario/habitaciones",
      icon: <Home size={18} />,
      label: "Mis Habitaciones",
    },
    {
      key: "/propietario/pagos",
      icon: <DollarSign size={18} />,
      label: "Pagos",
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (window.innerWidth < 768) {
      setDrawerVisible(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <User size={16} />,
      label: "Mi perfil",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={16} />,
      label: "Cerrar sesión",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <style>{`
        .owner-layout{min-height:100vh}
        .owner-sider{background:#fff;border-right:1px solid #eaeaea}
        .ant-menu-item,.ant-menu-submenu-title{padding-left:24px!important}
        .ant-menu-item-selected {
          background-color: rgba(59, 130, 246, 0.1)!important;
        }
        .ant-menu-item-selected .ant-menu-item-icon,
        .ant-menu-item-selected .ant-menu-title-content {
          color:#3b82f6!important;
          font-weight:600;
        }
        .ant-menu-item:hover {
          background-color: rgba(59, 130, 246, 0.05)!important;
        }
        .ant-menu-item:hover .ant-menu-item-icon {
          color:#3b82f6!important;
        }
        .owner-header{
          height:64px;
          background:#3b82f6;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .owner-logo img{height:40px}
        .mobile-menu-btn{
          display:none;
          background:transparent;
          border:none;
          cursor:pointer;
          padding:8px;
        }
        .owner-content{
          padding:24px;
          background:#f5f5f5;
          min-height:calc(100vh - 64px);
        }
        @media (max-width: 767px) {
          .owner-sider{display:none}
          .mobile-menu-btn{display:block}
          .owner-header{padding:0 16px}
          .owner-content{padding:16px}
        }
      `}</style>

      <Layout className="owner-layout">
        <Sider width={260} className="owner-sider" breakpoint="lg" collapsedWidth="0">
          <div style={{ padding: "16px", borderBottom: "1px solid #eaeaea" }}>
            <h3 style={{ margin: 0, color: "#1e40af" }}>Panel Propietario</h3>
          </div>
          <Menu
            mode="inline"
            items={menuItems}
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
          />
        </Sider>

        <Drawer
          title="Menú Propietario"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={260}
        >
          <Menu
            mode="inline"
            items={menuItems}
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
          />
        </Drawer>

        <Layout>
          <Header className="owner-header">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                className="mobile-menu-btn"
                onClick={() => setDrawerVisible(true)}
              >
                <MenuIcon size={24} color="#fff" />
              </button>
              <div className="owner-logo">
                <img src="/LogoPrincipal-Horizontal.webp" alt="Logo" />
              </div>
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <Avatar style={{ backgroundColor: "#1e40af" }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <span style={{ color: "#fff", fontWeight: 500 }}>
                  {user?.name}
                </span>
              </div>
            </Dropdown>
          </Header>
          <Content className="owner-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}