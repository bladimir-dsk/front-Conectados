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
  Popover,
  Pagination,
  Alert,
  Spin,
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
  Star,
  Bed,
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
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

// Importar componentes de modales
import RoomDetailsModal from "../../../components/modals/RoomDetailsModal";
import ReservationModal from "../../../components/modals/ReservationModal";

const { RangePicker } = DatePicker;

const IMAGE_URL = "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg";

const SERVICES = [
  { id: 1, name: "Internet", price: 0, icon: <Wifi size={16} /> },
  { id: 2, name: "Agua", price: 0, icon: <Droplets size={16} /> },
  { id: 3, name: "Luz", price: 20, icon: <Zap size={16} /> },
  { id: 4, name: "Limpieza", price: 15, icon: <Sparkles size={16} /> },
  { id: 5, name: "Cocina", price: 10, icon: <Utensils size={16} /> },
  { id: 6, name: "Lavadora", price: 5, icon: <Shirt size={16} /> },
  { id: 7, name: "Aire acondicionado", price: 25, icon: <Wind size={16} /> },
  { id: 8, name: "TV", price: 10, icon: <Tv size={16} /> },
  { id: 9, name: "Parqueadero", price: 30, icon: <Car size={16} /> },
  { id: 10, name: "Gimnasio", price: 20, icon: <Dumbbell size={16} /> },
  { id: 11, name: "Piscina", price: 25, icon: <Waves size={16} /> },
  { id: 12, name: "Desayuno", price: 12, icon: <Coffee size={16} /> },
  { id: 13, name: "Almuerzo", price: 18, icon: <Sandwich size={16} /> },
  { id: 14, name: "Cena", price: 22, icon: <Moon size={16} /> },
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
            className="flex-1 !bg-transparent !border-white font-medium hover:!bg-transparent !text-white h-10 text-sm"
            onClick={() => onViewMap(room.id)}
          >
            Mapa
          </Button>
        </div>
      </div>
    </div>
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
  const [loading, setLoading] = useState({
    rooms: false,
    reservation: false,
  });
  const [error, setError] = useState(null);

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

  const calculatePrices = (roomPrice, period, servicesSelected) => {
    const periodPrices = {
      12: 100,
      6: 200,
      3: 300,
    };

    const servicesCost = servicesSelected.reduce((total, serviceName) => {
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

  const saveReservation = async () => {
    if (!selectedRoom) return;

    setLoading((prev) => ({ ...prev, reservation: true }));

    try {
      const reservationData = {
        roomId: selectedRoom.id,
        rentType,
        selectedRooms,
        selectedBed,
        rentPeriod,
        selectedServices,
        prices,
        userId: "current-user-id",
      };

      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Reservación guardada:", reservationData);

      setLoading((prev) => ({ ...prev, reservation: false }));
    } catch (err) {
      setError("Error al guardar la reservación");
      setLoading((prev) => ({ ...prev, reservation: false }));
    }
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

  const handleServicesChange = (newServices) => {
    setSelectedServices(newServices);
    if (selectedRoom) {
      calculatePrices(selectedRoom.price, rentPeriod, newServices);
    }
  };

  useEffect(() => {
    setLoading((prev) => ({ ...prev, rooms: true }));
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, rooms: false }));
    }, 1000);
  }, []);

  if (loading.rooms && rooms.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Cargando habitaciones..." />
      </div>
    );
  }

  return (
    <ConfigProvider locale={esES}>
      <div className="min-h-screen bg-gray-50 flex justify-center w-full mb-0">
        <div className="w-full max-w-7xl px-4 py-8 mb-0">
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-4"
              closable
              onClose={() => setError(null)}
            />
          )}

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

          {loading.rooms ? (
            <div className="text-center py-12">
              <Spin size="large" tip="Cargando habitaciones..." />
            </div>
          ) : (
            <>
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
                    No hay habitaciones disponibles con los filtros
                    seleccionados. Intenta con otras fechas o número de
                    huéspedes.
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
            </>
          )}

          <RoomDetailsModal
            open={openDetails}
            onClose={() => setOpenDetails(false)}
            room={selectedRoom}
            userRating={userRating[selectedRoom?.id]}
            onRate={handleRate}
            onRequestRoom={handleRequestRoom}
            services={SERVICES}
            loading={loading.reservation}
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
      </div>
    </ConfigProvider>
  );
}
