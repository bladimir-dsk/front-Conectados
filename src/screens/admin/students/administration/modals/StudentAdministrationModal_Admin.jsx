import { Button, Form, App, Select, Row, Col, Input } from "antd";
import { useEffect } from "react";
import { X } from "lucide-react";
import FormInput from "../../../../../components/inputs/FormInput";

const StudentModal_Admin = ({
    visible,
    onClose,
    onSave,
    editData = null,
    isEditing = false,
}) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const statusOptions = [
        { value: "Activo", label: "Activo" },
        { value: "Suspendido", label: "Suspendido" },
    ];

    const universityOptions = [
        { value: "UADY", label: "UADY" },
        { value: "UNAM", label: "UNAM" },
        { value: "UTR", label: "UTR" },
    ];

    useEffect(() => {
        if (visible) {
            if (isEditing && editData) {
                form.setFieldsValue({
                    name: editData.name,
                    paternalLastName: editData.paternalLastName,
                    maternalLastName: editData.maternalLastName,
                    email: editData.email,
                    phone: editData.phone,
                    status: editData.status,
                    university: editData.university,
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
                            ? "Estudiante actualizado correctamente"
                            : "Estudiante agregado correctamente"
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
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {isEditing ? "Editar estudiante" : "Agregar estudiante"}
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
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <FormInput
                                        name="name"
                                        label="Nombre(s)"
                                        placeholder="Ej: Juan Carlos"
                                        rules={[
                                            { required: true, message: "El nombre es requerido" },
                                            {
                                                min: 2,
                                                message: "El nombre debe tener al menos 2 caracteres",
                                            },
                                        ]}
                                    />
                                </Col>

                                <Col xs={24} sm={12}>
                                    <FormInput
                                        name="paternalLastName"
                                        label="Apellido paterno"
                                        placeholder="Ej: Pérez"
                                        rules={[
                                            {
                                                required: true,
                                                message: "El apellido paterno es requerido",
                                            },
                                            {
                                                min: 2,
                                                message:
                                                    "El apellido paterno debe tener al menos 2 caracteres",
                                            },
                                        ]}
                                    />
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <FormInput
                                        name="maternalLastName"
                                        label="Apellido materno"
                                        placeholder="Ej: López"
                                        rules={[
                                            {
                                                required: true,
                                                message: "El apellido materno es requerido",
                                            },
                                            {
                                                min: 2,
                                                message:
                                                    "El apellido materno debe tener al menos 2 caracteres",
                                            },
                                        ]}
                                    />
                                </Col>

                                <Col xs={24} sm={12}>
                                    <FormInput
                                        name="email"
                                        label="Correo electrónico"
                                        placeholder="juan.perez@example.com"
                                        rules={[
                                            { required: true, message: "El correo es requerido" },
                                            { type: "email", message: "Ingrese un correo válido" },
                                        ]}
                                    />
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Teléfono">
                                        <div className="flex gap-2">
                                            <Input
                                                size="large"
                                                defaultValue="+52"
                                                style={{ width: '80px' }}
                                                maxLength={4}
                                            />
                                            <Form.Item
                                                name="phone"
                                                noStyle
                                                rules={[
                                                    { required: true, message: "El teléfono es requerido" },
                                                    {
                                                        pattern: /^[0-9]{10}$/,
                                                        message: "El teléfono debe tener 10 dígitos",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    size="large"
                                                    placeholder="9991234567"
                                                    maxLength={10}
                                                    style={{ flex: 1 }}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="university"
                                        label="Universidad"
                                        rules={[
                                            {
                                                required: true,
                                                message: "La universidad es requerida",
                                            },
                                        ]}
                                        hasFeedback
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Seleccione una universidad"
                                            options={universityOptions}
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="status"
                                        label="Estado"
                                        rules={[
                                            { required: true, message: "El estado es requerido" },
                                        ]}
                                        hasFeedback
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Seleccione un estado"
                                            options={statusOptions}
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
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

export default StudentModal_Admin;