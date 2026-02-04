import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { App, Button, Input, Space, Table, Tag, Tooltip, Empty, Avatar } from "antd";
import {
    ArrowLeftOutlined,
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { Building2 } from "lucide-react";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import "dayjs/locale/es";
import PropertyModal_Admin from "./modals/PropertyModal_Admin";
import PropertyDetailsModal_Admin from "./modals/PropertyDetailsModal_Admin";
import { initialPropertiesData } from "../OwnersData";

dayjs.locale("es");

export default function OwnersPropertiesScreen_Admin() {
    const { ownerId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { message, modal } = App.useApp();

    const owner = location.state?.owner;
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [propertiesData, setPropertiesData] = useState([]);
    const [modalState, setModalState] = useState({
        add: false,
        edit: false,
        details: false,
    });
    const [selectedProperty, setSelectedProperty] = useState(null);

    // Cargar propiedades del propietario
    useEffect(() => {
        const ownerProperties = initialPropertiesData.filter(
            (property) => property.ownerId === parseInt(ownerId)
        );
        setPropertiesData(ownerProperties);
    }, [ownerId]);

    const openModal = (type, property = null) => {
        setModalState({ add: false, edit: false, details: false, [type]: true });
        setSelectedProperty(property);
    };

    const closeModal = (type) => {
        setModalState((prev) => ({ ...prev, [type]: false }));
        setSelectedProperty(null);
    };

    const handleSaveProperty = (values) => {
        if (modalState.edit && selectedProperty) {
            setPropertiesData((prev) =>
                prev.map((item) =>
                    item.id === selectedProperty.id ? { ...item, ...values } : item
                )
            );
            closeModal("edit");
        } else {
            const newId =
                propertiesData.length > 0
                    ? Math.max(...propertiesData.map((p) => p.id)) + 1
                    : 1;

            setPropertiesData((prev) => [
                ...prev,
                {
                    key: String(newId),
                    id: newId,
                    ...values,
                    registrationDate: dayjs().format("YYYY-MM-DD"),
                },
            ]);
            closeModal("add");
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Buscar...`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        className="btn-buscar"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button
                        className="btn-limpiar"
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Limpiar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filtrar
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        Cerrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#9cd522" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#C7DC5B", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const handleDelete = (record) => {
        modal.confirm({
            title: "¿Estás seguro?",
            content: `Se eliminará la propiedad: ${record.propertyName}`,
            okText: "Aceptar",
            okType: "danger",
            cancelText: "Cancelar",
            onOk: () => {
                setPropertiesData((prev) => prev.filter((item) => item.id !== record.id));
                message.success("Propiedad eliminada correctamente");
            },
        });
    };

    const getStatusColor = (status) => {
        return status === "Activo" ? "green" : "red";
    };

    const columns = [
        {
            title: "Imagen",
            dataIndex: "image",
            key: "image",
            align: "center",
            width: 80,
            render: (image, record) => (
                <Avatar
                    src={image}
                    alt={record.propertyName}
                    size={50}
                    shape="square"
                />
            ),
        },
        {
            title: "Nombre",
            dataIndex: "propertyName",
            key: "propertyName",
            ...getColumnSearchProps("propertyName"),
            sorter: (a, b) => a.propertyName.localeCompare(b.propertyName),
        },
        {
            title: "Dirección",
            dataIndex: "address",
            key: "address",
            ...getColumnSearchProps("address"),
        },
        {
            title: "Ciudad",
            dataIndex: "city",
            key: "city",
            align: "center",
        },
        {
            title: "Tipo",
            dataIndex: "propertyType",
            key: "propertyType",
            align: "center",
            filters: [
                { text: "Casa", value: "Casa" },
                { text: "Departamento", value: "Departamento" },
                { text: "Local Comercial", value: "Local Comercial" },
                { text: "Oficina", value: "Oficina" },
                { text: "Terreno", value: "Terreno" },
            ],
            onFilter: (value, record) => record.propertyType === value,
            render: (type) => (
                <Tag color="blue" style={{ fontSize: "13px" }}>
                    {type}
                </Tag>
            ),
        },
        {
            title: "Tipo de renta",
            dataIndex: "rentalType",
            key: "rentalType",
            align: "center",
            filters: [
                { text: "Completa", value: "Completa" },
                { text: "Por espacios", value: "Por espacios" },
            ],
            onFilter: (value, record) => record.rentalType === value,
            render: (type) => (
                <Tag color={type === "Completa" ? "purple" : "cyan"} style={{ fontSize: "13px" }}>
                    {type}
                </Tag>
            ),
        },
        {
            title: "Precio desde",
            dataIndex: "priceFrom",
            key: "priceFrom",
            align: "center",
            sorter: (a, b) => a.priceFrom - b.priceFrom,
            render: (price) => (
                <span className="font-semibold text-green-600">
                    ${price?.toLocaleString("es-MX")}
                </span>
            ),
        },
        {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            align: "center",
            filters: [
                { text: "Activo", value: "Activo" },
                { text: "Inactivo", value: "Inactivo" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag color={getStatusColor(status)} style={{ fontSize: "13px" }}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Ver detalles" color="blue">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            style={{ color: "#1890ff" }}
                            onClick={() => openModal("details", record)}
                        />
                    </Tooltip>
                    <Tooltip title="Editar" color="green">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            style={{ color: "#52c41a" }}
                            onClick={() => openModal("edit", record)}
                        />
                    </Tooltip>
                    <Tooltip title="Eliminar" color="red">
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="bg-linear-to-r from-[#84cc16] to-[#65a30d] px-6 py-6 md:py-3 rounded-md">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate("/admin/propietarios")}
                            className="text-[#111214] hover:bg-[#65a30d]"
                            size="large"
                        />
                        <div className="p-2">
                            <Building2 className="text-[#111214]" size={35} />
                        </div>
                        <div className="space-y-0">
                            <h1 className="text-xl md:text-2xl font-bold text-[#111214] leading-tight">
                                Propiedades de {owner?.name || "Propietario"}
                            </h1>
                            <h1 className="text-gray-700 text-sm mt-0.5">
                                {owner?.email || ""}
                            </h1>
                        </div>
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        className="h-11 rounded-lg shadow-lg w-11 md:w-auto p-0 md:px-4"
                        style={{
                            backgroundColor: "#C4D82E",
                            borderColor: "#C4D82E",
                            color: "#111214",
                        }}
                        onClick={() => openModal("add")}
                    >
                        <span className="hidden md:inline ml-2">Agregar</span>
                    </Button>
                </div>
            </div>

            {/* Tabla */}
            <div className="p-2">
                <div className="bg-white dark:bg-[#141414] rounded-md shadow-lg p-4 md:p-6">
                    <Table
                        columns={columns}
                        dataSource={propertiesData}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} propiedades`,
                        }}
                        locale={{
                            emptyText: (
                                <Empty
                                    description={
                                        <span>
                                            No hay propiedades registradas para este propietario.
                                            <br />
                                            Dale en "Agregar" para crear una.
                                        </span>
                                    }
                                />
                            ),
                        }}
                    />
                </div>
            </div>

            {/* Modal – Agregar */}
            <PropertyModal_Admin
                visible={modalState.add}
                onClose={() => closeModal("add")}
                onSave={handleSaveProperty}
                isEditing={false}
                selectedOwnerId={parseInt(ownerId)}
            />

            {/* Modal – Editar */}
            <PropertyModal_Admin
                visible={modalState.edit}
                onClose={() => closeModal("edit")}
                onSave={handleSaveProperty}
                editData={selectedProperty}
                isEditing={true}
            />

            {/* Modal – Detalles */}
            <PropertyDetailsModal_Admin
                visible={modalState.details}
                onClose={() => closeModal("details")}
                propertyData={selectedProperty}
                ownerData={owner}
            />
        </div>
    );
}