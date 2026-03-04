import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Form, Input, Button, Select, message } from 'antd';
import { useApi } from '../../../../hooks/useApi';
import { getServiceIconOptions, SERVICE_ICONS_CONFIG } from '../../../../components/icon/serviceIconsConfig';

const ServiceModal_Admin = ({
    visible,
    onClose,
    onSave,
    editData = null,
    isEditing = false
}) => {
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);
    const [hasChanges, setHasChanges] = useState(false);
    const [initialData, setInitialData] = useState(null);

    const { postData: createService, loading: creatingService } = useApi('/servicios', {}, false);
    const { patchData: updateService, loading: updatingService } = useApi('/servicios', {}, false);

    const iconOptions = getServiceIconOptions();

    const checkForChanges = (changedValues, allValues) => {
        if (!isEditing || !initialData) {
            setHasChanges(true);
            return;
        }

        const hasChanged =
            allValues.name !== initialData.name ||
            allValues.icon !== initialData.icon;

        setHasChanges(hasChanged);
    };

    useEffect(() => {
        if (visible) {
            if (isEditing && editData) {
                const initialValues = {
                    name: editData.name || '',
                    icon: editData.icon || undefined,
                };

                form.setFieldsValue(initialValues);
                setInitialData(initialValues);
                setHasChanges(false);
            } else {
                form.resetFields();
                setInitialData(null);
                setHasChanges(false);
            }
        }
    }, [visible, isEditing, editData, form]);

    const isFormComplete = () => {
        if (!formValues) return false;

        return formValues.name?.trim() && formValues.icon;
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const dataToSend = {
                name: values.name,
                icon: values.icon,
            };

            if (isEditing) {
                await updateService(dataToSend, editData.id_servicio);
                message.success('Servicio actualizado correctamente');
            } else {
                await createService(dataToSend);
                message.success('Servicio agregado correctamente');
            }

            form.resetFields();
            onSave();
        } catch (error) {
            if (error.errorFields) {
                return;
            }

            message.error(error.message || 'No se pudo guardar el servicio');
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    if (!visible) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/90 z-50 transition-opacity"
                onClick={handleCancel}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700 border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                            {isEditing ? 'Editar servicio' : 'Agregar servicio'}
                        </h2>
                        <button onClick={handleCancel}>
                            <X size={24} className='text-gray-400 hover:text-gray-600 transition-colors' />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-5">
                        <Form
                            form={form}
                            layout="vertical"
                            onValuesChange={checkForChanges}
                        >
                            <Form.Item
                                name="name"
                                label="Nombre del servicio"
                                rules={[
                                    { required: true, message: 'El nombre es requerido' },
                                    { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
                                ]}
                            >
                                <Input
                                    placeholder="Ej: Agua potable"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="icon"
                                label="Icono"
                                rules={[
                                    { required: true, message: 'Selecciona un icono' },
                                ]}>
                                <Select
                                    placeholder="Selecciona un icono"
                                    size="large"
                                    showSearch
                                    optionFilterProp="label"
                                    options={iconOptions.map((opt) => {
                                        const IconComp = opt.icon;
                                        return {
                                            value: opt.value,
                                            label: opt.label,
                                        };
                                    })}
                                    optionRender={(option) => {
                                        const config = SERVICE_ICONS_CONFIG[option.value];
                                        if (!config) return option.label;
                                        const IconComp = config.icon;
                                        return (
                                            <div className="flex items-center gap-2">
                                                <IconComp size={18} color={config.color} />
                                                <span>{config.label}</span>
                                            </div>
                                        );
                                    }}
                                    labelRender={(props) => {
                                        const config = SERVICE_ICONS_CONFIG[props.value];
                                        if (!config) return props.label;
                                        const IconComp = config.icon;
                                        return (
                                            <div className="flex items-center gap-2">
                                                <IconComp size={18} color={config.color} />
                                                <span>{config.label}</span>
                                            </div>
                                        );
                                    }}
                                />
                            </Form.Item>

                            {isEditing && !hasChanges && (
                                <div className="text-sm text-blue-600 dark:text-blue-400">
                                    No hay cambios para guardar
                                </div>
                            )}
                        </Form>
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
                            color="cyan" variant="solid"
                            onClick={handleSubmit}
                            size="large"
                            loading={creatingService || updatingService}
                            disabled={(isEditing && !hasChanges) || !isFormComplete()}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isEditing ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServiceModal_Admin;