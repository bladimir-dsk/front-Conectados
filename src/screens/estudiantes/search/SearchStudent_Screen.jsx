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
  Wifi, Droplets, Zap, Sparkles, Utensils, Shirt, Wind,
  Tv, Car, Dumbbell, Waves, Coffee, Sandwich, Moon, X, Clock,
  MapPin, Navigation, School,
} from "lucide-react";

import RouteModal from "../../../components/modals/RouteModal";
import ReservationModal from "../../../components/modals/ReservationModal";
import { useApi } from "../../../hooks/useApi";
import api from "../../../api/axiosConfig";

const containerStyle = { width: "100%", height: "100%" };
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

const RouteInfo = ({ duration, distance, originName, originType, destinationName, onClear }) => (
  <div className="fixed top-24 right-10 z-[9999] bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-64 overflow-hidden">

    {/* Header con X dentro */}
    <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100 dark:border-neutral-700">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        Ruta activa
      </span>
      <button
        onClick={onClear}
        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={13} />
      </button>
    </div>

    {/* Contenido */}
    <div className="px-4 py-3 space-y-3">
      <div className="flex items-center gap-3">
        <Clock size={17} className="text-lime-600 shrink-0" />
        <div>
          <p className="text-xs text-gray-400 leading-none">Tiempo estimado</p>
          <p className="font-bold text-gray-800 dark:text-white text-sm">{duration || "Calculando..."}</p>
        </div>
      </div>

      {distance && (
        <div className="flex items-center gap-3">
          <Navigation size={15} className="text-lime-600 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 leading-none">Distancia</p>
            <p className="font-semibold text-gray-700 dark:text-white text-sm">{distance}</p>
          </div>
        </div>
      )}

      {originName && (
        <div className="flex items-start gap-3">
          {originType === "school"
            ? <School size={15} className="text-lime-600 shrink-0 mt-0.5" />
            : <MapPin size={15} className="text-lime-600 shrink-0 mt-0.5" />
          }
          <div className="min-w-0">
            <p className="text-xs text-gray-400 leading-none">
              {originType === "school" ? "Escuela" : "Tu ubicación"}
            </p>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{originName}</p>
          </div>
        </div>
      )}

      {destinationName && (
        <div className="flex items-start gap-3">
          <MapPin size={15} className="text-red-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 leading-none">Destino</p>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{destinationName}</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

const Info = ({ icon, label, value }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3">
    <div className="text-lime-500">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800 break-words leading-snug">{value}</p>
    </div>
  </div>
);

export default function SearchStudent_Screen() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [userRating, setUserRating] = useState({});
  const [showRoute, setShowRoute] = useState(false);
  const [routeDuration, setRouteDuration] = useState("");
  const [routeDistance, setRouteDistance] = useState("");
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [reservationStep, setReservationStep] = useState(1);
  const [rentType, setRentType] = useState("completo");
  const [selectedRooms, setSelectedRooms] = useState(1);
  const [selectedBed, setSelectedBed] = useState("");
  const [hasRated, setHasRated] = useState({});
  const [rentPeriod, setRentPeriod] = useState(12);
  const [hasDocuments, setHasDocuments] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [prices, setPrices] = useState({ subtotal: 0, iva: 0, total: 0 });
  const [loading, setLoading] = useState({ rooms: false, reservation: false });
  const [error, setError] = useState(null);

  const [studentProfile, setStudentProfile] = useState(null);
  const [schoolInfoOpen, setSchoolInfoOpen] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState(null);   // { lat, lng }
  const [routeOriginName, setRouteOriginName] = useState("");
  const [routeOriginType, setRouteOriginType] = useState("school"); // "school" | "gps"
  const [schoolMarker, setSchoolMarker] = useState(null);   // { lat, lng, name }

  const parseCoordinate = (coord) => {
    if (!coord) return null;
    const clean = coord.replace(/[^\d.-]/g, "");
    return parseFloat(clean);
  };

  const { fetchData } = useApi("/documentacion/status/approved", {}, false);

  const location = useLocation();
  const { roomId } = useParams();

  const [directions, setDirections] = useState(null);
  const [roomCoords, setRoomCoords] = useState(null);
  const [roomDestName, setRoomDestName] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        const profile = res.data;
        setStudentProfile(profile);

        if (profile?.School?.latitud && profile?.School?.longitud) {
          setSchoolMarker({
            lat: Number(profile.School.latitud),
            lng: Number(profile.School.longitud),
            name: profile.School.name,
          });
        }
      } catch (err) {
        console.error("Error cargando perfil", err);
      }
    };
    loadProfile();
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const fetchDocumentStatus = async () => {
    try {
      const response = await fetchData();
      const approved = response?.approved === true;
      setHasDocuments(approved);
      return approved;
    } catch {
      setHasDocuments(false);
      return false;
    }
  };

  const loadUserRating = async (roomId) => {
    try {
      const res = await api.get(`/calificacion/mi-calificacion/${roomId}`);
      return res.data?.puntuacion ?? null;
    } catch (error) {
      if (error.response?.status === 404) return null;
      console.error("Error cargando mi calificación", error);
      return null;
    }
  };

  const handleServicesChange = (newServices) => {
    setSelectedServices(newServices);
    if (selectedRoom) calculatePrices(selectedRoom.price, rentPeriod, newServices);
  };

  const checkDocuments = () => {
    const ine = JSON.parse(localStorage.getItem("ineFiles") || "[]");
    const address = JSON.parse(localStorage.getItem("addressFile") || "[]");
    const valid = Array.isArray(ine) && ine.length === 2 && Array.isArray(address) && address.length === 1;
    setHasDocuments(valid);
    localStorage.setItem("hasDocuments", valid.toString());
    return valid;
  };

  useEffect(() => {
    checkDocuments();
    const handleStorageChange = () => checkDocuments();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const calculatePrices = (roomPrice, period, services) => {
    const periodPrices = { 12: 100, 6: 200, 3: 300 };
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
      time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "2-digit" }),
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

    const existing = JSON.parse(localStorage.getItem("student_reservations") || "[]");
    localStorage.setItem("student_reservations", JSON.stringify([...existing, newReservation]));
  };

  const handleRequestRoom = async (room) => {
    checkDocuments();
    setSelectedRoom(room);
    if (room) calculatePrices(room.price, rentPeriod, selectedServices);
    await fetchDocumentStatus();
    setReservationStep(1);
    setReservationModalOpen(true);
  };

  // ── Ver ruta: escuela o GPS ─────────────────────────────────────────────────
  const handleShowRoute = (room) => {
    if (!room?.lat || !room?.lng) {
      console.error("Habitación sin coordenadas", room);
      return;
    }

    const destLat = Number(room.lat);
    const destLng = Number(room.lng);
    if (isNaN(destLat) || isNaN(destLng)) {
      console.error("Coordenadas inválidas", room.lat, room.lng);
      return;
    }

    setRoomCoords({ lat: destLat, lng: destLng });
    setRoomDestName(room.address ?? room.name ?? "Alojamiento");
    setDirections(null);
    setRouteDuration("");
    setRouteDistance("");

    // Si el estudiante tiene escuela → usarla
    if (studentProfile?.School?.latitud && studentProfile?.School?.longitud) {
      setRouteOrigin({
        lat: Number(studentProfile.School.latitud),
        lng: Number(studentProfile.School.longitud),
      });
      setRouteOriginName(studentProfile.School.name);
      setRouteOriginType("school");
      setShowRoute(true);
      setOpenDetails(false);
      return;
    }

    // Sin escuela → pedir ubicación GPS
    if (!navigator.geolocation) {
      console.error("Geolocalización no soportada");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setRouteOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setRouteOriginName("Tu ubicación actual");
        setRouteOriginType("gps");
        setShowRoute(true);
        setOpenDetails(false);
      },
      (err) => console.error("Error obteniendo ubicación", err),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  // ── Detalles de alojamiento ─────────────────────────────────────────────────
  const fetchRoomDetails = async (roomId) => {
    try {
      setLoadingDetails(true);
      const res = await api.get(`/alojamientos/${roomId}/details`);
      const data = res.data?.data ?? res.data;
      const rating = await loadUserRating(roomId);

      setUserRating((prev) => ({ ...prev, [roomId]: rating ?? 0 }));
      setHasRated((prev) => ({ ...prev, [roomId]: rating !== null }));

      const mappedRoom = {
        id: data.id_alojamiento,
        name: data.name,
        price: Number(data.precio_completo),
        type: data.typeProperty,
        typeIncome: data.typeIncome ?? null,
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
        mainImage: data.fotos?.find((f) => f.esPrincipal)?.url || data.fotos?.[0]?.url || IMAGE_URL,
        services: (data.servicios || []).map((s) => ({
          id: s.id, 
          name: s.servicio.name,
          icon: s.servicio.icon,
          price: Number(s.costo),
          costo: Number(s.costo),
        })),
      };

      setSelectedRoom(mappedRoom);
      setOpenDetails(true);
    } catch (error) {
      console.error("❌ Error cargando detalles:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => { if (roomId) fetchRoomDetails(Number(roomId)); }, [roomId]);

  // ── Cargar marcadores del mapa ──────────────────────────────────────────────
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoadingRooms(true);
        const res = await api.get("/alojamientos?estatus=ACTIVO");
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

  // ── Calcular ruta cuando cambia el origen ──────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !showRoute || !routeOrigin || !roomCoords) return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: { lat: routeOrigin.lat, lng: routeOrigin.lng },
        destination: { lat: roomCoords.lat, lng: roomCoords.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          const leg = result.routes[0].legs[0];
          setDirections(result);
          setRouteDuration(leg.duration.text);
          setRouteDistance(leg.distance.text);
        } else {
          console.error("Error al calcular ruta:", status);
        }
      },
    );
  }, [isLoaded, showRoute, routeOrigin, roomCoords]);

  const handleRate = async (roomId, value) => {
    if (hasRated[roomId]) return;
    setUserRating((prev) => ({ ...prev, [roomId]: value }));
    try {
      await api.post("/calificacion", { id_alojamiento: roomId, puntuacion: value });
      setHasRated((prev) => ({ ...prev, [roomId]: true }));
    } catch (error) {
      console.error("Error guardando calificación", error);
    }
  };

  useEffect(() => {
    setDirections(null);
    setRoomCoords(null);
    setRouteOrigin(null);
  }, [location.key]);

  // ── Centro del mapa: escuela del estudiante o Mérida ───────────────────────
  const mapCenter = schoolMarker
    ? { lat: schoolMarker.lat, lng: schoolMarker.lng }
    : { lat: 20.99, lng: -89.6 };

  return (
    <ConfigProvider locale={esES}>
      <div className="relative h-[calc(100vh-64px)]">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={13}
          >
            {/* Marker de la escuela del estudiante */}
            {schoolMarker && (
              <Marker
                position={{ lat: schoolMarker.lat, lng: schoolMarker.lng }}
                icon={{
                  url: "/Maker-school.webp",
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                onClick={() => {
                  // Mostrar info de la escuela en un InfoWindow sencillo
                  // o simplemente centrar — en este caso abrimos un pequeño toast
                  // El RouteModal no aplica aquí; usamos la SchoolInfoWindow de abajo
                  setSchoolInfoOpen(true);
                }}
              />
            )}

            {/* Marcadores de alojamientos */}
            {rooms.map((room) => (
              <Marker
                key={room.id}
                position={{ lat: room.lat, lng: room.lng }}
                icon={{
                  url: "/Maker-house.webp",
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                onClick={async () => {
                  await fetchRoomDetails(room.id);
                  setSelectedRoom((prev) => ({ ...prev, lat: room.lat, lng: room.lng }));
                  setOpenDetails(true);
                }}
              />
            ))}

            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{ polylineOptions: { strokeColor: "#84cc16", strokeWeight: 5 } }}
              />
            )}
          </GoogleMap>
        )}

        {showRoute && (
          <RouteInfo
            duration={routeDuration}
            distance={routeDistance}
            originName={routeOriginName}
            originType={routeOriginType}
            destinationName={roomDestName}
            onClear={() => {
              setDirections(null);
              setShowRoute(false);
              setRouteDuration("");
              setRouteDistance("");
              setRouteOrigin(null);
            }}
          />
        )}

        {/* Info popup de la escuela al hacer clic en el marker */}
        <SchoolInfoCard
          school={studentProfile?.School}
          open={schoolInfoOpen}
          onClose={() => setSchoolInfoOpen(false)}
        />

        <RouteModal
          open={openDetails}
          selectedRoom={selectedRoom}
          loading={loadingDetails}
          userRating={userRating}
          hasRated={hasRated}
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
            if (selectedRoom) calculatePrices(selectedRoom.price, period, selectedServices);
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

// ── SchoolInfoCard: tarjeta flotante al hacer clic en el marker de la escuela ─
function SchoolInfoCard({ school, open, onClose }) {
  // Necesitamos schoolInfoOpen en el componente padre; lo pasamos via props.
  // Ver nota abajo — el estado se maneja en el padre con un useState.
  if (!open || !school) return null;

  const badges = [
    school.level,
    school.type,
    school.turn,
  ].filter(Boolean);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-24 left-5 z-50 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-72 p-4 border border-gray-100 dark:border-neutral-700">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center shrink-0">
              <School size={18} className="text-lime-600" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{school.name}</p>
              {school.cct && <p className="text-xs text-gray-400">CCT: {school.cct}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0">
            <X size={15} />
          </button>
        </div>

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {badges.map((b) => (
              <span
                key={b}
                className="text-xs bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400 border border-lime-200 dark:border-lime-800 rounded-full px-2 py-0.5 font-medium"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <MapPin size={12} className="text-lime-500 shrink-0" />
          <span>{Number(school.latitud).toFixed(4)}, {Number(school.longitud).toFixed(4)}</span>
        </div>
      </div>
    </>
  );
}