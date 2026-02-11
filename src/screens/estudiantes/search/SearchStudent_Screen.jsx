import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useLocation, useParams } from "react-router-dom";
import {
  Modal,
  Button,
  Tag,
  Steps,
  Divider,
  Space,
  ConfigProvider,
} from "antd";
import esES from "antd/locale/es_ES";
import {
  MapPin,
  User,
  Home,
  Bed,
  DollarSign,
  Star,
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
  ShieldCheck,
  X,
  Navigation,
  Map,
  Clock,
  CheckCircle,
  CalendarDays,
  Plus,
} from "lucide-react";

// Importar componentes de modales
import RouteModal from "../../../components/modals/RouteModal";
import ReservationModal from "../../../components/modals/ReservationModal";
import { useApi } from "../../../hooks/useApi";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const IMAGE_URL = "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg";

const SERVICES = [
  { name: "Internet", price: 0, icon: <Wifi size={16} /> },
  { name: "Agua", price: 0, icon: <Droplets size={16} /> },
  { name: "Luz", price: 20, icon: <Zap size={16} /> },
  { name: "Limpieza", price: 15, icon: <Sparkles size={16} /> },
  { name: "Cocina", price: 10, icon: <Utensils size={16} /> },
  { name: "Lavadora", price: 5, icon: <Shirt size={16} /> },
  { name: "Aire acondicionado", price: 25, icon: <Wind size={16} /> },
  { name: "TV", price: 10, icon: <Tv size={16} /> },
  { name: "Parqueadero", price: 30, icon: <Car size={16} /> },
  { name: "Gimnasio", price: 20, icon: <Dumbbell size={16} /> },
  { name: "Piscina", price: 25, icon: <Waves size={16} /> },
  { name: "Desayuno", price: 12, icon: <Coffee size={16} /> },
  { name: "Almuerzo", price: 18, icon: <Sandwich size={16} /> },
  { name: "Cena", price: 22, icon: <Moon size={16} /> },
];

const rooms = [
  {
    id: 1,
    title: "Habitación Centro",
    name: "Habitación Centro",
    price: 2500,
    rating: 4.3,
    available: true,
    services: SERVICES,
    lat: 20.9671,
    lng: -89.6237,
    image: IMAGE_URL,
    address: "Calle 10 #123, Centro, Mérida, Yucatán",
    owner: "Juan Pérez",
    type: "Cuarto privado",
    beds: 1,
    gender: "Mixto",
  },
  {
    id: 2,
    title: "Habitación Itzimná",
    name: "Habitación Itzimná",
    price: 3200,
    rating: 4.5,
    available: true,
    services: SERVICES,
    lat: 20.9802,
    lng: -89.6103,
    image: IMAGE_URL,
    address: "Calle 25 #456, Itzimná, Mérida",
    owner: "María García",
    type: "Cuarto privado",
    beds: 1,
    gender: "Femenino",
  },
  {
    id: 3,
    title: "Habitación Chuburná",
    name: "Habitación Chuburná",
    price: 2800,
    rating: 4.2,
    available: true,
    services: SERVICES,
    lat: 20.9954,
    lng: -89.6356,
    image: IMAGE_URL,
    address: "Calle 30 #789, Chuburná, Mérida",
    owner: "Carlos López",
    type: "Habitación compartida",
    beds: 2,
    gender: "Mixto",
  },
  {
    id: 4,
    title: "Habitación Montejo",
    name: "Habitación Montejo",
    price: 3000,
    rating: 4.4,
    available: true,
    services: SERVICES,
    lat: 21.0152,
    lng: -89.6487,
    image: IMAGE_URL,
    address: "Paseo Montejo #101, Centro, Mérida",
    owner: "Ana Rodríguez",
    type: "Cuarto privado",
    beds: 1,
    gender: "Masculino",
  },
  {
    id: 5,
    title: "Habitación Altabrisa",
    name: "Habitación Altabrisa",
    price: 4200,
    rating: 4.8,
    available: true,
    services: SERVICES,
    lat: 21.0281,
    lng: -89.5904,
    image: IMAGE_URL,
    address: "Altabrisa #202, Mérida",
    owner: "Luis Hernández",
    type: "Cuarto privado",
    beds: 1,
    gender: "Mixto",
  },
  {
    id: 6,
    title: "Habitación Jardines",
    name: "Habitación Jardines",
    price: 3500,
    rating: 4.1,
    available: true,
    services: SERVICES,
    lat: 21.0403,
    lng: -89.6109,
    image: IMAGE_URL,
    address: "Jardines del Norte #303, Mérida",
    owner: "Sofía Martínez",
    type: "Habitación compartida",
    beds: 2,
    gender: "Mixto",
  },
  {
    id: 7,
    title: "Habitación México Norte",
    name: "Habitación México Norte",
    price: 2700,
    rating: 4.0,
    available: true,
    services: SERVICES,
    lat: 20.9959,
    lng: -89.6048,
    image: IMAGE_URL,
    address: "México Norte #404, Mérida",
    owner: "Pedro Gómez",
    type: "Cuarto privado",
    beds: 1,
    gender: "Femenino",
  },
  {
    id: 8,
    title: "Habitación Ginerés",
    name: "Habitación Ginerés",
    price: 3300,
    rating: 4.3,
    available: true,
    services: SERVICES,
    lat: 20.9584,
    lng: -89.6082,
    image: IMAGE_URL,
    address: "Ginerés #505, Mérida",
    owner: "Laura Díaz",
    type: "Cuarto privado",
    beds: 1,
    gender: "Masculino",
  },
  ...Array.from({ length: 16 }).map((_, i) => ({
    id: i + 9,
    title: `Habitación Zona ${i + 9}`,
    name: `Habitación ${i + 9}`,
    price: 2600 + (i % 5) * 300,
    rating: 4 + (i % 3) * 0.2,
    available: true,
    services: SERVICES,
    lat: 20.96 + i * 0.003,
    lng: -89.62 + i * 0.002,
    image: IMAGE_URL,
    address: `Calle ${i + 10} #${100 + i}, Mérida, Yucatán`,
    owner: "Propietario verificado",
    type: i % 2 === 0 ? "Cuarto privado" : "Habitación compartida",
    beds: i % 2 === 0 ? 1 : 2,
    gender: i % 3 === 0 ? "Femenino" : "Mixto",
  })),
];

