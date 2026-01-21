import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
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
  Eye,
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
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const { RangePicker } = DatePicker;

const IMAGE_URL = "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg";

const rooms = Array.from({ length: 24 }, (_, i) => ({
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
  services: [
    { name: "Internet", price: 0, icon: <Wifi size={14} /> },
    { name: "Agua", price: 0, icon: <CheckCircle size={14} /> },
    { name: "Luz", price: 20, icon: <CheckCircle size={14} /> },
    { name: "Limpieza", price: 15, icon: <CheckCircle size={14} /> },
    { name: "Cocina", price: 10, icon: <CheckCircle size={14} /> },
    { name: "Lavadora", price: 5, icon: <CheckCircle size={14} /> },
    { name: "Aire acondicionado", price: 25, icon: <CheckCircle size={14} /> },
    { name: "Calefacción", price: 15, icon: <CheckCircle size={14} /> },
    { name: "TV", price: 10, icon: <CheckCircle size={14} /> },
    { name: "Parqueadero", price: 30, icon: <CheckCircle size={14} /> },
    { name: "Gimnasio", price: 20, icon: <CheckCircle size={14} /> },
    { name: "Piscina", price: 25, icon: <CheckCircle size={14} /> },
    { name: "Wifi alta velocidad", price: 0, icon: <CheckCircle size={14} /> },
    { name: "Desayuno", price: 12, icon: <CheckCircle size={14} /> },
    { name: "Almuerzo", price: 18, icon: <CheckCircle size={14} /> },
    { name: "Cena", price: 22, icon: <CheckCircle size={14} /> },
    { name: "Room service", price: 8, icon: <CheckCircle size={14} /> },
    { name: "Toallas", price: 0, icon: <CheckCircle size={14} /> },
    { name: "Ropa de cama", price: 0, icon: <CheckCircle size={14} /> },
    { name: "Secador de pelo", price: 5, icon: <CheckCircle size={14} /> },
    { name: "Plancha", price: 3, icon: <CheckCircle size={14} /> },
    { name: "Caja fuerte", price: 7, icon: <CheckCircle size={14} /> },
    { name: "Minibar", price: 15, icon: <CheckCircle size={14} /> },
    { name: "Balcón", price: 10, icon: <CheckCircle size={14} /> },
    { name: "Vista al mar", price: 35, icon: <CheckCircle size={14} /> },
    { name: "Transporte", price: 20, icon: <CheckCircle size={14} /> },
    { name: "Spa", price: 40, icon: <CheckCircle size={14} /> },
    { name: "Sauna", price: 25, icon: <CheckCircle size={14} /> },
    { name: "Jacuzzi", price: 30, icon: <CheckCircle size={14} /> },
    { name: "Mascotas", price: 15, icon: <CheckCircle size={14} /> },
  ],
}));

