import React, { useState, useEffect } from "react";
import {
  X, MapPin, Star, Mail, Phone, Home, Transgender,
  Navigation, Map, BedDouble, CheckCircle2,
  ChevronLeft, ChevronRight, Wifi, Droplets, Zap, Tv,
} from "lucide-react";
import { Spin, Empty, Button, Tag, Collapse } from "antd";

const renderServiceIcon = (icon) => {
  switch (icon) {
    case "internet": return <Wifi size={15} className="text-lime-500" />;
    case "water": return <Droplets size={15} className="text-lime-500" />;
    case "cable":
    case "electricidad": return <Zap size={15} className="text-lime-500" />;
    case "tv": return <Tv size={15} className="text-lime-500" />;
    default: return <Star size={15} className="text-gray-400" />;
  }
};

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

const STATUS_MAP = {
  ACTIVO: { label: "Disponible", color: "green" },
  INACTIVO: { label: "Inactivo", color: "default" },
  OCUPADO: { label: "Ocupado", color: "red" },
  PENDIENTE: { label: "Pendiente", color: "gold" },
  MANTENIMIENTO: { label: "Mantenim.", color: "gold" },
};

const ESTATUS_DOT = {
  ACTIVO: { dot: "bg-green-500", text: "text-green-600 dark:text-green-400" },
  INACTIVO: { dot: "bg-gray-400", text: "text-gray-500 dark:text-gray-400" },
  OCUPADO: { dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  MANTENIMIENTO: { dot: "bg-amber-400", text: "text-amber-600 dark:text-amber-400" },
  PENDIENTE: { dot: "bg-blue-400", text: "text-blue-600 dark:text-blue-400" },
};

function EstatusTag({ estatus }) {
  const cfg = ESTATUS_DOT[estatus?.toUpperCase()] ?? ESTATUS_DOT.INACTIVO;
  const lbl = STATUS_MAP[estatus?.toUpperCase()]?.label ?? estatus;
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
      <span className={`text-xs ${cfg.text}`}>{lbl}</span>
    </div>
  );
}

function PhotoCarousel({ images = [] }) {
  const [active, setActive] = useState(0);

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
        <img src={images[active]?.url} alt="foto" className="w-full h-full object-cover" />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((a) => (a > 0 ? a - 1 : images.length - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setActive((a) => (a < images.length - 1 ? a + 1 : 0))}
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
        <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 w-14 h-11 rounded-md overflow-hidden border-2 transition-all ${i === active ? "border-lime-500" : "border-transparent opacity-50 hover:opacity-80"
                }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StarRating({ value = 0, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={17}
          className={readonly ? "cursor-default" : "cursor-pointer transition-transform hover:scale-110"}
          fill={(hover || value) >= star ? "#84cc16" : "none"}
          color={(hover || value) >= star ? "#84cc16" : "#d1d5db"}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onChange?.(star)}
        />
      ))}
    </div>
  );
}

