import { Layout, Menu, Drawer, Button } from "antd";
import {
    LayoutDashboard,
    Search,
    CalendarCheck,
    FileText,
    RotateCcw,
    DollarSign,
    Star,
    Users,
    Moon,
    Sun,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

const { Sider } = Layout;

export default function StudentSidebar({
    collapsed,
    onCollapse,
    isMobile,
    open,
    onClose,
    selectedFilterKeys,
    setSelectedFilterKeys,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useTheme();

    const navigationItems = [
        {
            key: "/estudiante/dashboard",
            icon: <LayoutDashboard size={18} />,
            label: "Inicio",
        },
        {
            key: "/estudiante/search",
            icon: <Search size={18} />,
            label: "Buscar Habitaciones",
        },
        {
            key: "/estudiante/reservas",
            icon: <CalendarCheck size={18} />,
            label: "Mis reservas",
        },
        {
            key: "/estudiante/documentation",
            icon: <FileText size={18} />,
            label: "Mi documentación",
        },
    ];

    const filterItems = [
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
            ].map((l, i) => ({ key: `p${i}`, label: l })),
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
            ].map((l, i) => ({ key: `c${i}`, label: l })),
        },
    ];

    const menuItems = [...navigationItems, ...filterItems];

    const isFilterKey = (key) =>
        key.startsWith("p") || key.startsWith("r") || key.startsWith("c");

    const handleMenuSelect = ({ key }) => {
        if (key === "reset") {
            setSelectedFilterKeys([]);
            if (isMobile) onClose();
            return;
        }

        if (isFilterKey(key)) {
            setSelectedFilterKeys((prev) =>
                prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
            );
        } else {
            navigate(key);
        }

        if (isMobile) onClose();
    };

    const getSelectedKeys = () => {
        const currentPath = location.pathname;

        let bestNavMatch = null;
        let longestMatch = 0;

        navigationItems.forEach((item) => {
            if (currentPath.startsWith(item.key) && item.key.length > longestMatch) {
                longestMatch = item.key.length;
                bestNavMatch = item.key;
            }
        });

        return [
            ...(bestNavMatch ? [bestNavMatch] : []),
            ...selectedFilterKeys,
        ];
    };

    const menuStyles = `
    .student-sidebar-menu.ant-menu-light .ant-menu-item-selected,
    .student-sidebar-menu.ant-menu-light .ant-menu-item-selected .ant-menu-item-icon {
      color: #84cc16 !important;
    }
    .student-sidebar-menu.ant-menu-light .ant-menu-item-selected .ant-menu-title-content {
      color: #84cc16 !important;
      font-weight: 600;
    }
    .student-sidebar-menu.ant-menu-light .ant-menu-item:hover .ant-menu-item-icon,
    .student-sidebar-menu.ant-menu-light .ant-menu-submenu:hover > .ant-menu-submenu-title .ant-menu-item-icon {
      color: #84cc16 !important;
    }
    .student-sidebar-menu.ant-menu-light .ant-menu-item-selected::after {
      border-color: #84cc16 !important;
    }
    .student-sidebar-menu.ant-menu-light .ant-menu-submenu-selected > .ant-menu-submenu-title,
    .student-sidebar-menu.ant-menu-light .ant-menu-submenu-selected > .ant-menu-submenu-title .ant-menu-item-icon {
      color: #84cc16 !important;
    }
    .student-sidebar-menu.ant-menu-light .ant-menu-submenu-selected > .ant-menu-submenu-title::after {
      border-color: #84cc16 !important;
    }
    .student-sidebar-menu.ant-menu-light .ant-menu-item:active,
    .student-sidebar-menu.ant-menu-light .ant-menu-submenu-title:active {
      background: rgba(132, 204, 22, 0.1) !important;
    }
    .student-sidebar-menu.ant-menu-light .ant-menu-submenu-arrow {
      color: inherit !important;
    }
    .student-sidebar-menu.ant-menu-light .ant-menu-submenu-selected .ant-menu-submenu-arrow {
      color: #84cc16 !important;
    }
    .student-sidebar-menu.ant-menu-light .ant-menu-item.ant-menu-item-selected {
      background-color: rgba(132, 204, 22, 0.1) !important;
    }

    /* Dark mode */
    .dark .student-sidebar-menu.ant-menu-light {
      background-color: #18181b !important;
      color: #e4e4e7 !important;
    }
    .dark .student-sidebar-menu.ant-menu-light .ant-menu-item {
      color: #e4e4e7 !important;
    }
    .dark .student-sidebar-menu.ant-menu-light .ant-menu-item:hover {
      background-color: rgba(132, 204, 22, 0.15) !important;
    }
    .dark .student-sidebar-menu.ant-menu-light .ant-menu-submenu-title {
      color: #e4e4e7 !important;
    }
    .dark .student-sidebar-menu.ant-menu-light .ant-menu-submenu-title:hover {
      background-color: rgba(132, 204, 22, 0.15) !important;
    }
    .dark .student-sidebar-menu.ant-menu-light .ant-menu-sub.ant-menu-inline {
      background-color: #27272a !important;
    }
    .dark .student-sidebar-menu.ant-menu-light .ant-menu-sub .ant-menu-item {
      color: #e4e4e7 !important;
    }
    .dark .student-sidebar-content {
      background-color: #18181b !important;
      border-right-color: #3f3f46 !important;
    }
    .dark .student-sidebar-header {
      border-bottom-color: #3f3f46 !important;
    }
    .dark .student-sidebar-footer {
      border-top-color: #3f3f46 !important;
    }
  `;

    const sidebarContent = (
        <div
            className="student-sidebar-content flex flex-col h-full"
            style={{
                backgroundColor: "white",
                borderRight: "1px solid #eaeaea",
            }}
        >
            <style>{menuStyles}</style>

            {/* Header con Logo */}
            <div
                className="student-sidebar-header h-16 flex items-center justify-center px-4"
                style={{ borderBottom: "1px solid #eaeaea" }}
            >
                {!collapsed || isMobile ? (
                    <img
                        src="/LogoPrincipal-Horizontal.webp"
                        alt="Logo"
                        className="h-10"
                    />
                ) : (
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#84cc16" }}>
                        C
                    </div>
                )}
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto">
                <Menu
                    mode="inline"
                    items={menuItems}
                    selectedKeys={getSelectedKeys()}
                    defaultOpenKeys={["price", "rating", "capacity"]}
                    onSelect={handleMenuSelect}
                    multiple
                    className="student-sidebar-menu"
                    style={{ border: 0 }}
                />
            </div>

            {/* Botón de cambio de tema */}
            <div
                className="student-sidebar-footer p-4 flex items-center justify-center"
                style={{ borderTop: "1px solid #eaeaea" }}
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

    if (isMobile) {
        return (
            <Drawer
                placement="left"
                onClose={onClose}
                open={open}
                closable={false}
                size={280}
                styles={{
                    body: { padding: 0 },
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
            breakpoint="lg"
            width={240}
            trigger={null}
            collapsedWidth={80}
            style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                backgroundColor: "white",
            }}
        >
            {sidebarContent}
        </Sider>
    );
}