export default function DashboardStudent_Screen() {
  const [favorites, setFavorites] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [guests, setGuests] = useState(1);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRating, setUserRating] = useState({});
  const pageSize = 8;

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

  const currentRooms = rooms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <ConfigProvider locale={esES}>
      <div className="min-h-screen w-full flex justify-center bg-gray-100">
        <div className="w-full max-w-[1200px] px-2 py-6">
          <div className="relative mx-auto mb-7 h-12 max-w-[520px] rounded-full bg-gray-200 flex items-center">
            <div className="flex flex-1 items-center justify-center gap-4 text-sm">
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
                <div className="flex items-center gap-1 cursor-pointer">
                  <CalendarDays size={16} />
                  <span className="font-medium lowercase">
                    {dateRange
                      ? `${dayjs(dateRange[0]).format("DD MMM")} - ${dayjs(
                          dateRange[1],
                        ).format("DD MMM")}`
                      : "Fechas"}
                  </span>
                </div>
              </Popover>

              <div className="h-5 w-px bg-gray-300" />

              <div className="flex items-center gap-1">
                <Users size={16} />
                <InputNumber
                  min={1}
                  value={guests}
                  onChange={setGuests}
                  bordered={false}
                  className="w-12"
                />
                <span>huéspedes</span>
              </div>
            </div>

            <Button
              icon={<Search size={18} />}
              className="absolute right-1 h-10 w-10 rounded-full bg-green-500 text-white border-none"
            />
          </div>
          <Row gutter={[20, 20]} justify="center">
            {currentRooms.map((room) => {
              const isFav = favorites.includes(room.id);

              return (
                <Col key={room.id} xs={24} sm={12} md={8} xl={6}>
                  <Card
                    hoverable
                    className="rounded-2xl overflow-hidden shadow-lg"
                    cover={
                      <div className="relative">
                        <img
                          src={IMAGE_URL}
                          alt={room.name}
                          className="h-40 w-full object-cover"
                        />
                        <div className="absolute inset-x-2 top-2 flex justify-between">
                          <Tag color="green">Disponible</Tag>
                          <div
                            onClick={() => toggleFavorite(room.id)}
                            className="bg-white p-1.5 rounded-full cursor-pointer"
                          >
                            <Heart
                              size={18}
                              fill={isFav ? "#ff4d4f" : "none"}
                              color={isFav ? "#ff4d4f" : "#666"}
                            />
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <h3 className="text-sm font-semibold mb-2">{room.name}</h3>

                    <div className="flex flex-col gap-1 mb-3 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Home size={14} />
                        {room.type}
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed size={14} />
                        {room.beds} {room.beds === 1 ? "cama" : "camas"}
                      </div>
                    </div>

                    <div className="flex items-baseline mb-3">
                      <span className="text-lg font-semibold">
                        ${room.price}
                      </span>
                      <span className="ml-1 text-xs text-gray-500">/noche</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        style={{
                          backgroundColor: "#84cc16",
                          color: "white",
                        }}
                        onClick={() => openRoomDetails(room)}
                      >
                        Ver detalles
                      </Button>
                      <Button icon={<MapPin size={16} />}>Ver en mapa</Button>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
          <div className="flex justify-center mt-10">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={rooms.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
          <Modal
            open={openDetails}
            onCancel={() => setOpenDetails(false)}
            footer={null}
            centered
            width={480}
            closable={false}
            styles={{ body: { padding: 0 } }}
          >
            {selectedRoom && (
              <div className="relative rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenDetails(false)}
                  className="absolute top-3 right-3 z-10 bg-white rounded-full p-1 shadow"
                >
                  <X size={18} />
                </button>
                <img
                  src={IMAGE_URL}
                  alt={selectedRoom.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">
                      {selectedRoom.name}
                    </h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          size={18}
                          className="cursor-pointer"
                          fill={
                            userRating[selectedRoom.id] >= star
                              ? "#facc15"
                              : "none"
                          }
                          color={
                            userRating[selectedRoom.id] >= star
                              ? "#facc15"
                              : "#d1d5db"
                          }
                          onClick={() => handleRate(selectedRoom.id, star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <User size={14} />
                    {selectedRoom.owner}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex gap-2">
                      <Home size={16} className="text-green-500" />
                      {selectedRoom.type}
                    </div>

                    <div className="flex gap-2">
                      <Bed size={16} className="text-green-500" />
                      {selectedRoom.beds} camas
                    </div>

                    <div className="flex gap-2">
                      <DollarSign size={16} className="text-green-500" />$
                      {selectedRoom.price}/noche
                    </div>

                    <div className="flex gap-2 col-span-2">
                      <MapPin size={16} className="text-green-500" />
                      {selectedRoom.address}
                    </div>
                  </div>

                  <Divider className="my-2" />

                  <div>
                    <h4 className="font-semibold mb-2">Servicios incluidos</h4>

                    <div className="max-h-40 overflow-y-auto space-y-2 text-sm">
                      {selectedRoom.services.map((s, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2">
                            {s.icon}
                            {s.name}
                          </div>
                          <span className="font-medium text-green-600">
                            {s.price === 0 ? "Incluido" : `+$${s.price}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full h-11 bg-green-500 text-white border-none font-medium"
                    onClick={() => setOpenDetails(false)}
                  >
                    Solicitar habitación
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
}
