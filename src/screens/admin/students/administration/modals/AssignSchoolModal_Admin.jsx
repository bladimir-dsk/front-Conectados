// modals/AssignSchoolModal_Admin.jsx
import { Button, Form, Select, App } from "antd";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useApi } from "../../../../../hooks/useApi";
import api from "../../../../../api/axiosConfig";

const AssignSchoolModal_Admin = ({ visible, onClose, student, onSaved }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [saving, setSaving] = useState(false);

    const { data: schoolsData, loading: loadingSchools } = useApi("/School", {}, visible);

    const schoolOptions = useMemo(
        () =>
            (schoolsData || []).map((s) => ({
                value: s.id_school,
                label: `${s.name} — ${s.type}`,
            })),
        [schoolsData]
    );

    useEffect(() => {
        if (visible && student) {
            form.setFieldsValue({
                id_school: student.School?.id_school ?? undefined,
            });
        }
    }, [visible, student, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);
            await api.patch(`/auth/estudiante/${student.id}`, {
                id_school: values.id_school,
            });
            message.success("Escuela asignada correctamente");
            onSaved();
            onClose();
        } catch (err) {
            if (err?.errorFields) return;
            message.error(err?.response?.data?.message || "No se pudo asignar la escuela");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    if (!visible) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/80 z-50" onClick={handleCancel} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                            Asignar escuela
                        </h2>
                        <button onClick={handleCancel}>
                            <X size={22} className="text-gray-400 hover:text-gray-600 transition-colors" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                        {student && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Estudiante:{" "}
                                <span className="font-medium text-gray-800 dark:text-gray-100">
                                    {student.name}
                                </span>
                            </p>
                        )}
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="id_school"
                                label="Escuela"
                                rules={[{ required: true, message: "Selecciona una escuela" }]}>
                                <Select
                                    size="large"
                                    placeholder="Buscar escuela..."
                                    loading={loadingSchools}
                                    showSearch
                                    optionFilterProp="label"
                                    options={schoolOptions}
                                    allowClear
                                />
                            </Form.Item>
                        </Form>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-zinc-700">
                        <Button onClick={handleCancel} size="large" type="primary" danger>
                            Cancelar
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            loading={saving}
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleSubmit}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AssignSchoolModal_Admin;