const university = {
  name: "Universidad Marista",
  lat: 21.0257,
  lng: -89.6273,
};

const RouteInfo = ({ duration, onClear }) => (
  <div className="absolute top-24 right-5 z-20 bg-white rounded-2xl shadow-xl px-4 py-3 w-52">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Clock size={18} className="text-lime-600" />
        <div>
          <p className="text-xs text-gray-500">Tiempo estimado</p>
          <p className="font-semibold text-gray-800">{duration}</p>
        </div>
      </div>
      <button onClick={onClear} className="text-gray-400 hover:text-gray-600">
        <X size={14} />
      </button>
    </div>
  </div>
);

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

export default function SearchStudent_Screen() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [userRating, setUserRating] = useState({});
  const [showRoute, setShowRoute] = useState(false);
  const [routeDuration, setRouteDuration] = useState("");
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [reservationStep, setReservationStep] = useState(1);
  const [rentType, setRentType] = useState("completo");
  const [selectedRooms, setSelectedRooms] = useState(1);
  const [selectedBed, setSelectedBed] = useState("");
  const [rentPeriod, setRentPeriod] = useState(12);
  const [hasDocuments, setHasDocuments] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const { fetchData } = useApi("/documentacion/status/approved", {}, false);
  const [prices, setPrices] = useState({
    subtotal: 0,
    iva: 0,
    total: 0,
  });
  const [loading, setLoading] = useState({
    rooms: false,
    reservation: false,
  });

  const fetchDocumentStatus = async () => {
    try {
      const response = await fetchData();
      const approved = response?.approved === true;
      setHasDocuments(approved);
      return approved;
    } catch (error) {
      setHasDocuments(false);
      return false;
    }
  };

  const [error, setError] = useState(null);

  const location = useLocation();
  const { id } = useParams();
  const roomId = id || location.state?.roomId;

  const [directions, setDirections] = useState(null);
  const [roomCoords, setRoomCoords] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleServicesChange = (newServices) => {
    setSelectedServices(newServices);
    if (selectedRoom) {
      calculatePrices(selectedRoom.price, rentPeriod, newServices);
    }
  };

  const checkDocuments = () => {
    const ine = JSON.parse(localStorage.getItem("ineFiles") || "[]");
    const address = JSON.parse(localStorage.getItem("addressFile") || "[]");

    const valid =
      Array.isArray(ine) &&
      ine.length === 2 &&
      Array.isArray(address) &&
      address.length === 1;

    setHasDocuments(valid);
    localStorage.setItem("hasDocuments", valid.toString());
    return valid;
  };

  useEffect(() => {
    checkDocuments();

    const handleStorageChange = () => {
      checkDocuments();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const calculatePrices = (roomPrice, period, services) => {
    const periodPrices = {
      12: 100,
      6: 200,
      3: 300,
    };

    const servicesCost = services.reduce((total, serviceName) => {
      const service = SERVICES.find((s) => s.name === serviceName);
      return total + (service?.price || 0);
    }, 0);

    const periodPrice = periodPrices[period] || 0;
    const subtotal = periodPrice + servicesCost;
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    setPrices({
      subtotal: Math.round(subtotal * 100) / 100,
      iva: Math.round(iva * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
  };

  const saveReservation = () => {
    if (!selectedRoom) return;

    const periodPrices = { 12: 100, 6: 200, 3: 300 };
    const periodPrice = periodPrices[rentPeriod] || 0;
    const servicesCost = selectedServices.reduce((total, serviceName) => {
      const service = SERVICES.find((s) => s.name === serviceName);
      return total + (service?.price || 0);
    }, 0);

    const subtotal = periodPrice + servicesCost;
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    const newReservation = {
      id: `RES-${Date.now()}`,
      time: new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      room: `${selectedRoom.name} (${rentType === "completo" ? "Completo" : `${selectedRooms} espacio(s)`})`,
      days: rentPeriod * 30,
      price: periodPrice,
      tax: Math.round(iva * 100) / 100,
      serviceFee: servicesCost,
      total: Math.round(total * 100) / 100,
      paymentMethod: "Stripe",
      status: "En proceso",
      statusColor: "warning",
      tabKey: "enProceso",
    };

    const existingReservations = JSON.parse(
      localStorage.getItem("student_reservations") || "[]",
    );
    const updatedReservations = [...existingReservations, newReservation];
    localStorage.setItem(
      "student_reservations",
      JSON.stringify(updatedReservations),
    );
  };

  const handleRequestRoom = async (room) => {
    checkDocuments();
    setSelectedRoom(room);
    if (room) {
      calculatePrices(room.price, rentPeriod, selectedServices);
    }
    await fetchDocumentStatus();
    setReservationStep(1);
    setReservationModalOpen(true);
  };

  const handleShowRoute = (room) => {
    setRoomCoords({ lat: room.lat, lng: room.lng });
    setDirections(null);
    setShowRoute(true);
    setOpenDetails(false);
  };

  useEffect(() => {
    if (!id) return;

    setDirections(null);
    setRoomCoords(null);

    const fetchRoom = async () => {
      const response = await fetch(`http://localhost:3000/rooms/${id}`);
      const data = await response.json();

      setRoomCoords({
        lat: data.latitude,
        lng: data.longitude,
      });
    };

    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (!isLoaded || !roomCoords || !showRoute) return;

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: university,
        destination: roomCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          setRouteDuration(result.routes[0].legs[0].duration.text);
        }
      },
    );
  }, [isLoaded, roomCoords, showRoute]);

  const roomIdFromDashboard = location.state?.roomId;

  useEffect(() => {
    if (roomId) {
      const room = rooms.find((r) => r.id === Number(roomId));
      if (room) {
        setSelectedRoom(room);
        setOpenDetails(true);
      }
    }
  }, [roomId, rooms]);

  const handleRate = (roomId, value) => {
    setUserRating((prev) => ({ ...prev, [roomId]: value }));
  };

  useEffect(() => {
    setDirections(null);
    setRoomCoords(null);
  }, [location.key]);

  return (
    <ConfigProvider locale={esES}>
      <div className="relative h-[calc(100vh-64px)]">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: 20.99, lng: -89.6 }}
            zoom={13}
          >
            <Marker
              position={university}
              icon={{
                url: "/edificio-escolar.png",
                scaledSize: new window.google.maps.Size(36, 36),
              }}
            />

            {rooms.map((room) => (
              <Marker
                key={room.id}
                position={{ lat: room.lat, lng: room.lng }}
                icon={{
                  url: "/casa.png",
                  scaledSize: new window.google.maps.Size(32, 32),
                }}
                onClick={() => {
                  setSelectedRoom(room);
                  setOpenDetails(true);
                  setRoomCoords({ lat: room.lat, lng: room.lng });
                }}
              />
            ))}

            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: "#84cc16",
                    strokeWeight: 5,
                    strokeOpacity: 0.8,
                  },
                  suppressMarkers: true,
                }}
              />
            )}
          </GoogleMap>
        )}

        {showRoute && routeDuration && (
          <RouteInfo
            duration={routeDuration}
            onClear={() => {
              setDirections(null);
              setShowRoute(false);
              setRouteDuration("");
            }}
          />
        )}

        <RouteModal
          open={openDetails}
          selectedRoom={selectedRoom}
          userRating={userRating}
          onRate={handleRate}
          onClose={() => setOpenDetails(false)}
          onShowRoute={handleShowRoute}
          onRequestRoom={(room) => {
            handleRequestRoom(room);
            setOpenDetails(false);
          }}
        />
        <ReservationModal
          open={reservationModalOpen}
          onClose={() => {
            setReservationModalOpen(false);
            setReservationStep(1);
            setSelectedServices([]);
            setError(null);
          }}
          step={reservationStep}
          onStepChange={setReservationStep}
          room={selectedRoom}
          hasDocuments={hasDocuments}
          rentType={rentType}
          onRentTypeChange={setRentType}
          selectedRooms={selectedRooms}
          onSelectedRoomsChange={setSelectedRooms}
          selectedBed={selectedBed}
          onSelectedBedChange={setSelectedBed}
          rentPeriod={rentPeriod}
          onRentPeriodChange={(period) => {
            setRentPeriod(period);
            if (selectedRoom) {
              calculatePrices(selectedRoom.price, period, selectedServices);
            }
          }}
          selectedServices={selectedServices}
          onSelectedServicesChange={handleServicesChange}
          services={SERVICES}
          prices={prices}
          onSaveReservation={saveReservation}
          loading={loading.reservation}
          error={error}
        />
      </div>
    </ConfigProvider>
  );
}
