import React, { useState } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  LayoutDashboard,
  CalendarCheck,
  RotateCcw,
  DollarSign,
  Star,
  Users,
  Menu as MenuIcon,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export default function SidebarLayout() {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState(["price", "rating", "capacity"]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

  const handleMenuSelect = ({ key }) => {
    if (key === "reset") {
      setSelectedKeys([]);
      setDrawerVisible(false);
      return;
    }

    if (key === "dashboard") {
      navigate("estudiante/dashboard");
      setSelectedKeys(["dashboard"]);
    } else if (key === "reservas") {
      navigate("estudiante/reservation");
      setSelectedKeys(["reservas"]);
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
    } else {
      setSelectedKeys([key]);
    }
    if (window.innerWidth < 768) {
      setDrawerVisible(false);
    }
  };

  const items = [
    {
      key: "dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      key: "reservas",
      icon: <CalendarCheck size={18} />,
      label: "Mis reservas",
    },
    { type: "divider" },
    { key: "reset", icon: <RotateCcw size={16} />, label: "Restablecer" },
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
        .app-layout{min-height:100vh}
        .app-sider{background:#fff;border-right:1px solid #eaeaea}
        .ant-menu-item,.ant-menu-submenu-title{padding-left:24px!important}
        .ant-menu-item-selected,
        .ant-menu-item-selected .ant-menu-item-icon,
        .ant-menu-submenu-selected .ant-menu-submenu-title,
        .ant-menu-submenu-selected .ant-menu-submenu-title .ant-menu-item-icon {
          color:#9be15d!important;
        }
        .ant-menu-item-selected .ant-menu-title-content{
          color:#9be15d!important;
          font-weight:600
        }
        .ant-menu-item:hover .ant-menu-item-icon,
        .ant-menu-submenu:hover .ant-menu-submenu-title .ant-menu-item-icon {
          color:#9be15d!important;
        }
        .ant-menu-item-selected::after {
          border-color:#9be15d!important;
        }
        .ant-menu-submenu-selected > .ant-menu-submenu-title::after {
          border-color:#9be15d!important;
        }
        .app-header{
          height:64px;background:#6abf4b;display:flex;
          align-items:center;justify-content:space-between;
          padding:0 16px;width:100%
        }
        .app-logo img{height:40px}
        .header-actions button{margin-left:8px}
        .mobile-menu-btn{display:none;background:transparent;border:none;cursor:pointer;padding:8px}
        .ant-btn-primary{
          background:#9be15d!important;
          border-color:#9be15d!important;
          color:#1f1f1f!important
        }
        .ant-btn-primary:hover{
          background:#7ed957!important;
          border-color:#7ed957!important
        }
        .app-content{padding:16px;background:#f7f9fb}
        .ant-menu-item:active,
        .ant-menu-submenu-title:active {
          background: rgba(155, 225, 93, 0.1)!important;
        }
        .ant-menu-submenu-arrow {
          color: #9be15d!important;
        }
        .ant-menu-submenu-selected .ant-menu-submenu-arrow {
          color: #9be15d!important;
        }
        .ant-menu-item.ant-menu-item-selected {
          background-color: rgba(155, 225, 93, 0.1)!important;
        }
        @media (max-width: 767px) {
          .app-sider{display:none}
          .mobile-menu-btn{display:block}
          .app-header{padding:0 12px}
          .app-content{padding:12px}
          .header-actions button{font-size:12px;padding:4px 8px}
          .app-logo img{height:32px}
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .app-sider{width:200px!important}
          .app-content{padding:20px}
          .app-header{padding:0 20px}
        }
      `}</style>

      <Layout className="app-layout">
        <Sider
          width={260}
          className="app-sider"
          breakpoint="lg"
          collapsedWidth="0"
        >
          <Menu
            mode="inline"
            items={items}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onSelect={handleMenuSelect}
            onOpenChange={setOpenKeys}
            multiple={true}
          />
        </Sider>

        <Drawer
          title="Menú"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={260}
        >
          <Menu
            mode="inline"
            items={items}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onSelect={handleMenuSelect}
            onOpenChange={setOpenKeys}
            multiple={true}
          />
        </Drawer>

        <Layout>
          <Header className="app-header">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                className="mobile-menu-btn"
                onClick={() => setDrawerVisible(true)}
              >
                <MenuIcon size={24} color="#fff" />
              </button>
              <div className="app-logo">
                <img src="/LogoPrincipal-Horizontal.webp" alt="Logo" />
              </div>
            </div>
            <div className="header-actions">
              <Link to="/register">
                <Button type="text">Registrarse</Button>
              </Link>
              <Link to="/login">
                <Button type="primary">Iniciar sesión</Button>
              </Link>
            </div>
          </Header>
          <Content className="app-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
