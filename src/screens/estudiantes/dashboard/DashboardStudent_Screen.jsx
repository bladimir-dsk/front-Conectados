import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/useApi";
import api from "../../../api/axiosConfig";
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
import { Users, Search, CalendarDays } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

import RoomDetailsModal from "../../../components/modals/RoomDetailsModal";
import ReservationModal from "../../../components/modals/ReservationModal";
import RoomCard from "../../../components/cards/RoomCard";

const { RangePicker } = DatePicker;
const IMAGE_URL = "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg";

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
  const [hasRated, setHasRated] = useState({});
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

  const loadUserRating = async (roomId) => {
    try {
      const res = await api.get(`/calificacion/mi-calificacion/${roomId}`);

      return res.data?.puntuacion ?? null;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Error cargando mi calificación", error);
      return null;
    }
  };

  const [allAccommodations, setAllAccommodations] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
    total: 0,
  });

  const loadRatingStats = async (roomId) => {
    try {
      const res = await api.get(`/calificacion/estadistica/${roomId}`);

      setAllAccommodations((prev) =>
        prev.map((room) =>
          room.id === roomId
            ? {
                ...room,
                rating: res.data.promedio ?? 0,
                totalVotos: res.data.totalVotos ?? 0,
              }
            : room,
        ),
      );
    } catch (error) {
      console.error("Error cargando estadísticas", error);
    }
  };

  const [displayedRooms, setDisplayedRooms] = useState([]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleGuestsChange = (value) => {
    setGuests(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const loadAllAccommodations = async () => {
    setLoading((prev) => ({ ...prev, rooms: true }));
    try {
      let page = 1;
      let allItems = [];
      let total = 0;
      const limit = 100;

      do {
        const params = {
          startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
          endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
          guests,
          page,
          limit,
        };
        const res = await api.get("/alojamientos", { params });
        const items = res.data?.data ?? res.data ?? [];
        total = res.data?.meta?.total ?? items.length;
        allItems = [...allItems, ...items];
        page++;
      } while (allItems.length < total);

      const mappedRooms = allItems.map((item) => {
        const fotos = (item.fotos || []).map((foto) => ({
          id: foto.id_foto,
          url: foto.url,
          esPrincipal: foto.esPrincipal,
        }));

        const mainPhoto =
          fotos.find((f) => f.esPrincipal === true) || fotos[0] || null;

        return {
          id: item.id_alojamiento,
          name: item.name,
          price: item.precio_completo,
          address: `${item.address}, ${item.city}, ${item.country}`,
          fotos,
          mainImage: mainPhoto?.url || IMAGE_URL,
          rating: item.rating ?? 0,
          reviews: item.reviews ?? 0,
        };
      });

      setAllAccommodations(mappedRooms);
      await Promise.all(mappedRooms.map((room) => loadRatingStats(room.id)));
      setPagination((prev) => ({ ...prev, total: mappedRooms.length }));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los alojamientos");
    } finally {
      setLoading((prev) => ({ ...prev, rooms: false }));
    }
  };

  useEffect(() => {
    loadAllAccommodations();
  }, [dateRange, guests]);

  useEffect(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    setDisplayedRooms(allAccommodations.slice(start, end));
  }, [allAccommodations, pagination.current, pagination.pageSize]);

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
    navigate(`/estudiante/search/${roomId}`, {
      state: {
        openRouteModal: true,
      },
    });
  };

  const openRoomDetails = async (roomId) => {
    setLoading((prev) => ({ ...prev, details: true }));
    setDetailsError(null);
    setOpenDetails(true);

    try {
      const res = await api.get(`/alojamientos/${roomId}/details`);
      const details = res.data;

      const rating = await loadUserRating(roomId);

      setUserRating((prev) => ({
        ...prev,
        [roomId]: rating ?? 0,
      }));

      setHasRated((prev) => ({
        ...prev,
        [roomId]: rating !== null,
      }));

      const normalizeGender = (gender) => {
        if (!gender) return "mixto";
        const value = gender.toLowerCase();
        if (value === "mujer" || value === "femenino") return "femenino";
        if (value === "hombre" || value === "masculino") return "masculino";
        return "mixto";
      };

      const fotos = (details.fotos || []).map((foto) => ({
        id: foto.id_foto,
        url: foto.url,
        principal: foto.esPrincipal,
        descripcion: foto.descripcion,
      }));

      const allServices = (details.servicios || []).map((s) => ({
        id: s.id,
        name: s.servicio.name,
        icon: s.servicio.icon,
        costo: s.costo != null ? Number(s.costo) : 0,
      }));

      const cuartos = (details.cuartos || []).map((cuarto) => ({
        id_cuarto: cuarto.id_cuarto,
        name: cuarto.name,
        price: Number(cuarto.price ?? 0),
        estatus: cuarto.estatus,
        camas: (cuarto.camas || []).map((cama) => ({
          id_cama: cama.id_cama,
          name: cama.name,
          price: Number(cama.price ?? 0),
          estatus: cama.estatus,
        })),
      }));

      const enrichedRoom = {
        id: details.id_alojamiento,
        name: details.name,
        price: details.precio_completo,
        typeProperty: details.typeProperty,
        gender: normalizeGender(details.gender),
        propietario: {
          namePersonal: details.propietario?.namePersonal,
          lastName: details.propietario?.lastName,
          emailPersonal: details.propietario?.emailPersonal,
          phone: details.propietario?.phone,
          code: details.propietario?.code,
        },
        address: `${details.address}, ${details.city}, ${details.country}`,
        services: allServices,
        fotos,
        mainImage: fotos[0]?.url || null,
        cuartos,
        rating: details.calificacion ?? 0,
      };

      setSelectedRoom(enrichedRoom);
    } catch (error) {
      console.error(error);
      setDetailsError("No se pudieron cargar los detalles");
    } finally {
      setLoading((prev) => ({ ...prev, details: false }));
    }
  };

  const calculatePrices = (roomPrice, period, servicesSelected) => {};

  const saveReservation = async () => {};

  const handleRequestRoom = async (roomId) => {
    await fetchDocumentStatus();
    setReservationModalOpen(true);
  };

  const handlePaginationChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  if (loading.rooms && allAccommodations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Cargando habitaciones..." fullscreen />
      </div>
    );
  }
  const handleRate = async (roomId, value) => {
    if (hasRated[roomId]) return;

    setUserRating((prev) => ({ ...prev, [roomId]: value }));

    try {
      await api.post("/calificacion", {
        id_alojamiento: roomId,
        puntuacion: value,
      });

      await loadRatingStats(roomId);
    } catch (error) {
      if (error.response?.status !== 400) {
        console.error("Error al guardar calificación", error);
      }
    }
  };

  return (
    <ConfigProvider locale={esES}>
      <div className="min-h-screen bg-gray-50 flex justify-center w-full mb-0 dark:bg-neutral-800">
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

          <div className="relative mx-auto mb-2 bg-white rounded-2xl border border-gray-200 h-14 max-w-lg flex items-center shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
            <div className="flex-1 flex justify-center items-center gap-6 px-4">
              <Popover
                trigger="click"
                placement="bottom"
                content={
                  <RangePicker
                    inline
                    value={dateRange}
                    onChange={handleDateChange}
                    allowClear={false}
                  />
                }
              >
                <div className="flex items-center gap-3 cursor-pointer">
                  <CalendarDays
                    size={18}
                    className="text-gray-600dark:text-white "
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium dark:text-white">
                      FECHAS
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
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
                <Users size={18} className="text-gray-600 dark:text-white" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium dark:text-white">
                    HUÉSPEDES
                  </span>
                  <div className="flex items-center">
                    <InputNumber
                      min={1}
                      max={20}
                      value={guests}
                      onChange={handleGuestsChange}
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
                loadAllAccommodations();
              }}
              aria-label="Buscar habitaciones"
            />
          </div>

          <div className="mb-3 text-sm text-gray-600 dark:text-white">
            Mostrando {displayedRooms.length} de {allAccommodations.length}{" "}
            habitaciones
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
                {displayedRooms.map((room, index) => (
                  <Col
                    key={room.id ?? `room-${index}`}
                    xs={24}
                    sm={12}
                    lg={8}
                    xl={8}
                  >
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

              {allAccommodations.length === 0 && (
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

              {allAccommodations.length > pagination.pageSize && (
                <div className="flex justify-center mt-12">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={allAccommodations.length}
                    onChange={handlePaginationChange}
                    className="[&_.ant-pagination-item]:rounded-full [&_.ant-pagination-item-active]:bg-lime-600 [&_.ant-pagination-item-active]:border-lime-600 [&_.ant-pagination-item-active_a]:text-white"
                  />
                </div>
              )}
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
            hasRated={hasRated[selectedRoom?.id]}
            onRate={handleRate}
            onRequestRoom={handleRequestRoom}
            services={selectedRoom?.services || []}
            loading={loading.details}
            error={detailsError}
          />

          <ReservationModal
            open={reservationModalOpen}
            onClose={() => setReservationModalOpen(false)}
            room={selectedRoom}
            hasDocuments={hasDocuments}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}
