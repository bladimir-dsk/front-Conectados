import { Button, Form, Select, Input, App, InputNumber, Spin } from "antd";
import { useEffect, useState, useCallback, useRef, useMemo, memo } from "react";
import FormInput from "../../../../components/inputs/FormInput";
import { X } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { GoogleMap, Marker } from "@react-google-maps/api";

const { TextArea } = Input;

const MAP_CONTAINER_STYLE = {
    width: "100%",
    height: "300px",
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
    draggableCursor: 'default',
    draggingCursor: 'grabbing',
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

const GENDER_OPTIONS = [
    { value: "Mixto", label: "Mixto" },
    { value: "Masculino", label: "Masculino" },
    { value: "Femenino", label: "Femenino" },
];

const TYPE_PROPERTY_OPTIONS = [
    { value: "Casa", label: "Casa" },
    { value: "Departamento", label: "Departamento" },
    { value: "Cuarto", label: "Cuarto" },
];

const TYPE_INCOME_OPTIONS = [
    { value: "ALOJAMIENTO_COMPLETO", label: "Alojamiento completo" },
    { value: "CUARTO", label: "Cuarto" },
    { value: "CAMA", label: "Cama" },
    { value: "ESPACIO", label: "Espacio" },
];

const STATUS_OPTIONS = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
    { value: "OCUPADO", label: "Ocupado" },
    { value: "MANTENIMIENTO", label: "Mantenimiento" },
    { value: "PENDIENTE", label: "Pendiente" },
];

