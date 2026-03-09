import { useEffect, useState } from "react";
import { Button, Table, Tag, Space, Tooltip } from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { BedDouble, Warehouse } from "lucide-react";
import { useApi } from "../../../hooks/useApi";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import RoomFormModal_Owner from "./modals/RoomFormModal_Owner";
import BedsModal_Owner from "./modals/BedsModal_Owner";

const getStatusColor = (status) => {
    const map = { ACTIVO: "green", INACTIVO: "red", OCUPADO: "blue", MANTENIMIENTO: "orange", PENDIENTE: "gold" };
    return map[status] || "default";
};

const getStatusLabel = (status) => {
    const map = { ACTIVO: "Activo", INACTIVO: "Inactivo", OCUPADO: "Ocupado", MANTENIMIENTO: "Mantenimiento", PENDIENTE: "Pendiente" };
    return map[status] || status;
};

const formatPrice = (price) =>
    new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(Number(price));

const RoomsView_Owner = ({ accommodation, onBack }) => {
    const [paginacion, setPaginacion] = useState({
        paginaActual: 1,
        limite: 10,
        totalRegistros: 0,
        totalPaginas: 0,
    });
    const [isChangingPage, setIsChangingPage] = useState(false);
    const [formModal, setFormModal] = useState({ visible: false, editData: null });
    const [bedsModal, setBedsModal] = useState({ visible: false, room: null });
    const [refreshKey, setRefreshKey] = useState(0);

    const endpoint = `/cuartos/alojamiento/${accommodation.id_alojamiento}?page=${paginacion.paginaActual}&limit=${paginacion.limite}`;

    const {
        data: roomsResponse,
        loading: loadingRooms,
        fetchData: fetchRooms,
    } = useApi(endpoint, {}, false);

    const { deleteData: deleteRoom } = useApi("/cuartos", {}, false);

    useEffect(() => {
        fetchRooms();
    }, [endpoint, refreshKey]);

    useEffect(() => {
        if (roomsResponse?.meta) {
            setPaginacion((prev) => ({
                ...prev,
                totalRegistros: roomsResponse.meta.totalItems,
                totalPaginas: roomsResponse.meta.totalPages,
                paginaActual: roomsResponse.meta.currentPage,
            }));
            setIsChangingPage(false);
        }
    }, [roomsResponse]);

    const alojamientoInfo = roomsResponse?.alojamiento || accommodation;
    const cuartos = roomsResponse?.cuartos || [];

    const handlePageChange = (page) => {
        setIsChangingPage(true);
        setPaginacion((prev) => ({ ...prev, paginaActual: page }));
    };

    const openFormModal = (editData = null) => setFormModal({ visible: true, editData });
    const closeFormModal = () => setFormModal({ visible: false, editData: null });

    const handleSaveRoom = async () => {
        await fetchRooms();
        closeFormModal();
    };

    const showDeleteConfirm = useDeleteConfirmation({
        onDelete: async (id) => {
            await deleteRoom(id);
            setRefreshKey((k) => k + 1);
        },
    });

    const handleDelete = (record) => {
        showDeleteConfirm({
            title: "¿Estás seguro de eliminar este cuarto?",
            itemName: record.name,
            entityName: "el cuarto",
            recordId: record.id_cuarto,
            successTitle: "Cuarto eliminado",
        });
    };

    const dataSource = cuartos.map((item) => ({ key: item.id_cuarto, ...item }));

    const columns = [
        {
            title: "Identificación",
            dataIndex: "identification",
            key: "identification",
            width: 130,
            render: (text) => (
                <Tag color="blue" style={{ fontSize: "13px" }}>{text}</Tag>
            ),
        },
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Precio",
            dataIndex: "price",
            key: "price",
            align: "center",
            width: 120,
            sorter: (a, b) => Number(a.price) - Number(b.price),
            render: (price) => formatPrice(price),
        },
        {
            title: "Descripción",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Estado",
            dataIndex: "estatus",
            key: "estatus",
            align: "center",
            width: 140,
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
            width: 140,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Administrar camas" color="purple">
                        <Button
                            type="link"
                            icon={<BedDouble size={15} className="text-indigo-500!" />}
                            onClick={() => setBedsModal({ visible: true, room: record })}
                        />
                    </Tooltip>
                    <Tooltip title="Editar" color="green">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            style={{ color: "#52c41a" }}
                            onClick={() => openFormModal(record)}
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
                            onClick={onBack}
                            className="text-[#111214]! hover:bg-white/20!"
                            size="large"
                        />
                        <div className="p-2">
                            <Warehouse className="text-[#111214]!" size={35} />
                        </div>
                        <div className="space-y-0">
                            <h1 className="text-xl md:text-2xl font-bold text-[#111214] leading-tight">
                                Cuartos del alojamiento
                            </h1>
                            <h1 className="text-gray-800 text-sm mt-0.5">
                                {alojamientoInfo.name} — {alojamientoInfo.city}
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
                        onClick={() => openFormModal(null)}
                    >
                        <span className="hidden md:inline ml-2">Agregar</span>
                    </Button>
                </div>
            </div>

            {/* Info del alojamiento */}
            <div className="px-2 pt-3">
                <div className="flex flex-wrap gap-3 text-sm">
                    <Tag color="purple">{alojamientoInfo.typeProperty}</Tag>
                    <Tag color="cyan">
                        Precio completo: {formatPrice(alojamientoInfo.precio_completo)}
                    </Tag>
                    <Tag color={getStatusColor(alojamientoInfo.estatus)}>
                        {getStatusLabel(alojamientoInfo.estatus)}
                    </Tag>
                </div>
            </div>

            {/* Tabla */}
            <div className="p-2">
                <div className="bg-white dark:bg-[#141414] rounded-md shadow-lg p-4 md:p-6">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        loading={loadingRooms || isChangingPage}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            current: paginacion.paginaActual,
                            pageSize: paginacion.limite,
                            total: paginacion.totalRegistros,
                            showTotal: (total) => `Total ${total} cuartos`,
                            showSizeChanger: false,
                            onChange: handlePageChange,
                        }}
                        locale={{
                            emptyText: () => {
                                if (loadingRooms) return null;
                                return 'No hay cuartos registrados. Dale en "Agregar" para crear uno.';
                            },
                        }}
                    />
                </div>
            </div>

            {/* Modal agregar/editar cuarto */}
            <RoomFormModal_Owner
                visible={formModal.visible}
                onClose={closeFormModal}
                onSave={handleSaveRoom}
                editData={formModal.editData}
                idAlojamiento={accommodation.id_alojamiento}
            />

            {/* Modal administrar camas */}
            <BedsModal_Owner
                visible={bedsModal.visible}
                onClose={() => setBedsModal({ visible: false, room: null })}
                room={bedsModal.room}
            />
        </div>
    );
};

export default RoomsView_Owner;