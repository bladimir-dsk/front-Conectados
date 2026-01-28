import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { Modal, Button, Tag } from "antd";
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
  WashingMachine,
  Snowflake,
  Tv,
  ShieldCheck,
  GraduationCap,
  X,
  Navigation,
  Map,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const servicesCatalog = [
  { name: "Internet", icon: <Wifi size={16} />, price: 0 },
  { name: "Agua", icon: <Droplet size={16} />, price: 0 },
  { name: "Luz", icon: <Zap size={16} />, price: 0 },
  { name: "Limpieza", icon: <Sparkles size={16} />, price: 15 },
  { name: "Cocina", icon: <CookingPot size={16} />, price: 10 },
  { name: "Lavadora", icon: <WashingMachine size={16} />, price: 0 },
  { name: "Aire acondicionado", icon: <Snowflake size={16} />, price: 0 },
  { name: "TV", icon: <Tv size={16} />, price: 0 },
  { name: "Seguridad", icon: <ShieldCheck size={16} />, price: 0 },
  { name: "Mantenimiento", icon: <Sparkles size={16} />, price: 0 },
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
    address: "Centro Histórico, Mérida",
    image: "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
    services: servicesCatalog,
    available: true,
  },
  {
    id: 2,
    name: "Habitación Montejo",
    price: 70,
    lat: 20.9845,
    lng: -89.62109,
    owner: "Ana López",
    type: "Compartida",
    beds: 2,
    gender: "Femenino",
    address: "Paseo de Montejo, Mérida",
    image: "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
    services: servicesCatalog,
    available: false,
  },
  {
    id: 3,
    name: "Habitación Itzimná",
    price: 75,
    lat: 20.99079,
    lng: -89.60028,
    owner: "Carlos Ruiz",
    type: "Privado",
    beds: 1,
    gender: "Masculino",
    address: "Itzimná, Mérida",
    image: "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
    services: servicesCatalog,
    available: true,
  },
  {
    id: 4,
    name: "Habitación Miraflores",
    price: 90,
    lat: 20.99798,
    lng: -89.61602,
    owner: "María Díaz",
    type: "Privado",
    beds: 1,
    gender: "Mixto",
    address: "Miraflores, Mérida",
    image: "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
    services: servicesCatalog,
    available: true,
  },
  {
    id: 5,
    name: "Habitación Altabrisa",
    price: 65,
    lat: 21.02221,
    lng: -89.56582,
    owner: "Luis Torres",
    type: "Privado",
    beds: 1,
    gender: "Mixto",
    address: "Altabrisa, Mérida",
    image: "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
    services: servicesCatalog,
    available: false,
  },
];

const university = {
  name: "Universidad Marista",
  lat: 21.0257,
  lng: -89.6273,
};

const RoomMarker = ({ onClick, isSelected, showRoute }) => (
  <div
    onClick={onClick}
    className="-translate-x-1/2 -translate-y-full cursor-pointer"
  >
    <Home
      size={30}
      className={`${showRoute ? "text-lime-500" : "text-red-500"} ${
        isSelected ? "scale-125 drop-shadow-lg" : ""
      } transition-all`}
    />
  </div>
);

const UniversityMarker = () => (
  <div className="-translate-x-1/2 -translate-y-full">
    <GraduationCap size={34} className="text-blue-600 drop-shadow" />
  </div>
);

const RouteInfo = ({ duration }) => (
  <div className="absolute top-24 right-5 z-20 bg-white rounded-2xl shadow-xl px-4 py-3 w-44">
    <div className="flex items-center gap-3">
      <Clock size={18} className="text-lime-600" />
      <div>
        <p className="text-xs text-gray-500">Tiempo estimado</p>
        <p className="font-semibold text-gray-800">{duration}</p>
      </div>
    </div>
  </div>
);

const Info = ({ icon, label, value }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3">
    <div className="text-lime-500">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

export default function SearchStudent_Screen() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [userRating, setUserRating] = useState({});
  const [showRoute, setShowRoute] = useState(false);
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routeDuration, setRouteDuration] = useState("");

  const handleRate = (roomId, value) => {
    setUserRating((prev) => ({ ...prev, [roomId]: value }));
  };

  const handleApiLoaded = ({ map, maps }) => {
    setMap(map);
    setMaps(maps);
    const renderer = new maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#84cc16",
        strokeOpacity: 0.85,
        strokeWeight: 5,
      },
    });
    renderer.setMap(map);
    setDirectionsRenderer(renderer);
  };

  const showRouteOnMap = (room) => {
    if (!map || !maps || !directionsRenderer) return;
    const service = new maps.DirectionsService();
    service.route(
      {
        origin: university,
        destination: { lat: room.lat, lng: room.lng },
        travelMode: maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          setShowRoute(true);
          setRouteDuration(result.routes[0].legs[0].duration.text);
          setOpenDetails(false);
        }
      },
    );
  };

  const clearRoute = () => {
    if (!directionsRenderer) return;
    directionsRenderer.setDirections({ routes: [] });
    setShowRoute(false);
    setRouteDuration("");
    map.setCenter({ lat: 20.99, lng: -89.6 });
    map.setZoom(13);
  };

  useEffect(() => {
    return () => {
      if (directionsRenderer) directionsRenderer.setMap(null);
    };
  }, [directionsRenderer]);

  return (
    <div className="relative h-[calc(100vh-64px)]">
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
        defaultCenter={{ lat: 20.99, lng: -89.6 }}
        defaultZoom={13}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleApiLoaded}
      >
        <UniversityMarker lat={university.lat} lng={university.lng} />
        {rooms.map((room) => (
          <RoomMarker
            key={room.id}
            lat={room.lat}
            lng={room.lng}
            isSelected={selectedRoom?.id === room.id}
            showRoute={showRoute && selectedRoom?.id === room.id}
            onClick={() => {
              setSelectedRoom(room);
              setOpenDetails(true);
            }}
          />
        ))}
      </GoogleMapReact>

      {showRoute && routeDuration && <RouteInfo duration={routeDuration} />}

      <Modal
        open={openDetails}
        footer={null}
        onCancel={() => setOpenDetails(false)}
        centered
        width={520}
        closable={false}
        mask={false}
        bodyStyle={{ padding: 0 }}
        className="[&_.ant-modal-content]:rounded-2xl"
      >
        {selectedRoom && (
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
                onClick={() => setOpenDetails(false)}
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
                    <div className="font-medium">{university.name}</div>
                    <div className="text-gray-500 truncate">
                      → {selectedRoom.address}
                    </div>
                  </div>

                  <Button
                    size="small"
                    type="primary"
                    icon={<Map size={14} />}
                    onClick={() => showRouteOnMap(selectedRoom)}
                    className="bg-lime-500 hover:bg-lime-600 border-lime-500 text-white"
                  >
                    Ver ruta
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Servicios incluidos</h4>
                <div className="space-y-2">
                  {selectedRoom.services.map((service, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="text-lime-500">{service.icon}</span>
                        {service.name}
                      </span>
                      <span className="text-lime-600 font-medium">
                        {service.price === 0
                          ? "Incluido"
                          : `+$${service.price}`}
                      </span>
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
                className="h-11 rounded-xl bg-lime-500 hover:bg-lime-600 border-lime-500 text-white"
              >
                {selectedRoom.available
                  ? "Solicitar habitación"
                  : "Habitación ocupada"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
