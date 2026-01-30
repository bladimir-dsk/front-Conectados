import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const { RangePicker } = DatePicker;

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
  { name: "Room service", price: 8, icon: <Bell size={16} /> },
  { name: "Toallas", price: 0, icon: <Bath size={16} /> },
  { name: "Secador de pelo", price: 5, icon: <CheckCircle size={16} /> },
  { name: "Plancha", price: 3, icon: <CheckCircle size={16} /> },
  { name: "Caja fuerte", price: 7, icon: <CheckCircle size={16} /> },
  { name: "Mascotas", price: 15, icon: <CheckCircle size={16} /> },
];

const RoomCard = ({ room, isFav, onToggleFavorite, onViewDetails }) => {
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
            className="flex-1 bg-lime-500 border-lime-500 text-white font-medium hover:bg-lime-600 hover:border-lime-600 h-10 text-sm"
            onClick={() => onViewDetails(room)}
          >
            Ver detalles
          </Button>
          <Button
            icon={<MapPinIcon size={14} />}
            className="flex-1 border-lime-500 text-lime-500 bg-transparent hover:bg-lime-50 hover:border-lime-600 hover:text-lime-600 h-10 text-sm"
            aria-label="Ver en mapa"
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
          className="text-gray-500 hover:text-lime-500"
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
          <Space direction="vertical" size={16} className="w-full">
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
                <Home size={18} className="text-lime-500" />
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
                <Bed size={18} className="text-lime-500" />
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
                <DollarSign size={18} className="text-lime-500" />
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
                <MapPinIcon size={18} className="text-lime-500" />
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
                  {SERVICES.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-lime-500 flex-shrink-0">
                          {service.icon}
                        </div>
                        <span className="text-gray-700 text-sm truncate">
                          {service.name}
                        </span>
                      </div>
                      <span className="text-lime-500 font-medium text-sm whitespace-nowrap flex-shrink-0 ml-2">
                        {service.price === 0
                          ? "Incluido"
                          : `+$${service.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-lime-500 border-lime-500 text-white font-medium h-11 hover:bg-lime-600 hover:border-lime-600 rounded-lg"
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

export default function DashboardStudent_Screen() {
  const [favorites, setFavorites] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [guests, setGuests] = useState(1);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRating, setUserRating] = useState({});
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
    }));
  }, []);

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

  const handleRequestRoom = (roomId) => {
    console.log("Solicitar habitación:", roomId);
  };

  const currentRooms = useMemo(() => {
    return rooms.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [rooms, currentPage, pageSize]);

  return (
    <ConfigProvider locale={esES}>
      <div className="min-h-screen bg-gray-50 flex justify-center w-full">
        <div className="w-full max-w-7xl px-4 py-8">
          <div className="relative mx-auto mb-10 bg-white rounded-2xl border border-gray-200 h-14 max-w-lg flex items-center shadow-sm">
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
                      {dateRange ? (
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
                      bordered={false}
                      className="w-12 text-base font-medium text-gray-800 p-0"
                      controls={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="absolute right-4 bg-lime-500 border-none rounded-full w-11 h-11 text-white hover:bg-lime-600 shadow-md"
              icon={<Search size={18} />}
              aria-label="Buscar habitaciones"
            />
          </div>

          <Row gutter={[24, 24]}>
            {currentRooms.map((room) => (
              <Col key={room.id} xs={24} sm={12} lg={8} xl={8}>
                <RoomCard
                  room={room}
                  isFav={favorites.includes(room.id)}
                  onToggleFavorite={toggleFavorite}
                  onViewDetails={openRoomDetails}
                />
              </Col>
            ))}
          </Row>

          <div className="flex justify-center mt-12">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={rooms.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showQuickJumper
              className="[&_.ant-pagination-item]:rounded-full [&_.ant-pagination-item-active]:bg-lime-500 [&_.ant-pagination-item-active]:border-lime-500 [&_.ant-pagination-item-active_a]:text-white"
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
        </div>
      </div>
    </ConfigProvider>
  );
}
