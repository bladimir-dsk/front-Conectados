import React, { useState } from "react";
import { Modal, Button, Tag, Divider } from "antd";
import {
  MapPin,
  User,
  Home,
  Bed,
  DollarSign,
  Star,
  Navigation,
  Map,
  X,
} from "lucide-react";

const Info = ({ icon, label, value }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3">
    <div className="text-lime-500">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800 break-words leading-snug">
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

  const [rating, setRating] = useState(userRating[selectedRoom.id] || 0);

  const handleRate = (value) => {
    setRating(value);
    onRate(selectedRoom.id, value);
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
      <div className="max-h-[88vh] flex flex-col">
        <div className="relative h-52 shrink-0">
          <img
            src={selectedRoom.image}
            alt={selectedRoom.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white text-lime-600 px-3 py-1 rounded-full text-sm font-medium shadow">
              {selectedRoom.available ? "Disponible" : "Ocupada"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 z-10"
          >
            <X size={16} />
          </button>

          <div className="absolute bottom-4 left-4 right-4 z-10">
            <h3 className="text-white font-bold text-xl truncate">
              {selectedRoom.name}
            </h3>
            <div className="flex items-center gap-1 text-lime-300 text-sm truncate">
              <MapPin size={14} />
              {selectedRoom.address}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-700">
              <User size={16} />
              {selectedRoom.owner}
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-500 block mb-1">
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Info
              icon={<Home size={16} />}
              label="Tipo"
              value={selectedRoom.type}
            />
            <Info
              icon={<Bed size={16} />}
              label="Camas"
              value={`${selectedRoom.beds} cama`}
            />
            <Info
              icon={<DollarSign size={16} />}
              label="Género"
              value={selectedRoom.gender}
            />
            <Info
              icon={<MapPin size={16} />}
              label="Ubicación"
              value={selectedRoom.address}
            />
          </div>

          <div className="bg-lime-50 border border-lime-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Navigation size={16} className="text-lime-600" />
              <span className="font-medium text-sm">
                Ruta desde tu universidad
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm">
                <div className="font-medium">Universidad Marista</div>
                <div className="text-gray-500 truncate">
                  → {selectedRoom.address}
                </div>
              </div>

              <Button
                size="small"
                type="default"
                icon={<Map size={14} />}
                onClick={() => {
                  onShowRoute(selectedRoom);
                  onClose();
                }}
                className="!bg-lime-500 hover:!bg-lime-600 !border-lime-500 !text-white"
              >
                Ver ruta
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Servicios incluidos</h4>
            <div className="space-y-2">
              {selectedRoom.services
                .filter((service) => service.price === 0)
                .map((service, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-lime-500">{service.icon}</span>
                      {service.name}
                    </span>
                    <span className="text-lime-600 font-medium">Incluido</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <Button
            block
            type="primary"
            disabled={!selectedRoom.available}
            className={`h-11 rounded-xl !text-white ${
              selectedRoom.available
                ? "!bg-lime-500 hover:!bg-lime-600 !border-lime-500"
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
