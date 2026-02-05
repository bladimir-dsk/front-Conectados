import { Button, Form, App, Select, InputNumber, Upload, Input } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { X } from "lucide-react";
import FormInput from "../../../../../components/inputs/FormInput";

const { TextArea } = Input;

const PropertyModal_Admin = ({
    visible,
    onClose,
    onSave,
    editData = null,
    isEditing = false,
    selectedOwnerId = null, // Este viene del ownerId de la URL
}) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [fileList, setFileList] = useState([]);

    const propertyTypeOptions = [
        { value: "Casa", label: "Casa" },
        { value: "Departamento", label: "Departamento" },
        { value: "Local Comercial", label: "Local Comercial" },
        { value: "Oficina", label: "Oficina" },
        { value: "Terreno", label: "Terreno" },
    ];

    const rentalTypeOptions = [
        { value: "Completa", label: "Completa" },
        { value: "Por espacios", label: "Por espacios" },
    ];

    const statusOptions = [
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
    ];

    useEffect(() => {
        if (visible) {
            if (isEditing && editData) {
                form.setFieldsValue({
                    propertyName: editData.propertyName,
                    address: editData.address,
                    city: editData.city,
                    state: editData.state,
                    zipCode: editData.zipCode,
                    propertyType: editData.propertyType,
                    rentalType: editData.rentalType,
                    priceFrom: editData.priceFrom,
                    status: editData.status,
                    description: editData.description,
                });
                if (editData.image) {
                    setFileList([
                        {
                            uid: "-1",
                            name: "imagen.jpg",
                            status: "done",
                            url: editData.image,
                        },
                    ]);
                }
            } else {
                form.resetFields();
                setFileList([]);
            }
        }
    }, [visible, isEditing, editData, form]);

    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                const imageUrl =
                    fileList.length > 0
                        ? fileList[0].url || fileList[0].thumbUrl
                        : editData?.image || "https://via.placeholder.com/400x300?text=Sin+Imagen";

                setTimeout(() => {
                    onSave({
                        ...values,
                        image: imageUrl,
                        ownerId: selectedOwnerId // Siempre usar el ownerId de la URL
                    });
                    message.success(
                        isEditing
                            ? "Propiedad actualizada correctamente"
                            : "Propiedad agregada correctamente"
                    );
                }, 600);
            })
            .catch(() => {
                message.error("Por favor complete todos los campos requeridos");
            });
    };

    const uploadProps = {
        fileList,
        onChange: ({ fileList: newFileList }) => setFileList(newFileList),
        beforeUpload: (file) => {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            const isValidType = allowedTypes.includes(file.type);

            if (!isValidType) {
                message.error("Solo se permiten archivos PNG, JPG o JPEG");
                return Upload.LIST_IGNORE; 
            }

            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error("La imagen debe ser menor a 5MB");
                return Upload.LIST_IGNORE;
            }

            return false;
        },
        accept: ".png,.jpg,.jpeg",
        listType: "picture",
        maxCount: 1,
    };

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
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {isEditing ? "Editar propiedad" : "Agregar propiedad"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-lime-200! transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <Form form={form} layout="vertical" autoComplete="off">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                {/* ELIMINADO EL SELECT DE PROPIETARIO */}

                                <FormInput
                                    name="propertyName"
                                    label="Nombre de la propiedad"
                                    placeholder="Ej: Casa Colonial Centro"
                                    rules={[
                                        {
                                            required: true,
                                            message: "El nombre es requerido",
                                        },
                                    ]}
                                    className="md:col-span-2"
                                />

                                <FormInput
                                    name="address"
                                    label="Dirección"
                                    placeholder="Calle 45 #123, Col. Centro"
                                    rules={[
                                        { required: true, message: "La dirección es requerida" },
                                    ]}
                                    className="md:col-span-2"
                                />

                                <FormInput
                                    name="city"
                                    label="Ciudad"
                                    placeholder="Mérida"
                                    rules={[{ required: true, message: "La ciudad es requerida" }]}
                                />

                                <FormInput
                                    name="state"
                                    label="Estado"
                                    placeholder="Yucatán"
                                    rules={[{ required: true, message: "El estado es requerido" }]}
                                />

                                <FormInput
                                    name="zipCode"
                                    label="Código Postal"
                                    placeholder="97000"
                                    rules={[
                                        { required: true, message: "El código postal es requerido" },
                                        {
                                            pattern: /^[0-9]{5}$/,
                                            message: "Debe tener 5 dígitos",
                                        },
                                    ]}
                                    inputProps={{ maxLength: 5 }}
                                />

                                <Form.Item
                                    name="propertyType"
                                    label="Tipo de propiedad"
                                    rules={[
                                        { required: true, message: "El tipo es requerido" },
                                    ]}
                                    hasFeedback
                                >
                                    <Select
                                        size="large"
                                        placeholder="Seleccione un tipo"
                                        options={propertyTypeOptions}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="rentalType"
                                    label="Tipo de renta"
                                    rules={[
                                        { required: true, message: "El tipo de renta es requerido" },
                                    ]}
                                    hasFeedback
                                >
                                    <Select
                                        size="large"
                                        placeholder="Seleccione tipo de renta"
                                        options={rentalTypeOptions}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="priceFrom"
                                    label="Precio desde (MXN)"
                                    rules={[
                                        { required: true, message: "El precio es requerido" },
                                    ]}
                                >
                                    <InputNumber
                                        size="large"
                                        placeholder="15000"
                                        style={{ width: "100%" }}
                                        min={0}
                                        formatter={(value) =>
                                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                        }
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="status"
                                    label="Estado"
                                    rules={[{ required: true, message: "El estado es requerido" }]}
                                    hasFeedback
                                >
                                    <Select
                                        size="large"
                                        placeholder="Seleccione un estado"
                                        options={statusOptions}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="image"
                                    label="Imagen de la propiedad"
                                    className="md:col-span-2"
                                >
                                    <Upload {...uploadProps}>
                                        <Button icon={<UploadOutlined />}>Seleccionar imagen</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item
                                    name="description"
                                    label="Descripción"
                                    rules={[
                                        { required: true, message: "La descripción es requerida" },
                                    ]}
                                    className="md:col-span-2"
                                    hasFeedback
                                >
                                    <TextArea
                                        rows={3}
                                        placeholder="Descripción de la propiedad"
                                        showCount
                                        maxLength={500}
                                    />
                                </Form.Item>
                            </div>
                        </Form>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-zinc-700">
                        <Button
                            size="middle"
                            danger
                            ghost
                            onClick={onClose}
                            className="h-8 px-4 rounded-lg"
                        >
                            Cancelar
                        </Button>
                        <Button
                            size="middle"
                            type="primary"
                            onClick={handleSubmit}
                            className="h-8 px-4 rounded-lg"
                        >
                            {isEditing ? "Actualizar" : "Guardar"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PropertyModal_Admin;