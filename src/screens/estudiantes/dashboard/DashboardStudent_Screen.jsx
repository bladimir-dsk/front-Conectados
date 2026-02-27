import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/useApi";
import {
  Row,
  Col,
  Button,
  Select,
  Input,
  ConfigProvider,
  Pagination,
  Alert,
  Spin,
  Empty,
  Tooltip,
} from "antd";
import esES from "antd/locale/es_ES";
import {
  Search,
  MapPin,
  Star,
  Home,
  Building2,
  Heart,
  X,
} from "lucide-react";

import RoomDetailsModal from "../../../components/modals/RoomDetailsModal";
import ReservationModal from "../../../components/modals/ReservationModal";

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
        <p className="text-xs font-medium text-lime-600 dark:text-lime-400 z-10">
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

function RoomCard({ room, isFav, onToggleFavorite, onViewDetails, onViewMap }) {
  const estatus =
    ESTATUS_CONFIG[room.estatus?.toUpperCase()] ?? ESTATUS_CONFIG.INACTIVO;
  const gender = GENDER_LABEL[room.gender] ?? GENDER_LABEL.Mixto;
  const income = TYPE_INCOME_LABEL[room.typeIncome?.toUpperCase()];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm! hover:shadow-md! hover:shadow-lime-400 transition-all duration-200 flex flex-col overflow-hidden h-full">
      <div className="relative overflow-hidden rounded-t-xl">
        <CardImage fotos={room.fotos} typeProperty={room.typeProperty} />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" />
        <div
          className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${estatus.cls}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${estatus.dot}`} />
          {estatus.label}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(room.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            size={15}
            className={
              isFav
                ? "fill-red-500 text-red-500"
                : "text-gray-400 dark:text-zinc-500"
            }
          />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-1">
            {room.name}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-base font-bold text-lime-600 dark:text-lime-400">
              ${Number(room.price).toLocaleString("es-MX")}
            </span>
            <span className="text-xs text-gray-400 dark:text-zinc-500 block -mt-0.5">
              MXN/mes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
          <MapPin size={12} className="shrink-0 text-gray-400" />
          <span className="line-clamp-1">{room.address}</span>
        </div>

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
        </div>

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

        <div className="mt-1 flex gap-2">
          <button
            onClick={() => onViewDetails(room.id)}
            className="flex-1 py-2 rounded-lg bg-lime-500 hover:bg-lime-600 text-black! text-sm font-semibold transition-colors"
          >
            Ver detalles
          </button>
          <Tooltip title="Ver ubicación en el mapa" placement="top" color="red">
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

export default function DashboardStudent_Screen() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  // Filtros
  const [filters, setFilters] = useState({
    typeProperty: null,
    gender: null,
    typeIncome: null,
    city: "",
  });
  // Filtros aplicados (los que se usan en la URL)
  const [appliedFilters, setAppliedFilters] = useState({
    typeProperty: null,
    gender: null,
    typeIncome: null,
    city: "",
  });

  // Modal detalles
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [detailRoomId, setDetailRoomId] = useState(null);

  // Modal reservación
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [hasDocuments, setHasDocuments] = useState(false);

  const construirURL = (pagina = 1, f = appliedFilters) => {
    const params = new URLSearchParams({ page: pagina, limit: 10, estatus: "ACTIVO" });
    if (f.typeProperty) params.set("typeProperty", f.typeProperty);
    if (f.gender) params.set("gender", f.gender);
    if (f.typeIncome) params.set("typeIncome", f.typeIncome);
    if (f.city?.trim()) params.set("city", f.city.trim());
    return `/alojamientos?${params.toString()}`;
  };

  const [endpoint, setEndpoint] = useState(() => construirURL(1, {
    typeProperty: null,
    gender: null,
    typeIncome: null,
    city: "",
  }));

  const { data, loading, error, fetchData } = useApi(endpoint, {}, false);

  const accommodations = data?.data ?? [];
  const meta = data?.meta ?? {};

  useEffect(() => {
    setEndpoint(construirURL(page, appliedFilters));
  }, [page, appliedFilters]);

  useEffect(() => {
    if (endpoint) fetchData();
  }, [endpoint]);

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

  const handleViewMap = (roomId) => {
    navigate(`/estudiante/search/${roomId}`, {
      state: { openRouteModal: true },
    });
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
          services: [],
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

  const handleSearch = () => {
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    const empty = { typeProperty: null, gender: null, typeIncome: null, city: "" };
    setFilters(empty);
    setPage(1);
    setAppliedFilters(empty);
  };

  const hasActiveFilters =
    appliedFilters.typeProperty ||
    appliedFilters.gender ||
    appliedFilters.typeIncome ||
    appliedFilters.city?.trim();

  const handlePaginationChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  return (
    <ConfigProvider locale={esES}>
      <div className="min-h-screen flex justify-center w-full">
        <div className="w-full max-w-7xl px-4 py-8">

          {error && (
            <Alert
              description={error}
              type="error"
              showIcon
              className="mb-4"
              closable
            />
          )}

          {/* Barra de filtros */}
          <div className="mx-auto mb-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm p-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Tipo de propiedad */}
              <Select
                placeholder="Tipo de propiedad"
                value={filters.typeProperty}
                onChange={(v) => setFilters((prev) => ({ ...prev, typeProperty: v }))}
                allowClear
                className="min-w-[160px] flex-1"
                options={[
                  { value: "Casa", label: "Casa" },
                  { value: "Departamento", label: "Departamento" },
                  { value: "Cuarto", label: "Cuarto" },
                ]}
              />

              {/* Género */}
              <Select
                placeholder="Género"
                value={filters.gender}
                onChange={(v) => setFilters((prev) => ({ ...prev, gender: v }))}
                allowClear
                className="min-w-[140px] flex-1"
                options={[
                  { value: "Masculino", label: "Solo hombres" },
                  { value: "Femenino", label: "Solo mujeres" },
                  { value: "Mixto", label: "Mixto" },
                ]}
              />

              {/* Tipo de ingreso */}
              <Select
                placeholder="Tipo de renta"
                value={filters.typeIncome}
                onChange={(v) => setFilters((prev) => ({ ...prev, typeIncome: v }))}
                allowClear
                className="min-w-[160px] flex-1"
                options={[
                  { value: "ALOJAMIENTO_COMPLETO", label: "Alojamiento completo" },
                  { value: "ESPACIO", label: "Por espacios" },
                ]}
              />

              {/* Ciudad */}
              <Input
                placeholder="Ciudad"
                value={filters.city}
                onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                onPressEnter={handleSearch}
                className="min-w-[130px] flex-1"
                allowClear
              />

              {/* Botón buscar */}
              <Button
                type="primary"
                icon={<Search size={16} />}
                onClick={handleSearch}
                className="bg-lime-500 hover:bg-lime-600 border-lime-500 hover:border-lime-600 text-black font-semibold shrink-0 h-8"
              >
                Buscar
              </Button>

              {/* Botón limpiar */}
              {hasActiveFilters && (
                <Button
                  icon={<X size={15} />}
                  onClick={handleClearFilters}
                  className="shrink-0 h-8 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:border-red-400 hover:text-red-500"
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Contador */}
          {!loading && (
            <p className="mb-4 text-sm text-gray-500 dark:text-zinc-400">
              {meta.totalItems ?? 0} alojamientos disponibles
              {hasActiveFilters && (
                <span className="ml-1 text-lime-600 dark:text-lime-400 font-medium">
                  · Filtros aplicados
                </span>
              )}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Spin size="large" tip="Cargando alojamientos..." />
            </div>
          ) : accommodations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-400 dark:text-zinc-500">
                    No hay alojamientos disponibles
                  </span>
                }
              />
            </div>
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {accommodations.map((item) => (
                  <Col key={item.id_alojamiento} xs={24} sm={12} lg={8}>
                    <RoomCard
                      room={{
                        id: item.id_alojamiento,
                        name: item.name,
                        price: item.precio_completo,
                        address: `${item.address}, ${item.city}, ${item.country}`,
                        fotos: item.fotos ?? [],
                        typeProperty: item.typeProperty,
                        typeIncome: item.typeIncome,
                        gender: item.gender,
                        estatus: item.estatus,
                        calificacion: item.calificacion ?? 0,
                      }}
                      isFav={favorites.includes(item.id_alojamiento)}
                      onToggleFavorite={toggleFavorite}
                      onViewDetails={openRoomDetails}
                      onViewMap={handleViewMap}
                    />
                  </Col>
                ))}
              </Row>

              {meta.totalItems > 10 && (
                <div className="flex justify-center mt-10">
                  <Pagination
                    current={page}
                    pageSize={10}
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