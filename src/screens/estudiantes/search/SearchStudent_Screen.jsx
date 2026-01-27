import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import { Modal, Button } from "antd";
import {
  MapPin,
  User,
  Home,
  Bed,
  DollarSign,
  Star,
  Wifi,
  Droplet,
  Zap,
  Sparkles,
  CookingPot,
  Snowflake,
  Tv,
  Lock,
  Fan,
  X,
} from "lucide-react";

const servicesCatalog = [
  { name: "Internet", icon: <Wifi />, price: 0 },
  { name: "Agua", icon: <Droplet />, price: 0 },
  { name: "Luz", icon: <Zap />, price: 20 },
  { name: "Limpieza", icon: <Sparkles />, price: 15 },
  { name: "Cocina compartida", icon: <CookingPot />, price: 10 },
  { name: "Aire acondicionado", icon: <Snowflake />, price: 25 },
  { name: "Televisión", icon: <Tv />, price: 0 },
  { name: "Ventilador", icon: <Fan />, price: 0 },
  { name: "Cerradura privada", icon: <Lock />, price: 0 },
  { name: "Área común", icon: <Home />, price: 0 },
];

const rooms = [
  {
    id: 1,
    name: "Habitación Centro",
    price: 80,
    lat: 20.96737,
    lng: -89.59258,
    owner: "Juan Pérez",
    type: "Cuarto privado",
    beds: 1,
    gender: "Mixto",
    address: "Centro, Mérida",
    image: "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
    services: servicesCatalog,
  },
  {
    id: 2,
    name: "Habitación Montejo",
    price: 70,
    lat: 20.98402,
    lng: -89.62043,
    owner: "Ana López",
    type: "Compartida",
    beds: 2,
    gender: "Femenino",
    address: "Paseo de Montejo, Mérida",
    image: "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
    services: servicesCatalog,
  },
  {
    id: 3,
    name: "Habitación Itzimná",
    price: 75,
    lat: 20.99092,
    lng: -89.60211,
    owner: "Carlos Ruiz",
    type: "Privado",
    beds: 1,
    gender: "Masculino",
    address: "Itzimná, Mérida",
    image: "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
    services: servicesCatalog,
  },
  {
    id: 4,
    name: "Habitación Miraflores",
    price: 90,
    lat: 20.99763,
    lng: -89.61694,
    owner: "María Díaz",
    type: "Privado",
    beds: 1,
    gender: "Mixto",
    address: "Miraflores, Mérida",
    image: "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
    services: servicesCatalog,
  },
  {
    id: 5,
    name: "Habitación Altabrisa",
    price: 65,
    lat: 21.02127,
    lng: -89.56569,
    owner: "Luis Torres",
    type: "Privado",
    beds: 1,
    gender: "Mixto",
    address: "Altabrisa, Mérida",
    image: "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
    services: servicesCatalog,
  },
];

const Marker = ({ onClick }) => (
  <div onClick={onClick} className="cursor-pointer">
    <MapPin size={36} className="text-lime-500 drop-shadow-lg" />
  </div>
);

const Info = ({ icon, label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
    <div className="text-lime-500">{icon}</div>
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-800 truncate">{value}</div>
    </div>
  </div>
);

export default function SearchStudent_Screen() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [userRating, setUserRating] = useState({});

  const openRoomDetails = (room) => {
    setSelectedRoom(room);
    setOpenDetails(true);
  };

  const handleRate = (roomId, value) => {
    setUserRating((prev) => ({ ...prev, [roomId]: value }));
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full">
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
        defaultCenter={{ lat: 20.99, lng: -89.6 }}
        defaultZoom={12}
      >
        {rooms.map((room) => (
          <Marker
            key={room.id}
            lat={room.lat}
            lng={room.lng}
            onClick={() => openRoomDetails(room)}
          />
        ))}
      </GoogleMapReact>

      <Modal
        open={openDetails}
        footer={null}
        onCancel={() => setOpenDetails(false)}
        centered
        width={520}
        closable={false}
        mask={false}
        className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-body]:p-0"
      >
        {selectedRoom && (
          <>
            <div className="relative h-56">
              <img
                src={selectedRoom.image}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <button
                onClick={() => setOpenDetails(false)}
                className="absolute top-4 right-4 text-white"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedRoom.name}
                  </h3>
                  <div className="flex items-center gap-1 text-lime-200 text-sm">
                    <MapPin size={14} />
                    {selectedRoom.address}
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  ${selectedRoom.price}
                  <span className="text-sm font-normal"> /noche</span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={16} />
                  {selectedRoom.owner}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Calificar</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className="cursor-pointer"
                        fill={
                          userRating[selectedRoom.id] >= star
                            ? "#84cc16"
                            : "none"
                        }
                        color={
                          userRating[selectedRoom.id] >= star
                            ? "#84cc16"
                            : "#d1d5db"
                        }
                        onClick={() => handleRate(selectedRoom.id, star)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Info icon={<Home />} label="Tipo" value={selectedRoom.type} />
                <Info
                  icon={<Bed />}
                  label="Camas"
                  value={`${selectedRoom.beds} cama`}
                />
                <Info
                  icon={<DollarSign />}
                  label="Género"
                  value={selectedRoom.gender}
                />
                <Info
                  icon={<MapPin />}
                  label="Ubicación"
                  value={selectedRoom.address}
                />
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Servicios incluidos
                </h4>
                <div className="max-h-52 overflow-y-auto space-y-3 pr-2">
                  {selectedRoom.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3 text-gray-700">
                        <span className="text-lime-500">{service.icon}</span>
                        {service.name}
                      </div>
                      <span className="text-lime-500 font-medium">
                        {service.price === 0
                          ? "Incluido"
                          : `+$${service.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full h-11 rounded-lg border border-gray-300">
                Solicitar habitación
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
