import React from "react";
import {
  Modal,
  Button,
  Space,
  Divider,
  Spin,
  Alert,
  Carousel,
  Collapse,
  Tag,
} from "antd";
import {
  Wifi,
  Droplets,
  Zap,
  Sparkles,
  Utensils,
  Shirt,
  Wind,
  Tv,
  Car,
  Dumbbell,
  Waves,
  Coffee,
  Sandwich,
  Moon,
  Home,
  User,
  Star as StarIcon,
  MapPin as MapPinIcon,
  DollarSign,
  X,
} from "lucide-react";

const ICON_MAP = {
  "fat-wifi": Wifi,
  "fat-droplets": Droplets,
  "fat-zap": Zap,
  "fat-sparkles": Sparkles,
  "fat-utensils": Utensils,
  "fat-shirt": Shirt,
  "fat-wind": Wind,
  "fat-tv": Tv,
  "fat-car": Car,
  "fat-dumbbell": Dumbbell,
  "fat-waves": Waves,
  "fat-coffee": Coffee,
  "fat-sandwich": Sandwich,
  "fat-moon": Moon,
};

const RoomDetailsModal = ({
  open,
  onClose,
  room,
  userRating,
  onRate,
  onRequestRoom,
  services = [],
  imageUrl = "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
  loading = false,
  error = null,
}) => {
  if (!room) return null;

  const formatCost = (cost) => {
    if (cost === null || cost === "0" || cost === 0) return "FREE";
    return `+ $${cost}`;
  };

  const fotosOrdenadas = Array.isArray(room?.fotos)
    ? [...room.fotos].sort((a, b) => {
        if (a.principal === b.principal) return 0;
        return b.principal ? 1 : -1;
      })
    : [];

  const renderServiceIcon = (iconName) => {
    if (!iconName) return <Sparkles size={16} className="text-lime-600" />;

    const IconComponent = ICON_MAP[iconName];
    return IconComponent ? (
      <IconComponent size={16} className="text-lime-600" />
    ) : (
      <Sparkles size={16} className="text-lime-600" />
    );
  };
  const BED_DISABLED_STATUS = [
    "INACTIVO",
    "OCUPADO",
    "MANTENIMIENTO",
    "PENDIENTE",
  ];

  const isBedAvailable = (status) => status === "ACTIVO";

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      width={480}
      closable={false}
      className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-body]:p-0"
    >
      <div className="absolute top-4 right-4 z-10">
        <Button
          type="text"
          icon={<X size={18} />}
          onClick={onClose}
          className="text-gray-500 hover:text-lime-600"
          aria-label="Cerrar"
          disabled={loading}
        />
      </div>

      {error && (
        <Alert
          title="Error"
          description={error}
          type="error"
          showIcon
          className="m-4"
          closable
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="relative h-56">
            <div className="relative h-56">
              {fotosOrdenadas.length > 0 ? (
                <Carousel autoplay dots>
                  {fotosOrdenadas.map((foto) => (
                    <div key={foto.id} className="h-60">
                      <img
                        src={foto.url}
                        alt={`Foto ${foto.id}`}
                        className="w-full h-60 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
                  Sin imágenes disponibles
                </div>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <MapPinIcon size={14} className="text-lime-200" />
                    <span className="text-lime-100 text-xs">
                      {room.location ||
                        room.address ||
                        "Ubicación no disponible"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    ${room.price}
                    <span className="text-sm text-lime-100 ml-1">/noche</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5">
            <Space orientation="vertical" size={16} className="w-full">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-600" />
                  <span className="text-gray-700 text-sm font-medium">
                    {room.owner || "Propietario"}
                  </span>
                </div>
                {onRate && (
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">
                      Tu calificación
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          size={16}
                          className="cursor-pointer"
                          fill={userRating >= star ? "#84cc16" : "none"}
                          color={userRating >= star ? "#84cc16" : "#d1d5db"}
                          onClick={() => onRate(room.id, star)}
                          aria-label={`Calificar con ${star} estrella${star !== 1 ? "s" : ""}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Home size={18} className="text-lime-600" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wide truncate">
                      Tipo
                    </div>
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {room.type || "No especificado"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign size={18} className="text-lime-600" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Género
                    </div>
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {room.gender === "femenino"
                        ? "Solo mujeres"
                        : room.gender === "masculino"
                          ? "Solo hombres"
                          : "Mixto"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg col-span-2">
                  <MapPinIcon size={18} className="text-lime-600" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Dirección
                    </div>
                    <div className="text-xs font-medium text-gray-800 truncate">
                      {room.address || "Dirección no disponible"}
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <h4 className="text-base font-semibold text-lime-600 mb-1">
                    Cuartos y camas
                  </h4>

                  {room.cuartos && room.cuartos.length > 0 ? (
                    <Collapse accordion ghost>
                      {room.cuartos.map((cuarto) => (
                        <Collapse.Panel
                          key={cuarto.id_cuarto}
                          header={
                            <div className="flex justify-between items-center w-full">
                              <span className="font-medium text-gray-800">
                                {cuarto.name}
                              </span>
                              <span className="text-sm font-semibold text-lime-600">
                                + ${cuarto.price}
                              </span>
                            </div>
                          }
                        >
                          {cuarto.camas && cuarto.camas.length > 0 ? (
                            <div className="space-y-2">
                              {cuarto.camas.map((cama) => {
                                const disponible = cama.estatus === "ACTIVO";

                                return (
                                  <div
                                    key={cama.id_cama}
                                    className={`flex items-center justify-between p-3 rounded-lg border ${
                                      disponible
                                        ? "bg-white border-gray-200"
                                        : "bg-gray-100 border-gray-300 opacity-60"
                                    }`}
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">
                                        {cama.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {disponible
                                          ? "Disponible"
                                          : "No disponible"}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold">
                                        + ${cama.price}
                                      </span>

                                      {!disponible && (
                                        <Tag color="red">No disponible</Tag>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Este cuarto no tiene camas registradas
                            </p>
                          )}
                        </Collapse.Panel>
                      ))}
                    </Collapse>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No hay cuartos disponibles para esta habitación
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <h4 className="text-base font-semibold text-lime-600 dark:text-lime-500 mb-3">
                  Servicios disponibles
                </h4>

                {services.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 mt-2 ">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          {renderServiceIcon(service.icon)}
                          <span className="text-sm text-gray-700">
                            {service.name}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {formatCost(service.costo)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No hay servicios disponibles
                  </p>
                )}
              </div>

              {onRequestRoom && (
                <Button
                  className="w-full !bg-lime-600 hover:!bg-lime-600 !border-lime-600 !text-white h-12 text-lg font-bold rounded-lg"
                  onClick={() => {
                    onRequestRoom(room.id);
                    onClose();
                  }}
                  aria-label="Solicitar habitación"
                  loading={loading}
                  disabled={loading}
                >
                  Solicitar habitación
                </Button>
              )}
            </Space>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RoomDetailsModal;
