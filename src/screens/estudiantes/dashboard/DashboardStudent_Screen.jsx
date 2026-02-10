import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/useApi";
import {
  Row,
  Col,
  Tag,
  Button,
  InputNumber,
  DatePicker,
  ConfigProvider,
  Divider,
  Popover,
  Modal,
  Space,
  Pagination,
  Steps,
} from "antd";
import esES from "antd/locale/es_ES";
import {
  Users,
  Wifi,
  MapPin,
  DollarSign,
  Heart,
  Search,
  CalendarDays,
  Home,
  User,
  CheckCircle,
  Star,
  Bed,
  X,
  Star as StarIcon,
  MapPin as MapPinIcon,
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
  Bell,
  Bath,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const { RangePicker } = DatePicker;
const { Step } = Steps;

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

const RoomCard = ({
  room,
  isFav,
  onToggleFavorite,
  onViewDetails,
  onViewMap,
}) => {
  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg group">
      <img
        src={IMAGE_URL}
        alt={room.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
        <Tag className="font-medium bg-white/20 backdrop-blur-sm border-0 text-white text-xs">
          Disponible
        </Tag>
        <button
          className={`bg-white/20 backdrop-blur-sm rounded-full p-1.5 cursor-pointer transition-colors ${
            isFav ? "text-red-400" : "text-white"
          }`}
          onClick={() => onToggleFavorite(room.id)}
          aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart size={16} fill={isFav ? "#ff4d4f" : "none"} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white mb-1">{room.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <MapPin size={12} className="text-gray-300" />
          <span className="text-gray-300 text-xs">Mérida, Yucatán</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400" fill="#fbbf24" />
            <span className="text-white font-medium text-sm">
              {room.rating.toFixed(1)}
            </span>
            <span className="text-gray-300 text-xs">({room.reviews})</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-white">${room.price}</span>
            <span className="text-gray-300 text-xs ml-1">/noche</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1 !bg-transparent !border-white font-medium hover:!bg-transparent !text-white h-10 text-sm"
            onClick={() => onViewDetails(room)}
          >
            Ver detalles
          </Button>
          <Button
            icon={<MapPinIcon size={14} />}
            className="flex-1 !bg-transparent !border-white font-medium hover:!bg-transparent  !text-white h-10 text-sm"
            onClick={() => onViewMap(room.id)}
          >
            Mapa
          </Button>
        </div>
      </div>
    </div>
  );
};

const RoomDetailsModal = ({
  open,
  onClose,
  room,
  userRating,
  onRate,
  onRequestRoom,
}) => {
  if (!room) return null;

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
        />
      </div>
      <div className="overflow-hidden">
        <div className="relative h-56">
          <div className="absolute inset-0">
            <img
              src={IMAGE_URL}
              alt={room.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {room.name}
                </h3>
                <div className="flex items-center gap-2">
                  <MapPinIcon size={14} className="text-lime-200" />
                  <span className="text-lime-100 text-xs">Mérida, Yucatán</span>
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
                  {room.owner}
                </span>
              </div>
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
                      aria-label={`Calificar con ${star} estrella${
                        star !== 1 ? "s" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Home size={18} className="text-lime-600" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 uppercase tracking-wide truncate">
                    Tipo
                  </div>
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {room.type}
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
                    {room.beds} {room.beds === 1 ? "cama" : "camas"}
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
                    {room.gender}
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
                    {room.address}
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-0 border-gray-200" />

            <div className="w-full">
              <h4 className="text-base font-semibold text-gray-800 mb-3">
                Servicios incluidos
              </h4>
              <div className="max-h-60 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 gap-2">
                  {SERVICES.filter((service) => service.price === 0).map(
                    (service, index) => (
                      <div
                        key={index}
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
                          Incluido
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            <Button
              className="w-full !bg-lime-600 hover:!bg-lime-600 !border-lime-600 !text-white h-12 text-lg font-bold rounded-lg"
              onClick={() => {
                onRequestRoom(room.id);
                onClose();
              }}
              aria-label="Solicitar habitación"
            >
              Solicitar habitación
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

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
            Debe subir sus documentos o no han sido aprobados.
          </p>
          <Button
            type="default"
            className="!bg-lime-600 hover:!bg-lime-600 !border-lime-600 !text-white"
            onClick={() => {
              window.location.href = "/estudiante/documentation";
            }}
          >
            Ir a Mi Documentación
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
              src={IMAGE_URL}
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

            <div className="text-xs text-gray-600 space-y-0.0">
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

export default function DashboardStudent_Screen() {
  const [favorites, setFavorites] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [guests, setGuests] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: null,
    guests: 1,
  });
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRating, setUserRating] = useState({});
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [reservationStep, setReservationStep] = useState(1);
  const [rentType, setRentType] = useState("completo");
  const [selectedRooms, setSelectedRooms] = useState(1);
  const [selectedBed, setSelectedBed] = useState("");
  const [rentPeriod, setRentPeriod] = useState(12);
  const [selectedServices, setSelectedServices] = useState([]);
  const { fetchData } = useApi("/documentacion/status/approved", {}, false);
  const [prices, setPrices] = useState({
    subtotal: 0,
    iva: 0,
    total: 0,
  });
  const [hasDocuments, setHasDocuments] = useState(false);

  const navigate = useNavigate();

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

  const handleViewMap = (roomId) => {
    navigate(`/estudiante/search/${roomId}`, {
      state: { roomId },
    });
  };

  const pageSize = 6;

  const rooms = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      name: `Habitación ${i + 1}`,
      price: 80 + (i % 5) * 20,
      owner: "Juan Pérez",
      gender: "Mixto",
      type:
        i % 3 === 0
          ? "Cuarto privado"
          : i % 3 === 1
            ? "Habitación compartida"
            : "Estudio",
      beds: i % 2 === 0 ? 1 : 2,
      address: "Calle 10 #123, Centro, Mérida, Yucatán",
      rating: 4.0 + i * 0.05,
      reviews: 10 + i,
      maxGuests: Math.floor(Math.random() * 5) + 1,
      availableDates: generateRandomAvailableDates(),
    }));
  }, []);

  function generateRandomAvailableDates() {
    const availableDates = [];
    const startDate = dayjs();
    const endDate = dayjs().add(90, "day");

    let currentDate = startDate;
    while (currentDate.isBefore(endDate)) {
      if (Math.random() > 0.2) {
        availableDates.push(currentDate.format("YYYY-MM-DD"));
      }
      currentDate = currentDate.add(1, "day");
    }
    return availableDates;
  }

  const isRoomAvailableInDateRange = (room, startDate, endDate) => {
    if (!startDate || !endDate) return true;

    const start = dayjs(startDate);
    const end = dayjs(endDate);
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      const dateStr = current.format("YYYY-MM-DD");
      if (!room.availableDates.includes(dateStr)) {
        return false;
      }
      current = current.add(1, "day");
    }

    return true;
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const openRoomDetails = (room) => {
    setSelectedRoom(room);
    setOpenDetails(true);
  };

  const handleRate = (roomId, value) => {
    setUserRating((prev) => ({ ...prev, [roomId]: value }));
  };

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
  };

  const handleRequestRoom = async (roomId) => {
    const room = filteredRooms.find((r) => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
      calculatePrices(room.price, rentPeriod, selectedServices);
    }

    await fetchDocumentStatus();
    setReservationStep(1);
    setReservationModalOpen(true);
  };

  const applyFilters = () => {
    setAppliedFilters({
      dateRange,
      guests,
    });
    setCurrentPage(1);
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (room.maxGuests < appliedFilters.guests) {
        return false;
      }

      if (
        appliedFilters.dateRange &&
        appliedFilters.dateRange[0] &&
        appliedFilters.dateRange[1]
      ) {
        const [startDate, endDate] = appliedFilters.dateRange;
        if (!isRoomAvailableInDateRange(room, startDate, endDate)) {
          return false;
        }
      }

      return true;
    });
  }, [rooms, appliedFilters]);

  const currentRooms = useMemo(() => {
    return filteredRooms.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
  }, [filteredRooms, currentPage, pageSize]);

  useEffect(() => {}, [dateRange, guests]);

  return (
    <ConfigProvider locale={esES}>
      <div className="min-h-screen bg-gray-50 flex justify-center w-full mb-0">
        <div className="w-full max-w-7xl px-4 py-8 mb-0">
          <div className="relative mx-auto mb-2 bg-white rounded-2xl border border-gray-200 h-14 max-w-lg flex items-center shadow-sm">
            <div className="flex-1 flex justify-center items-center gap-6 px-4">
              <Popover
                trigger="click"
                placement="bottom"
                content={
                  <RangePicker
                    inline
                    value={dateRange}
                    onChange={setDateRange}
                    allowClear={false}
                  />
                }
              >
                <div className="flex items-center gap-3 cursor-pointer">
                  <CalendarDays size={18} className="text-gray-600" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">
                      FECHAS
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {dateRange && dateRange[0] && dateRange[1] ? (
                        `${dayjs(dateRange[0]).format("DD MMM")} - ${dayjs(
                          dateRange[1],
                        ).format("DD MMM")}`
                      ) : (
                        <span className="text-gray-400">Seleccionar</span>
                      )}
                    </span>
                  </div>
                </div>
              </Popover>

              <div className="w-px h-6 bg-gray-300" />

              <div className="flex items-center gap-3">
                <Users size={18} className="text-gray-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">
                    HUÉSPEDES
                  </span>
                  <div className="flex items-center">
                    <InputNumber
                      min={1}
                      max={20}
                      value={guests}
                      onChange={setGuests}
                      variant="borderless"
                      className="w-12 text-base font-medium text-gray-800 p-0"
                      controls={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="absolute right-4 bg-lime-600 border-none rounded-full w-11 h-11 text-white hover:bg-lime-600 shadow-md"
              icon={<Search size={18} />}
              onClick={applyFilters}
              aria-label="Buscar habitaciones"
            />
          </div>

          <div className="mb-3 text-sm text-gray-600">
            Mostrando {filteredRooms.length} de {rooms.length} habitaciones
            {appliedFilters.dateRange &&
              appliedFilters.dateRange[0] &&
              appliedFilters.dateRange[1] && (
                <span>
                  {" "}
                  para las fechas{" "}
                  {dayjs(appliedFilters.dateRange[0]).format(
                    "DD/MM/YYYY",
                  )} - {dayjs(appliedFilters.dateRange[1]).format("DD/MM/YYYY")}
                </span>
              )}
            {appliedFilters.guests > 1 && (
              <span> con capacidad para {appliedFilters.guests} huéspedes</span>
            )}
          </div>

          <Row gutter={[24, 24]}>
            {currentRooms.map((room) => (
              <Col key={room.id} xs={24} sm={12} lg={8} xl={8}>
                <RoomCard
                  room={room}
                  isFav={favorites.includes(room.id)}
                  onToggleFavorite={toggleFavorite}
                  onViewDetails={openRoomDetails}
                  onViewMap={handleViewMap}
                />
              </Col>
            ))}
          </Row>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No se encontraron habitaciones
              </h3>
              <p className="text-gray-500">
                No hay habitaciones disponibles con los filtros seleccionados.
                Intenta con otras fechas o número de huéspedes.
              </p>
            </div>
          )}

          <div className="flex justify-center mt-12">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredRooms.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showQuickJumper
              className="[&_.ant-pagination-item]:rounded-full [&_.ant-pagination-item-active]:bg-lime-600 [&_.ant-pagination-item-active]:border-lime-600 [&_.ant-pagination-item-active_a]:text-white"
            />
          </div>

          <RoomDetailsModal
            open={openDetails}
            onClose={() => setOpenDetails(false)}
            room={selectedRoom}
            userRating={userRating[selectedRoom?.id]}
            onRate={handleRate}
            onRequestRoom={handleRequestRoom}
          />

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
      </div>
    </ConfigProvider>
  );
}
