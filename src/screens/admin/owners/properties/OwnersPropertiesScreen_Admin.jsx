import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Input, Space, Table, Tag, notification } from "antd";
import {
    ArrowLeftOutlined,
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import { House, Images, Warehouse } from "lucide-react";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useDeleteConfirmation } from "../../../../hooks/useDeleteConfirmation";
import { useApi } from "../../../../hooks/useApi";
import AccommodationDetailModal_Admin from "../../accommodations/modals/AccommodationDetailModal_Admin";
import AccommodationServicesModal_Admin from "../../accommodations/modals/AccommodationServicesModal_Admin";
import OwnerRoomsView_Admin from "../OwnerRoomsView_Admin";
import { Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import AccommodationPhotosModal_Admin from "../../accommodations/modals/AccommodationPhotosModal_Admin";
import AccommodationOwnerModal_Admin from "../modals/AccommodationOwnerModal_Admin";


dayjs.locale("es");

export default function OwnersPropertiesScreen_Admin() {
    const { ownerId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    const owner = location.state?.owner;

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const [photosAccommodation, setPhotosAccommodation] = useState(null);

    const [modalState, setModalState] = useState({
        add: false,
        edit: false,
        detail: false,
        services: false,
    });
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [servicesAccommodation, setServicesAccommodation] = useState(null);
    const [roomsViewAccommodation, setRoomsViewAccommodation] = useState(null);

    // Filtros server-side
    const [filtros, setFiltros] = useState({
        name: "",
        typeProperty: [],
        gender: [],
        typeIncome: [],
        city: "",
    });

    const [paginacion, setPaginacion] = useState({
        paginaActual: 1,
        limite: 10,
        totalRegistros: 0,
        totalPaginas: 0,
    });

    const construirURL = (pagina = 1) => {
        const params = new URLSearchParams();
        params.append("page", pagina.toString());
        params.append("limit", paginacion.limite.toString());

        if (filtros.name) params.append("name", filtros.name);
        if (filtros.city) params.append("city", filtros.city);
        if (filtros.typeProperty && filtros.typeProperty.length > 0) {
            params.append("typeProperty", filtros.typeProperty.join(","));
        }
        if (filtros.gender && filtros.gender.length > 0) {
            params.append("gender", filtros.gender.join(","));
        }
        if (filtros.typeIncome && filtros.typeIncome.length > 0) {
            params.append("typeIncome", filtros.typeIncome.join(","));
        }

        return `/alojamientos/alojamientos/propietario/${ownerId}?${params.toString()}`;
    };

    const [endpointPaginacion, setEndpointPaginacion] = useState(() =>
        construirURL(1)
    );

    const {
        data: propertiesResponse,
        loading: loadingProperties,
        fetchData: fetchProperties,
        deleteData: deleteProperty,
    } = useApi(endpointPaginacion, {}, false);

    // Búsqueda global
    const handleGlobalSearch = (value, field) => {
        setFiltros((prev) => ({
            ...prev,
            [field]: value,
        }));
        setPaginacion((prev) => ({
            ...prev,
            paginaActual: 1,
        }));
    };

    // Reaccionar a cambios de filtros/paginación
    useEffect(() => {
        const url = construirURL(paginacion.paginaActual);
        setEndpointPaginacion(url);
    }, [filtros, paginacion.paginaActual, paginacion.limite]);

    useEffect(() => {
        if (endpointPaginacion) {
            fetchProperties();
        }
    }, [endpointPaginacion]);

    useEffect(() => {
        if (propertiesResponse?.meta) {
            setPaginacion((prev) => ({
                ...prev,
                paginaActual: propertiesResponse.meta.currentPage,
                totalRegistros: propertiesResponse.meta.totalItems,
                totalPaginas: propertiesResponse.meta.totalPages,
                limite: propertiesResponse.meta.itemsPerPage,
            }));
            setIsChangingPage(false);
        }
    }, [propertiesResponse]);

    const propertiesData = propertiesResponse?.data || [];

    // Modales
    const openModal = (type, accommodation = null) => {
        setModalState((prev) => ({ ...prev, [type]: true }));
        if (type === "services") {
            setServicesAccommodation(accommodation);
        } else {
            setSelectedAccommodation(accommodation);
        }
    };

    const closeModal = (type) => {
        setModalState((prev) => ({ ...prev, [type]: false }));
        if (type === "services") {
            setServicesAccommodation(null);
        } else {
            setSelectedAccommodation(null);
        }
    };

    const handleSaveAccommodation = async () => {
        await fetchProperties();
        closeModal("add");
        closeModal("edit");
    };

    // Eliminación
    const showDeleteConfirm = useDeleteConfirmation({
        onDelete: deleteProperty,
    });

    const handleDelete = (record) => {
        showDeleteConfirm({
            title: "¿Estás seguro de eliminar este alojamiento?",
            itemName: record.name,
            entityName: "el alojamiento",
            recordId: record.id_alojamiento,
            successTitle: "Alojamiento eliminado",
            onSuccess: fetchProperties,
        });
    };

    // Cambio de página
    const handlePageChange = (page) => {
        setIsChangingPage(true);
        setPaginacion((prev) => ({
            ...prev,
            paginaActual: page,
        }));
    };

    // Manejar cambios en filtros de la tabla (selects)
    const handleTableChange = (_pagination, filters) => {
        const filterMapping = {
            typeProperty: "typeProperty",
            gender: "gender",
            typeIncome: "typeIncome",
        };

        let changed = false;
        const newFiltros = { ...filtros };

        Object.entries(filterMapping).forEach(([columnKey, filtroKey]) => {
            if (filters[columnKey] !== undefined) {
                const nuevosValores = filters[columnKey] || [];
                if (JSON.stringify(nuevosValores) !== JSON.stringify(filtros[filtroKey])) {
                    newFiltros[filtroKey] = nuevosValores;
                    changed = true;
                }
            }
        });

        if (changed) {
            setFiltros(newFiltros);
            setPaginacion((prev) => ({ ...prev, paginaActual: 1 }));
        }
    };

    // Búsqueda por columna (texto)
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        const value = selectedKeys[0] || "";
        handleGlobalSearch(value, dataIndex);
        setSearchText(value);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText("");
        handleGlobalSearch("", dataIndex);
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
                    placeholder="Buscar..."
                    value={selectedKeys[0] || ""}
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
                        onClick={() =>
                            clearFilters && handleReset(clearFilters, dataIndex)
                        }
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
        filterIcon: () => (
            <SearchOutlined
                style={{
                    color: filtros[dataIndex] ? "#0B733E" : undefined,
                }}
            />
        ),
        filteredValue: filtros[dataIndex] ? [filtros[dataIndex]] : null,
        onFilter: () => true,
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select?.());
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

    const getStatusColor = (status) => {
        const map = {
            ACTIVO: "green",
            INACTIVO: "red",
            OCUPADO: "blue",
            MANTENIMIENTO: "orange",
            PENDIENTE: "gold",
        };
        return map[status] || "default";
    };

    const getStatusLabel = (status) => {
        const map = {
            ACTIVO: "Activo",
            INACTIVO: "Inactivo",
            OCUPADO: "Ocupado",
            MANTENIMIENTO: "Mantenimiento",
            PENDIENTE: "Pendiente",
        };
        return map[status] || status;
    };

    const getTypeIncomeColor = (type) => {
        const map = {
            ALOJAMIENTO_COMPLETO: "purple",
            CUARTO: "cyan",
            CAMA: "geekblue",
            ESPACIO: "magenta",
        };
        return map[type] || "default";
    };

    const getTypeIncomeLabel = (type) => {
        const map = {
            ALOJAMIENTO_COMPLETO: "Alojamiento completo",
            CUARTO: "Cuarto",
            CAMA: "Cama",
            ESPACIO: "Espacio",
        };
        return map[type] || type;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(Number(price));
    };

    const dataSource = propertiesData.map((property) => ({
        key: property.id_alojamiento,
        ...property,
    }));

    const columns = [
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Tipo propiedad",
            dataIndex: "typeProperty",
            key: "typeProperty",
            align: "center",
            filters: [
                { text: "Casa", value: "Casa" },
                { text: "Departamento", value: "Departamento" },
                { text: "Cuarto", value: "Cuarto" },
            ],
            filteredValue:
                filtros.typeProperty && filtros.typeProperty.length > 0
                    ? filtros.typeProperty
                    : null,
            onFilter: () => true,
            render: (type) => <Tag>{type}</Tag>,
        },
        {
            title: "Ciudad",
            dataIndex: "city",
            key: "city",
            ...getColumnSearchProps("city"),
            sorter: (a, b) => a.city.localeCompare(b.city),
        },
        {
            title: "Género",
            dataIndex: "gender",
            key: "gender",
            align: "center",
            filters: [
                { text: "Mixto", value: "Mixto" },
                { text: "Masculino", value: "Masculino" },
                { text: "Femenino", value: "Femenino" },
            ],
            filteredValue:
                filtros.gender && filtros.gender.length > 0 ? filtros.gender : null,
            onFilter: () => true,
        },
        {
            title: "Tipo de renta",
            dataIndex: "typeIncome",
            key: "typeIncome",
            align: "center",
            filters: [
                { text: "Alojamiento completo", value: "ALOJAMIENTO_COMPLETO" },
                { text: "Espacio", value: "ESPACIO" },
            ],
            filteredValue:
                filtros.typeIncome && filtros.typeIncome.length > 0
                    ? filtros.typeIncome
                    : null,
            onFilter: () => true,
            render: (type) => (
                <Tag color={getTypeIncomeColor(type)}>{getTypeIncomeLabel(type)}</Tag>
            ),
        },
        {
            title: "Precio",
            dataIndex: "precio_completo",
            key: "precio_completo",
            align: "center",
            sorter: (a, b) => Number(a.precio_completo) - Number(b.precio_completo),
            render: (price) => formatPrice(price),
        },
        {
            title: "Capacidad",
            dataIndex: "capacity",
            key: "capacity",
            align: "center",
            sorter: (a, b) => (a.capacity || 0) - (b.capacity || 0),
            render: (capacity) =>
                capacity ? (
                    <Tag color="blue">{capacity} persona{capacity !== 1 ? "s" : ""}</Tag>
                ) : (
                    <span className="text-gray-400">—</span>
                ),
        },
        {
            title: "Estado",
            dataIndex: "estatus",
            key: "estatus",
            align: "center",
            render: (status) => (
                <Tag color={getStatusColor(status)} style={{ fontSize: "13px" }}>
                    {getStatusLabel(status)}
                </Tag>
            ),
        },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            width: 60,
            render: (_, record) => {
                const items = [
                    {
                        key: "detail",
                        label: "Ver detalle",
                        icon: <EyeOutlined style={{ color: "#1677ff" }} />,
                        onClick: () => openModal("detail", record),
                    },
                    {
                        key: "photos",
                        label: "Agregar fotos",
                        icon: <Images size={14} className="text-fuchsia-500!" />,
                        onClick: () => setPhotosAccommodation(record),
                    },
                    {
                        key: "services",
                        label: "Servicios",
                        icon: <ToolOutlined style={{ color: "#722ed1" }} />,
                        onClick: () => openModal("services", record),
                    },
                    ...(record.typeIncome === "ESPACIO"
                        ? [
                            {
                                key: "rooms",
                                label: "Administrar cuartos",
                                icon: <Warehouse size={14} className="text-orange-500!" />,
                                onClick: () => setRoomsViewAccommodation(record),
                            },
                        ]
                        : []),
                    { type: "divider" },
                    {
                        key: "edit",
                        label: "Editar",
                        icon: <EditOutlined style={{ color: "#52c41a" }} />,
                        onClick: () => openModal("edit", record),
                    },
                    {
                        key: "delete",
                        label: "Eliminar",
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => handleDelete(record),
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                        <Button
                            type="text"
                            icon={<MoreOutlined style={{ fontSize: 18 }} />}
                        />
                    </Dropdown>
                );
            },
        },
    ];

    // Si se seleccionó un alojamiento para ver cuartos, mostrar esa vista
    if (roomsViewAccommodation) {
        return (
            <OwnerRoomsView_Admin
                accommodation={roomsViewAccommodation}
                onBack={() => setRoomsViewAccommodation(null)}
            />
        );
    }

    return (
        <div>
            {contextHolder}

            {/* Header */}
            <div className="bg-linear-to-r from-[#84cc16] to-[#65a30d] px-6 py-6 md:py-3 rounded-md">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate("/admin/propietarios")}
                            className="text-[#111214]! hover:bg-[#65a30d]!"
                            size="large"
                        />
                        <div className="p-2">
                            <House className="text-[#111214]" size={35} />
                        </div>
                        <div className="space-y-0">
                            <h1 className="text-xl md:text-2xl font-bold text-[#111214] leading-tight">
                                Alojamientos de{" "}
                                {owner?.namePersonal || owner?.name || "Propietario"}{" "}
                                {owner?.lastName || ""}
                            </h1>
                            <h1 className="text-gray-700 text-sm mt-0.5">
                                {owner?.emailPersonal || owner?.email || ""}
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
                        dataSource={dataSource}
                        loading={loadingProperties || isChangingPage}
                        scroll={{ x: "max-content" }}
                        onChange={handleTableChange}
                        pagination={{
                            current: paginacion.paginaActual,
                            pageSize: paginacion.limite,
                            total: paginacion.totalRegistros,
                            showTotal: (total) => `Total ${total} alojamientos`,
                            showSizeChanger: false,
                            onChange: handlePageChange,
                        }}
                        locale={{
                            emptyText: () => {
                                if (loadingProperties) return null;

                                const hayFiltrosActivos =
                                    filtros.name ||
                                    filtros.city ||
                                    (filtros.typeProperty && filtros.typeProperty.length > 0) ||
                                    (filtros.gender && filtros.gender.length > 0) ||
                                    (filtros.typeIncome && filtros.typeIncome.length > 0);

                                if (hayFiltrosActivos) {
                                    return "No se encontraron alojamientos con los filtros aplicados.";
                                }

                                return 'No hay alojamientos registrados para este propietario. Dale en "Agregar" para crear uno.';
                            },
                        }}
                    />
                </div>
            </div>

            <AccommodationOwnerModal_Admin
                visible={modalState.add}
                onClose={() => closeModal("add")}
                onSave={handleSaveAccommodation}
                ownerId={ownerId}
                isEditing={false}
            />

            <AccommodationOwnerModal_Admin
                visible={modalState.edit}
                onClose={() => closeModal("edit")}
                onSave={handleSaveAccommodation}
                ownerId={ownerId}
                editData={selectedAccommodation}
                isEditing={true}
            />

            {/* Modal – Detalle alojamiento */}
            <AccommodationDetailModal_Admin
                visible={modalState.detail}
                onClose={() => closeModal("detail")}
                data={selectedAccommodation}
            />

            {/* Modal – Servicios alojamiento */}
            <AccommodationServicesModal_Admin
                visible={modalState.services}
                onClose={() => closeModal("services")}
                accommodation={servicesAccommodation}
            />

            <AccommodationPhotosModal_Admin
                visible={!!photosAccommodation}
                onClose={() => setPhotosAccommodation(null)}
                accommodation={photosAccommodation}
                onPhotosChanged={() => fetchProperties()}
            />
        </div>
    );
}