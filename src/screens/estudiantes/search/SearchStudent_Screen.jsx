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

const ReservationModal = ({
  open,
  onClose,
  step,
  onStepChange,
  room,
  hasDocuments,
  rentType,
  onRentTypeChange,
  selectedRooms,
  onSelectedRoomsChange,
  selectedBed,
  onSelectedBedChange,
  rentPeriod,
  onRentPeriodChange,
  selectedServices,
  onSelectedServicesChange,
  prices,
  onSaveReservation,
}) => {
  const [showExtraServices, setShowExtraServices] = useState(false);

  const handleServiceToggle = (serviceName) => {
    const newServices = selectedServices.includes(serviceName)
      ? selectedServices.filter((s) => s !== serviceName)
      : [...selectedServices, serviceName];
    onSelectedServicesChange(newServices);
  };

  const includedServices = SERVICES.filter((service) => service.price === 0);
  const extraServices = SERVICES.filter((service) => service.price > 0);

  const items = [
    {
      title: "Documentos",
      description: step > 1 ? "Completado" : "",
    },
    {
      title: "Reservación",
      description: step > 2 ? "Completado" : "",
    },
    {
      title: "Confirmación",
      description: step > 3 ? "Completado" : "",
    },
  ];

  const stepContents = [
    <div key="1" className="text-center py-0">
      {hasDocuments ? (
        <>
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Documentos completos
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Puedes continuar con tu reservación.
          </p>
          <Button
            type="default"
            className="!bg-lime-600 hover:!bg-lime-600 !border-lime-600 !text-white"
            onClick={() => onStepChange(2)}
          >
            Continuar
          </Button>
        </>
      ) : (
        <>
          <X size={48} className="text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Documentos pendientes
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Debes subir tus documentos primero.
          </p>
          <Button
            type="default"
            className="!bg-lime-600 hover:!bg-lime-600 !border-lime-600 !text-white"
            onClick={() => {
              onClose();
              window.location.href = "/estudiante/documentation";
            }}
          >
            Subir documentos
          </Button>
        </>
      )}
    </div>,
    <div key="2" className="py-0">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Procesar reservación
        </h1>

        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3">
          <div className="w-20 h-20 flex-shrink-0">
            <img
              src={room?.image || IMAGE_URL}
              alt={room?.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div>
                <Tag color="blue" className="text-xs mb-1">
                  {room?.id
                    ? `AL-${room.id.toString().padStart(3, "0")}`
                    : "AL-001"}
                </Tag>
                <h3 className="font-semibold text-gray-800 truncate">
                  {room?.name || "Casa color roja"}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-lime-600">
                  ${room?.price || 0}
                  <span className="text-xs text-gray-500 ml-1">/noche</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 space-y-0.5">
              <div className="flex items-center gap-1">
                <Home size={12} />
                <span>
                  Tipo: {rentType === "completo" ? "Completo" : "Por espacio"}
                </span>
              </div>
              {rentType === "espacio" && (
                <>
                  <div className="flex items-center gap-1">
                    <Bed size={12} />
                    <span>Habitación: {selectedRooms}</span>
                  </div>
                  {selectedBed && (
                    <div className="flex items-center gap-1">
                      <Bed size={12} />
                      <span>Cama: {selectedBed}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex items-center gap-1">
                <CalendarDays size={12} />
                <span>Folio: F2G4DSF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2 text-sm">
            TIPO DE ALOJAMIENTO
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                key: "completo",
                label: "Completo",
                desc: "Toda la propiedad",
                icon: <Home size={16} className="text-lime-600" />,
              },
              {
                key: "espacio",
                label: "Por espacio",
                desc: "Habitación específica",
                icon: <Bed size={16} className="text-lime-600" />,
              },
            ].map((type) => (
              <div
                key={type.key}
                className={`p-3 border rounded-lg cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                  rentType === type.key
                    ? "border-lime-600 bg-lime-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onRentTypeChange(type.key)}
              >
                <div className="mb-2">{type.icon}</div>
                <div className="font-bold text-gray-800 text-sm">
                  {type.label}
                </div>
                <div className="text-xs text-gray-600 mt-1">{type.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {rentType === "espacio" && (
          <>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">
                Habitación
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                      selectedRooms === num
                        ? "border-lime-600 bg-lime-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => onSelectedRoomsChange(num)}
                  >
                    <div className="text-sm font-bold text-gray-800">{num}</div>
                    <div className="text-xs text-gray-600">
                      {num === 1 ? "Habitación" : "Habitaciones"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">
                Camas disponibles
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {["Cama 1", "Cama 2"].map((cama) => (
                  <div
                    key={cama}
                    className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                      selectedBed === cama
                        ? "border-lime-600 bg-lime-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => onSelectedBedChange(cama)}
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {cama}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <h4 className="font-medium text-gray-700 mb-2 text-sm">
            PLAZO DE RENTA
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { months: 12, price: 100, label: "12 Meses" },
              { months: 6, price: 200, label: "6 Meses" },
              { months: 3, price: 300, label: "3 Meses" },
            ].map((option) => (
              <div
                key={option.months}
                className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                  rentPeriod === option.months
                    ? "border-lime-600 bg-lime-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onRentPeriodChange(option.months)}
              >
                <div className="text-sm font-bold text-gray-800">
                  {option.months}
                </div>
                <div className="text-gray-500 text-xs mb-1">{option.label}</div>
                <div className="text-sm font-bold text-lime-600">
                  ${option.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2 text-sm">
            SERVICIOS ADICIONALES
          </h4>
          <div className="border border-gray-200 rounded-lg bg-white p-4 mb-3">
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-700 mb-2">
                INCLUIDOS EN EL PRECIO
              </div>
              <div className="flex gap-2">
                {includedServices.map((service, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md"
                  >
                    <div className="text-lime-600 mb-1">{service.icon}</div>
                    <span className="text-xs font-medium">{service.name}</span>
                  </div>
                ))}
                <button
                  className="w-12 flex items-center justify-center p-3 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
                  onClick={() => setShowExtraServices(!showExtraServices)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {showExtraServices && (
              <div>
                <Divider className="my-3" />
                <div className="text-xs font-medium text-gray-700 mb-2">
                  SERVICIOS PREMIUM
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {extraServices.map((service, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg cursor-pointer transition-all flex flex-col items-center text-center ${
                        selectedServices.includes(service.name)
                          ? "border-lime-600 bg-lime-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleServiceToggle(service.name)}
                    >
                      <div className="text-lime-600 mb-2">{service.icon}</div>
                      <div className="text-xs font-medium text-gray-800 mb-1">
                        {service.name}
                      </div>
                      <div className="text-xs font-bold text-lime-600">
                        +${service.price}/mes
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Subtotal</span>
              <span className="font-bold text-gray-800 text-sm">
                ${prices.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">IVA (16%)</span>
              <span className="font-bold text-gray-800 text-sm">
                ${prices.iva.toFixed(2)}
              </span>
            </div>
            <Divider className="my-1" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-lg font-bold text-lime-600">
                ${prices.total.toFixed(2)} MXN
              </span>
            </div>
          </div>
        </div>

        <Button
          type="default"
          className="w-full !bg-lime-600 hover:!bg-lime-600 !border-lime-600 !text-white h-12 text-lg font-bold rounded-lg"
          onClick={() => onStepChange(3)}
        >
          RESERVAR AHORA
        </Button>
      </div>
    </div>,
    <div key="3" className="text-center py-6">
      <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        ¡Reservación en proceso!
      </h3>
      <Button
        type="default"
        className="!bg-lime-600 hover:!bg-lime-600 !border-lime-600 !text-white"
        onClick={() => {
          onSaveReservation();
          window.location.href = "/estudiante/reservas";
        }}
      >
        Ir a Mis Reservaciones
      </Button>
    </div>,
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      closable={false}
      className="[&_.ant-modal-content]:rounded-xl [&_.ant-modal-body]:p-0"
    >
      <div className="absolute top-3 right-3 z-10">
        <Button
          type="text"
          icon={<X size={16} />}
          onClick={onClose}
          className="text-gray-500 hover:text-lime-600 w-6 h-6 flex items-center justify-center"
          aria-label="Cerrar"
        />
      </div>

      <div className="pt-6">
        <Steps
          current={step - 1}
          items={items}
          className="mb-6 px-6"
          responsive={false}
          size="small"
          titlePlacement="vertical"
        />
        <Divider className="my-0" />
        <div className="px-3 py-0 max-h-[65vh] overflow-y-auto">
          {stepContents[step - 1]}
        </div>
      </div>
    </Modal>
  );
};

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
  const [prices, setPrices] = useState({
    subtotal: 0,
    iva: 0,
    total: 0,
  });

  const location = useLocation();
  const { id } = useParams();
  const roomId = id || location.state?.roomId;

  const [directions, setDirections] = useState(null);
  const [roomCoords, setRoomCoords] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

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

  const handleRequestRoom = (room) => {
    checkDocuments();
    setSelectedRoom(room);
    if (room) {
      calculatePrices(room.price, rentPeriod, selectedServices);
    }
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

        <Modal
          open={openDetails}
          footer={null}
          onCancel={() => setOpenDetails(false)}
          centered
          width={520}
          closable={false}
          mask={false}
          styles={{ body: { padding: 0 } }}
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
                      type="default"
                      icon={<Map size={14} />}
                      onClick={() => handleShowRoute(selectedRoom)}
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
                            <span className="text-lime-500">
                              {service.icon}
                            </span>
                            {service.name}
                          </span>
                          <span className="text-lime-600 font-medium">
                            Incluido
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
                  className={`h-11 rounded-xl !text-white ${
                    selectedRoom.available
                      ? "!bg-lime-500 hover:!bg-lime-600 !border-lime-500"
                      : "!bg-gray-400 !border-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (selectedRoom.available) {
                      handleRequestRoom(selectedRoom);
                      setOpenDetails(false);
                    }
                  }}
                >
                  {selectedRoom.available
                    ? "Solicitar habitación"
                    : "Habitación ocupada"}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <ReservationModal
          open={reservationModalOpen}
          onClose={() => {
            setReservationModalOpen(false);
            setReservationStep(1);
            setSelectedServices([]);
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
          onSelectedServicesChange={(services) => {
            setSelectedServices(services);
            if (selectedRoom) {
              calculatePrices(selectedRoom.price, rentPeriod, services);
            }
          }}
          prices={prices}
          onSaveReservation={saveReservation}
        />
      </div>
    </ConfigProvider>
  );
}
