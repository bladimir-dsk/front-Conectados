import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/useApi";
import {
    ConfigProvider,
    Pagination,
    Alert,
    Spin,
    Empty,
    Tooltip,
    Row,
    Col,
    notification,
} from "antd";
import esES from "antd/locale/es_ES";
import {
    MapPin,
    Star,
    Home,
    Building2,
    Heart,
    Users,
    BookMarked,
    Sparkles,
    HeartHandshake,
    Clock,
} from "lucide-react";

import RoomDetailsModal from "../../../components/modals/RoomDetailsModal";
import ReservationModal from "../../../components/modals/ReservationModal";
import api from "../../../api/axiosConfig";
import HeroBannerFavoritos from "./HeroBannerFavoritos";

// ── Constantes ───────────────────────────────────────────────────────────────

const ESTATUS_CONFIG = {
    ACTIVO: {
        label: "Disponible",
        cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        dot: "bg-green-500",
    },
    PENDIENTE: {
        label: "Pendiente",
        cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        dot: "bg-blue-400",
    },
    OCUPADO: {
        label: "Ocupado",
        cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        dot: "bg-red-500",
    },
    MANTENIMIENTO: {
        label: "Mantenimiento",
        cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        dot: "bg-amber-400",
    },
    INACTIVO: {
        label: "Inactivo",
        cls: "bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400",
        dot: "bg-gray-400",
    },
};

