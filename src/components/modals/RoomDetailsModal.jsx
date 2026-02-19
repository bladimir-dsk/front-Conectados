import React from "react";
import {
  Modal,
  Button,
  Space,
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
  Transgender,
  User,
  Mail,
  Phone,
  Star as StarIcon,
  MapPin as MapPinIcon,
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
  internet: Wifi,
  water: Droplets,
  electricidad: Zap,
  cable: Zap,
  wifi: Wifi,
  aire: Wind,
  tv: Tv,
  estacionamiento: Car,
  gimnasio: Dumbbell,
  piscina: Waves,
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
        if (a.esPrincipal === b.esPrincipal) return 0;
        return b.esPrincipal ? 1 : -1;
      })
    : [];

  const renderServiceIcon = (iconName) => {
    if (!iconName) return <Sparkles size={16} className="text-lime-500" />;

    const IconComponent =
      ICON_MAP[iconName.toLowerCase()] || ICON_MAP[iconName];
    return IconComponent ? (
      <IconComponent size={16} className="text-lime-500" />
    ) : (
      <Sparkles size={16} className="text-lime-500" />
    );
  };

  const STATUS_CONFIG = {
    ACTIVO: { label: "Disponible", color: "green" },
    INACTIVO: { label: "No disponible", color: "red" },
    PENDIENTE: { label: "Pendiente", color: "gold" },
    OCUPADO: { label: "Ocupado", color: "gold" },
    MANTENIMIENTO: { label: "Mantenimiento", color: "gold" },
  };

  const getStatusTag = (status) => {
    const config = STATUS_CONFIG[status] || {
      label: status,
      color: "default",
    };

    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const isBedAvailable = (status) => status === "ACTIVO";

  const propietario = room.propietario || {};
  const ownerName =
    propietario.namePersonal && propietario.lastName
      ? `${propietario.namePersonal} ${propietario.lastName}`
      : propietario.namePersonal || "Propietario";
  const ownerEmail = propietario.emailPersonal || propietario.email || "";
  const ownerPhone = propietario.phone
    ? `+${propietario.code || ""} ${propietario.phone}`
    : "";

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
          className="text-gray-500 hover:text-lime-500"
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
            {fotosOrdenadas.length > 0 ? (
              <Carousel autoplay dots>
                {fotosOrdenadas.map((foto) => (
                  <div key={foto.id_foto} className="h-60">
                    <img
                      src={foto.url}
                      alt={`Foto ${foto.id_foto}`}
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
                    ${room.precio_completo || room.price}
                    <span className="text-sm text-lime-100 ml-1">/mes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 my-2">
            <Space orientation="vertical" size={16} className="w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-semibold text-lime-500 my-3">
                    Propietario
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 dark:text-white">
                      <User
                        size={16}
                        className="text-gray-600 dark:text-white"
                      />
                      <span className="text-gray-700 text-sm dark:text-white">
                        {ownerName}
                      </span>
                    </div>
                    {ownerEmail && (
                      <div className="flex items-center gap-2">
                        <Mail
                          size={14}
                          className="text-gray-600 dark:text-white"
                        />
                        <span className="text-gray-500 text-xs dark:text-white">
                          {ownerEmail}
                        </span>
                      </div>
                    )}
                    {ownerPhone && (
                      <div className="flex items-center gap-2">
                        <Phone
                          size={14}
                          className="text-gray-600 dark:text-white"
                        />
                        <span className="text-gray-500 text-xs dark:text-white">
                          {ownerPhone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {onRate && (
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1 dark:text-white">
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
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-transparent dark:bg-neutral-900">
                  <Home size={18} className="text-lime-500" />
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wide truncate text-gray-500 dark:text-white">
                      Tipo
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
                <div className="col-span-2">
                  <h4 className="text-base font-semibold text-lime-500 mb-1">
                    Cuartos y camas
                  </h4>
                  {room.cuartos && room.cuartos.length > 0 ? (
                    <Collapse accordion ghost>
                      {room.cuartos.map((cuarto) => {
                        const cuartoActivo = cuarto.estatus === "ACTIVO";

                        return (
                          <Collapse.Panel
                            key={cuarto.id_cuarto}
                            header={
                              <div className="flex justify-between items-center w-full">
                                <span className="font-medium text-gray-800 dark:text-white">
                                  {cuarto.name}
                                </span>

                                <div className="flex items-center gap-2">
                                  {getStatusTag(cuarto.estatus)}
                                  <span className="text-sm font-semibold text-lime-500">
                                    + ${cuarto.price}
                                  </span>
                                </div>
                              </div>
                            }
                          >
                            {cuartoActivo ? (
                              cuarto.camas && cuarto.camas.length > 0 ? (
                                <div className="space-y-2">
                                  {cuarto.camas.map((cama) => (
                                    <div
                                      key={cama.id_cama}
                                      className="flex items-center justify-between p-3 rounded-lg bg-white border-gray-200 dark:bg-neutral-900"
                                    >
                                      <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-white">
                                          {cama.name}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {getStatusTag(cama.estatus)}
                                        <span className="text-sm font-semibold">
                                          + ${cama.price}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-white">
                                  Este cuarto no tiene camas registradas
                                </p>
                              )
                            ) : (
                              <p className="text-sm text-gray-500">
                                Este cuarto no está disponible para selección
                              </p>
                            )}
                          </Collapse.Panel>
                        );
                      })}
                    </Collapse>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No hay cuartos disponibles para esta habitación
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full">
                <h4 className="text-base font-semibold text-lime-500 mb-3">
                  Servicios disponibles
                </h4>

                {services.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 mt-2 ">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-lg dark:bg-neutral-900"
                      >
                        <div className="flex items-center gap-2">
                          {renderServiceIcon(service.icon)}
                          <span className="text-sm text-gray-700 dark:text-white">
                            {service.name}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-white">
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
                  className="w-full !bg-lime-500 hover:!bg-lime-500 !border-lime-500 !text-white h-12 text-lg font-bold rounded-lg"
                  onClick={() => {
                    onRequestRoom(room.id_alojamiento);
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
