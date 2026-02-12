import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/useApi";
import {
  Row,
  Col,
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
  Search,
  CalendarDays,
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

const ICON_MAP = {
  "fat-wifi": <Wifi size={16} />,
  "fat-droplets": <Droplets size={16} />,
  "fat-zap": <Zap size={16} />,
  "fat-sparkles": <Sparkles size={16} />,
  "fat-utensils": <Utensils size={16} />,
  "fat-shirt": <Shirt size={16} />,
  "fat-wind": <Wind size={16} />,
  "fat-tv": <Tv size={16} />,
  "fat-car": <Car size={16} />,
  "fat-dumbbell": <Dumbbell size={16} />,
  "fat-waves": <Waves size={16} />,
  "fat-coffee": <Coffee size={16} />,
  "fat-sandwich": <Sandwich size={16} />,
  "fat-moon": <Moon size={16} />,
  default: <Sparkles size={16} />,
};

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
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  const [prices, setPrices] = useState({
    subtotal: 0,
    iva: 0,
    total: 0,
  });
  const [hasDocuments, setHasDocuments] = useState(false);
  const [loading, setLoading] = useState({
    rooms: false,
    reservation: false,
    details: false,
  });
  const [error, setError] = useState(null);
  const [detailsError, setDetailsError] = useState(null);

  const navigate = useNavigate();

  const { fetchData: fetchDocumentsStatus } = useApi(
    "/documentacion/status/approved",
    {},
    false,
  );
  const { fetchData: fetchAccommodations } = useApi("/alojamientos", {}, false);

  const [accommodations, setAccommodations] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
  });

  const mapApiServices = (apiServices) => {
    if (!apiServices) return [];
    return apiServices.map((item) => ({
      id: item.servicio.id_servicio,
      name: item.servicio.name,
      cost: item.costo === null ? 0 : Number(item.costo),
      icon: ICON_MAP[item.servicio.icon] || ICON_MAP.default,
    }));
  };

  const fetchDocumentStatus = async () => {
    try {
      const response = await fetchDocumentsStatus();
      const approved = response?.approved === true;
      setHasDocuments(approved);
      return approved;
    } catch {
      setHasDocuments(false);
      return false;
    }
  };

  const handleViewMap = (roomId) => {
    navigate(`/estudiante/search/${roomId}`, { state: { roomId } });
  };

  const openRoomDetails = async (room) => {
    if (!room) return;
    setSelectedRoom(null);
    setOpenDetails(true);
    setLoading((prev) => ({ ...prev, details: true }));
    setDetailsError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/v1/alojamientos/${room.id}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error en la respuesta");

      const details = await response.json();

      const images = details.imagenes?.map((img) => img.url) || [];

      const enrichedRoom = {
        ...room,
        type: details.typeProperty,
        gender: details.gender,
        owner: details.propietario?.namePersonal || "Propietario",
        location: `${details.address}, ${details.city}, ${details.country}`,
        address: details.address,
        description: details.description,
        beds: details.camas || 0,
        services: mapApiServices(details.servicios),
        images,
      };
      setSelectedRoom(enrichedRoom);
    } catch {
      setDetailsError("No se pudieron cargar los detalles de la habitación");
    } finally {
      setLoading((prev) => ({ ...prev, details: false }));
    }
  };

  const handleRate = (roomId, value) => {
    setUserRating((prev) => ({ ...prev, [roomId]: value }));
  };

  const calculatePrices = (
    roomPricePerNight,
    periodMonths,
    selectedIds,
    availableServices = [],
  ) => {
    const numericPrice = Number(roomPricePerNight) || 0;
    const days = periodMonths * 30;
    const roomTotal = numericPrice * days;

    const servicesCost = availableServices
      .filter((service) => selectedIds.includes(service.id))
      .reduce((total, service) => total + (service.cost || 0), 0);

    const subtotal = roomTotal + servicesCost;
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
        selectedServiceIds,
        prices,
        userId: "current-user-id",
      };
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Reservación guardada:", reservationData);
    } catch {
      setError("Error al guardar la reservación");
    } finally {
      setLoading((prev) => ({ ...prev, reservation: false }));
    }
  };

  const handleRequestRoom = async (roomId) => {
    let room = null;
    if (selectedRoom?.id === roomId && selectedRoom?.services) {
      room = selectedRoom;
    } else {
      room = accommodations.find((r) => r.id === roomId);
    }

    if (room) {
      if (selectedRoom?.id !== roomId) {
        setSelectedRoom(room);
      }
      calculatePrices(
        room.price,
        rentPeriod,
        selectedServiceIds,
        room.services || [],
      );
    }

    await fetchDocumentStatus();
    setReservationStep(1);
    setReservationModalOpen(true);
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize, total: pagination.total });
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

        const mappedRooms = items.map((item) => {
          let mainImage = IMAGE_URL;
          if (item.imagenes && Array.isArray(item.imagenes)) {
            const principal = item.imagenes.find(
              (img) => img.principal === true,
            );
            if (principal) mainImage = principal.url;
          }

          return {
            id: item.id,
            name: item.name,
            price: item.precio_completo,
            address: `${item.address || ""}, ${item.city || ""}, ${item.country || ""}`,
            image: mainImage,
            rating: item.rating ?? 0,
            reviews: item.reviews ?? 0,
          };
        });

        setAccommodations(mappedRooms);
        setPagination((prev) => ({ ...prev, total }));
        setError(null);
      } catch {
        setError("Error al cargar los alojamientos");
      } finally {
        setLoading((prev) => ({ ...prev, rooms: false }));
      }
    };

    loadAccommodations();
  }, [pagination.current, pagination.pageSize, dateRange, guests]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
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
                      id="guests-input"
                      name="guests"
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
              onClick={() => setPagination((prev) => ({ ...prev, current: 1 }))}
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
            onClose={() => {
              setOpenDetails(false);
              setDetailsError(null);
            }}
            room={selectedRoom}
            userRating={userRating[selectedRoom?.id]}
            onRate={handleRate}
            onRequestRoom={handleRequestRoom}
            services={selectedRoom?.services || []}
            images={selectedRoom?.images || []}
            loading={loading.details}
            error={detailsError}
          />

          <ReservationModal
            open={reservationModalOpen}
            onClose={() => {
              setReservationModalOpen(false);
              setReservationStep(1);
              setSelectedServiceIds([]);
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
                calculatePrices(
                  selectedRoom.price,
                  period,
                  selectedServiceIds,
                  selectedRoom.services || [],
                );
              }
            }}
            selectedServiceIds={selectedServiceIds}
            onSelectedServicesChange={setSelectedServiceIds}
            services={selectedRoom?.services || []}
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
