import { useState, useEffect, useRef } from "react";
import { Button, Input, App, Image, Tooltip, Spin } from "antd";
import {
    DeleteOutlined,
    StarFilled,
    StarOutlined,
    EditOutlined,
    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { X, ImagePlus, Camera } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";

const { TextArea } = Input;

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const AccommodationPhotosModal_Owner = ({
    visible,
    onClose,
    accommodation,
    onPhotosChanged,
}) => {
    const { message } = App.useApp();
    const fileInputRef = useRef(null);

    const [pendingPhotos, setPendingPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [closing, setClosing] = useState(false);
    const [editingPhotoId, setEditingPhotoId] = useState(null);
    const [editDescription, setEditDescription] = useState("");

    const accommodationId = accommodation?.id_alojamiento;

    const {
        data: photosResponse,
        loading: loadingExisting,
        fetchData: fetchPhotos,
    } = useApi(`/alojamientos/${accommodationId}`, {}, false);

    const { deleteData: deletePhoto, patchData: patchPhoto, postData: postPhoto } = useApi(
        `/fotos`,
        {},
        false
    );

    const existingPhotos = photosResponse?.fotos || [];

    useEffect(() => {
        if (visible && accommodationId) {
            fetchPhotos();
            setPendingPhotos([]);
            setClosing(false);
            setEditingPhotoId(null);
        }
    }, [visible, accommodationId]);

    const totalPhotos = existingPhotos.length + pendingPhotos.length;

    const handleClose = () => {
        if (uploading) return;
        setClosing(true);
        setTimeout(() => {
            onClose();
            setClosing(false);
        }, 200);
    };

    const processFiles = (files) => {
        if (!files.length) return;
        const availableSlots = MAX_PHOTOS - totalPhotos;
        if (availableSlots <= 0) {
            message.warning(`Máximo de ${MAX_PHOTOS} fotos alcanzado.`);
            return;
        }

        const validFiles = [];
        for (const file of files) {
            if (validFiles.length >= availableSlots) break;
            if (!ALLOWED_TYPES.includes(file.type)) {
                message.error(`"${file.name}" — formato no válido. Usa PNG, JPG o WEBP.`);
                continue;
            }
            if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
                message.error(`"${file.name}" excede ${MAX_FILE_SIZE_MB}MB.`);
                continue;
            }
            validFiles.push(file);
        }

        if (!validFiles.length) return;

        const newPhotos = validFiles.map((file, idx) => ({
            id: `${Date.now()}-${idx}`,
            file,
            preview: URL.createObjectURL(file),
            descripcion: "",
            esPrincipal:
                existingPhotos.length === 0 && pendingPhotos.length === 0 && idx === 0,
        }));

        setPendingPhotos((prev) => [...prev, ...newPhotos]);
    };

    const handleFileSelect = (e) => {
        processFiles(Array.from(e.target.files || []));
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (uploading) return;
        processFiles(Array.from(e.dataTransfer.files || []));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!uploading) setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const removePending = (id) => {
        setPendingPhotos((prev) => {
            const updated = prev.filter((p) => p.id !== id);
            const removed = prev.find((p) => p.id === id);
            if (removed?.esPrincipal && updated.length > 0 && existingPhotos.length === 0) {
                updated[0].esPrincipal = true;
            }
            return updated;
        });
    };

    const updateDescription = (id, value) => {
        setPendingPhotos((prev) =>
            prev.map((p) => (p.id === id ? { ...p, descripcion: value } : p))
        );
    };

    const setPrincipal = (id) => {
        setPendingPhotos((prev) => prev.map((p) => ({ ...p, esPrincipal: p.id === id })));
    };

    const handleDeleteExisting = async (photo) => {
        const photoId = photo.id_foto || photo.id;
        try {
            await deletePhoto(photoId);
            message.success("Foto eliminada");
            await fetchPhotos();
            onPhotosChanged?.();
        } catch {
            message.error("Error al eliminar la foto");
        }
    };

    const handleSetExistingPrincipal = async (photo) => {
        const photoId = photo.id_foto || photo.id;
        try {
            const currentPrincipal = existingPhotos.find(
                (p) => p.esPrincipal && (p.id_foto || p.id) !== photoId
            );
            if (currentPrincipal) {
                const currentPrincipalId = currentPrincipal.id_foto || currentPrincipal.id;
                const removeFd = new FormData();
                removeFd.append("esPrincipal", "false");
                await patchPhoto(removeFd, currentPrincipalId);
            }

            const formData = new FormData();
            formData.append("esPrincipal", "true");
            await patchPhoto(formData, photoId);

            setPendingPhotos((prev) => prev.map((p) => ({ ...p, esPrincipal: false })));
            message.success("Foto marcada como principal");
            await fetchPhotos();
            onPhotosChanged?.();
        } catch {
            message.error("Error al actualizar la foto");
        }
    };

    const handleStartEdit = (photo) => {
        const photoId = photo.id_foto || photo.id;
        setEditingPhotoId(photoId);
        setEditDescription(photo.descripcion || "");
    };

    const handleCancelEdit = () => {
        setEditingPhotoId(null);
        setEditDescription("");
    };

    const handleSaveEdit = async (photo) => {
        const photoId = photo.id_foto || photo.id;
        try {
            const formData = new FormData();
            formData.append("descripcion", editDescription.trim());
            await patchPhoto(formData, photoId);
            message.success("Descripción actualizada");
            setEditingPhotoId(null);
            setEditDescription("");
            await fetchPhotos();
            onPhotosChanged?.();
        } catch {
            message.error("Error al actualizar la descripción");
        }
    };

    const handleUploadAll = async () => {
        if (pendingPhotos.length === 0) {
            message.warning("No hay fotos para subir.");
            return;
        }

        setUploading(true);
        let successCount = 0;

        try {
            const pendingHasPrincipal = pendingPhotos.some((p) => p.esPrincipal);

            if (pendingHasPrincipal) {
                const currentPrincipal = existingPhotos.find((p) => p.esPrincipal);
                if (currentPrincipal) {
                    const currentPrincipalId = currentPrincipal.id_foto || currentPrincipal.id;
                    const removeFd = new FormData();
                    removeFd.append("esPrincipal", "false");
                    try {
                        await patchPhoto(removeFd, currentPrincipalId);
                    } catch {
                        message.error("Error al quitar la foto principal anterior");
                    }
                }
            }

            for (const photo of pendingPhotos) {
                const formData = new FormData();
                formData.append("id_alojamiento", accommodationId);
                formData.append("files", photo.file);
                if (photo.esPrincipal) formData.append("esPrincipal", "true");
                if (photo.descripcion.trim()) formData.append("descripcion", photo.descripcion.trim());

                try {
                    await postPhoto(formData, false);
                    successCount++;
                } catch (err) {
                    const errMsg = err.response?.data?.message || "Error al subir la foto";
                    message.error(`Error subiendo "${photo.file.name}": ${errMsg}`);
                }
            }

            if (successCount > 0) {
                message.success(
                    `${successCount} foto${successCount > 1 ? "s" : ""} subida${successCount > 1 ? "s" : ""}`
                );
                await fetchPhotos();
                setPendingPhotos([]);
                onPhotosChanged?.();
            }
        } finally {
            setUploading(false);
        }
    };

    const getPhotoUrl = (photo) => photo.url || photo.ruta || "";

    useEffect(() => {
        return () => {
            pendingPhotos.forEach((p) => {
                if (p.preview) URL.revokeObjectURL(p.preview);
            });
        };
    }, []);

    if (!visible) return null;

    return (
        <>
            <div
                className={`fixed inset-0 z-50 bg-black/90 transition-all duration-300 ${closing ? "opacity-0" : "opacity-100"}`}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className={`pointer-events-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300 ${
                        closing ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.05)",
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                Administrar fotos del alojamiento
                            </span>
                            <span className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                                {accommodation?.name || "Alojamiento"} — {totalPhotos}/{MAX_PHOTOS} fotos
                            </span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-lime-200! transition-colors"
                            disabled={uploading}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div
                        className="flex-1 overflow-y-auto px-6 py-4 space-y-5"
                        onDrop={handleDrop}
                        style={{ minHeight: 0 }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <Spin spinning={loadingExisting} tip="Cargando fotos...">
                            {/* Existing photos */}
                            {existingPhotos.length > 0 && (
                                <section className="mb-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                                            Fotos actuales
                                        </span>
                                        <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-800" />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <Image.PreviewGroup>
                                            {existingPhotos.map((photo) => {
                                                const photoId = photo.id_foto || photo.id;
                                                const isPrincipal = photo.esPrincipal;
                                                const photoUrl = getPhotoUrl(photo);
                                                const isEditing = editingPhotoId === photoId;

                                                return (
                                                    <div
                                                        key={photoId}
                                                        className={`group relative rounded-xl overflow-hidden aspect-4/3 bg-gray-100 dark:bg-zinc-800 ring-2 transition-all ${
                                                            isPrincipal
                                                                ? "ring-amber-500! dark:ring-amber-500!"
                                                                : "ring-transparent hover:ring-gray-200 dark:hover:ring-zinc-700"
                                                        }`}
                                                    >
                                                        <Image
                                                            src={photoUrl}
                                                            alt={photo.descripcion || "Foto"}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                display: "block",
                                                            }}
                                                            rootClassName="!block w-full h-full"
                                                            fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5Q0EzQUYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbjwvdGV4dD48L3N2Zz4="
                                                        />

                                                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200" />

                                                        {isPrincipal && (
                                                            <div className="absolute top-3 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-semibold shadow-lg">
                                                                <StarFilled style={{ fontSize: 9 }} />
                                                                Principal
                                                            </div>
                                                        )}

                                                        {isEditing ? (
                                                            <div
                                                                className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Input
                                                                    size="small"
                                                                    value={editDescription}
                                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                                    maxLength={200}
                                                                    placeholder="Descripción..."
                                                                    className="text-xs! rounded-md! mb-1.5"
                                                                    onPressEnter={() => handleSaveEdit(photo)}
                                                                />
                                                                <div className="flex justify-end gap-1">
                                                                    <Tooltip title="Cancelar">
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                                                                            className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                                                                        >
                                                                            <CloseOutlined style={{ fontSize: 10 }} />
                                                                        </button>
                                                                    </Tooltip>
                                                                    <Tooltip title="Guardar">
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); handleSaveEdit(photo); }}
                                                                            className="w-6 h-6 rounded-md bg-lime-500/80 flex items-center justify-center text-white hover:bg-lime-500 transition-all"
                                                                        >
                                                                            <CheckOutlined style={{ fontSize: 10 }} />
                                                                        </button>
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            photo.descripcion && (
                                                                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                                    <p className="text-[11px] text-white/90 line-clamp-2 leading-tight">
                                                                        {photo.descripcion}
                                                                    </p>
                                                                </div>
                                                            )
                                                        )}

                                                        {!isEditing && (
                                                            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                                {!isPrincipal && (
                                                                    <Tooltip title="Marcar como principal" color="orange">
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); handleSetExistingPrincipal(photo); }}
                                                                            className="w-7 h-7 rounded-lg bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center text-amber-500! hover:bg-amber-50! dark:hover:bg-amber-900/30! transition-all shadow-sm"
                                                                        >
                                                                            <StarOutlined style={{ fontSize: 13 }} />
                                                                        </button>
                                                                    </Tooltip>
                                                                )}
                                                                <Tooltip title="Editar descripción" color="green">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleStartEdit(photo); }}
                                                                        className="w-7 h-7 rounded-lg bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center text-green-500! hover:bg-green-50! dark:hover:bg-green-900/30! transition-all shadow-sm"
                                                                    >
                                                                        <EditOutlined style={{ fontSize: 13 }} />
                                                                    </button>
                                                                </Tooltip>
                                                                <Tooltip title="Eliminar" color="red">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleDeleteExisting(photo); }}
                                                                        className="w-7 h-7 rounded-lg bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center text-red-500! hover:bg-red-50! dark:hover:bg-red-900/30! transition-all shadow-sm"
                                                                    >
                                                                        <DeleteOutlined style={{ fontSize: 13 }} />
                                                                    </button>
                                                                </Tooltip>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </Image.PreviewGroup>
                                    </div>
                                </section>
                            )}

                            {/* Pending photos */}
                            {pendingPhotos.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                                            Nuevas fotos
                                        </span>
                                        <span className="text-[11px] font-medium text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-500/10 px-1.5 py-0.5 rounded-md">
                                            {pendingPhotos.length}
                                        </span>
                                        <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-800" />
                                    </div>

                                    <div className="space-y-2.5">
                                        {pendingPhotos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                                                    photo.esPrincipal
                                                        ? "border-amber-300 bg-amber-50/50 dark:border-amber-500/40 dark:bg-amber-500/5"
                                                        : "border-gray-150 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30"
                                                }`}
                                            >
                                                <div className="w-[72px] h-[56px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-zinc-700 ring-1 ring-black/5">
                                                    <img src={photo.preview} alt="Preview" className="w-full h-full object-cover" />
                                                </div>

                                                <div className="flex-1 min-w-0 space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate flex-1">
                                                            {photo.file.name}
                                                        </p>
                                                        <span className="text-[10px] text-gray-300 dark:text-zinc-600 whitespace-nowrap">
                                                            {(photo.file.size / 1024 / 1024).toFixed(1)}MB
                                                        </span>
                                                    </div>

                                                    <TextArea
                                                        size="middle"
                                                        rows={1}
                                                        placeholder="Descripción (opcional)"
                                                        value={photo.descripcion}
                                                        onChange={(e) => updateDescription(photo.id, e.target.value)}
                                                        maxLength={200}
                                                        showCount
                                                        disabled={uploading}
                                                        className="text-xs! rounded-lg!"
                                                        style={{ resize: "none" }}
                                                    />

                                                    <div className="flex items-center justify-between pt-5">
                                                        <button
                                                            onClick={() => !uploading && setPrincipal(photo.id)}
                                                            disabled={uploading}
                                                            className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
                                                                photo.esPrincipal
                                                                    ? "text-amber-600! dark:text-amber-400!"
                                                                    : "text-gray-400 dark:text-zinc-500 hover:text-amber-500"
                                                            }`}
                                                        >
                                                            {photo.esPrincipal ? (
                                                                <StarFilled style={{ fontSize: 11 }} />
                                                            ) : (
                                                                <StarOutlined style={{ fontSize: 11 }} />
                                                            )}
                                                            {photo.esPrincipal ? "Principal" : "Marcar principal"}
                                                        </button>

                                                        {!uploading && (
                                                            <button
                                                                onClick={() => removePending(photo.id)}
                                                                className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                            >
                                                                <DeleteOutlined style={{ fontSize: 11 }} />
                                                                Quitar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Drop zone */}
                            {totalPhotos < MAX_PHOTOS && !uploading && (
                                <label
                                    className={`group flex flex-col items-center justify-center gap-2 p-6 mt-3 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                        dragOver
                                            ? "border-lime-500 bg-lime-50/50 dark:bg-lime-500/5 scale-[1.01]"
                                            : "border-gray-200 dark:border-zinc-700 hover:border-lime-400 dark:hover:border-lime-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                    }`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                                            dragOver
                                                ? "bg-lime-500/15 text-lime-600"
                                                : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 group-hover:bg-lime-500/10 group-hover:text-lime-600 dark:group-hover:text-lime-400"
                                        }`}
                                    >
                                        <ImagePlus size={20} />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                                            {dragOver ? "Suelta aquí" : "Agregar imágenes"}
                                        </span>
                                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">
                                            PNG, JPG, WEBP · máx. {MAX_FILE_SIZE_MB}MB
                                        </p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.webp"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            )}

                            {totalPhotos >= MAX_PHOTOS && !uploading && (
                                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                                    <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center">
                                        <Camera size={12} className="text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-zinc-400">
                                        Máximo de {MAX_PHOTOS} fotos alcanzado
                                    </span>
                                </div>
                            )}

                            {existingPhotos.length === 0 && pendingPhotos.length === 0 && !loadingExisting && (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mb-3">
                                        <Camera size={28} className="text-gray-300 dark:text-zinc-600" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-zinc-400">No hay fotos aún</p>
                                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                                        Arrastra imágenes o haz clic en el área superior
                                    </p>
                                </div>
                            )}
                        </Spin>

                        {pendingPhotos.length > 0 && (
                            <div className="flex justify-end">
                                <Button
                                    size="middle"
                                    type="primary"
                                    onClick={handleUploadAll}
                                    loading={uploading}
                                    className="h-8 px-4 rounded-lg"
                                >
                                    {uploading
                                        ? "Subiendo, espere..."
                                        : `Subir ${pendingPhotos.length} foto${pendingPhotos.length > 1 ? "s" : ""}`}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-zinc-700">
                        <Button
                            size="middle"
                            danger
                            ghost
                            onClick={onClose}
                            disabled={uploading}
                            className="h-8 px-4 rounded-lg"
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccommodationPhotosModal_Owner;