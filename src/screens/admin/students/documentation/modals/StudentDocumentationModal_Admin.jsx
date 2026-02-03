import { Button, Form, App, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { X, Upload as UploadIcon } from "lucide-react";
import FormInput from "../../../../../components/inputs/FormInput";

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

    const documentTypeOptions = [
        { value: "INE", label: "INE" },
        { value: "Comprobante de domicilio", label: "Comprobante de domicilio" },
        { value: "Credencial universitaria", label: "Credencial universitaria" },
        { value: "Constancia de estudios", label: "Constancia de estudios" },
        { value: "Acta de nacimiento", label: "Acta de nacimiento" },
    ];

    const statusOptions = [
        { value: "Aprobado", label: "Aprobado" },
        { value: "Pendiente", label: "Pendiente" },
        { value: "Rechazado", label: "Rechazado" },
    ];

    useEffect(() => {
        if (visible) {
            if (isEditing && editData) {
                form.setFieldsValue({
                    documentType: editData.documentType,
                    status: editData.status,
                    rejectionReasons: editData.rejectionReasons,
                    reviewedBy: editData.reviewedBy,
                });
                setFileList([
                    {
                        uid: "-1",
                        name: editData.fileName,
                        status: "done",
                        url: editData.path,
                    },
                ]);
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
                if (!isEditing && fileList.length === 0) {
                    message.error("Por favor seleccione un archivo PDF");
                    return;
                }

                const documentData = {
                    ...values,
                    fileName: fileList[0]?.name || editData?.fileName,
                    fileSize: fileList[0]?.size
                        ? `${(fileList[0].size / (1024 * 1024)).toFixed(1)} MB`
                        : editData?.fileSize,
                    path: fileList[0]?.url || editData?.path || "/documents/temp.pdf",
                };

                setTimeout(() => {
                    onSave(documentData);
                }, 600);
            })
            .catch(() => {
                message.error("Por favor complete todos los campos requeridos");
            });
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isPDF = file.type === "application/pdf";
            if (!isPDF) {
                message.error("Solo se permiten archivos PDF");
                return Upload.LIST_IGNORE;
            }
            const isLt10M = file.size / 1024 / 1024 < 5;
            if (!isLt10M) {
                message.error("El archivo debe ser menor a 5MB");
                return Upload.LIST_IGNORE;
            }
            setFileList([file]);
            return false;
        },
        onRemove: () => {
            setFileList([]);
        },
        fileList,
        maxCount: 1,
        accept: ".pdf",
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
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {isEditing ? "Editar documento" : "Agregar documento"}
                            </h2>
                            {/* {studentData && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Estudiante: {studentData.studentName}
                                </p>
                            )} */}
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
                        <Form form={form} layout="vertical" autoComplete="off">
                            <Form.Item
                                name="documentType"
                                label="Tipo de documento"
                                rules={[
                                    {
                                        required: true,
                                        message: "El tipo de documento es requerido",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Select
                                    size="large"
                                    placeholder="Seleccione un tipo de documento"
                                    options={documentTypeOptions}
                                    allowClear
                                />
                            </Form.Item>

                            <Form.Item
                                label="Archivo PDF"
                                required={!isEditing}
                                help="Solo archivos PDF, máximo 5MB"
                            >
                                <Upload.Dragger {...uploadProps}>
                                    <p className="ant-upload-drag-icon">
                                        <UploadIcon className="mx-auto" size={48} />
                                    </p>
                                    <p className="ant-upload-text">
                                        Haz clic o arrastra el archivo aquí
                                    </p>
                                    <p className="ant-upload-hint">Solo archivos PDF (máx. 5MB)</p>
                                </Upload.Dragger>
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
                                    allowClear
                                />
                            </Form.Item>

                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) =>
                                    prevValues.status !== currentValues.status
                                }
                            >
                                {({ getFieldValue }) =>
                                    getFieldValue("status") === "Rechazado" ? (
                                        <FormInput
                                            name="rejectionReasons"
                                            label="Motivos de rechazo"
                                            placeholder="Especifique los motivos del rechazo"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Los motivos de rechazo son requeridos",
                                                },
                                            ]}
                                            inputProps={{
                                                type: "textarea",
                                                rows: 3,
                                            }}
                                        />
                                    ) : null
                                }
                            </Form.Item>

                            <FormInput
                                name="reviewedBy"
                                label="Revisado por"
                                placeholder="Nombre del revisor"
                                rules={[
                                    { required: true, message: "El revisor es requerido" },
                                ]}
                            />
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

export default StudentDocumentationModal_Admin;