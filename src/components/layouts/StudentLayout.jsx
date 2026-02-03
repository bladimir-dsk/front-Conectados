import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer, Avatar, Dropdown } from "antd";
import {
  LayoutDashboard,
  CalendarCheck,
  RotateCcw,
  DollarSign,
  Star,
  Users,
  Menu as MenuIcon,
  LogOut,
  User,
  Search,
  FileText,
} from "lucide-react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const { Header, Sider, Content } = Layout;

export default function StudentLayout() {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState(["price", "rating", "capacity"]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (location.pathname.includes("/estudiante/search")) {
      setSelectedKeys(["search"]);
    } else if (location.pathname.includes("/estudiante/dashboard")) {
      setSelectedKeys(["dashboard"]);
    } else if (location.pathname.includes("/estudiante/reservas")) {
      setSelectedKeys(["reservas"]);
    } else if (location.pathname.includes("/estudiante/documentation")) {
      setSelectedKeys(["documentation"]);
    }
  }, [location.pathname]);

  const handleMenuSelect = ({ key }) => {
    if (key === "reset") {
      setSelectedKeys([]);
      setDrawerVisible(false);
      return;
    }

    if (key === "dashboard") {
      navigate("/estudiante/dashboard");
    } else if (key === "search") {
      navigate("/estudiante/search");
    } else if (key === "reservas") {
      navigate("/estudiante/reservas");
    } else if (key === "documentation") {
      navigate("/estudiante/documentation");
    } else if (
      key.startsWith("p") ||
      key.startsWith("r") ||
      key.startsWith("c")
    ) {
      if (selectedKeys.includes(key)) {
        setSelectedKeys(selectedKeys.filter((k) => k !== key));
      } else {
        setSelectedKeys([...selectedKeys, key]);
      }
    }

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
      onClick: () => navigate("/estudiante/profile"),
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

  const menuItems = [
    {
      key: "dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Inicio",
    },
    {
      key: "search",
      icon: <Search size={18} />,
      label: "Buscar Habitaciones",
    },
    {
      key: "reservas",
      icon: <CalendarCheck size={18} />,
      label: "Mis reservas",
    },
    {
      key: "documentation",
      icon: <FileText size={18} />,
      label: "Mi documentación",
    },
    { type: "divider" },
    {
      key: "reset",
      icon: <RotateCcw size={16} />,
      label: "Restablecer filtros",
    },
    {
      key: "price",
      icon: <DollarSign size={18} />,
      label: "Por precios",
      children: [
        "Menos de $400",
        "$400 a $500",
        "$500 a $600",
        "Más de $600",
      ].map((l, i) => ({
        key: `p${i}`,
        label: l,
      })),
    },
    {
      key: "rating",
      icon: <Star size={18} />,
      label: "Por clasificación",
      children: ["Ninguno", "Excelente", "Muy bueno", "Bueno"].map((l, i) => ({
        key: `r${i}`,
        label: l,
      })),
    },
    {
      key: "capacity",
      icon: <Users size={18} />,
      label: "Por capacidad",
      children: [
        "Individual",
        "1 a 2 huéspedes",
        "2 a 4 huéspedes",
        "Más de 4 huéspedes",
      ].map((l, i) => ({
        key: `c${i}`,
        label: l,
      })),
    },
  ];

  return (
    <>
      <style>{`
        .student-layout{min-height:100vh}
        .student-sider{background:#fff;border-right:1px solid #eaeaea}
        .ant-menu-item,.ant-menu-submenu-title{padding-left:24px!important}
        .ant-menu-item-selected,
        .ant-menu-item-selected .ant-menu-item-icon,
        .ant-menu-submenu-selected .ant-menu-submenu-title,
        .ant-menu-submenu-selected .ant-menu-submenu-title .ant-menu-item-icon {
          color:#84cc16!important;
        }
        .ant-menu-item-selected .ant-menu-title-content{
          color:#84cc16!important;
          font-weight:600
        }
        .ant-menu-item:hover .ant-menu-item-icon,
        .ant-menu-submenu:hover .ant-menu-submenu-title .ant-menu-item-icon {
          color:#84cc16!important;
        }
        .ant-menu-item-selected::after {
          border-color:#84cc16!important;
        }
        .ant-menu-submenu-selected > .ant-menu-submenu-title::after {
          border-color:#84cc16!important;
        }
        .student-header{
          height:64px;
          background:#84cc16;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 16px;
          width:100%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .student-logo img{height:40px}
        .header-actions button{margin-left:8px}
        .mobile-menu-btn{
          display:none;
          background:transparent;
          border:none;
          cursor:pointer;
          padding:8px
        }
        .student-content{
          padding:16px;
          background:#f7f9fb;
          min-height:calc(100vh - 64px);
        }
        .ant-menu-item:active,
        .ant-menu-submenu-title:active {
          background: rgba(132, 204, 22, 0.1)!important;
        }
        .ant-menu-submenu-arrow {
          color: #84cc16!important;
        }
        .ant-menu-submenu-selected .ant-menu-submenu-arrow {
          color: #84cc16!important;
        }
        .ant-menu-item.ant-menu-item-selected {
          background-color: rgba(132, 204, 22, 0.1)!important;
        }
        @media (max-width: 767px) {
          .student-sider{display:none}
          .mobile-menu-btn{display:block}
          .student-header{padding:0 12px}
          .student-content{padding:12px}
          .student-logo img{height:32px}
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .student-sider{width:200px!important}
          .student-content{padding:20px}
          .student-header{padding:0 20px}
        }
      `}</style>

      <Layout className="student-layout">
        <Sider
          width={260}
          className="student-sider"
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div style={{ padding: "16px", borderBottom: "1px solid #eaeaea" }}>
            <h3 style={{ margin: 0, color: "#84cc16" }}>Panel Estudiante</h3>
          </div>
          <Menu
            mode="inline"
            items={menuItems}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onSelect={handleMenuSelect}
            onOpenChange={setOpenKeys}
            multiple={true}
          />
        </Sider>

        <Drawer
          title="Menú Estudiante"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={260}
        >
          <Menu
            mode="inline"
            items={menuItems}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onSelect={handleMenuSelect}
            onOpenChange={setOpenKeys}
            multiple={true}
          />
        </Drawer>

        <Layout>
          <Header className="student-header">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                className="mobile-menu-btn"
                onClick={() => setDrawerVisible(true)}
              >
                <MenuIcon size={24} color="#fff" />
              </button>
              <div className="student-logo">
                <img src="/LogoPrincipal-Horizontal.webp" alt="Logo" />
              </div>
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <Avatar style={{ backgroundColor: "#84cc16" }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 500,
                    display: window.innerWidth < 768 ? "none" : "block",
                  }}
                >
                  {user?.name}
                </span>
              </div>
            </Dropdown>
          </Header>
          <Content className="student-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