const AccommodationModal_Admin = ({
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
    const mapRef = useRef(null);
    const mapCenterRef = useRef(DEFAULT_CENTER);
    const [loadingModal, setLoadingModal] = useState(true);
    const { message } = App.useApp();

    const { postData: createAccommodation, loading: creating } = useApi("/alojamientos", {}, false);
    const { patchData: updateAccommodation, loading: updating } = useApi("/alojamientos", {}, false);

    const { data: ownersResponse, loading: loadingOwners } = useApi(
        "/propietarios?paginaActual=1&limite=10",
        {},
        visible
    );

    const ownersList = ownersResponse?.data || [];

    const ownerOptions = useMemo(
        () =>
            ownersList.map((owner) => ({
                value: owner.id_propietario,
                label: `${owner.namePersonal} ${owner.lastName} — ${owner.emailPersonal}`,
            })),
        [ownersList]
    );

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
                        description: editData.description || "",
                        url: editData.url || "",
                        typeProperty: editData.typeProperty || undefined,
                        gender: editData.gender || undefined,
                        typeIncome: editData.typeIncome || undefined,
                        estatus: editData.estatus || "PENDIENTE",
                        precio_completo: editData.precio_completo
                            ? Number(editData.precio_completo)
                            : undefined,
                        country: editData.country || "México",
                        city: editData.city || "",
                        codePostal: editData.codePostal || "",
                        address: editData.address || "",
                        id_propietario: editData.propietario?.id_propietario || undefined,
                    };

                    form.setFieldsValue(initialValues);
                    setInitialData(initialValues);
                    setHasChanges(false);

                    if (editData.latitude && editData.longitude) {
                        const pos = {
                            lat: parseFloat(editData.latitude),
                            lng: parseFloat(editData.longitude),
                        };
                        setMarkerPosition(pos);
                        mapCenterRef.current = pos;
                    } else {
                        setMarkerPosition(null);
                        mapCenterRef.current = DEFAULT_CENTER;
                    }
                } else {
                    form.resetFields();
                    form.setFieldsValue({ country: "México", estatus: "PENDIENTE" });
                    setInitialData(null);
                    setHasChanges(false);
                    setMarkerPosition(null);
                    mapCenterRef.current = DEFAULT_CENTER;
                }
            });
        }
    }, [visible, isEditing, editData, form]);

    const validateSubmittable = useCallback(() => {
        const values = form.getFieldsValue();
        const { name, typeProperty, gender, typeIncome, estatus, precio_completo, city, address, id_propietario } = values;

        const complete =
            name?.trim() &&
            typeProperty &&
            gender &&
            typeIncome &&
            estatus &&
            precio_completo &&
            city?.trim() &&
            address?.trim() &&
            id_propietario &&
            markerPosition;

        setSubmittable(!!complete);
    }, [markerPosition, form]);

    useEffect(() => {
        validateSubmittable();
    }, [markerPosition]);

    const checkForChanges = (changedValues, allValues) => {
        if (!isEditing || !initialData) {
            setHasChanges(true);
            validateSubmittable();
            return;
        }

        const hasChanged =
            allValues.name !== initialData.name ||
            allValues.description !== initialData.description ||
            allValues.url !== initialData.url ||
            allValues.typeProperty !== initialData.typeProperty ||
            allValues.gender !== initialData.gender ||
            allValues.typeIncome !== initialData.typeIncome ||
            allValues.estatus !== initialData.estatus ||
            allValues.precio_completo !== initialData.precio_completo ||
            allValues.country !== initialData.country ||
            allValues.city !== initialData.city ||
            allValues.codePostal !== initialData.codePostal ||
            allValues.address !== initialData.address ||
            allValues.id_propietario !== initialData.id_propietario;

        setHasChanges(hasChanged);
        validateSubmittable();
    };

    const handleMapClick = useCallback((e) => {
        const newPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };
        setMarkerPosition(newPosition);
        setHasChanges(true);
    }, []);

    const handleMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    useEffect(() => {
        if (mapRef.current && visible) {
            if (editData?.latitude && editData?.longitude) {
                mapRef.current.setZoom(14);
                mapRef.current.panTo({ lat: parseFloat(editData.latitude), lng: parseFloat(editData.longitude) });
            } else {
                mapRef.current.setZoom(10);
                mapRef.current.panTo(DEFAULT_CENTER);
            }
        }
    }, [visible, editData]);

    const mapCenter = useRef(DEFAULT_CENTER);
    const mapZoom = useRef(10);

    // Solo actualiza en el useEffect cuando cambia editData
    useEffect(() => {
        if (isEditing && editData?.latitude && editData?.longitude) {
            mapCenter.current = { lat: parseFloat(editData.latitude), lng: parseFloat(editData.longitude) };
            mapZoom.current = 15;
        } else {
            mapCenter.current = DEFAULT_CENTER;
            mapZoom.current = 10;
        }
    }, [isEditing, editData]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const dataToSend = {
                name: values.name,
                description: values.description || "",
                url: values.url || "",
                typeProperty: values.typeProperty,
                gender: values.gender,
                typeIncome: values.typeIncome,
                estatus: values.estatus,
                precio_completo: values.precio_completo,
                country: values.country || "México",
                city: values.city,
                codePostal: values.codePostal || "",
                address: values.address,
                latitude: markerPosition?.lat?.toString() || "",
                longitude: markerPosition?.lng?.toString() || "",
                id_Propietario: values.id_propietario,
            };

            if (isEditing) {
                await updateAccommodation(dataToSend, editData.id_alojamiento);
                message.success("Alojamiento actualizado correctamente");
            } else {
                await createAccommodation(dataToSend);
                message.success("Alojamiento agregado correctamente");
            }

            form.resetFields();
            setMarkerPosition(null);
            onSave();
        } catch (error) {
            if (error.errorFields) return;
            message.error(
                error.response?.data?.message ||
                error.message ||
                "No se pudo guardar el alojamiento"
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
                className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity"
                onClick={handleCancel}
            />

            <div className="fixed inset-0 z-50 flex items-center backdrop-blur-md justify-center p-4 overflow-y-auto">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                            {isEditing ? "Editar alojamiento" : "Agregar alojamiento"}
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
                                onValuesChange={checkForChanges}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                    {/* Nombre */}
                                    <FormInput
                                        name="name"
                                        label="Nombre del alojamiento"
                                        placeholder="Ej: Casa Ceiba"
                                        rules={[
                                            { required: true, message: "El nombre es requerido" },
                                            { min: 2, message: "Mínimo 2 caracteres" },
                                        ]}
                                    />

                                    {/* Precio */}
                                    <Form.Item
                                        name="precio_completo"
                                        label="Precio"
                                        rules={[{ required: true, message: "El precio es requerido" }]}>
                                        <InputNumber
                                            placeholder="Ej: 5000"
                                            size="large"
                                            style={{ width: "100%" }}
                                            min={0}
                                            formatter={(value) =>
                                                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            }
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                        />
                                    </Form.Item>

                                    {/* Tipo de propiedad */}
                                    <Form.Item
                                        name="typeProperty"
                                        label="Tipo de propiedad"
                                        rules={[{ required: true, message: "Seleccione el tipo" }]}>
                                        <Select
                                            size="large"
                                            placeholder="Seleccionar"
                                            options={TYPE_PROPERTY_OPTIONS}
                                            allowClear
                                        />
                                    </Form.Item>

                                    {/* Género */}
                                    <Form.Item
                                        name="gender"
                                        label="Género"
                                        rules={[{ required: true, message: "Seleccione el género" }]}>
                                        <Select
                                            size="large"
                                            placeholder="Seleccionar"
                                            options={GENDER_OPTIONS}
                                            allowClear
                                        />
                                    </Form.Item>

                                    {/* Tipo de ingreso */}
                                    <Form.Item
                                        name="typeIncome"
                                        label="Tipo de ingreso"
                                        rules={[{ required: true, message: "Seleccione el tipo de ingreso" }]}>
                                        <Select
                                            size="large"
                                            placeholder="Seleccionar"
                                            options={TYPE_INCOME_OPTIONS}
                                            allowClear
                                        />
                                    </Form.Item>

                                    {/* Estatus */}
                                    <Form.Item
                                        name="estatus"
                                        label="Estado"
                                        rules={[{ required: true, message: "El estado es requerido" }]}
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Seleccione..."
                                            options={STATUS_OPTIONS}
                                            allowClear
                                        />
                                    </Form.Item>

                                    {/* Propietario */}
                                    <div className="md:col-span-2">
                                        <Form.Item
                                            name="id_propietario"
                                            label="Propietario"
                                            rules={[{ required: true, message: "Seleccione un propietario" }]}>
                                            <Select
                                                size="large"
                                                placeholder="Buscar propietario..."
                                                loading={loadingOwners}
                                                showSearch
                                                optionFilterProp="label"
                                                options={ownerOptions}
                                                allowClear
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* URL imagen */}
                                    <div className="md:col-span-2">
                                        <FormInput
                                            name="url"
                                            label="URL de imagen"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            rules={[
                                                { required: true, message: "La URL de la imagen es requerida" },
                                            ]}
                                        />
                                    </div>

                                    {/* Descripción */}
                                    <div className="md:col-span-2">
                                        <Form.Item name="description" label="Descripción"
                                            rules={[
                                                { required: true, message: "La descripción es requerida" },
                                            ]}
                                        >
                                            <TextArea
                                                placeholder="Descripción del alojamiento..."
                                                rows={3}
                                                size="large"
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* Separador ubicación */}
                                    <div className="md:col-span-2">
                                        <div className="border-t border-gray-200 dark:border-zinc-700 my-2" />
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                            Ubicación
                                        </p>
                                    </div>

                                    <FormInput name="country" label="País" placeholder="México" rules={[
                                        { required: true, message: "El país es requerido" },
                                    ]} />

                                    <FormInput
                                        name="city"
                                        label="Ciudad"
                                        placeholder="Ej: Mérida"
                                        rules={[{ required: true, message: "La ciudad es requerida" }]}
                                    />

                                    <FormInput
                                        name="codePostal"
                                        label="Código postal"
                                        placeholder="Ej: 97000"
                                        rules={[
                                            { required: true, message: "El código postal es requerido" },
                                            {
                                                pattern: /^\d{5}$/,
                                                message: "El código postal debe tener 5 dígitos",
                                            },
                                        ]}
                                        inputProps={{
                                            maxLength: 5,
                                            inputMode: "numeric",
                                            onKeyPress: (e) => {
                                                if (!/[0-9]/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            },
                                        }}
                                    />

                                    <FormInput
                                        name="address"
                                        label="Dirección"
                                        placeholder="Ej: Calle 60 x 41"
                                        rules={[{ required: true, message: "La dirección es requerida" }]}
                                    />

                                    {/* Mapa */}
                                    <div className="md:col-span-2">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Seleccionar ubicación en el mapa{" "}
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
                                                    <Input
                                                        disabled
                                                        size="small"
                                                        value={markerPosition.lat.toFixed(6)}
                                                        readOnly
                                                        className="bg-gray-50 dark:bg-zinc-800"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500 dark:text-gray-400">
                                                        Longitud
                                                    </label>
                                                    <Input
                                                        disabled
                                                        size="small"
                                                        value={markerPosition.lng.toFixed(6)}
                                                        readOnly
                                                        className="bg-gray-50 dark:bg-zinc-800"
                                                    />
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

export default AccommodationModal_Admin;