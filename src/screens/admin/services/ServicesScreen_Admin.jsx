import React, { useRef, useState } from "react";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tooltip, notification } from "antd";
import Highlighter from "react-highlight-words";
import { useApi } from "../../../hooks/useApi";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import ServiceModal_Admin from "./modals/ServiceModal_Admin";
import ServiceIconRenderer from "../../../components/icon/Serviceiconrenderer";
import { Wrench } from "lucide-react";

export default function ServicesScreen_Admin() {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [modalState, setModalState] = useState({
        add: false,
        edit: false,
    });
    const [selectedService, setSelectedService] = useState(null);

    const searchInput = useRef(null);
    const [api, contextHolder] = notification.useNotification();

    const {
        data: servicesData,
        loading: loadingServices,
        fetchData: fetchServices,
        deleteData: deleteService,
    } = useApi("/servicios");

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

    const openModal = (type, service = null) => {
        setModalState({ add: false, edit: false, [type]: true });
        setSelectedService(service);
    };

    const closeModal = (type) => {
        setModalState((prev) => ({ ...prev, [type]: false }));
        setSelectedService(null);
    };

    const handleSaveService = async () => {
        await fetchServices();
        closeModal("add");
        closeModal("edit");
    };

    const showDeleteConfirm = useDeleteConfirmation({
        onDelete: deleteService,
    });

    const handleDelete = (record) => {
        showDeleteConfirm({
            title: '¿Estás seguro de eliminar este servicio?',
            itemName: record.name,
            entityName: 'el servicio',
            recordId: record.id_servicio,
            successTitle: 'Servicio eliminado',
        });
    };

    const handleEdit = (record) => {
        openModal("edit", record);
    };

    const dataSource =
        servicesData
            ?.map((service) => ({
                key: service.id_servicio,
                id_servicio: service.id_servicio,
                name: service.name,
                icon: service.icon,
            })) || [];

    const columns = [
        {
            title: "Icono",
            dataIndex: "icon",
            key: "icon",
            align: "center",
            width: 80,
            render: (icon) => (
                <ServiceIconRenderer iconKey={icon} size={28} />
            ),
        },
        {
            title: "Nombre del Servicio",
            dataIndex: "name",
            key: "name",
            align: "center", 
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Acciones",
            key: "acciones",
            align: "center",
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Editar" color="green">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            style={{ color: "#52c41a" }}
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
            {contextHolder}

            {/* Header */}
            <div className="bg-linear-to-r from-[#84cc16] to-[#65a30d] px-6 py-6 md:py-3 rounded-md">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2">
                            <Wrench className="text-[#111214]!" size={35} />
                        </div>
                        <div className="space-y-0">
                            <h1 className="text-xl md:text-2xl font-bold text-[#111214] leading-tight">
                                Servicios
                            </h1>
                            <h1 className="text-gray-700 text-sm mt-0.5">
                                Administra y organiza los servicios disponibles.
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
                        loading={loadingServices}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} servicios`,
                        }}
                        locale={{
                            emptyText: () => {
                                if (!loadingServices && servicesData?.length === 0) {
                                    return 'No hay servicios registrados aún. Dale en "Agregar" para crear uno.';
                                }
                                return "No se encontraron servicios";
                            },
                        }}
                    />
                </div>
            </div>

            <ServiceModal_Admin
                visible={modalState.add}
                onClose={() => closeModal("add")}
                onSave={handleSaveService}
                isEditing={false}
            />

            <ServiceModal_Admin
                visible={modalState.edit}
                onClose={() => closeModal("edit")}
                onSave={handleSaveService}
                editData={selectedService}
                isEditing={true}
            />
        </div>
    );
}