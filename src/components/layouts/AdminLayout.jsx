import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, Avatar, Dropdown } from "antd";
import {
    LayoutDashboard,
    CalendarCheck,
    Menu as MenuIcon,
    LogOut,
    User,
    Home,
    Users,
} from "lucide-react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        {
            key: "/admin/dashboard",
            icon: <LayoutDashboard size={18} />,
            label: "Dashboard",
        },
        {
            key: "/admin/reservas",
            icon: <CalendarCheck size={18} />,
            label: "Reservas",
        },
        {
            key: "/admin/habitaciones",
            icon: <Home size={18} />,
            label: "Habitaciones",
        },
        {
            key: "/admin/usuarios",
            icon: <Users size={18} />,
            label: "Usuarios",
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
        .admin-layout{min-height:100vh}
        .admin-sider{background:#fff;border-right:1px solid #eaeaea}
        .ant-menu-item,.ant-menu-submenu-title{padding-left:24px!important}
        .ant-menu-item-selected {
          background-color: rgba(132, 204, 22, 0.1)!important;
        }
        .ant-menu-item-selected .ant-menu-item-icon,
        .ant-menu-item-selected .ant-menu-title-content {
          color:#84cc16!important;
          font-weight:600;
        }
        .ant-menu-item:hover {
          background-color: rgba(132, 204, 22, 0.05)!important;
        }
        .ant-menu-item:hover .ant-menu-item-icon {
          color:#84cc16!important;
        }
        .admin-header{
          height:64px;
          background:#84cc16;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .admin-logo img{height:40px}
        .mobile-menu-btn{
          display:none;
          background:transparent;
          border:none;
          cursor:pointer;
          padding:8px;
        }
        .admin-content{
          padding:24px;
          background:#f5f5f5;
          min-height:calc(100vh - 64px);
        }
        @media (max-width: 767px) {
          .admin-sider{display:none}
          .mobile-menu-btn{display:block}
          .admin-header{padding:0 16px}
          .admin-content{padding:16px}
        }
      `}</style>

            <Layout className="admin-layout">
                <Sider width={260} className="admin-sider" breakpoint="lg" collapsedWidth="0">
                    <div style={{ padding: "16px", borderBottom: "1px solid #eaeaea" }}>
                        <h3 style={{ margin: 0, color: "#1a2e05" }}>Panel Admin</h3>
                    </div>
                    <Menu
                        mode="inline"
                        items={menuItems}
                        selectedKeys={[location.pathname]}
                        onClick={handleMenuClick}
                    />
                </Sider>

                <Drawer
                    title="Menú Admin"
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
                    <Header className="admin-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <button
                                className="mobile-menu-btn"
                                onClick={() => setDrawerVisible(true)}
                            >
                                <MenuIcon size={24} color="#fff" />
                            </button>
                            <div className="admin-logo">
                                <img src="/LogoPrincipal-Horizontal.webp" alt="Logo" />
                            </div>
                        </div>
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                                <Avatar style={{ backgroundColor: "#1a2e05" }}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <span style={{ color: "#fff", fontWeight: 500 }}>
                                    {user?.name}
                                </span>
                            </div>
                        </Dropdown>
                    </Header>
                    <Content className="admin-content">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}