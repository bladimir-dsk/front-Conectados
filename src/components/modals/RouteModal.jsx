import React, { useState } from "react";
import { Modal, Button, Tag, Divider, Carousel, Collapse } from "antd";
import {
  Wifi,
  Droplets,
  Zap,
  Tv,
  Star,
  MapPin,
  User,
  Home,
  Bed,
  Transgender,
  DollarSign,
  Navigation,
  Map,
  X,
  Mail,
  Phone,
} from "lucide-react";

const renderServiceIcon = (icon) => {
  switch (icon) {
    case "internet":
      return <Wifi size={16} className="text-lime-500" />;
    case "water":
      return <Droplets size={16} className="text-lime-500" />;
    case "cable":
    case "electricidad":
      return <Zap size={16} className="text-lime-500" />;
    case "tv":
      return <Tv size={16} className="text-lime-500" />;
    default:
      return <Star size={16} className="text-gray-400" />;
  }
};

const Info = ({ icon, label, value }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3 dark:bg-neutral-900 dark:border-neutral-900">
    <div className="text-lime-500">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 dark:text-white">{label}</p>
      <p className="font-medium text-gray-800 break-words leading-snug dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const RouteModal = ({
  open,
  onClose,
  selectedRoom,
  userRating,
  onRate,
  onShowRoute,
  onRequestRoom,
}) => {
  if (!selectedRoom) return null;

  const fotosOrdenadas = [...(selectedRoom.images || [])].sort(
    (a, b) => (a.orden ?? 0) - (b.orden ?? 0),
  );

  const room = selectedRoom;

  const owner = selectedRoom.owner || {};

  const ownerName =
    `${owner.namePersonal || ""} ${owner.lastName || ""}`.trim() ||
    "Propietario no disponible";

  const ownerEmail = owner.email || null;
  const ownerPhone = owner.phone || owner.telefono || null;

  const [rating, setRating] = useState(userRating[selectedRoom.id] || 0);

  const handleRate = (value) => {
    setRating(value);
    onRate(selectedRoom.id, value);
  };

  const getStatusTag = (status) => {
    const map = {
      ACTIVO: { text: "Disponible", color: "green" },
      INACTIVO: { text: "No disponible", color: "red" },
      OCUPADO: { text: "Ocupado", color: "gold" },
      PENDIENTE: { text: "Pendiente", color: "gold" },
      MANTENIMIENTO: { text: "Mantenimiento", color: "gold" },
    };

    return map[status] || { text: status, color: "default" };
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      width={520}
      closable={false}
      mask={false}
      styles={{ body: { padding: 0 } }}
      className="[&_.ant-modal-content]:rounded-2xl"
    >
      <div className="absolute top-4 right-4 z-10"></div>
      <div className="max-h-[88vh] flex flex-col">
        <div className="flex justify-end">
          <Button
            type="text"
            icon={<X size={18} />}
            onClick={onClose}
            className="text-gray-500 hover:text-lime-500"
            aria-label="Cerrar"
          />
        </div>
        <div className="relative h-60 shrink-0 z-20 overflow-hidden">
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
                  <MapPin size={14} className="text-lime-200" />
                  <span className="text-lime-100 text-xs">
                    {room.location || room.address || "Ubicación no disponible"}
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

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-base font-semibold text-lime-500 my-1">
                Propietario
              </h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-600 dark:text-white" />
                  <span className="text-gray-700 text-sm dark:text-white">
                    {ownerName}
                  </span>
                </div>

                {ownerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-600 dark:text-white" />
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
                <span className="text-xs text-gray-500 block dark:text-white">
                  Calificar
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className="cursor-pointer"
                      fill={rating >= star ? "#84cc16" : "none"}
                      color={rating >= star ? "#84cc16" : "#d1d5db"}
                      onClick={() => handleRate(star)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Info
              icon={<Home size={16} />}
              label="Tipo"
              value={selectedRoom.type}
            />
            <Info
              icon={<Transgender size={16} />}
              label="Género"
              value={selectedRoom.gender}
            />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Info
              icon={<MapPin size={16} />}
              label="Ubicación"
              value={selectedRoom.address}
            />
          </div>
          <div className="w-full">
            <h4 className="text-base font-semibold text-lime-500 mb-3">
              Cuartos y camas
            </h4>
            {selectedRoom.cuartos?.length > 0 ? (
              <Collapse accordion ghost>
                {selectedRoom.cuartos.map((cuarto) => {
                  const cuartoStatus = getStatusTag(cuarto.estatus);
                  const isActivo = cuarto.estatus === "ACTIVO";
                  return (
                    <Collapse.Panel
                      key={cuarto.id_cuarto}
                      header={
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-white">
                            <span className="font-medium">{cuarto.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag color={cuartoStatus.color}>
                              {cuartoStatus.text}
                            </Tag>
                            <span className="text-lime-500 font-semibold">
                              +${cuarto.price}
                            </span>
                          </div>
                        </div>
                      }
                    >
                      {isActivo ? (
                        cuarto.camas?.length > 0 ? (
                          <div className="space-y-2">
                            {cuarto.camas.map((cama) => {
                              const camaStatus = getStatusTag(cama.estatus);

                              return (
                                <div
                                  key={cama.id_cama}
                                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg dark:bg-neutral-900"
                                >
                                  <div className="flex items-center gap-2 text-gray-600 dark:text-white">
                                    <span className="text-xs dark:text-white">
                                      {cama.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Tag color={camaStatus.color}>
                                      {camaStatus.text}
                                    </Tag>
                                    <span className="text-sm font-medium">
                                      +${cama.price}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
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
                No hay cuartos disponibles
              </p>
            )}
          </div>
          <div className="bg-lime-50 border border-lime-200 rounded-xl p-3 dark:bg-neutral-900 dark:border-neutral-900">
            {" "}
            <div className="flex items-center gap-2 mb-2">
              {" "}
              <Navigation size={16} className="text-lime-500" />{" "}
              <span className="font-medium text-sm">
                {" "}
                Ruta desde tu universidad{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex justify-between items-center">
              {" "}
              <div className="text-sm">
                {" "}
                <div className="font-medium">Universidad Marista</div>{" "}
                <div className="text-gray-500 truncate">
                  {" "}
                  → {selectedRoom.address}{" "}
                </div>{" "}
              </div>{" "}
              <Button
                size="small"
                type="default"
                icon={<Map size={14} />}
                onClick={() => {
                  onShowRoute(selectedRoom);
                  onClose();
                }}
                className="!bg-lime-500 hover:!bg-lime-500 !border-lime-500 !text-white"
              >
                {" "}
                Ver ruta{" "}
              </Button>{" "}
            </div>{" "}
          </div>
          <div className="w-full">
            <h4 className="text-base font-semibold text-lime-500 mb-3">
              Servicios disponibles
            </h4>
            {selectedRoom.services?.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {selectedRoom.services.map((service) => (
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
                      {service.price === 0 ? "Incluido" : `+$${service.price}`}
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
        </div>
        <div className="p-4 border-t">
          <Button
            block
            type="primary"
            disabled={!selectedRoom.available}
            className={`h-11 rounded-xl !text-white ${
              selectedRoom.available
                ? "!bg-lime-500 hover:!bg-lime-500 !border-lime-500"
                : "!bg-gray-400 !border-gray-400 cursor-not-allowed"
            }`}
            onClick={() => {
              if (selectedRoom.available) {
                onRequestRoom(selectedRoom);
                onClose();
              }
            }}
          >
            {selectedRoom.available
              ? "Solicitar habitación"
              : "Habitación ocupada"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RouteModal;
