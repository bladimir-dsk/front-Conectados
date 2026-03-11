import { Button, Form, App, Select, Upload, Input } from "antd";
import { useEffect, useState } from "react";
import { X, Upload as UploadIcon } from "lucide-react";
import { useApi } from "../../../../../hooks/useApi";
import axios from "axios";

const { TextArea } = Input;

const StudentDocumentationModal_Admin = ({
    visible,
    onClose,
    onSave,
    studentData = null,
    editData = null,
    isEditing = false,
}) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [fileList, setFileList] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [uploadEndpoint, setUploadEndpoint] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [updating, setUpdating] = useState(false);

    // Obtener token y baseURL
    const token = localStorage.getItem('token');
    const baseURL = import.meta.env.VITE_API_URL;

    const { fetchData: refreshDocuments } = useApi("/documentacion", {}, false);

    const documentTypeOptions = [
        { value: "ine_delantera", label: "INE (Delantera)" },
        { value: "ine_trasera", label: "INE (Trasera)" },
        { value: "pasaporte", label: "Pasaporte" },
        { value: "cfe", label: "CFE" },
    ];

    const statusOptions = [
        { value: "aprobado", label: "Aprobado" },
        { value: "pendiente", label: "Pendiente" },
        { value: "rechazado", label: "Rechazado" },
    ];

    useEffect(() => {
        if (visible) {
            if (isEditing && editData) {
                const initialValues = {
                    typeDocument: editData.typeDocument,
                    status: editData.status,
                    observation: editData.observation || "",
                };

                form.setFieldsValue(initialValues);
                setInitialData(initialValues);
                setHasChanges(false);

                setFileList([
                    {
                        uid: "-1",
                        name: editData.name,
                        status: "done",
                        url: editData.documentUrl,
                    },
                ]);
            } else {
                // Modal de agregar - configurar endpoint dinámico
                if (studentData?.studentId) {
                    setUploadEndpoint(`/documentacion/upload/${studentData.studentId}`);
                }
                form.resetFields();
                form.setFieldsValue({ status: "pendiente" });
                setFileList([]);
                setInitialData(null);
                setHasChanges(false);
            }
        }
    }, [visible, isEditing, editData, studentData, form]);

    const checkForChanges = (changedValues, allValues) => {
        if (!isEditing || !initialData) {
            setHasChanges(true);
            return;
        }

        const hasChanged =
            allValues.typeDocument !== initialData.typeDocument ||
            allValues.status !== initialData.status ||
            allValues.observation !== initialData.observation ||
            fileList.length > 0 && fileList[0].originFileObj;

        setHasChanges(hasChanged);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (isEditing) {
                const formData = new FormData();

                formData.append("typeDocument", values.typeDocument);
                formData.append("status", values.status);

                if (values.status !== "aprobado") {
                    formData.append("observation", values.observation || "");
                } else {
                    formData.append("observation", "");
                }

                if (fileList.length > 0 && fileList[0].originFileObj) {
                    formData.append("file", fileList[0].originFileObj);
                } else if (editData?.documentUrl) {
                    try {
                        const response = await fetch(editData.documentUrl);
                        const blob = await response.blob();
                        const file = new File([blob], editData.name, { type: editData.type });
                        formData.append("file", file);
                    } catch (fetchError) {
                        message.error("Error al procesar el archivo original");
                        return;
                    }
                }

                setUpdating(true);
                await axios.patch(
                    `${baseURL}/documentacion/${editData.id_documentacion}/estado`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                setUpdating(false);
                message.success("Documento actualizado correctamente");
            } else {
                // Lógica de creación
                if (fileList.length === 0) {
                    message.error("Por favor seleccione un archivo");
                    return;
                }

                if (!studentData?.studentId) {
                    message.error("No se encontró el ID del estudiante");
                    return;
                }

                const formData = new FormData();

                formData.append("file", fileList[0].originFileObj || fileList[0]);
                formData.append("typeDocument", values.typeDocument);
                formData.append("status", values.status);

                if (values.status !== "aprobado" && values.observation) {
                    formData.append("observation", values.observation);
                }

                setUploading(true);
                await axios.post(
                    `${baseURL}/documentacion/upload/${studentData.studentId}`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                setUploading(false);
                message.success("Documento agregado correctamente");
            }

            form.resetFields();
            setFileList([]);
            onSave();
        } catch (error) {
            setUploading(false);
            setUpdating(false);
            console.error("Error completo:", error);
            if (error.errorFields) {
                return;
            }
            message.error(
                error.response?.data?.message ||
                error.message ||
                "No se pudo guardar el documento"
            );
        }
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isValidType =
                file.type === "application/pdf" ||
                file.type === "image/jpeg" ||
                file.type === "image/jpg" ||
                file.type === "image/png";

            if (!isValidType) {
                message.error("Solo se permiten archivos PDF, JPG, JPEG o PNG");
                return Upload.LIST_IGNORE;
            }

            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error("El archivo debe ser menor a 5MB");
                return Upload.LIST_IGNORE;
            }

            setFileList([file]);
            checkForChanges(null, form.getFieldsValues());
            return false;
        },
        onRemove: () => {
            setFileList([]);
            checkForChanges(null, form.getFieldsValues());
        },
        fileList,
        maxCount: 1,
        accept: ".pdf,.jpg,.jpeg,.png",
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        setHasChanges(false);
        setInitialData(null);
        onClose();
    };

    if (!visible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/90 z-50 transition-opacity"
                onClick={handleCancel}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                {isEditing ? "Editar documento" : "Agregar documento"}
                            </span>
                            {studentData && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Estudiante: {studentData.name}
                                </span>
                            )}
                            {isEditing && editData && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Estudiante: {editData.user?.name || editData.userEmail}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-5">
                        <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                            onValuesChange={checkForChanges}
                        >
                            <Form.Item
                                name="typeDocument"
                                label="Tipo de documento"
                                rules={[
                                    {
                                        required: true,
                                        message: "El tipo de documento es requerido",
                                    },
                                ]}
                            >
                                <Select
                                    size="large"
                                    placeholder="Seleccione un tipo de documento"
                                    options={documentTypeOptions}
                                    allowClear
                                />
                            </Form.Item>

                            <Form.Item
                                label="Archivo"
                                required={!isEditing}
                                help={
                                    isEditing
                                        ? "PDF, JPG, JPEG o PNG, máx. 5MB (opcional, solo si deseas cambiar el archivo)"
                                        : "PDF, JPG, JPEG o PNG, máximo 5MB"
                                }
                            >
                                <Upload.Dragger {...uploadProps}>
                                    <p className="ant-upload-drag-icon">
                                        <UploadIcon className="mx-auto" size={48} />
                                    </p>
                                    <p className="ant-upload-text">
                                        Haz clic o arrastra el archivo aquí
                                    </p>
                                    <p className="ant-upload-hint">
                                        PDF, JPG, JPEG o PNG (máx. 5MB)
                                    </p>
                                </Upload.Dragger>
                            </Form.Item>

                            <Form.Item
                                name="status"
                                label="Estado"
                                rules={[{ required: true, message: "El estado es requerido" }]}
                            >
                                <Select
                                    size="large"
                                    placeholder="Seleccione un estado"
                                    options={statusOptions}
                                    allowClear
                                    onChange={(value) => {
                                        // Limpiar observación si se selecciona "aprobado"
                                        if (value === "aprobado") {
                                            form.setFieldsValue({ observation: "" });
                                        }
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) =>
                                    prevValues.status !== currentValues.status
                                }
                            >
                                {({ getFieldValue }) => {
                                    const status = getFieldValue("status");
                                    return status && status !== "aprobado" ? (
                                        <Form.Item name="observation" label="Observación">
                                            <TextArea
                                                placeholder="Agregar observaciones sobre el documento (opcional)"
                                                rows={3}
                                                size="large"
                                            />
                                        </Form.Item>
                                    ) : null;
                                }}
                            </Form.Item>

                            {!hasChanges && (
                                <div className="text-sm text-blue-600 dark:text-blue-400">
                                    No hay cambios para guardar
                                </div>
                            )}
                        </Form>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-zinc-700">
                        <Button
                            onClick={handleCancel}
                            size="large"
                            type="primary"
                            danger
                        >
                            Cancelar
                        </Button>
                        <Button
                            color="cyan" variant="solid"
                            onClick={handleSubmit}
                            size="large"
                            loading={uploading || updating}
                            disabled={isEditing && !hasChanges}
                        >
                            {isEditing ? "Actualizar" : "Guardar"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentDocumentationModal_Admin;