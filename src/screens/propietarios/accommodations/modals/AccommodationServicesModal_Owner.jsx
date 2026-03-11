import { Button, Table, Tag, Space, Tooltip, App, Spin } from "antd";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useApi } from "../../../../hooks/useApi";
import { useDeleteConfirmation } from "../../../../hooks/useDeleteConfirmation";
import { SERVICE_ICONS_CONFIG } from "../../../../components/icon/serviceIconsConfig";
import ServiceIconRenderer from "../../../../components/icon/Serviceiconrenderer";
import ServiceFormModal_Admin from "../../../admin/accommodations/modals/ServiceFormModal_Admin";

const AccommodationServicesModal_Owner = ({
    visible,
    onClose,
    accommodation,
}) => {
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [isEditingService, setIsEditingService] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [loadingModal, setLoadingModal] = useState(true);
    const { message } = App.useApp();

    const serviciosEndpoint = accommodation
        ? `/alojamiento-servicios/alojamiento/${accommodation.id_alojamiento}`
        : null;

    const {
        data: serviciosResponse,
        loading: loadingServicios,
        fetchData: fetchServicios,
    } = useApi(serviciosEndpoint, {}, false);

    const {
        data: catalogoServicios,
        loading: loadingCatalogo,
    } = useApi("/servicios", {}, visible);

    const { postData: crearServicio, loading: creando } = useApi("/alojamiento-servicios", {}, false);
    const { patchData: syncServicios, loading: actualizando } = useApi(
        serviciosEndpoint || "/alojamiento-servicios",
        {},
        false
    );
    const { deleteData: eliminarServicio } = useApi("/alojamiento-servicios", {}, false);

    useEffect(() => {
        if (visible && accommodation) {
            setLoadingModal(true);
            const timer = setTimeout(() => setLoadingModal(false));
            return () => clearTimeout(timer);
        }
    }, [visible, accommodation]);

    useEffect(() => {
        if (visible && accommodation && serviciosEndpoint) {
            fetchServicios();
        }
    }, [visible, accommodation, serviciosEndpoint]);

    const serviciosData = serviciosResponse?.servicios || [];
    const catalogoData = Array.isArray(catalogoServicios) ? catalogoServicios : [];

    const showDeleteConfirm = useDeleteConfirmation({ onDelete: eliminarServicio });

    const handleDelete = (record) => {
        showDeleteConfirm({
            title: "¿Estás seguro de eliminar este servicio?",
            itemName: record.nombre,
            entityName: "el servicio",
            recordId: record.id,
            successTitle: "Servicio eliminado",
            onSuccess: fetchServicios,
        });
    };

    const openAddModal = () => {
        setIsEditingService(false);
        setSelectedService(null);
        setFormModalVisible(true);
    };

    const openEditModal = (record) => {
        setIsEditingService(true);
        setSelectedService(record);
        setFormModalVisible(true);
    };

    const closeFormModal = () => {
        setFormModalVisible(false);
        setIsEditingService(false);
        setSelectedService(null);
    };

    const handleSaveService = async (values) => {
        try {
            if (isEditingService) {
                const serviciosActualizados = serviciosData.map((s) => ({
                    servicio_id: s.id,
                    costo:
                        s.id === values.servicio_id
                            ? values.costo || null
                            : s.costo
                            ? Number(s.costo)
                            : null,
                }));
                await syncServicios({ servicios: serviciosActualizados }, "sync");
                message.success("Servicio actualizado correctamente");
            } else {
                await crearServicio({
                    alojamiento_id: accommodation.id_alojamiento,
                    servicios: [{ servicio_id: values.servicio_id, costo: values.costo || null }],
                });
                message.success("Servicio agregado correctamente");
            }
            closeFormModal();
            fetchServicios();
        } catch (error) {
            message.error(
                error.response?.data?.message || error.message || "No se pudo guardar el servicio"
            );
        }
    };

    const handleCancel = () => {
        closeFormModal();
        onClose();
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return "—";
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(Number(price));
    };

    const getIconLabel = (iconKey) => {
        const config = SERVICE_ICONS_CONFIG[iconKey];
        return config?.label || iconKey || "—";
    };

    const dataSource = serviciosData.map((item) => ({ key: item.id, ...item }));

    const columns = [
        {
            title: "Servicio",
            dataIndex: "nombre",
            key: "nombre",
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: "Icono",
            dataIndex: "icono",
            key: "icono",
            align: "center",
            render: (icon) => (
                <div className="flex items-center justify-center gap-2">
                    <ServiceIconRenderer iconKey={icon} size={18} />
                    <span className="text-xs text-gray-500">{getIconLabel(icon)}</span>
                </div>
            ),
        },
        {
            title: "Costo",
            dataIndex: "costo",
            key: "costo",
            align: "center",
            render: (costo) => (
                <span className={costo ? "font-semibold" : "text-gray-400"}>
                    {formatPrice(costo)}
                </span>
            ),
        },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Editar" color="green">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            style={{ color: "#52c41a" }}
                            onClick={() => openEditModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Eliminar" color="red">
                        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    if (!visible) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/90 z-50 transition-opacity" onClick={handleCancel} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                Servicios del alojamiento
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {accommodation?.name}
                            </span>
                        </div>
                        <button onClick={handleCancel}>
                            <X size={24} className="text-gray-400 hover:text-gray-600 transition-colors" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-5">
                        <Spin spinning={loadingModal} tip="...">
                            <div className="flex justify-end mb-4">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={openAddModal}
                                    style={{ backgroundColor: "#C4D82E", borderColor: "#C4D82E", color: "#111214" }}
                                >
                                    Agregar
                                </Button>
                            </div>
                            <Table
                                columns={columns}
                                dataSource={dataSource}
                                loading={loadingServicios}
                                scroll={{ x: "max-content" }}
                                pagination={{
                                    pageSize: 10,
                                    showTotal: (total) => `Total ${total} servicios`,
                                    showSizeChanger: false,
                                }}
                                locale={{
                                    emptyText: loadingServicios
                                        ? null
                                        : "No hay servicios asignados. Agrega uno.",
                                }}
                            />
                        </Spin>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t dark:border-zinc-700 border-gray-200">
                        <Button onClick={handleCancel} size="large" type="primary" danger>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>

            <ServiceFormModal_Admin
                visible={formModalVisible}
                onClose={closeFormModal}
                onSave={handleSaveService}
                loading={isEditingService ? actualizando : creando}
                serviciosCatalogo={catalogoData}
                loadingServicios={loadingCatalogo}
                serviciosExistentes={serviciosData}
                isEditing={isEditingService}
                editData={selectedService}
            />
        </>
    );
};

export default AccommodationServicesModal_Owner;