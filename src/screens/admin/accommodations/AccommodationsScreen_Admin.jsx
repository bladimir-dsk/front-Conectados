import { useRef, useState, useEffect } from "react";
import { Button, Input, Space, Table, Tag, Tooltip, notification } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Building2, Warehouse } from "lucide-react";
import { useApi } from "../../../hooks/useApi";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import AccommodationModal_Admin from "./modals/AccommodationModal_Admin";
import AccommodationDetailModal_Admin from "./modals/AccommodationDetailModal_Admin";
import AccommodationServicesModal_Admin from "./modals/AccommodationServicesModal_Admin";
import RoomsView_Admin from "./RoomsView_Admin";
dayjs.locale("es");

export default function AccommodationsScreen_Admin() {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [modalState, setModalState] = useState({ add: false, edit: false, detail: false, services: false });
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [servicesAccommodation, setServicesAccommodation] = useState(null);
    const [roomsViewAccommodation, setRoomsViewAccommodation] = useState(null);
    const [isChangingPage, setIsChangingPage] = useState(false);

    const [filtros, setFiltros] = useState({
        name: "",
        typeProperty: [],
        gender: [],
        typeIncome: [],
        city: "",
        estatus: [],
    });

    const [paginacion, setPaginacion] = useState({
        paginaActual: 1,
        limite: 10,
        totalRegistros: 0,
        totalPaginas: 0,
    });

    const searchInput = useRef(null);
    const [api, contextHolder] = notification.useNotification();

    const construirURL = (pagina = 1) => {
        const params = new URLSearchParams();
        params.append("page", pagina.toString());
        params.append("limit", paginacion.limite.toString());

        if (filtros.name) params.append("name", filtros.name);
        if (filtros.city) params.append("city", filtros.city);
        if (filtros.typeProperty.length > 0)
            params.append("typeProperty", filtros.typeProperty.join(","));
        if (filtros.gender.length > 0)
            params.append("gender", filtros.gender.join(","));
        if (filtros.typeIncome.length > 0)
            params.append("typeIncome", filtros.typeIncome.join(","));
        if (filtros.estatus.length > 0)
            params.append("estatus", filtros.estatus.join(","));

        return `/alojamientos?${params.toString()}`;
    };

    const [endpointPaginacion, setEndpointPaginacion] = useState(() =>
        construirURL(1)
    );

    const {
        data: accommodationsResponse,
        loading: loadingAccommodations,
        fetchData: fetchAccommodations,
        deleteData: deleteAccommodation,
    } = useApi(endpointPaginacion, {}, false);

    const handleGlobalSearch = (value, field) => {
        setFiltros((prev) => ({
            ...prev,
            [field]: value,
        }));
        setPaginacion((prev) => ({ ...prev, paginaActual: 1 }));
    };

    useEffect(() => {
        const url = construirURL(paginacion.paginaActual);
        setEndpointPaginacion(url);
    }, [filtros, paginacion.paginaActual, paginacion.limite]);

    useEffect(() => {
        if (endpointPaginacion) {
            fetchAccommodations();
        }
    }, [endpointPaginacion]);

    useEffect(() => {
        if (accommodationsResponse?.meta) {
            setPaginacion((prev) => ({
                ...prev,
                totalRegistros: accommodationsResponse.meta.totalItems,
                totalPaginas: accommodationsResponse.meta.totalPages,
                paginaActual: accommodationsResponse.meta.currentPage,
            }));
            setIsChangingPage(false);
        }
    }, [accommodationsResponse]);

    const accommodationsData = accommodationsResponse?.data || [];

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
        await fetchAccommodations();
        closeModal("add");
        closeModal("edit");
    };

    const showDeleteConfirm = useDeleteConfirmation({
        onDelete: deleteAccommodation,
    });

    const handleDelete = (record) => {
        showDeleteConfirm({
            title: "¿Estás seguro de eliminar este alojamiento?",
            itemName: record.name,
            entityName: "el alojamiento",
            recordId: record.id_alojamiento,
            successTitle: "Alojamiento eliminado",
            onSuccess: fetchAccommodations,
        });
    };

    const handleTableChange = (_pagination, filters) => {
        const filterMapping = {
            typeProperty: "typeProperty",
            gender: "gender",
            typeIncome: "typeIncome",
            estatus: "estatus",
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

    const handlePageChange = (page) => {
        setIsChangingPage(true);
        setPaginacion((prev) => ({ ...prev, paginaActual: page }));
    };

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
                        onClick={() => clearFilters && handleReset(clearFilters, dataIndex)}
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
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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

    const dataSource = accommodationsData.map((item) => ({
        key: item.id_alojamiento,
        ...item,
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
                filtros.typeProperty.length > 0 ? filtros.typeProperty : null,
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
            filteredValue: filtros.gender.length > 0 ? filtros.gender : null,
            onFilter: () => true,
        },
        {
            title: "Tipo ingreso",
            dataIndex: "typeIncome",
            key: "typeIncome",
            align: "center",
            filters: [
                { text: "Alojamiento completo", value: "ALOJAMIENTO_COMPLETO" },
                { text: "Cuarto", value: "CUARTO" },
                { text: "Cama", value: "CAMA" },
                { text: "Espacio", value: "ESPACIO" },
            ],
            filteredValue: filtros.typeIncome.length > 0 ? filtros.typeIncome : null,
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
            title: "Estado",
            dataIndex: "estatus",
            key: "estatus",
            align: "center",
            filters: [
                { text: "Activo", value: "ACTIVO" },
                { text: "Inactivo", value: "INACTIVO" },
                { text: "Ocupado", value: "OCUPADO" },
                { text: "Mantenimiento", value: "MANTENIMIENTO" },
                { text: "Pendiente", value: "PENDIENTE" },
            ],
            filteredValue: filtros.estatus.length > 0 ? filtros.estatus : null,
            onFilter: () => true,
            render: (status) => (
                <Tag color={getStatusColor(status)} style={{ fontSize: "13px" }}>
                    {getStatusLabel(status)}
                </Tag>
            ),
        },
        {
            title: "Propietario",
            key: "propietario",
            render: (_, record) =>
                record.propietario
                    ? `${record.propietario.namePersonal} ${record.propietario.lastName}`
                    : "—",
        },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            width: 180,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Ver detalle" color="blue">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            style={{ color: "#1677ff" }}
                            onClick={() => openModal("detail", record)}
                        />
                    </Tooltip>
                    <Tooltip title="Servicios" color="purple">
                        <Button
                            type="link"
                            icon={<ToolOutlined />}
                            style={{ color: "#722ed1" }}
                            onClick={() => openModal("services", record)}
                        />
                    </Tooltip>
                    {record.typeIncome === "ESPACIO" && (
                        <Tooltip title="Administrar cuartos" color="orange">
                            <Button
                                type="link"
                                icon={<Warehouse size={15} className="text-orange-500!" />}
                                onClick={() => setRoomsViewAccommodation(record)}
                            />
                        </Tooltip>
                    )}
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

    if (roomsViewAccommodation) {
        return (
            <RoomsView_Admin
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
                        <div className="p-2">
                            <Building2 className="text-[#111214]!" size={35} />
                        </div>
                        <div className="space-y-0">
                            <h1 className="text-xl md:text-2xl font-bold text-[#111214] leading-tight">
                                Alojamientos
                            </h1>
                            <h1 className="text-gray-700 text-sm mt-0.5">
                                Administra y organiza los alojamientos registrados.
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
                        loading={loadingAccommodations || isChangingPage}
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
                                if (loadingAccommodations) return null;

                                const hayFiltrosActivos =
                                    filtros.name ||
                                    filtros.city ||
                                    filtros.typeProperty.length > 0 ||
                                    filtros.gender.length > 0 ||
                                    filtros.typeIncome.length > 0 ||
                                    filtros.estatus.length > 0;

                                if (hayFiltrosActivos) {
                                    return "No se encontraron alojamientos con los filtros aplicados.";
                                }

                                return 'No hay alojamientos registrados aún. Dale en "Agregar" para crear uno.';
                            },
                        }}
                    />
                </div>
            </div>

            {/* Modal – Agregar */}
            <AccommodationModal_Admin
                visible={modalState.add}
                onClose={() => closeModal("add")}
                onSave={handleSaveAccommodation}
                isEditing={false}
            />

            {/* Modal – Editar */}
            <AccommodationModal_Admin
                visible={modalState.edit}
                onClose={() => closeModal("edit")}
                onSave={handleSaveAccommodation}
                editData={selectedAccommodation}
                isEditing={true}
            />

            {/* Modal – Detalle */}
            <AccommodationDetailModal_Admin
                visible={modalState.detail}
                onClose={() => closeModal("detail")}
                data={selectedAccommodation}
            />

            {/* Modal – Servicios */}
            <AccommodationServicesModal_Admin
                visible={modalState.services}
                onClose={() => closeModal("services")}
                accommodation={servicesAccommodation}
            />
        </div>
    );
}