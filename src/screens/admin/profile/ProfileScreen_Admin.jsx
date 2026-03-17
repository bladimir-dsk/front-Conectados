import { useEffect, useState } from "react";
import { Form, Input, Button, Tag, Skeleton, App } from "antd";
import {
    User,
    Mail,
    Phone,
    Building2,
    FileText,
    Save,
    Edit3,
    X,
    ShieldCheck,
    Hash,
    CheckCircle2,
} from "lucide-react";
import api from "../../../api/axiosConfig";

const Section = ({
    icon: Icon,
    title,
    subtitle,
    accent = "lime",
    children,
    editing,
    someOtherEditing,
    onEdit,
    onCancel,
    onSave,
    saving,
}) => {
    const styles = {
        lime: {
            header: "bg-lime-500/20 dark:bg-lime-500/10 border-b border-lime-500/20",
            iconWrap: "bg-lime-500/15 text-lime-600 dark:text-lime-400",
            saveBtn: { backgroundColor: "#84cc16", borderColor: "#84cc16", color: "#111" },
        },
        sky: {
            header: "bg-sky-500/20 dark:bg-sky-500/10 border-b border-sky-500/20",
            iconWrap: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
            saveBtn: { backgroundColor: "#0ea5e9", borderColor: "#0ea5e9", color: "#fff" },
        },
    };
    const s = styles[accent];

    return (
        <div className="rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-[#141414]">
            {/* Header de sección */}
            <div className={`px-5 py-4 flex items-center justify-between ${s.header}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${s.iconWrap}`}>
                        <Icon size={17} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-tight">
                            {title}
                        </span>
                        {subtitle && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!editing ? (
                        <Button
                            size="small"
                            icon={<Edit3 size={13} />}
                            onClick={onEdit}
                            disabled={someOtherEditing}
                            className="flex items-center gap-1 rounded-lg"
                        >
                            Editar
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="small"
                                danger
                                icon={<X size={13} />}
                                onClick={onCancel}
                                className="flex items-center gap-1 rounded-lg"
                            >
                                Cancelar
                            </Button>
                            <Button
                                size="small"
                                variant="solid"
                                color="cyan"
                                icon={<Save size={13} />}
                                onClick={onSave}
                                loading={saving}
                                className="flex items-center gap-1 rounded-lg"
                            >
                                Guardar
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="px-5 py-5">{children}</div>
        </div>
    );
};

export default function ProfileScreen_Admin() {
    const { message } = App.useApp();
    const [profileForm] = Form.useForm();
    const [empresaForm] = Form.useForm();

    const [profile, setProfile] = useState(null);
    const [empresa, setEmpresa] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editingProfile, setEditingProfile] = useState(false);
    const [editingEmpresa, setEditingEmpresa] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingEmpresa, setSavingEmpresa] = useState(false);

    /* ── Carga inicial ── */
    useEffect(() => {
        const load = async () => {
            try {
                const [{ data: prof }, { data: emps }] = await Promise.all([
                    api.get("/auth/profile"),
                    api.get("/empresa"),
                ]);

                setProfile(prof);
                profileForm.setFieldsValue({
                    name: prof.name,
                    firstName: prof.firstName,
                    middleName: prof.middleName,
                    email: prof.email,
                    phone: prof.phone,
                    code: prof.code,
                });

                const emp = emps[0] ?? null;
                setEmpresa(emp);
                if (emp) {
                    empresaForm.setFieldsValue({ name: emp.name, rfc: emp.rfc });
                }
            } catch {
                message.error("No se pudo cargar la información del perfil");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    /* ── Guardar perfil ── */
    const saveProfile = async () => {
        try {
            const values = await profileForm.validateFields();
            setSavingProfile(true);
            await api.patch("/auth/profile", {
                name: values.name,
                firstName: values.firstName,
                middleName: values.middleName,
                phone: values.phone,
                code: values.code,
            });
            setProfile((prev) => ({ ...prev, ...values }));
            setEditingProfile(false);
            message.success("Perfil actualizado correctamente");
        } catch (err) {
            if (err?.errorFields) return;
            message.error("No se pudo actualizar el perfil");
        } finally {
            setSavingProfile(false);
        }
    };

    /* ── Guardar empresa ── */
    const saveEmpresa = async () => {
        try {
            const values = await empresaForm.validateFields();
            setSavingEmpresa(true);
            await api.patch("/empresa", {
                name: values.name,
                rfc: values.rfc,
            });
            setEmpresa((prev) => ({ ...prev, ...values }));
            setEditingEmpresa(false);
            message.success("Empresa actualizada correctamente");
        } catch (err) {
            if (err?.errorFields) return;
            message.error("No se pudo actualizar la empresa");
        } finally {
            setSavingEmpresa(false);
        }
    };

    /* ── Cancelar helpers ── */
    const cancelProfile = () => {
        profileForm.setFieldsValue({
            name: profile.name,
            firstName: profile.firstName,
            middleName: profile.middleName,
            phone: profile.phone,
            code: profile.code,
        });
        setEditingProfile(false);
    };

    const cancelEmpresa = () => {
        empresaForm.setFieldsValue({ name: empresa?.name, rfc: empresa?.rfc });
        setEditingEmpresa(false);
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton active paragraph={{ rows: 3 }} />
                <Skeleton active paragraph={{ rows: 2 }} />
            </div>
        );
    }

    return (
        <div className="space-y-5">

            {/* Cabecera de página */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                        Mi perfil
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Administra tu información personal y de empresa
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Tag
                        icon={<CheckCircle2 size={12} className="inline mr-1" />}
                        color="success"
                        className="rounded-full px-3 py-0.5 text-xs font-medium"
                    >
                        {profile?.estatus ?? "Activo"}
                    </Tag>
                    <Tag
                        icon={<ShieldCheck size={12} className="inline mr-1" />}
                        color="processing"
                        className="rounded-full px-3 py-0.5 text-xs font-medium capitalize"
                    >
                        {profile?.role ?? "Admin"}
                    </Tag>
                </div>
            </div>

            <div>
                {/* ── Sección: Perfil personal ── */}
                <Form form={profileForm} layout="vertical">
                    <Section
                        icon={User}
                        title="Información personal"
                        subtitle="Nombre, teléfono y código de acceso"
                        accent="lime"
                        editing={editingProfile}
                        someOtherEditing={editingEmpresa}
                        onEdit={() => setEditingProfile(true)}
                        onCancel={cancelProfile}
                        onSave={saveProfile}
                        saving={savingProfile}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                            <Form.Item
                                label="Nombre"
                                name="name"
                                rules={[{ required: true, message: "Requerido" }]}
                            >
                                <Input
                                    prefix={<User size={14} className="text-gray-400" />}
                                    disabled={!editingProfile}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Apellido paterno"
                                name="firstName"
                                rules={[{ required: true, message: "Requerido" }]}
                            >
                                <Input disabled={!editingProfile} />
                            </Form.Item>
                            <Form.Item label="Apellido materno" name="middleName">
                                <Input disabled={!editingProfile} />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr_1fr] gap-x-4">
                            <Form.Item label="Cód. país" name="code">
                                <Input
                                    prefix={<Hash size={14} className="text-gray-400" />}
                                    disabled={!editingProfile}
                                    maxLength={2}
                                />
                            </Form.Item>
                            <Form.Item label="Teléfono" name="phone">
                                <Input
                                    prefix={<Phone size={14} className="text-gray-400" />}
                                    disabled={!editingProfile}
                                    maxLength={10}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Correo electrónico"
                                name="email"
                                extra={
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        El email no se puede modificar
                                    </span>
                                }
                            >
                                <Input
                                    prefix={<Mail size={14} className="text-gray-400" />}
                                    disabled
                                />
                            </Form.Item>
                        </div>
                    </Section>
                </Form>
            </div>

            <div>
                {/* ── Sección: Empresa ── */}
                <Form form={empresaForm} layout="vertical">
                    <Section
                        icon={Building2}
                        title="Datos de la empresa"
                        subtitle="Nombre y RFC registrados"
                        accent="sky"
                        editing={editingEmpresa}
                        someOtherEditing={editingProfile}
                        onEdit={() => setEditingEmpresa(true)}
                        onCancel={cancelEmpresa}
                        onSave={saveEmpresa}
                        saving={savingEmpresa}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                            <Form.Item
                                label="Nombre de la empresa"
                                name="name"
                                rules={[{ required: true, message: "Requerido" }]}
                            >
                                <Input
                                    prefix={<Building2 size={14} className="text-gray-400" />}
                                    disabled={!editingEmpresa}
                                />
                            </Form.Item>
                            <Form.Item
                                label="RFC"
                                name="rfc"
                                rules={[
                                    { required: true, message: "Requerido" },
                                    { len: 12, message: "El RFC debe tener exactamente 12 caracteres" },
                                ]}
                            >
                                <Input
                                    prefix={<FileText size={14} className="text-gray-400" />}
                                    disabled={!editingEmpresa}
                                    maxLength={12}
                                    showCount={editingEmpresa}
                                />
                            </Form.Item>
                        </div>
                    </Section>
                </Form>
            </div>



        </div>
    );
}