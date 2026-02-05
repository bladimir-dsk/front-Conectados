import { Button, Form, App, Select } from "antd";
import { useEffect } from "react";
import FormInput from "../../../../components/inputs/FormInput";
import { X } from "lucide-react";

const OwnerModal_Admin = ({
    visible,
    onClose,
    onSave,
    editData = null,
    isEditing = false,
}) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const statusOptions = [
        { value: "Verificado", label: "Verificado" },
        { value: "Pendiente", label: "Pendiente" },
        { value: "Suspendido", label: "Suspendido" },
    ];

    useEffect(() => {
        if (visible) {
            if (isEditing && editData) {
                form.setFieldsValue({
                    name: editData.name,
                    email: editData.email,
                    phone: editData.phone,
                    status: editData.status,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, isEditing, editData, form]);

    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                setTimeout(() => {
                    onSave(values);
                    message.success(
                        isEditing
                            ? "Propietario actualizado correctamente"
                            : "Propietario agregado correctamente",
                    );
                }, 600);
            })
            .catch(() => {
                message.error("Por favor complete todos los campos requeridos");
            });
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
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {isEditing ? "Editar propietario" : "Agregar propietario"}
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
                            <FormInput
                                name="name"
                                label="Nombre completo"
                                placeholder="Ej: Ana López"
                                rules={[
                                    { required: true, message: "El nombre es requerido" },
                                    {
                                        min: 2,
                                        message: "El nombre debe tener al menos 2 caracteres",
                                    },
                                ]}
                            />

                            <FormInput
                                name="email"
                                label="Correo electrónico"
                                placeholder="ana.lopez@example.com"
                                rules={[
                                    { required: true, message: "El correo es requerido" },
                                    { type: "email", message: "Ingrese un correo válido" },
                                ]}
                            />

                            <FormInput
                                name="phone"
                                label="Teléfono"
                                placeholder="9991234567"
                                rules={[
                                    { required: true, message: "El teléfono es requerido" },
                                    {
                                        pattern: /^[0-9]{10}$/,
                                        message: "El teléfono debe tener 10 dígitos",
                                    },
                                ]}
                                inputProps={{ maxLength: 10 }}
                            />

                            <Form.Item
                                name="status"
                                label="Estado"
                                rules={[{ required: true, message: "El estado es requerido" }]}
                                hasFeedback>
                                <Select
                                    size="large"
                                    placeholder="Seleccione un estado"
                                    options={statusOptions}
                                    allowClear
                                />
                            </Form.Item>
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
                            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
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

export default OwnerModal_Admin;
