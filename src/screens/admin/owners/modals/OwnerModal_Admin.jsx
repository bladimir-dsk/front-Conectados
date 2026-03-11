import { Button, Form, Select, Checkbox, Input, message } from "antd";
import { useEffect, useState } from "react";
import FormInput from "../../../../components/inputs/FormInput";
import { X } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";

const OwnerModal_Admin = ({
    visible,
    onClose,
    onSave,
    editData = null,
    isEditing = false,
}) => {
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);
    const [sameEmail, setSameEmail] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [initialData, setInitialData] = useState(null);

    const { postData: createOwner, loading: creatingOwner } = useApi("/propietarios", {}, false);
    const { patchData: updateOwner, loading: updatingOwner } = useApi("/propietarios", {}, false);

    const statusOptions = [
        { value: "pendiente", label: "Pendiente" },
        { value: "verificado", label: "Verificado" },
        { value: "suspendido", label: "Suspendido" },
    ];

    useEffect(() => {
        if (visible) {
            if (isEditing && editData) {
                const isSame = editData.emailPersonal === editData.email;
                const initialValues = {
                    namePersonal: editData.namePersonal || "",
                    lastName: editData.lastName || "",
                    emailPersonal: editData.emailPersonal || "",
                    email: editData.email || "",
                    code: editData.code || "52",
                    phone: editData.phone || "",
                    address: editData.address || "",
                    estatus: editData.estatus || "pendiente",
                    password: "",
                    confirmPassword: "",
                };

                form.setFieldsValue(initialValues);
                setSameEmail(isSame);
                setInitialData(initialValues);
                setHasChanges(false);
            } else {
                form.resetFields();
                form.setFieldsValue({ code: "52", estatus: "pendiente" });
                setSameEmail(true);
                setInitialData(null);
                setHasChanges(false);
            }
        }
    }, [visible, isEditing, editData, form]);

    const checkForChanges = (changedValues, allValues) => {
        if (!isEditing || !initialData) {
            setHasChanges(true);
            return;
        }

        const hasChanged =
            allValues.namePersonal !== initialData.namePersonal ||
            allValues.lastName !== initialData.lastName ||
            allValues.emailPersonal !== initialData.emailPersonal ||
            allValues.email !== initialData.email ||
            allValues.code !== initialData.code ||
            allValues.phone !== initialData.phone ||
            allValues.address !== initialData.address ||
            allValues.estatus !== initialData.estatus ||
            (allValues.password && allValues.password.length > 0);

        setHasChanges(hasChanged);
    };

    const handleSameEmailChange = (e) => {
        const checked = e.target.checked;
        setSameEmail(checked);
        if (checked) {
            const personalEmail = form.getFieldValue("emailPersonal");
            form.setFieldsValue({ email: personalEmail });
        } else {
            form.setFieldsValue({ email: "" });
        }
        checkForChanges(null, form.getFieldsValue());
    };

    const handlePersonalEmailChange = (e) => {
        if (sameEmail) {
            form.setFieldsValue({ email: e.target.value });
        }
    };

    const isFormComplete = () => {
        if (!formValues) return false;
        const { namePersonal, lastName, emailPersonal, email, phone, address, estatus, password, confirmPassword } = formValues;

        const baseComplete =
            namePersonal?.trim() &&
            lastName?.trim() &&
            emailPersonal?.trim() &&
            (sameEmail || email?.trim()) &&
            phone?.trim() &&
            address?.trim() &&
            estatus;

        if (!isEditing) {
            return baseComplete && password?.trim() && password.length >= 8 && password === confirmPassword;
        }

        if (password && password.length > 0) {
            return baseComplete && password.length >= 8 && password === confirmPassword;
        }

        return baseComplete;
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const emailAcceso = sameEmail ? values.emailPersonal : values.email;

            if (isEditing) {
                const dataToSend = {
                    namePersonal: values.namePersonal,
                    lastName: values.lastName,
                    emailPersonal: values.emailPersonal,
                    email: emailAcceso,
                    code: values.code || "52",
                    phone: values.phone,
                    address: values.address || "",
                    estatus: values.estatus,
                    aplicaEnUsuario: true,
                    name: values.namePersonal,
                };

                if (values.password && values.password.trim().length > 0) {
                    dataToSend.password = values.password;
                }

                await updateOwner(dataToSend, editData.id_propietario);
                message.success("Propietario actualizado correctamente");
            } else {
                const dataToSend = {
                    namePersonal: values.namePersonal,
                    lastName: values.lastName,
                    emailPersonal: values.emailPersonal,
                    email: emailAcceso,
                    code: values.code || "52",
                    phone: values.phone,
                    address: values.address || "",
                    aplicaEnUsuario: true,
                    name: values.namePersonal,
                    password: values.password,
                    estatus: values.estatus,
                };

                await createOwner(dataToSend);
                message.success("Propietario agregado correctamente");
            }

            form.resetFields();
            onSave();
        } catch (error) {
            if (error.errorFields) {
                return;
            }
            message.error(error.response?.data?.message || error.message || "No se pudo guardar el propietario");
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setSameEmail(true);
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
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                            {isEditing ? "Editar propietario" : "Agregar propietario"}
                        </h2>
                        <button onClick={handleCancel}>
                            <X size={24} className="text-gray-400 hover:text-gray-600 transition-colors" />
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                {/* Nombre */}
                                <FormInput
                                    name="namePersonal"
                                    label="Nombre(s)"
                                    placeholder="Ej: Oscar Luis"
                                    rules={[
                                        { required: true, message: "El nombre es requerido" },
                                        { min: 2, message: "Mínimo 2 caracteres" },
                                    ]}
                                />

                                {/* Apellido */}
                                <FormInput
                                    name="lastName"
                                    label="Apellido(s)"
                                    placeholder="Ej: García López"
                                    rules={[
                                        { required: true, message: "El apellido es requerido" },
                                        { min: 2, message: "Mínimo 2 caracteres" },
                                    ]}
                                />

                                {/* Email personal - 2 columnas */}
                                <div className="md:col-span-2">
                                    <Form.Item
                                        name="emailPersonal"
                                        label="Correo personal"
                                        rules={[
                                            { required: true, message: "El correo personal es requerido" },
                                            { type: "email", message: "Ingrese un correo válido" },
                                        ]}
                                    >
                                        <Input
                                            placeholder="oscar@gmail.com"
                                            size="large"
                                            onChange={handlePersonalEmailChange}
                                        />
                                    </Form.Item>
                                </div>

                                {/* Checkbox - 2 columnas */}
                                <div className="md:col-span-2 -mt-2 mb-3">
                                    <Checkbox
                                        checked={sameEmail}
                                        onChange={handleSameEmailChange}
                                    >
                                        Usar el mismo correo como correo de acceso
                                    </Checkbox>
                                </div>

                                {/* Email de acceso - 2 columnas, condicional */}
                                {!sameEmail && (
                                    <div className="md:col-span-2">
                                        <FormInput
                                            name="email"
                                            label="Correo de acceso"
                                            placeholder="acceso@gmail.com"
                                            rules={[
                                                { required: true, message: "El correo de acceso es requerido" },
                                                { type: "email", message: "Ingrese un correo válido" },
                                            ]}
                                        />
                                    </div>
                                )}

                                {/* Contraseña */}
                                <Form.Item
                                    name="password"
                                    label={isEditing ? "Nueva contraseña" : "Contraseña"}
                                    rules={
                                        isEditing
                                            ? [{ min: 8, message: "Mínimo 8 caracteres" }]
                                            : [
                                                { required: true, message: "La contraseña es requerida" },
                                                { min: 8, message: "Mínimo 8 caracteres" },
                                            ]
                                    }
                                >
                                    <Input.Password
                                        placeholder={isEditing ? "Dejar vacío para no cambiar" : "Mínimo 8 caracteres"}
                                        size="large"
                                    />
                                </Form.Item>

                                {/* Confirmar contraseña */}
                                <Form.Item
                                    name="confirmPassword"
                                    label="Confirmar contraseña"
                                    dependencies={["password"]}
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const pwd = getFieldValue("password");
                                                if (!pwd || pwd.length === 0) {
                                                    return Promise.resolve();
                                                }
                                                if (!value) {
                                                    return Promise.reject(new Error("Confirme la contraseña"));
                                                }
                                                if (pwd !== value) {
                                                    return Promise.reject(new Error("Las contraseñas no coinciden"));
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        placeholder="Repita la contraseña"
                                        size="large"
                                    />
                                </Form.Item>

                                {/* Código + Teléfono - 2 columnas */}
                                <div className="md:col-span-2">
                                    <div className="flex gap-3">
                                        <Form.Item
                                            name="code"
                                            label="Código"
                                            className="w-24 shrink-0"
                                            rules={[{ required: true, message: "Requerido" }]}
                                        >
                                            <Input placeholder="52" size="large" maxLength={4} />
                                        </Form.Item>

                                        <div className="flex-1">
                                            <FormInput
                                                name="phone"
                                                label="Teléfono"
                                                placeholder="9971338867"
                                                rules={[
                                                    { required: true, message: "El teléfono es requerido" },
                                                    {
                                                        pattern: /^[0-9]{10}$/,
                                                        message: "Debe tener exactamente 10 dígitos",
                                                    },
                                                ]}
                                                inputProps={{ maxLength: 10 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dirección */}
                                <FormInput
                                    name="address"
                                    label="Dirección"
                                    placeholder="Ej: Calle 23 x 32"
                                    rules={[
                                        { required: true, message: "La dirección es requerida" },
                                    ]}
                                />

                                {/* Estatus */}
                                <Form.Item
                                    name="estatus"
                                    label="Estado"
                                    rules={[{ required: true, message: "El estado es requerido" }]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Seleccione un estado"
                                        options={statusOptions}
                                        allowClear
                                    />
                                </Form.Item>
                            </div>

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
                            type="primary"
                            onClick={handleSubmit}
                            size="large"
                            loading={creatingOwner || updatingOwner}
                            disabled={(isEditing && !hasChanges) || !isFormComplete()}
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

export default OwnerModal_Admin;