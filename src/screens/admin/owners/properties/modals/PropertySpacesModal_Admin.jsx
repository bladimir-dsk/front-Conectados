import { Button, Form, App, InputNumber, Table, Space, Tooltip, Empty } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import FormInput from "../../../../../components/inputs/FormInput";

const PropertySpacesModal_Admin = ({
    visible,
    onClose,
    propertyData,
}) => {
    const [form] = Form.useForm();
    const { message, modal } = App.useApp();
    const [spaces, setSpaces] = useState([]);
    const [editingSpace, setEditingSpace] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (visible && propertyData) {
            // Cargar espacios existentes o inicializar vacío
            setSpaces(propertyData.spaces || []);
            form.resetFields();
            setEditingSpace(null);
            setIsEditing(false);
        }
    }, [visible, propertyData, form]);

    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                if (isEditing && editingSpace) {
                    // Editar espacio existente
                    setSpaces((prev) =>
                        prev.map((space) =>
                            space.id === editingSpace.id
                                ? { ...space, ...values }
                                : space
                        )
                    );
                    message.success("Espacio actualizado correctamente");
                } else {
                    // Agregar nuevo espacio
                    const newId = spaces.length > 0 ? Math.max(...spaces.map((s) => s.id)) + 1 : 1;
                    setSpaces((prev) => [
                        ...prev,
                        {
                            id: newId,
                            key: String(newId),
                            ...values,
                        },
                    ]);
                    message.success("Espacio agregado correctamente");
                }
                form.resetFields();
                setEditingSpace(null);
                setIsEditing(false);
            })
            .catch(() => {
                message.error("Por favor complete todos los campos requeridos");
            });
    };

    const handleEdit = (record) => {
        setEditingSpace(record);
        setIsEditing(true);
        form.setFieldsValue({
            spaceName: record.spaceName,
            spaceNumber: record.spaceNumber,
            monthlyPrice: record.monthlyPrice,
        });
    };

    const handleDelete = (record) => {
        modal.confirm({
            title: "¿Estás seguro?",
            content: `Se eliminará el espacio: ${record.spaceName}`,
            okText: "Aceptar",
            okType: "danger",
            cancelText: "Cancelar",
            onOk: () => {
                setSpaces((prev) => prev.filter((space) => space.id !== record.id));
                message.success("Espacio eliminado correctamente");
            },
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setEditingSpace(null);
        setIsEditing(false);
    };

    const handleSaveAll = () => {
        // Aquí guardarías los espacios en el backend o estado global
        message.success("Espacios guardados correctamente");
        onClose();
    };

    const columns = [
        {
            title: "Nombre",
            dataIndex: "spaceName",
            key: "spaceName",
        },
        {
            title: "Número/Identificador",
            dataIndex: "spaceNumber",
            key: "spaceNumber",
            align: "center",
        },
        {
            title: "Precio Mensual",
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
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Gestionar Espacios
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
                                {isEditing ? "Editar espacio" : "Agregar nuevo espacio"}
                            </h3>
                            <Form form={form} layout="vertical" autoComplete="off">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <FormInput
                                        name="spaceName"
                                        label="Nombre del espacio"
                                        placeholder="Ej: Habitación, Cuarto, Depto"
                                        rules={[
                                            {
                                                required: true,
                                                message: "El nombre es requerido",
                                            },
                                        ]}
                                    />

                                    <FormInput
                                        name="spaceNumber"
                                        label="Número/Identificador"
                                        placeholder="Ej: 101, A-1, Cuarto 3"
                                        rules={[
                                            {
                                                required: true,
                                                message: "El identificador es requerido",
                                            },
                                        ]}
                                    />

                                    <Form.Item
                                        name="monthlyPrice"
                                        label="Precio Mensual (MXN)"
                                        rules={[
                                            { required: true, message: "El precio es requerido" },
                                        ]}
                                    >
                                        <InputNumber
                                            size="large"
                                            placeholder="8000"
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

                        {/* Tabla de espacios */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Espacios registrados ({spaces.length})
                            </h3>
                            <Table
                                columns={columns}
                                dataSource={spaces}
                                pagination={false}
                                size="small"
                                locale={{
                                    emptyText: (
                                        <Empty
                                            description="No hay espacios registrados. Agrega el primero arriba."
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

export default PropertySpacesModal_Admin;