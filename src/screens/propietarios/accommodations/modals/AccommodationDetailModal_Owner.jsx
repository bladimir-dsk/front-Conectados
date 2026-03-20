import { Tag, Button, Spin } from "antd";
import {
  X,
  MapPin,
  Info,
  Home,
  DollarSign,
  Calendar,
  DoorOpen,
  BedDouble,
  Settings,
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useApi } from "../../../../hooks/useApi";
import ServiceIconRenderer from "../../../../components/icon/Serviceiconrenderer";
dayjs.locale("es");

const mapContainerStyle = {
  width: "100%",
  height: "250px",
};

const AccommodationDetailModal_Owner = ({ visible, onClose, data }) => {
  const [detailData, setDetailData] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const thumbnailsRef = useRef(null);

  const {
    data: detailResponse,
    loading,
    fetchData: fetchDetail,
  } = useApi(
    data ? `/alojamientos/${data.id_alojamiento}/details` : null,
    {},
    false,
  );

  useEffect(() => {
    if (visible && data) {
      setDetailData(null);
      setCurrentPhotoIndex(0);
      fetchDetail();
    }
  }, [visible, data]);

  useEffect(() => {
    if (detailResponse) setDetailData(detailResponse);
  }, [detailResponse]);

  if (!visible || !data) return null;

  const d = detailData || data;
  const fotos = detailData?.fotos || [];
  const fotosOrdenadas = [...fotos].sort(
    (a, b) => (b.esPrincipal ? 1 : 0) - (a.esPrincipal ? 1 : 0),
  );

  const markerPosition =
    d.latitude && d.longitude
      ? { lat: parseFloat(d.latitude), lng: parseFloat(d.longitude) }
      : null;

  const getStatusColor = (status) => {
    const map = {
      ACTIVO: "green",
      INACTIVO: "red",
      OCUPADO: "blue",
      MANTENIMIENTO: "orange",
      PENDIENTE: "gold",
      LIMPIEZA: "purple",
    };
    return map[status] || "default";
  };

  const getStatusLabel = (status) => {
    const map = {
      ACTIVO: "Activo",
      INACTIVO: "Inactivo",
      OCUPADO: "Ocupado",
      MANTENIMIENTO: "Mantenimiento",
      PENDIENTE: "Pendiente",
      LIMPIEZA: "En limpieza",
    };
    return map[status] || status;
  };

  const getTypeIncomeLabel = (type) => {
    const map = {
      ALOJAMIENTO_COMPLETO: "Alojamiento completo",
      CUARTO: "Cuarto",
      CAMA: "Cama",
      ESPACIO: "Espacio",
    };
    return map[type] || type;
  };

  const getTypeIncomeColor = (type) => {
    const map = {
      ALOJAMIENTO_COMPLETO: "purple",
      CUARTO: "cyan",
      CAMA: "geekblue",
      ESPACIO: "magenta",
    };
    return map[type] || "default";
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(price));

  const handlePrevPhoto = () =>
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? fotosOrdenadas.length - 1 : prev - 1,
    );

  const handleNextPhoto = () =>
    setCurrentPhotoIndex((prev) =>
      prev === fotosOrdenadas.length - 1 ? 0 : prev + 1,
    );

  const servicios = detailData?.servicios || [];
  const cuartos = detailData?.cuartos || [];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/90 z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-zinc-700">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {d.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Detalle del alojamiento
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <Spin spinning={loading} tip="Cargando...">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Columna izquierda */}
                <div>
                  {/* Galería */}
                  <div className="relative bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                    {fotosOrdenadas.length > 0 ? (
                      <>
                        <div className="relative">
                          <img
                            src={fotosOrdenadas[currentPhotoIndex]?.url}
                            alt={`${d.name} - Foto ${currentPhotoIndex + 1}`}
                            className="w-full h-96 object-cover transition-opacity duration-300"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/800x600?text=Error+de+imagen";
                            }}
                          />
                          <div className="absolute top-3 right-3">
                            <Tag
                              color={getStatusColor(d.estatus)}
                              className="text-sm font-semibold px-3 py-1"
                            >
                              {getStatusLabel(d.estatus)}
                            </Tag>
                          </div>
                          {fotosOrdenadas[currentPhotoIndex]?.esPrincipal && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                                Principal
                              </span>
                            </div>
                          )}
                          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                            {currentPhotoIndex + 1} / {fotosOrdenadas.length}
                          </div>
                          {fotosOrdenadas.length > 1 && (
                            <>
                              <button
                                onClick={handlePrevPhoto}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
                              >
                                <ChevronLeft size={20} />
                              </button>
                              <button
                                onClick={handleNextPhoto}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
                              >
                                <ChevronRight size={20} />
                              </button>
                            </>
                          )}
                        </div>
                        {fotosOrdenadas.length > 1 && (
                          <div className="p-2 bg-gray-50 dark:bg-zinc-800/80">
                            <div
                              ref={thumbnailsRef}
                              className="flex gap-2 overflow-x-auto pb-1"
                              style={{
                                scrollbarWidth: "thin",
                                scrollbarColor: "#a3a3a3 transparent",
                              }}
                            >
                              {fotosOrdenadas.map((foto, index) => (
                                <button
                                  key={foto.id_foto}
                                  onClick={() => setCurrentPhotoIndex(index)}
                                  className={`relative shrink-0 overflow-hidden transition-all duration-200 ${
                                    index === currentPhotoIndex
                                      ? "ring-2 ring-orange-500 ring-offset-1 opacity-100"
                                      : "opacity-60 hover:opacity-90"
                                  }`}
                                >
                                  <img
                                    src={foto.url}
                                    alt={`Miniatura ${index + 1}`}
                                    className="w-16 h-12 object-cover"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/64x48?text=Error";
                                    }}
                                  />
                                  {foto.esPrincipal && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-orange-500/80 text-white text-[8px] text-center font-semibold leading-tight py-0.5">
                                      Principal
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="relative">
                        <div className="w-full h-96 flex flex-col items-center justify-center gap-3">
                          <ImageOff
                            size={48}
                            className="text-gray-300 dark:text-zinc-600"
                          />
                          <p className="text-sm text-gray-400 dark:text-gray-500">
                            Sin imágenes disponibles
                          </p>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Tag
                            color={getStatusColor(d.estatus)}
                            className="text-sm font-semibold px-3 py-1"
                          >
                            {getStatusLabel(d.estatus)}
                          </Tag>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Precio */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 rounded-lg border border-lime-200 dark:border-lime-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Precio completo
                    </p>
                    <div className="flex items-center gap-2">
                      <DollarSign
                        size={28}
                        className="text-lime-600 dark:text-lime-400"
                      />
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(d.precio_completo)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        MXN/mes
                      </span>
                    </div>
                  </div>

                  {/* Mapa */}
                  {markerPosition && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={markerPosition}
                        zoom={15}
                        options={{
                          zoomControl: true,
                          mapTypeControl: false,
                          streetViewControl: false,
                          fullscreenControl: false,
                          clickableIcons: false,
                          gestureHandling: "cooperative",
                          draggable: false,
                        }}
                      >
                        <Marker position={markerPosition} />
                      </GoogleMap>
                    </div>
                  )}
                </div>

                {/* Columna derecha */}
                <div className="space-y-5">
                  {/* Descripción */}
                  {d.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <Home size={18} />
                        Descripción
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {d.description}
                      </p>
                    </div>
                  )}

                  {/* Ubicación */}
                  <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin
                        size={18}
                        className="text-gray-500 dark:text-gray-400"
                      />
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Ubicación
                      </h3>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {d.address || "—"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {d.city}
                      {d.country ? `, ${d.country}` : ""}
                    </p>
                    {d.codePostal && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        CP: {d.codePostal}
                      </p>
                    )}
                    {markerPosition && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {markerPosition.lat.toFixed(6)},{" "}
                        {markerPosition.lng.toFixed(6)}
                      </p>
                    )}
                  </div>

                  {/* Características */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Info size={18} />
                      Características
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Tipo de propiedad
                        </p>
                        <Tag color="blue" className="text-sm">
                          {d.typeProperty}
                        </Tag>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Tipo de renta
                        </p>
                        <Tag
                          color={getTypeIncomeColor(d.typeIncome)}
                          className="text-sm"
                        >
                          {getTypeIncomeLabel(d.typeIncome)}
                        </Tag>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Género
                        </p>
                        <Tag color="orange" className="text-sm">
                          {d.gender}
                        </Tag>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Estado
                        </p>
                        <Tag
                          color={getStatusColor(d.estatus)}
                          className="text-sm"
                        >
                          {getStatusLabel(d.estatus)}
                        </Tag>
                      </div>
                    </div>
                  </div>

                  {/* Servicios */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Settings size={18} />
                      Servicios
                      {servicios.length > 0 && (
                        <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                          ({servicios.length})
                        </span>
                      )}
                    </h3>
                    {servicios.length === 0 ? (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                        Sin servicios asignados
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {servicios.map((item) => (
                          <div
                            key={item.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-full"
                          >
                            <ServiceIconRenderer
                              iconKey={item.servicio?.icon}
                              size={14}
                              className="text-purple-600 dark:text-purple-400"
                            />
                            <span className="text-xs font-medium text-purple-800 dark:text-purple-300">
                              {item.servicio?.name || "—"}
                            </span>
                            {item.costo ? (
                              <span className="text-xs text-purple-500 dark:text-purple-400 font-semibold ml-0.5">
                                {formatPrice(item.costo)}
                              </span>
                            ) : (
                              <span className="text-[10px] text-purple-400 dark:text-purple-500 italic ml-0.5">
                                Incluido
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fecha de registro */}
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar
                        size={16}
                        className="text-gray-500 dark:text-gray-400"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Fecha de registro
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {dayjs(d.CreatedAt).format("DD [de] MMMM, YYYY")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cuartos y Camas - solo ESPACIO */}
              {d.typeIncome === "ESPACIO" && (
                <div className="px-6 pb-6">
                  <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 px-5 py-4 border-b border-gray-200 dark:border-zinc-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DoorOpen
                            size={20}
                            className="text-orange-600 dark:text-orange-400"
                          />
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Cuartos y Camas
                          </h3>
                        </div>
                        <Tag color="orange" className="text-sm">
                          {cuartos.length}{" "}
                          {cuartos.length === 1 ? "cuarto" : "cuartos"}
                        </Tag>
                      </div>
                    </div>

                    {cuartos.length === 0 ? (
                      <div className="p-8 text-center">
                        <DoorOpen
                          size={40}
                          className="text-gray-300 dark:text-zinc-600 mx-auto mb-3"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No hay cuartos registrados en este alojamiento.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                        {cuartos.map((cuarto) => (
                          <div key={cuarto.id_cuarto} className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                  <DoorOpen
                                    size={20}
                                    className="text-orange-600 dark:text-orange-400"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {cuarto.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      ID: {cuarto.identification}
                                    </span>
                                    {cuarto.description && (
                                      <>
                                        <span className="text-xs text-gray-300 dark:text-zinc-600">
                                          •
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {cuarto.description}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {formatPrice(cuarto.price)}
                                </span>
                                <Tag
                                  color={getStatusColor(cuarto.estatus)}
                                  className="text-xs"
                                >
                                  {getStatusLabel(cuarto.estatus)}
                                </Tag>
                              </div>
                            </div>

                            {cuarto.camas && cuarto.camas.length > 0 && (
                              <div className="ml-13 pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-2">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                                  <BedDouble
                                    size={14}
                                    className="text-blue-500"
                                  />
                                  {cuarto.camas.length}{" "}
                                  {cuarto.camas.length === 1 ? "cama" : "camas"}
                                </p>
                                {cuarto.camas.map((cama) => (
                                  <div
                                    key={cama.id_cama}
                                    className="flex items-center justify-between p-2.5 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <BedDouble
                                        size={16}
                                        className="text-blue-500 dark:text-blue-400"
                                      />
                                      <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                          {cama.name}
                                        </p>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          ID: {cama.identification}
                                          {cama.description &&
                                            ` • ${cama.description}`}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {formatPrice(cama.price)}
                                      </span>
                                      <Tag
                                        color={getStatusColor(cama.estatus)}
                                        className="text-xs"
                                      >
                                        {getStatusLabel(cama.estatus)}
                                      </Tag>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(!cuarto.camas || cuarto.camas.length === 0) && (
                              <div className="ml-13 pl-4 border-l-2 border-gray-200 dark:border-zinc-700">
                                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                                  Sin camas registradas
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Spin>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
            <Button
              size="large"
              type="primary"
              danger
              onClick={onClose}
              className="px-8 rounded-lg"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccommodationDetailModal_Owner;
