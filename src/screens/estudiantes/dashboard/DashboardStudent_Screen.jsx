import React, { useState, useEffect } from "react";
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
  Heart,
  Search,
  CalendarDays,
  Star,
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

import RoomDetailsModal from "../../../components/modals/RoomDetailsModal";
import ReservationModal from "../../../components/modals/ReservationModal";
import RoomCard from "../../../components/cards/RoomCard";

const { RangePicker } = DatePicker;

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

export default function DashboardStudent_Screen() {
  const [favorites, setFavorites] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [guests, setGuests] = useState(1);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userRating, setUserRating] = useState({});
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [reservationStep, setReservationStep] = useState(1);
  const [rentType, setRentType] = useState("completo");
  const [selectedRooms, setSelectedRooms] = useState(1);
  const [selectedBed, setSelectedBed] = useState("");
  const [rentPeriod, setRentPeriod] = useState(12);
  const [selectedServices, setSelectedServices] = useState([]);

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

  const { fetchData: fetchDocumentsStatus } = useApi(
    "/documentacion/status/approved",
    {},
    false,
  );
  const {
    fetchData: fetchAccommodations,
    loading: accommodationsLoading,
    error: accommodationsError,
  } = useApi("/alojamientos", {}, false);

  const [accommodations, setAccommodations] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
  });

  const fetchDocumentStatus = async () => {
    try {
      const response = await fetchDocumentsStatus();
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

  useEffect(() => {
    const loadAccommodations = async () => {
      setLoading((prev) => ({ ...prev, rooms: true }));
      try {
        const data = await fetchAccommodations({
          params: {
            page: pagination.current,
            limit: pagination.pageSize,
            startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
            endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
            guests,
          },
        });

        const items = data?.data ?? [];
        const total = data?.meta?.total ?? 0;

        const mappedRooms = items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.precio_completo,
          address: `${item.address}, ${item.city}, ${item.country}`,
          image: item.url || IMAGE_URL,
          rating: item.rating ?? 0,
          reviews: item.reviews ?? 0,
        }));

        setAccommodations(mappedRooms);
        setPagination((prev) => ({ ...prev, total }));
        setError(null);
      } catch (err) {
        setError("Error al cargar los alojamientos");
      } finally {
        setLoading((prev) => ({ ...prev, rooms: false }));
      }
    };

    loadAccommodations();
  }, [pagination.current, pagination.pageSize, dateRange, guests]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, rooms: accommodationsLoading }));
  }, [accommodationsLoading]);

  useEffect(() => {
    if (accommodationsError) {
      setError("Error al cargar los alojamientos");
    }
  }, [accommodationsError]);

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
    const room = accommodations.find((r) => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
      calculatePrices(room.price, rentPeriod, selectedServices);
    }

    await fetchDocumentStatus();
    setReservationStep(1);
    setReservationModalOpen(true);
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };

  if (loading.rooms && accommodations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Cargando habitaciones..." fullscreen />
      </div>
    );
  }

  return (
    <ConfigProvider locale={esES}>
      <div className="min-h-screen bg-gray-50 flex justify-center w-full mb-0">
        <div className="w-full max-w-7xl px-4 py-8 mb-0">
          {error && (
            <Alert
              title="Error"
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
              onClick={() => {
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
              aria-label="Buscar habitaciones"
            />
          </div>

          <div className="mb-3 text-sm text-gray-600">
            Mostrando {accommodations.length} de {pagination.total} habitaciones
            {dateRange && dateRange[0] && dateRange[1] && (
              <span>
                {" "}
                para las fechas {dayjs(dateRange[0]).format(
                  "DD/MM/YYYY",
                )} - {dayjs(dateRange[1]).format("DD/MM/YYYY")}
              </span>
            )}
            {guests > 1 && <span> con capacidad para {guests} huéspedes</span>}
          </div>

          {loading.rooms ? (
            <div className="text-center py-12">
              <Spin size="large" tip="Cargando habitaciones..." />
            </div>
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {accommodations.map((room) => (
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

              {accommodations.length === 0 && (
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
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePaginationChange}
                  showSizeChanger
                  onShowSizeChange={handlePaginationChange}
                  pageSizeOptions={["6", "12", "18", "24"]}
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
            onSelectedServicesChange={setSelectedServices}
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
