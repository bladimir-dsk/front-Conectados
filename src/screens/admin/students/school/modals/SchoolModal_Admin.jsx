import { Button, Form, Select, App, Spin } from "antd";
import { useEffect, useState, useCallback, useRef, memo } from "react";
import { X } from "lucide-react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useApi } from "../../../../../hooks/useApi";
import FormInput from "../../../../../components/inputs/FormInput";

const MAP_CONTAINER_STYLE = {
    width: "100%",
    height: "280px",
};

const DEFAULT_CENTER = {
    lat: 20.9674,
    lng: -89.6235,
};

const MAP_OPTIONS = {
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    clickableIcons: false,
    gestureHandling: "greedy",
    draggableCursor: "default",
    draggingCursor: "grabbing",
};

const MemoizedMap = memo(({ center, zoom, onClick, onLoad, markerPosition }) => (
    <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={zoom}
        onClick={onClick}
        onLoad={onLoad}
        options={MAP_OPTIONS}
    >
        {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
));
MemoizedMap.displayName = "MemoizedMap";

const LEVEL_OPTIONS = [
    { value: "Secundaria", label: "Secundaria" },
    { value: "Bachillerato", label: "Bachillerato" },
    { value: "Universidad", label: "Universidad" },
];

const TYPE_OPTIONS = [
    { value: "Publica", label: "Pública" },
    { value: "Privada", label: "Privada" },
];

const TURN_OPTIONS = [
    { value: "Matutino", label: "Matutino" },
    { value: "Vespertino", label: "Vespertino" },
];

const SchoolModal_Admin = ({
    visible,
    onClose,
    onSave,
    editData = null,
    isEditing = false,
}) => {
    const [form] = Form.useForm();
    const [hasChanges, setHasChanges] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [submittable, setSubmittable] = useState(false);
    const [loadingModal, setLoadingModal] = useState(true);
    const mapRef = useRef(null);
    const mapCenter = useRef(DEFAULT_CENTER);
    const mapZoom = useRef(10);
    const { message } = App.useApp();

    const { postData: createSchool, loading: creating } = useApi("/School", {}, false);
    const { patchData: updateSchool, loading: updating } = useApi("/School", {}, false);

    useEffect(() => {
        if (visible) {
            setLoadingModal(true);
            const timer = setTimeout(() => setLoadingModal(false));
            return () => clearTimeout(timer);
        }
    }, [visible, editData]);

    useEffect(() => {
        if (visible) {
            requestAnimationFrame(() => {
                if (isEditing && editData) {
                    const initialValues = {
                        name: editData.name || "",
                        cct: editData.cct || "",
                        level: editData.level || undefined,
                        type: editData.type || undefined,
                        turn: editData.turn || undefined,
                    };
                    form.setFieldsValue(initialValues);
                    setInitialData(initialValues);
                    setHasChanges(false);

                    if (editData.latitud && editData.longitud) {
                        const pos = {
                            lat: parseFloat(editData.latitud),
                            lng: parseFloat(editData.longitud),
                        };
                        setMarkerPosition(pos);
                        mapCenter.current = pos;
                        mapZoom.current = 14;
                    } else {
                        setMarkerPosition(null);
                        mapCenter.current = DEFAULT_CENTER;
                        mapZoom.current = 10;
                    }
                } else {
                    form.resetFields();
                    setInitialData(null);
                    setHasChanges(false);
                    setMarkerPosition(null);
                    mapCenter.current = DEFAULT_CENTER;
                    mapZoom.current = 10;
                }
            });
        }
    }, [visible, isEditing, editData, form]);

    const validateSubmittable = useCallback(() => {
        const values = form.getFieldsValue();
        const { name, cct, level, type, turn } = values;
        const complete =
            name?.trim() && cct?.trim() && level && type && turn && markerPosition;
        setSubmittable(!!complete);
    }, [markerPosition, form]);

    useEffect(() => {
        validateSubmittable();
    }, [markerPosition]);

    const checkForChanges = (_changedValues, allValues) => {
        if (!isEditing || !initialData) {
            setHasChanges(true);
            validateSubmittable();
            return;
        }

        const hasChanged =
            allValues.name !== initialData.name ||
            allValues.cct !== initialData.cct ||
            allValues.level !== initialData.level ||
            allValues.type !== initialData.type ||
            allValues.turn !== initialData.turn;

        setHasChanges(hasChanged);
        validateSubmittable();
    };

    const handleMapClick = useCallback((e) => {
        setMarkerPosition({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        });
        setHasChanges(true);
    }, []);

    const handleMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const dataToSend = {
                name: values.name,
                cct: values.cct,
                level: values.level,
                type: values.type,
                turn: values.turn,
                latitud: markerPosition?.lat ?? 0,
                longitud: markerPosition?.lng ?? 0,
            };

            if (isEditing) {
                await updateSchool(dataToSend, editData.id_school);
                message.success("Escuela actualizada correctamente");
            } else {
                await createSchool(dataToSend);
                message.success("Escuela agregada correctamente");
            }

            form.resetFields();
            setMarkerPosition(null);
            onSave();
        } catch (error) {
            if (error.errorFields) return;
            message.error(
                error.response?.data?.message ||
                error.message ||
                "No se pudo guardar la escuela"
            );
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setMarkerPosition(null);
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
                            {isEditing ? "Editar escuela" : "Agregar escuela"}
                        </h2>
                        <button onClick={handleCancel}>
                            <X size={24} className="text-gray-400 hover:text-gray-600 transition-colors" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-5">
                        <Spin spinning={loadingModal} tip="Cargando...">
                            <Form
                                form={form}
                                layout="vertical"
                                autoComplete="off"
                                onValuesChange={checkForChanges}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                    {/* Nombre */}
                                    <div className="md:col-span-2">
                                        <FormInput
                                            name="name"
                                            label="Nombre de la escuela"
                                            placeholder="Ej: Universidad Anáhuac Mayab"
                                            rules={[
                                                { required: true, message: "El nombre es requerido" },
                                                { min: 2, message: "Mínimo 2 caracteres" },
                                            ]}
                                        />
                                    </div>

                                    {/* CCT */}
                                    <FormInput
                                        name="cct"
                                        label="CCT"
                                        placeholder="Ej: 31PSU0002B"
                                        rules={[
                                            { required: true, message: "El CCT es requerido" },
                                        ]}
                                    />

                                    {/* Nivel */}
                                    <Form.Item
                                        name="level"
                                        label="Nivel educativo"
                                        rules={[{ required: true, message: "Seleccione el nivel" }]}
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Seleccionar"
                                            options={LEVEL_OPTIONS}
                                            allowClear
                                        />
                                    </Form.Item>

                                    {/* Tipo */}
                                    <Form.Item
                                        name="type"
                                        label="Tipo"
                                        rules={[{ required: true, message: "Seleccione el tipo" }]}
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Seleccionar"
                                            options={TYPE_OPTIONS}
                                            allowClear
                                        />
                                    </Form.Item>

                                    {/* Turno */}
                                    <Form.Item
                                        name="turn"
                                        label="Turno"
                                        rules={[{ required: true, message: "Seleccione el turno" }]}
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Seleccionar"
                                            options={TURN_OPTIONS}
                                            allowClear
                                        />
                                    </Form.Item>

                                    {/* Mapa */}
                                    <div className="md:col-span-2">
                                        <div className="border-t border-gray-200 dark:border-zinc-700 my-2" />
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Ubicación en el mapa{" "}
                                            <span className="text-red-500">*</span>
                                        </p>
                                        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                                            <MemoizedMap
                                                center={mapCenter.current}
                                                zoom={mapZoom.current}
                                                onClick={handleMapClick}
                                                onLoad={handleMapLoad}
                                                markerPosition={markerPosition}
                                            />
                                        </div>

                                        {markerPosition && (
                                            <div className="flex gap-4 mt-3">
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500 dark:text-gray-400">
                                                        Latitud
                                                    </label>
                                                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded border border-gray-200 dark:border-zinc-700">
                                                        {markerPosition.lat.toFixed(6)}
                                                    </p>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500 dark:text-gray-400">
                                                        Longitud
                                                    </label>
                                                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded border border-gray-200 dark:border-zinc-700">
                                                        {markerPosition.lng.toFixed(6)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {!markerPosition && (
                                            <p className="text-xs text-orange-500 mt-2">
                                                Haz clic en el mapa para seleccionar la ubicación
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {isEditing && !hasChanges && (
                                    <div className="text-sm text-blue-600 dark:text-blue-400 mt-3">
                                        No hay cambios para guardar
                                    </div>
                                )}
                            </Form>
                        </Spin>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t dark:border-zinc-700 border-gray-200">
                        <Button onClick={handleCancel} size="large" type="primary" danger>
                            Cancelar
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            size="large"
                            loading={creating || updating}
                            disabled={(isEditing && !hasChanges) || !submittable}
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

export default SchoolModal_Admin;