const GENDER_LABEL = {
    Masculino: {
        label: "Solo hombres",
        cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    Femenino: {
        label: "Solo mujeres",
        cls: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    },
    Mixto: {
        label: "Mixto",
        cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
};

const TYPE_INCOME_LABEL = {
    ALOJAMIENTO_COMPLETO: {
        label: "Alojamiento completo",
        cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
    ESPACIO: {
        label: "Por espacios",
        cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    CUARTO: {
        label: "Por cuarto",
        cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    },
    CAMA: {
        label: "Por cama",
        cls: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    },
};

// ── CardImage ────────────────────────────────────────────────────────────────

function CardImage({ fotos = [], typeProperty = "" }) {
    const main = fotos.find((f) => f.esPrincipal) ?? fotos[0];
    if (!main) {
        return (
            <div className="w-full h-44 bg-gradient-to-br from-lime-50 to-emerald-100 dark:from-zinc-800 dark:to-zinc-700 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-lime-200/40 dark:bg-lime-900/20" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-emerald-200/40 dark:bg-emerald-900/20" />
                <div className="w-14 h-14 rounded-2xl bg-white/70 dark:bg-zinc-600/50 flex items-center justify-center shadow-sm">
                    <Building2 size={28} className="text-lime-500 dark:text-lime-400" />
                </div>
                <p className="text-xs font-medium text-lime-500 dark:text-lime-400 z-10">
                    {typeProperty || "Alojamiento"}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 z-10">Sin fotografías</p>
            </div>
        );
    }
    return (
        <img
            src={main.url}
            alt="foto alojamiento"
            className="w-full h-44 object-cover"
            loading="lazy"
        />
    );
}

// ── FavCard ──────────────────────────────────────────────────────────────────

function FavCard({ room, onRemoveFavorite, onViewDetails, onViewMap }) {
    const estatus = ESTATUS_CONFIG[room.estatus?.toUpperCase()] ?? ESTATUS_CONFIG.INACTIVO;
    const gender = GENDER_LABEL[room.gender] ?? GENDER_LABEL.Mixto;
    const income = TYPE_INCOME_LABEL[room.typeIncome?.toUpperCase()];

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm! hover:shadow-md! hover:shadow-lime-400 transition-all duration-200 flex flex-col overflow-hidden h-full">
            {/* Imagen */}
            <div className="relative overflow-hidden rounded-t-xl h-44">
                <CardImage fotos={room.fotos} typeProperty={room.typeProperty} />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" />

                {/* Badge estatus */}
                <div
                    className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${estatus.cls}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${estatus.dot}`} />
                    {estatus.label}
                </div>

                {/* Botón quitar favorito */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite?.(room.id_favorito, room.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                >
                    <Heart size={15} className="fill-red-500 text-red-500" />
                </button>
            </div>

            {/* Contenido */}
            <div className="p-4 flex flex-col gap-2.5 flex-1">
                {/* Título y precio */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-1">
                        {room.name}
                    </h3>
                    <div className="text-right shrink-0">
                        <span className="text-base font-bold text-lime-600 dark:text-lime-400">
                            ${Number(room.price).toLocaleString("es-MX")}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 block">MXN/mes</span>
                    </div>
                </div>

                {/* Dirección */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
                    <MapPin size={12} className="shrink-0 text-gray-400" />
                    <span className="line-clamp-1">{room.address}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    {room.typeProperty && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 font-medium">
                            <Home size={11} />
                            {room.typeProperty}
                        </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${gender.cls}`}>
                        {gender.label}
                    </span>
                    {income && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${income.cls}`}>
                            {income.label}
                        </span>
                    )}
                    {room.capacity && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 font-medium">
                            <Users size={11} />
                            {room.capacity} {room.capacity === 1 ? "persona" : "personas"}
                        </span>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-auto pt-1">
                    <Star
                        size={13}
                        className={
                            room.calificacion > 0
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 dark:text-zinc-600"
                        }
                    />
                    <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                        {room.calificacion > 0
                            ? Number(room.calificacion).toFixed(1)
                            : "Sin calificación"}
                    </span>
                </div>

                {/* Botones */}
                <div className="mt-1 flex gap-2">
                    <button
                        onClick={() => onViewDetails(room.id)}
                        className="flex-1 py-2 rounded-lg bg-lime-500 hover:bg-lime-600 text-black! text-sm font-semibold transition-colors"
                    >
                        Ver detalles
                    </button>
                    <Tooltip title="Ver en el mapa" placement="top" color="#ef4444">
                        <button
                            onClick={() => onViewMap(room.id)}
                            className="px-3 py-2 rounded-lg border border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-800 text-red-600! dark:text-red-400! transition-colors"
                        >
                            <MapPin size={16} />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

// ── Screen principal ─────────────────────────────────────────────────────────

export default function FavoritosStudent_Screen() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [notifApi, notifContextHolder] = notification.useNotification();

    // Modal detalles
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState(null);
    const [detailRoomId, setDetailRoomId] = useState(null);

    // Modal reservación
    const [reservationModalOpen, setReservationModalOpen] = useState(false);
    const [hasDocuments, setHasDocuments] = useState(false);

    // Favoritos locales (para remover optimistamente)
    const [removedIds, setRemovedIds] = useState([]);

    const construirURL = (p = 1) => `/favorito?page=${p}&limit=9`;

    const [endpoint, setEndpoint] = useState(() => construirURL(1));
    const { data, loading, error, fetchData } = useApi(endpoint, {}, false);

    const rawFavoritos = data?.data ?? [];
    const meta = data?.meta ?? {};

    // Filtrar los que el usuario ya quitó localmente
    const favoritos = rawFavoritos.filter(
        (f) => !removedIds.includes(f.id_favorito),
    );

    useEffect(() => {
        setEndpoint(construirURL(page));
    }, [page]);

    useEffect(() => {
        if (endpoint) fetchData();
    }, [endpoint]);

    // ── Detail modal ──────────────────────────────────────────────────────────

    const { fetchData: fetchRoomDetail } = useApi(
        detailRoomId ? `/alojamientos/${detailRoomId}/details` : "/alojamientos",
        {},
        false,
    );

    const { fetchData: fetchDocumentsStatus } = useApi(
        "/documentacion/status/approved",
        {},
        false,
    );

    const fetchDocumentStatus = async () => {
        try {
            const response = await fetchDocumentsStatus();
            setHasDocuments(response?.approved === true);
        } catch {
            setHasDocuments(false);
        }
    };

    const openRoomDetails = (roomId) => {
        setLoadingDetails(true);
        setDetailsError(null);
        setOpenDetails(true);
        setDetailRoomId(roomId);
    };

    useEffect(() => {
        if (!detailRoomId) return;
        const load = async () => {
            try {
                const details = await fetchRoomDetail();
                const normalizeGender = (g) => {
                    if (!g) return "mixto";
                    const v = g.toLowerCase();
                    if (v === "mujer" || v === "femenino") return "femenino";
                    if (v === "hombre" || v === "masculino") return "masculino";
                    return "mixto";
                };
                const services = (details.servicios || []).map((s) => ({
                    id: s.id,
                    name: s.servicio.name,
                    icon: s.servicio.icon,
                    costo: Number(s.costo ?? 0),
                }));
                const fotos = (details.fotos || []).map((f) => ({
                    id: f.id_foto,
                    url: f.url,
                    principal: f.esPrincipal,
                    descripcion: f.descripcion,
                }));
                const cuartos = (details.cuartos || []).map((cuarto) => ({
                    id_cuarto: cuarto.id_cuarto,
                    name: cuarto.name,
                    price: Number(cuarto.price ?? 0),
                    estatus: cuarto.estatus,
                    camas: (cuarto.camas || []).map((cama) => ({
                        id_cama: cama.id_cama,
                        name: cama.name,
                        price: Number(cama.price ?? 0),
                        estatus: cama.estatus,
                    })),
                }));
                setSelectedRoom({
                    id: details.id_alojamiento,
                    name: details.name,
                    price: details.precio_completo,
                    typeProperty: details.typeProperty,
                    typeIncome: details.typeIncome,
                    gender: normalizeGender(details.gender),
                    propietario: {
                        namePersonal: details.propietario?.namePersonal,
                        lastName: details.propietario?.lastName,
                        emailPersonal: details.propietario?.emailPersonal,
                        phone: details.propietario?.phone,
                        code: details.propietario?.code,
                    },
                    address: `${details.address}, ${details.city}, ${details.country}`,
                    fotos,
                    mainImage: fotos[0]?.url ?? null,
                    cuartos,
                    rating: details.calificacion ?? 0,
                    services,
                });
            } catch {
                setDetailsError("No se pudieron cargar los detalles");
            } finally {
                setLoadingDetails(false);
            }
        };
        load();
    }, [detailRoomId]);

    const handleRequestRoom = async () => {
        await fetchDocumentStatus();
        setReservationModalOpen(true);
    };


    const handleRemoveFavorite = async (idFavorito, idAlojamiento) => {
        setRemovedIds((prev) => [...prev, idFavorito]);

        try {
            await api.delete(`/favorito/${idAlojamiento}`);
            notifApi.success({
                message: "Eliminado de favoritos",
                description: "El alojamiento fue removido de tus favoritos.",
                placement: "bottomRight",
                duration: 3,
            });
        } catch {
            setRemovedIds((prev) => prev.filter((id) => id !== idFavorito));
            notifApi.error({
                message: "Error",
                description: "No se pudo eliminar el favorito. Intenta de nuevo.",
                placement: "bottomRight",
                duration: 3,
            });
        }
    };

    const handleViewMap = (roomId) => {
        navigate(`/estudiante/search/${roomId}`, { state: { openRouteModal: true } });
    };

    const handlePaginationChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    return (
        <ConfigProvider locale={esES}>
            {notifContextHolder}
            <div className="min-h-screen w-full">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                    {error && (
                        <Alert description={error} type="error" showIcon className="mb-4" closable />
                    )}

                    <HeroBannerFavoritos />

                    {/* Contador */}
                    {!loading && (
                        <p className="text-sm text-gray-600 dark:text-zinc-400 mb-5">
                            <span className="font-bold text-gray-900 dark:text-white">
                                {(meta.totalItems ?? 0) - removedIds.length}
                            </span>{" "}
                            alojamiento{(meta.totalItems ?? 0) !== 1 ? "s" : ""} guardado
                            {(meta.totalItems ?? 0) !== 1 ? "s" : ""}
                        </p>
                    )}

                    {/* Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Spin size="large" />
                            <p className="text-sm text-gray-400 dark:text-zinc-500 animate-pulse">
                                Cargando tus favoritos...
                            </p>
                        </div>
                    ) : favoritos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div className="text-center">
                                        <p className="text-gray-600 dark:text-zinc-400 font-medium">
                                            No tienes favoritos guardados
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                                            Explora alojamientos y guarda los que más te gusten
                                        </p>
                                    </div>
                                }
                            />
                            <button
                                onClick={() => navigate("/estudiante/dashboard")}
                                className="mt-4 px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors"
                            >
                                Explorar alojamientos
                            </button>
                        </div>
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                {favoritos.map((item) => {
                                    const a = item.alojamiento;
                                    return (
                                        <Col key={item.id_favorito} xs={24} sm={12} lg={8}>
                                            <FavCard
                                                room={{
                                                    id: a.id_alojamiento,
                                                    id_favorito: item.id_favorito,
                                                    name: a.name,
                                                    price: a.precio_completo,
                                                    address: `${a.address}, ${a.city}, ${a.country}`,
                                                    fotos: a.fotos ?? [],
                                                    typeProperty: a.typeProperty,
                                                    typeIncome: a.typeIncome,
                                                    gender: a.gender,
                                                    estatus: a.estatus,
                                                    calificacion: a.calificacion ?? 0,
                                                    capacity: a.capacity,
                                                }}
                                                onRemoveFavorite={handleRemoveFavorite}
                                                onViewDetails={openRoomDetails}
                                                onViewMap={handleViewMap}
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>

                            {meta.totalItems > 9 && (
                                <div className="flex justify-center mt-10">
                                    <Pagination
                                        current={page}
                                        pageSize={9}
                                        total={meta.totalItems ?? 0}
                                        onChange={handlePaginationChange}
                                        showSizeChanger={false}
                                        className="[&_.ant-pagination-item-active]:bg-lime-500 [&_.ant-pagination-item-active]:border-lime-500 [&_.ant-pagination-item-active_a]:text-white"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Modal detalles */}
                <RoomDetailsModal
                    open={openDetails}
                    onClose={() => {
                        setOpenDetails(false);
                        setDetailsError(null);
                        setDetailRoomId(null);
                    }}
                    room={selectedRoom}
                    onRequestRoom={handleRequestRoom}
                    services={[]}
                    loading={loadingDetails}
                    error={detailsError}
                />

                {/* Modal reservación */}
                <ReservationModal
                    open={reservationModalOpen}
                    onClose={() => setReservationModalOpen(false)}
                    room={selectedRoom}
                    hasDocuments={hasDocuments}
                />
            </div>
        </ConfigProvider>
    );
}