const RouteModal = ({
  open,
  onClose,
  selectedRoom,
  loading,
  userRating,
  hasRated,
  onRate,
  onShowRoute,
  onRequestRoom,
}) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
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

  const room = selectedRoom;
  const fotosOrdenadas = [...(room?.images || [])].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  const owner = room?.owner ?? {};
  const ownerName = `${owner.namePersonal || ""} ${owner.lastName || ""}`.trim() || "No disponible";
  const roomId = room?.id;
  const myRating = userRating?.[roomId] ?? 0;
  const alreadyRated = hasRated?.[roomId] ?? false;

  const getStatusTag = (estatus) =>
    STATUS_MAP[estatus?.toUpperCase()] ?? { label: estatus, color: "default" };

  return (
    <>
      <div className="fixed inset-0 bg-black/85 z-50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >

          {/* ── Header ── */}
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

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Spin size="large" tip="Cargando detalles..." />
              </div>
            ) : !room ? (
              <div className="flex items-center justify-center h-64 px-8">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin información" />
              </div>
            ) : (
              <div className="p-6 space-y-5">

                {/* Grid 2 col */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* ── Izquierda: fotos + precio ── */}
                  <div className="space-y-4">
                    <PhotoCarousel images={fotosOrdenadas} />

                    <div className="p-4 bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 rounded-lg border border-lime-200 dark:border-lime-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Precio mensual</p>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${Number(room.precio_completo ?? room.price ?? 0).toLocaleString("es-MX")}
                        </span>
                        <span className="text-sm text-gray-400 dark:text-gray-500 mb-0.5">MXN/mes</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Derecha: info ── */}
                  <div className="space-y-3">

                    {room.typeIncome && (() => {
                      const info = TYPE_INCOME_LABEL[room.typeIncome?.toUpperCase()];
                      return info ? (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${info.cls}`}>
                          {info.label}
                        </span>
                      ) : null;
                    })()}

                    {/* Ubicación */}
                    <div className="p-3 bg-gray-200 dark:bg-zinc-800 mt-2 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Ubicación
                        </span>
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200 pl-5">
                        {room.address ?? "No disponible"}
                      </span>
                    </div>

                    {/* Tipo + Género */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
                        <Home size={16} className="text-lime-500" />
                        <div className="min-w-0 flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wide dark:text-white">Tipo</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
                            {room.type ?? room.typeProperty ?? "—"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
                        <Transgender size={16} className="text-lime-500" />
                        <div className="min-w-0 flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wide dark:text-white">Género</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
                            {room.gender === "femenino" ? "Solo mujeres"
                              : room.gender === "masculino" ? "Solo hombres"
                                : "Mixto"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Calificación */}
                    <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        {alreadyRated ? "Tu calificación" : "Calificar este alojamiento"}
                      </p>
                      {alreadyRated ? (
                        <div className="flex items-center justify-between">
                          <StarRating value={myRating} readonly />
                          <span className="text-xs text-lime-600 dark:text-lime-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={11} /> Ya calificaste
                          </span>
                        </div>
                      ) : (
                        <StarRating
                          value={myRating}
                          onChange={(val) => onRate(roomId, val)}
                        />
                      )}
                    </div>

                    {/* Propietario */}
                    {owner.namePersonal && (
                      <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Propietario
                        </p>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center shrink-0">
                            <span className="text-lime-700 dark:text-lime-400 font-bold text-sm">
                              {owner.namePersonal?.[0] ?? "?"}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{ownerName}</p>
                        </div>
                        <div className="space-y-1.5 pl-1">
                          {owner.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Mail size={13} className="shrink-0" />
                              <span className="truncate">{owner.email}</span>
                            </div>
                          )}
                          {owner.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Phone size={13} className="shrink-0" />
                              <span>{owner.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Ver ruta ── */}
                <div className="bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation size={15} className="text-lime-600" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Ruta desde tu universidad
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Universidad Marista</p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">→ {room.address}</p>
                    </div>
                    <Button
                      type="primary"
                      size="middle "
                      icon={<Map size={13} />}
                      onClick={() => { onShowRoute(room); onClose(); }}
                      className="shrink-0"
                    >
                      Ver ruta
                    </Button>
                  </div>
                </div>

                {/* ── Servicios ── */}
                {(room.services ?? []).length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Servicios disponibles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {room.services.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-1.5 bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 text-lime-700 dark:text-lime-400 rounded-lg px-2.5 py-1.5 text-sm"
                        >
                          {renderServiceIcon(s.icon)}
                          <span className="font-medium">{s.name}</span>
                          {s.price === 0 ? (
                            <span className="text-xs text-lime-500 font-semibold">Incluido</span>
                          ) : (
                            <span className="text-xs text-lime-500 font-semibold">+${s.price}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Cuartos y camas ── */}
                {(room.cuartos ?? []).length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Cuartos y camas
                    </p>
                    <Collapse accordion ghost>
                      {room.cuartos.map((cuarto) => {
                        const st = getStatusTag(cuarto.estatus);
                        const isActivo = cuarto.estatus === "ACTIVO";
                        return (
                          <Collapse.Panel
                            key={cuarto.id_cuarto}
                            header={
                              <div className="flex justify-between items-center w-full pr-2">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-white min-w-0">
                                  <span className="font-medium text-sm truncate">{cuarto.name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <Tag color={st.color}>{st.label}</Tag>
                                  {cuarto.price > 0 && (
                                    <span className="text-lime-500 font-semibold text-sm">
                                      +${Number(cuarto.price).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            }
                          >
                            {!isActivo ? (
                              <p className="text-sm text-gray-500">Este cuarto no está disponible.</p>
                            ) : cuarto.camas?.length > 0 ? (
                              <div className="space-y-2">
                                {cuarto.camas.map((cama) => {
                                  const cs = getStatusTag(cama.estatus);
                                  return (
                                    <div
                                      key={cama.id_cama}
                                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg"
                                    >
                                      <div className="flex items-center gap-2 min-w-0 text-gray-600 dark:text-white">
                                        <BedDouble size={12} className="shrink-0" />
                                        <span className="text-xs truncate">{cama.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <Tag color={cs.color}>{cs.label}</Tag>
                                        {cama.price > 0 && (
                                          <span className="text-sm font-medium">
                                            +${Number(cama.price).toLocaleString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Sin camas registradas.</p>
                            )}
                          </Collapse.Panel>
                        );
                      })}
                    </Collapse>
                  </div>
                )}

                {/* ── CTA ── */}
                <Button
                  type="primary"
                  size="large"
                  disabled={!room.available}
                  onClick={() => {
                    if (room.available) { onRequestRoom(room); onClose(); }
                  }}
                  className="w-full">
                  {room.available ? "Solicitar alojamiento" : "Habitación ocupada"}
                </Button>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RouteModal;