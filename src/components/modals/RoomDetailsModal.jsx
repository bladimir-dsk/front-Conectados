import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Star,
  Phone,
  Mail,
  BedDouble,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Spin, Empty, Button } from "antd";
import { getServiceIcon } from "../icon/serviceIconsConfig";

const GENDER_LABEL = {
  femenino: {
    label: "Solo mujeres",
    cls: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  },
  masculino: {
    label: "Solo hombres",
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  mixto: {
    label: "Mixto",
    cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
};

const TYPE_LABEL = {
  casa: "Casa",
  departamento: "Departamento",
  habitacion: "Habitación",
  estudio: "Estudio",
};

const ESTATUS_CONFIG = {
  ACTIVO: {
    label: "Activo",
    dot: "bg-green-500",
    text: "text-green-600 dark:text-green-400",
  },
  INACTIVO: {
    label: "Inactivo",
    dot: "bg-gray-400",
    text: "text-gray-500 dark:text-gray-400",
  },
  OCUPADO: {
    label: "Ocupado",
    dot: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
  },
  MANTENIMIENTO: {
    label: "Mantenimiento",
    dot: "bg-amber-400",
    text: "text-amber-600 dark:text-amber-400",
  },
  PENDIENTE: {
    label: "Pendiente",
    dot: "bg-blue-400",
    text: "text-blue-600 dark:text-blue-400",
  },
};

function EstatusTag({ estatus }) {
  const cfg = ESTATUS_CONFIG[estatus?.toUpperCase()] ?? ESTATUS_CONFIG.INACTIVO;
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
      <span className={`text-xs capitalize ${cfg.text}`}>{cfg.label}</span>
    </div>
  );
}

function PhotoCarousel({ fotos = [], mainImage }) {
  const [active, setActive] = useState(0);
  const images =
    fotos.length > 0 ? fotos : mainImage ? [{ url: mainImage }] : [];

  if (images.length === 0) {
    return (
      <div className="w-full h-56 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-gray-400 dark:text-zinc-500 text-sm">
              Sin imágenes disponibles
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative w-full h-56 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
        <img
          src={images[active]?.url}
          alt="foto"
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setActive((a) => (a > 0 ? a - 1 : images.length - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() =>
                setActive((a) => (a < images.length - 1 ? a + 1 : 0))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={15} />
            </button>
            <span className="absolute bottom-2 right-3 text-xs text-white bg-black/40 rounded-full px-2 py-0.5">
              {active + 1}/{images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: "none" }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 w-14 h-11 rounded-md overflow-hidden border-2 transition-all ${
                i === active
                  ? "border-lime-500"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const RoomDetailsModal = ({
  open,
  onClose,
  room,
  userRating,
  onRate,
  onRequestRoom,
  services = [],
  loading = false,
  error = null,
}) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const TYPE_INCOME_LABEL = {
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
    ALOJAMIENTO_COMPLETO: {
      label: "Alojamiento completo",
      cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
  };

  const normalizedGender = room?.gender?.toLowerCase() ?? "mixto";
  const genderInfo = GENDER_LABEL[normalizedGender] ?? GENDER_LABEL.mixto;
  const typeLabel =
    TYPE_LABEL[room?.type?.toLowerCase()] ?? room?.type ?? "Alojamiento";
  const incomeInfo = TYPE_INCOME_LABEL[room?.typeIncome?.toUpperCase()] ?? null;

  return (
    <>
      <div className="fixed inset-0 bg-black/85 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-zinc-700 shrink-0">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {room?.name ?? "Alojamiento"}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Detalles del alojamiento
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X size={22} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Spin size="large" tip="Cargando detalles..." />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 px-8">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span className="text-red-500">{error}</span>}
                />
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Izquierda */}
                  <div className="space-y-4">
                    <PhotoCarousel
                      fotos={room?.fotos}
                      mainImage={room?.mainImage}
                    />
                    <div className="p-4 bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 rounded-lg border border-lime-200 dark:border-lime-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Precio mensual
                      </p>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${Number(room?.price ?? 0).toLocaleString("es-MX")}
                        </span>
                        <span className="text-sm text-gray-400 dark:text-gray-500 mb-0.5">
                          MXN/mes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Derecha */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {incomeInfo && (
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${incomeInfo.cls}`}
                        >
                          {incomeInfo.label}
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${genderInfo.cls}`}
                      >
                        {genderInfo.label}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300">
                        {typeLabel}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-gray-400" />
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Ubicación
                        </p>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 pl-5">
                        {room?.address ?? "No disponible"}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-200 flex-col dark:bg-zinc-800 rounded-lg flex items-center">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Puntuación
                      </span>

                      <div className="flex flex-row items-center gap-2">
                        <Star
                          size={15}
                          className="text-lime-400 fill-lime-400 shrink-0"
                        />
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {room?.rating > 0
                            ? Number(room.rating).toFixed(1)
                            : "0"}{" "}
                          / 5
                        </span>
                      </div>
                    </div>

                    {room?.propietario && (
                      <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Propietario
                        </p>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center shrink-0">
                            <span className="text-lime-700 dark:text-lime-400 font-bold text-sm">
                              {room.propietario.namePersonal?.[0] ?? "?"}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                            {room.propietario.namePersonal}{" "}
                            {room.propietario.lastName}
                          </p>
                        </div>
                        <div className="space-y-1.5 pl-1">
                          {room.propietario.emailPersonal && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Mail size={13} className="shrink-0" />
                              <span className="truncate">
                                {room.propietario.emailPersonal}
                              </span>
                            </div>
                          )}
                          {room.propietario.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Phone size={13} className="shrink-0" />
                              <span>
                                +{room.propietario.code}{" "}
                                {room.propietario.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Servicios ── */}
                {services.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Servicios incluidos
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {services.map((s) => {
                        const { icon: IconComponent, color } = getServiceIcon(
                          s.icon,
                        );
                        return (
                          <div
                            key={s.id}
                            className="flex items-center gap-1.5 bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 text-lime-700 dark:text-lime-400 rounded-lg px-2.5 py-1.5 text-sm"
                          >
                            <IconComponent size={15} color={color} />
                            <span className="font-medium">{s.name}</span>
                            {s.costo > 0 && (
                              <span className="text-xs text-lime-500 font-semibold">
                                +${s.costo}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Property Details ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg dark:bg-neutral-900">
                    <Home size={18} className="text-lime-500" />
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 uppercase tracking-wide dark:text-white">
                        Tipo de propiedad
                      </div>
                      <div className="text-sm font-medium truncate text-gray-800 dark:text-white">
                        {room.typeProperty || "No especificado"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg dark:bg-neutral-900">
                    <Transgender size={18} className="text-lime-500" />
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 uppercase tracking-wide dark:text-white">
                        Género
                      </div>
                      <div className="text-sm font-medium text-gray-800 truncate dark:text-white">
                        {room.gender === "femenino"
                          ? "Solo mujeres"
                          : room.gender === "masculino"
                            ? "Solo hombres"
                            : "Mixto"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg col-span-2 dark:bg-neutral-900">
                    <MapPinIcon size={18} className="text-lime-500" />
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 uppercase tracking-wide dark:text-white">
                        Dirección
                      </div>
                      <div className="text-xs font-medium text-gray-800 truncate dark:text-white">
                        {room.address || "Dirección no disponible"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Cuartos ── */}
                {room?.cuartos?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Cuartos disponibles ({room.cuartos.length})
                    </p>
                    <div className="space-y-2">
                      {room.cuartos.map((cuarto) => (
                        <div
                          key={cuarto.id_cuarto}
                          className="border border-gray-200 dark:border-zinc-700 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                              {cuarto.name}
                            </span>
                            {/* Estado del cuarto */}
                            <EstatusTag estatus={cuarto.estatus} />
                          </div>
                          {cuarto.camas?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {cuarto.camas.map((cama) => (
                                <div
                                  key={cama.id_cama}
                                  className="flex items-center gap-1.5 text-xs bg-gray-50 dark:bg-zinc-800 rounded-md px-2 py-1.5 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-zinc-700"
                                >
                                  <BedDouble size={11} />
                                  <span>{cama.name}</span>
                                  {cama.price > 0 && (
                                    <span className="text-gray-400">
                                      · ${Number(cama.price).toLocaleString()}
                                    </span>
                                  )}
                                  {/* Estado de la cama */}
                                  <EstatusTag estatus={cama.estatus} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    onClose();
                    onRequestRoom?.(room?.id);
                  }}
                  className="w-full"
                >
                  Solicitar alojamiento
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDetailsModal;
