import { Button, Form, App, InputNumber, Table, Space, Tooltip, Empty, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getServiceIcon, getServiceIconOptions } from "../../../../../components/icon/serviceIconsConfig";

const PropertyServicesModal_Admin = ({
    visible,
    onClose,
    propertyData,
}) => {
    const [form] = Form.useForm();
    const { message, modal } = App.useApp();
    const [services, setServices] = useState([]);
    const [editingService, setEditingService] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Obtener las opciones de servicios disponibles
    const serviceOptions = getServiceIconOptions();

    useEffect(() => {
        if (visible && propertyData) {
            // Cargar servicios existentes o inicializar vacío
            setServices(propertyData.services || []);
            form.resetFields();
            setEditingService(null);
            setIsEditing(false);
        }
    }, [visible, propertyData, form]);

    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                // Buscar la información completa del servicio seleccionado
                const selectedService = serviceOptions.find(s => s.value === values.serviceType);
                
                if (isEditing && editingService) {
                    // Editar servicio existente
                    setServices((prev) =>
                        prev.map((service) =>
                            service.id === editingService.id
                                ? { 
                                    ...service, 
                                    serviceType: values.serviceType,
                                    serviceName: selectedService.label,
                                    icon: selectedService.value,
                                    monthlyPrice: values.monthlyPrice 
                                }
                                : service
                        )
                    );
                    message.success("Servicio actualizado correctamente");
                } else {
                    // Agregar nuevo servicio
                    const newId = services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;
                    setServices((prev) => [
                        ...prev,
                        {
                            id: newId,
                            key: String(newId),
                            serviceType: values.serviceType,
                            serviceName: selectedService.label,
                            icon: selectedService.value,
                            monthlyPrice: values.monthlyPrice,
                        },
                    ]);
                    message.success("Servicio agregado correctamente");
                }
                form.resetFields();
                setEditingService(null);
                setIsEditing(false);
            })
            .catch(() => {
                message.error("Por favor complete todos los campos requeridos");
            });
    };

    const handleEdit = (record) => {
        setEditingService(record);
        setIsEditing(true);
        form.setFieldsValue({
            serviceType: record.serviceType || record.icon,
            monthlyPrice: record.monthlyPrice,
        });
    };

    const handleDelete = (record) => {
        modal.confirm({
            title: "¿Estás seguro?",
            content: `Se eliminará el servicio: ${record.serviceName}`,
            okText: "Aceptar",
            okType: "danger",
            cancelText: "Cancelar",
            onOk: () => {
                setServices((prev) => prev.filter((service) => service.id !== record.id));
                message.success("Servicio eliminado correctamente");
            },
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setEditingService(null);
        setIsEditing(false);
    };

    const handleSaveAll = () => {
        // Aquí guardarías los servicios en el backend o estado global
        message.success("Servicios guardados correctamente");
        onClose();
    };

    const columns = [
        {
            title: "Icono",
            dataIndex: "icon",
            key: "icon",
            align: "center",
            width: 80,
            render: (iconKey) => {
                const { icon: IconComponent, color } = getServiceIcon(iconKey);
                return (
                    <div className="flex justify-center">
                        <IconComponent size={24} color={color} />
                    </div>
                );
            },
        },
        {
            title: "Nombre del servicio",
            dataIndex: "serviceName",
            key: "serviceName",
        },
        {
            title: "Precio mensual",
            dataIndex: "monthlyPrice",
            key: "monthlyPrice",
            align: "center",
            render: (price) => (
                <span className="font-semibold text-green-600">
                    ${price?.toLocaleString("es-MX")}
                </span>
            ),
        },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            width: 100,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Editar">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            style={{ color: "#52c41a" }}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Eliminar">
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

    if (!visible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center backdrop-blur-md justify-center p-4">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Gestionar servicios
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {propertyData?.propertyName}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-lime-200! transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {/* Formulario para agregar/editar */}
                        <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                {isEditing ? "Editar servicio" : "Agregar nuevo servicio"}
                            </h3>
                            <Form form={form} layout="vertical" autoComplete="off">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Form.Item
                                        name="serviceType"
                                        label="Tipo de servicio"
                                        rules={[
                                            { required: true, message: "Seleccione un servicio" },
                                        ]}
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Seleccione un servicio"
                                            optionLabelProp="label"
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            {serviceOptions.map(({ value, label, icon: Icon, color }) => (
                                                <Select.Option key={value} value={value} label={label}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon size={18} color={color} />
                                                        <span>{label}</span>
                                                    </div>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="monthlyPrice"
                                        label="Precio mensual (MXN)"
                                        rules={[
                                            { required: true, message: "El precio es requerido" },
                                        ]}
                                    >
                                        <InputNumber
                                            size="large"
                                            placeholder="500"
                                            style={{ width: "100%" }}
                                            min={0}
                                            formatter={(value) =>
                                                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            }
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="flex gap-2 justify-end mt-2">
                                    {isEditing && (
                                        <Button danger onClick={handleCancel}>
                                            Cancelar
                                        </Button>
                                    )}
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={handleSubmit}
                                    >
                                        {isEditing ? "Actualizar" : "Agregar"}
                                    </Button>
                                </div>
                            </Form>
                        </div>

                        {/* Tabla de servicios */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Servicios registrados ({services.length})
                            </h3>
                            <Table
                                columns={columns}
                                dataSource={services}
                                pagination={false}
                                size="small"
                                locale={{
                                    emptyText: (
                                        <Empty
                                            description="No hay servicios registrados. Agrega el primero arriba."
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
                                    ),
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-zinc-700">
                        <Button size="middle" danger onClick={onClose}>
                            Cerrar
                        </Button>
                        <Button
                            size="middle"
                            type="primary"
                            onClick={handleSaveAll}
                        >
                            Guardar cambios
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PropertyServicesModal_Admin;