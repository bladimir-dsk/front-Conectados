import { Button, Form, Select, InputNumber, App } from "antd";
import { useEffect, useState, useMemo, useCallback } from "react";
import { X } from "lucide-react";

const ServiceFormModal_Admin = ({
    visible,
    onClose,
    onSave,
    loading,
    serviciosCatalogo = [],
    loadingServicios,
    serviciosExistentes = [],
    isEditing = false,
    editData = null,
}) => {
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        if (visible) {
            requestAnimationFrame(() => {
                if (isEditing && editData) {
                    const initialValues = {
                        servicio_id: editData.id,
                        costo: editData.costo ? Number(editData.costo) : undefined,
                    };
                    form.setFieldsValue(initialValues);
                    setSubmittable(false);
                    setHasChanges(false);
                } else {
                    form.resetFields();
                    setSubmittable(false);
                    setHasChanges(false);
                }
            });
        }
    }, [visible, isEditing, editData, form]);

    const serviciosDisponibles = useMemo(() => {
        const idsExistentes = new Set(serviciosExistentes.map((s) => s.id));
        return serviciosCatalogo
            .filter((s) => !idsExistentes.has(s.id_servicio))
            .map((s) => ({
                value: s.id_servicio,
                label: s.name,
            }));
    }, [serviciosCatalogo, serviciosExistentes]);

    // En modo edición, necesitamos la opción del servicio actual para mostrarlo en el Select
    const editServiceOption = useMemo(() => {
        if (!isEditing || !editData) return null;
        const found = serviciosCatalogo.find((s) => s.id_servicio === editData.id);
        if (found) {
            return { value: found.id_servicio, label: found.name };
        }
        return { value: editData.id, label: editData.nombre };
    }, [isEditing, editData, serviciosCatalogo]);

    const selectOptions = useMemo(() => {
        if (isEditing && editServiceOption) {
            return [editServiceOption];
        }
        return serviciosDisponibles;
    }, [isEditing, editServiceOption, serviciosDisponibles]);

    const validateForm = useCallback(() => {
        const values = form.getFieldsValue();

        if (isEditing && editData) {
            const originalCosto = editData.costo ? Number(editData.costo) : undefined;
            const currentCosto = values.costo ?? undefined;
            const changed = currentCosto !== originalCosto;
            setHasChanges(changed);
            setSubmittable(changed);
        } else {
            const isComplete = !!values.servicio_id;
            setSubmittable(isComplete);
        }
    }, [form, isEditing, editData]);

    const handleValuesChange = () => {
        validateForm();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSave(values);
            form.resetFields();
            setSubmittable(false);
            setHasChanges(false);
        } catch (error) {
            if (error.errorFields) return;
            message.error(
                isEditing
                    ? "No se pudo actualizar el servicio"
                    : "No se pudo agregar el servicio"
            );
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setSubmittable(false);
        setHasChanges(false);
        onClose();
    };

    if (!visible) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/90 z-[60] transition-opacity"
                onClick={handleCancel}
            />

            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                            {isEditing ? "Editar servicio" : "Agregar servicio"}
                        </h2>
                        <button onClick={handleCancel}>
                            <X
                                size={24}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                        <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                            onValuesChange={handleValuesChange}
                        >
                            <Form.Item
                                name="servicio_id"
                                label="Servicio"
                                rules={[
                                    { required: true, message: "Seleccione un servicio" },
                                ]}
                            >
                                <Select
                                    size="large"
                                    placeholder="Buscar servicio..."
                                    loading={loadingServicios}
                                    showSearch
                                    optionFilterProp="label"
                                    options={selectOptions}
                                    allowClear={!isEditing}
                                    disabled={isEditing}
                                    notFoundContent={
                                        serviciosDisponibles.length === 0
                                            ? "No hay servicios disponibles"
                                            : "Sin resultados"
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                name="costo"
                                label="Costo (opcional)"
                            >
                                <InputNumber
                                    placeholder="Ej: 100"
                                    size="large"
                                    style={{ width: "100%" }}
                                    min={0}
                                    formatter={(value) =>
                                        `$ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                    parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, "")
                                    }
                                />
                            </Form.Item>
                        </Form>

                        {isEditing && !hasChanges && (
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                                No hay cambios para guardar
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t dark:border-zinc-700 border-gray-200">
                        <Button
                            onClick={handleCancel}
                            size="large"
                            type="primary"
                            danger
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            size="large"
                            loading={loading}
                            disabled={!submittable}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isEditing ? "Actualizar" : "Guardar"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServiceFormModal_Admin;