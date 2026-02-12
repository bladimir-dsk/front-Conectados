import React from "react";
import { Modal, Button, Space, Divider, Spin, Alert, Carousel } from "antd";
import {
  Home,
  User,
  Star as StarIcon,
  MapPin as MapPinIcon,
  Bed,
  DollarSign,
  X,
} from "lucide-react";

const RoomDetailsModal = ({
  open,
  onClose,
  room,
  userRating,
  onRate,
  onRequestRoom,
  services = [],
  images = [],
  imageUrl = "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
  loading = false,
  error = null,
}) => {
  if (!room) return null;

  const formatCost = (cost) => {
    if (cost === null || cost === "0" || cost === 0) return "Incluido";
    return `+ $${cost}`;
  };

  const displayImages = images.length > 0 ? images : [room.image || imageUrl];

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
          message="Error"
          description={error}
          type="error"
          showIcon
          className="m-4"
          closable
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Cargando detalles..." />
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="relative h-56">
            <Carousel autoplay dots className="w-full h-full">
              {displayImages.map((src, index) => (
                <div key={index} className="w-full h-56">
                  <img
                    src={src}
                    alt={`${room.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Carousel>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
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
                  <Bed size={18} className="text-lime-600" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Camas
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {room.beds || 0} {room.beds === 1 ? "cama" : "camas"}
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
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPinIcon size={18} className="text-lime-600" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Ubicación
                    </div>
                    <div className="text-xs font-medium text-gray-800 truncate">
                      {room.address || "Dirección no disponible"}
                    </div>
                  </div>
                </div>
              </div>

              {services.length > 0 && (
                <>
                  <Divider className="my-0 border-gray-200" />
                  <div className="w-full">
                    <h4 className="text-base font-semibold text-gray-800 mb-3">
                      Servicios disponibles
                    </h4>
                    <div className="max-h-60 overflow-y-auto pr-2">
                      <div className="grid grid-cols-1 gap-2">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="text-lime-600 flex-shrink-0">
                                {service.icon}
                              </div>
                              <span className="text-gray-700 text-sm truncate">
                                {service.name}
                              </span>
                            </div>
                            <span className="text-lime-600 font-medium text-sm whitespace-nowrap flex-shrink-0 ml-2">
                              {formatCost(service.cost)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

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
