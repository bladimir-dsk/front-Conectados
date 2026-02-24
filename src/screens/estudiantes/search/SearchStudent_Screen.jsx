import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useLocation, useParams } from "react-router-dom";
import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";
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
  X,
  Clock,
} from "lucide-react";

import RouteModal from "../../../components/modals/RouteModal";
import ReservationModal from "../../../components/modals/ReservationModal";
import { useApi } from "../../../hooks/useApi";
import api from "../../../api/axiosConfig";

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

const university = {
  name: "Universidad Marista",
  lat: 21.0257,
  lng: -89.6273,
};

const RouteInfo = ({ duration, onClear }) => (
  <div className="absolute top-24 right-5 z-20 bg-white rounded-2xl shadow-xl px-4 py-3 w-52 dark:bg-neutral-800">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Clock size={18} className="text-lime-600" />
        <div>
          <p className="text-xs text-gray-500 dark:text-white">
            Tiempo estimado
          </p>
          <p className="font-semibold text-gray-800 dark:text-white">
            {duration}
          </p>
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
  const [rooms, setRooms] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
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

  const parseCoordinate = (coord) => {
    if (!coord) return null;

    const clean = coord.replace(/[^\d.-]/g, "");
    return parseFloat(clean);
  };
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
    if (!room?.lat || !room?.lng) {
      console.error("Habitación sin coordenadas", room);
      return;
    }

    const lat = Number(room.lat);
    const lng = Number(room.lng);

    if (isNaN(lat) || isNaN(lng)) {
      console.error("Coordenadas inválidas", room.lat, room.lng);
      return;
    }

    setRoomCoords({ lat, lng });
    setDirections(null);
    setRouteDuration("");
    setShowRoute(true);
    setOpenDetails(false);
  };

  const fetchRoomDetails = async (roomId) => {
    try {
      setLoadingDetails(true);

      const res = await api.get(`/alojamientos/${roomId}/details`);
      const data = res.data?.data ?? res.data;

      const mappedRoom = {
        id: data.id_alojamiento,
        name: data.name,
        price: Number(data.precio_completo),
        type: data.typeProperty,
        gender: data.gender ?? "mixto",

        address: `${data.address}, ${data.city}, ${data.country}`,

        available: data.estatus === "ACTIVO",

        cuartos: data.cuartos || [],

        owner: {
          namePersonal: data.propietario?.namePersonal,
          lastName: data.propietario?.lastName,
          email: data.propietario?.emailPersonal,
          phone: `${data.propietario?.code ?? ""}${data.propietario?.phone ?? ""}`,
        },

        images: (data.fotos || []).map((f) => ({
          id_foto: f.id_foto,
          url: f.url,
          orden: f.orden ?? 0,
          esPrincipal: f.esPrincipal,
        })),

        mainImage:
          data.fotos?.find((f) => f.esPrincipal)?.url ||
          data.fotos?.[0]?.url ||
          IMAGE_URL,

        services: (data.servicios || []).map((s) => ({
          id: s.servicio.id_servicio,
          name: s.servicio.name,
          icon: s.servicio.icon,
          price: Number(s.costo),
        })),
      };

      setSelectedRoom(mappedRoom);
      setOpenDetails(true);
    } catch (error) {
      console.error("❌ Error cargando detalles:", error);
      setSelectedRoom(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRoomDetails(Number(id));
    }
  }, [id]);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoadingRooms(true);

        const res = await api.get("/alojamientos");
        const items = res.data?.data ?? res.data ?? [];

        const parsed = items
          .map((item) => {
            if (!item.latitude || !item.longitude) return null;

            return {
              id: item.id_alojamiento,
              name: item.name,
              price: item.precio_completo,
              lat: parseFloat(item.latitude.replace(/[^\d.-]/g, "")),
              lng: parseFloat(item.longitude.replace(/[^\d.-]/g, "")),
            };
          })
          .filter(Boolean);

        setRooms(parsed);
      } catch (error) {
        console.error("Error cargando alojamientos", error);
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, []);

  useEffect(() => {
    if (!isLoaded || !showRoute || !roomCoords) return;

    console.log("Calculando ruta:", {
      origin: university,
      destination: roomCoords,
    });

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: {
          lat: university.lat,
          lng: university.lng,
        },
        destination: {
          lat: roomCoords.lat,
          lng: roomCoords.lng,
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        console.log("Directions status:", status);

        if (status === "OK" && result) {
          setDirections(result);
          setRouteDuration(result.routes[0].legs[0].duration.text);
        } else {
          console.error("Error al calcular ruta:", status);
        }
      },
    );
  }, [isLoaded, showRoute, roomCoords]);

  const roomIdFromDashboard = location.state?.roomId;

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
                onClick={async () => {
                  await fetchRoomDetails(room.id);
                  setSelectedRoom((prev) => ({
                    ...prev,
                    lat: room.lat,
                    lng: room.lng,
                  }));
                  setOpenDetails(true);
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
                  },
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
          loading={loadingDetails}
          userRating={userRating}
          onRate={handleRate}
          onClose={() => setOpenDetails(false)}
          onShowRoute={handleShowRoute}
          onRequestRoom={handleRequestRoom}
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
