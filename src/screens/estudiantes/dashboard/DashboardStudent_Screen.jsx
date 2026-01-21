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
  Badge,
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
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const { RangePicker } = DatePicker;

const IMAGE_URL = "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg";

const rooms = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Habitación ${i + 1}`,
  price: 120,
  owner: "Juan Pérez",
  gender: "Mixto",
  type: "Cuarto privado",
  address: "Calle 10 #123, Centro, Mérida, Yucatán",
  rating: 4.2 + i * 0.1,
  reviews: 12 + i,
  services: [
    { name: "Internet", price: 0, icon: <Wifi size={14} /> },
    { name: "Agua", price: 0, icon: <CheckCircle size={14} /> },
    { name: "Luz", price: 20, icon: <CheckCircle size={14} /> },
    { name: "Limpieza", price: 15, icon: <CheckCircle size={14} /> },
  ],
}));

export default function DashboardStudent_Screen() {
  const [favorites, setFavorites] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [guests, setGuests] = useState(1);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const openRoomDetails = (room) => {
    setSelectedRoom(room);
    setOpenDetails(true);
  };

  return (
    <ConfigProvider locale={esES}>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.searchBar}>
            <div style={styles.searchContent}>
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
                <div style={styles.searchItem}>
                  <CalendarDays size={16} />
                  {dateRange ? (
                    <span style={styles.dateText}>
                      {`${dayjs(dateRange[0]).format("DD MMM")} - ${dayjs(
                        dateRange[1],
                      ).format("DD MMM")}`}
                    </span>
                  ) : (
                    <span>Fechas</span>
                  )}
                </div>
              </Popover>

              <div style={styles.divider} />

              <div style={styles.searchItem}>
                <Users size={16} />
                <InputNumber
                  min={1}
                  value={guests}
                  onChange={setGuests}
                  bordered={false}
                  style={{ width: 50 }}
                />
                <span>huéspedes</span>
              </div>
            </div>

            <Button style={styles.searchButton} icon={<Search size={18} />} />
          </div>

          <Row gutter={[20, 20]} justify="center">
            {rooms.map((room) => {
              const isFav = favorites.includes(room.id);

              return (
                <Col key={room.id} xs={24} sm={12} md={8} xl={6}>
                  <Card
                    hoverable
                    style={styles.card}
                    cover={
                      <div style={styles.imageWrapper}>
                        <img
                          src={IMAGE_URL}
                          alt={room.name}
                          style={styles.image}
                        />
                        <div style={styles.topActions}>
                          <Tag color="green">Disponible</Tag>
                          <div
                            style={{
                              ...styles.heart,
                              color: isFav ? "#ff4d4f" : "#666",
                            }}
                            onClick={() => toggleFavorite(room.id)}
                          >
                            <Heart
                              size={18}
                              fill={isFav ? "#ff4d4f" : "none"}
                            />
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <h3 style={styles.roomTitle}>{room.name}</h3>

                    <div style={styles.info}>
                      <div style={styles.infoItem}>
                        <Users size={14} />
                        <span>2 personas</span>
                      </div>
                      <div style={styles.infoItem}>
                        <Eye size={14} />
                        <span>Vista ciudad</span>
                      </div>
                      <div style={styles.infoItem}>
                        <Wifi size={14} />
                        <span>Internet</span>
                      </div>
                      <div style={styles.infoItem}>
                        <DollarSign size={14} />
                        <span>${room.price} / día</span>
                      </div>
                    </div>

                    <div style={styles.actions}>
                      <Button
                        style={styles.primaryButton}
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

          <Modal
            open={openDetails}
            footer={null}
            onCancel={() => setOpenDetails(false)}
            centered
            width={480}
            styles={{
              body: { padding: 0 },
            }}
          >
            {selectedRoom && (
              <div style={styles.modalContent}>
                <div style={styles.modalImageWrapper}>
                  <img
                    src={IMAGE_URL}
                    alt={selectedRoom.name}
                    style={styles.modalImage}
                  />
                  <div style={styles.modalBadge}>
                    <Badge
                      count={
                        <Space size={4}>
                          <Star size={12} fill="#fff" />
                          <span style={{ fontSize: 11 }}>
                            {selectedRoom.rating}
                          </span>
                        </Space>
                      }
                      style={{ backgroundColor: "#52c41a" }}
                    />
                  </div>
                </div>

                <div style={styles.modalBody}>
                  <Space
                    direction="vertical"
                    size={16}
                    style={{ width: "100%" }}
                  >
                    <div>
                      <h3 style={styles.modalTitle}>{selectedRoom.name}</h3>
                      <Space size={8} style={{ marginTop: 4 }}>
                        <User size={14} color="#666" />
                        <span style={styles.modalText}>
                          {selectedRoom.owner}
                        </span>
                      </Space>
                    </div>

                    <div style={styles.modalGrid}>
                      <div style={styles.modalGridItem}>
                        <Home size={16} color="#52c41a" />
                        <div>
                          <div style={styles.modalLabel}>Tipo</div>
                          <div style={styles.modalValue}>
                            {selectedRoom.type}
                          </div>
                        </div>
                      </div>
                      <div style={styles.modalGridItem}>
                        <Users size={16} color="#52c41a" />
                        <div>
                          <div style={styles.modalLabel}>Género</div>
                          <div style={styles.modalValue}>
                            {selectedRoom.gender}
                          </div>
                        </div>
                      </div>
                      <div style={styles.modalGridItem}>
                        <DollarSign size={16} color="#52c41a" />
                        <div>
                          <div style={styles.modalLabel}>Precio</div>
                          <div style={styles.modalPrice}>
                            ${selectedRoom.price}/día
                          </div>
                        </div>
                      </div>
                      <div style={styles.modalGridItem}>
                        <MapPin size={16} color="#52c41a" />
                        <div>
                          <div style={styles.modalLabel}>Ubicación</div>
                          <div style={styles.modalAddress}>
                            {selectedRoom.address}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Divider style={{ margin: 0 }} />

                    <div>
                      <h4 style={styles.sectionTitle}>Servicios incluidos</h4>
                      <Space
                        direction="vertical"
                        size={8}
                        style={{ width: "100%" }}
                      >
                        {selectedRoom.services.map((service, index) => (
                          <div key={index} style={styles.serviceItem}>
                            <Space size={12}>
                              {service.icon}
                              <span style={styles.serviceName}>
                                {service.name}
                              </span>
                            </Space>
                            <span style={styles.servicePrice}>
                              {service.price === 0
                                ? "Incluido"
                                : `+$${service.price}`}
                            </span>
                          </div>
                        ))}
                      </Space>
                    </div>

                    <div style={styles.modalActions}>
                      <Button
                        style={styles.requestButton}
                        onClick={() => {
                          console.log("Solicitar habitación:", selectedRoom.id);
                          setOpenDetails(false);
                        }}
                      >
                        Solicitar habitación
                      </Button>
                    </div>
                  </Space>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
}

const lime = "#52c41a";

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  container: {
    width: "100%",
    maxWidth: 1200,
    padding: "24px 8px",
  },
  searchBar: {
    position: "relative",
    margin: "0 auto 28px",
    background: "#f2f2f2",
    borderRadius: 30,
    height: 48,
    maxWidth: 520,
    display: "flex",
    alignItems: "center",
  },
  searchContent: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  searchItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontSize: 13,
  },
  divider: {
    width: 1,
    height: 20,
    background: "#ddd",
  },
  dateText: {
    fontWeight: 500,
    textTransform: "lowercase",
  },
  searchButton: {
    position: "absolute",
    right: 4,
    background: lime,
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    color: "#fff",
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 160,
    objectFit: "cover",
  },
  topActions: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    display: "flex",
    justifyContent: "space-between",
  },
  heart: {
    background: "#fff",
    borderRadius: "50%",
    padding: 6,
    cursor: "pointer",
  },
  roomTitle: {
    fontSize: 15,
    fontWeight: 600,
  },
  info: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    fontSize: 12,
  },
  infoItem: {
    display: "flex",
    gap: 6,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 14,
  },
  primaryButton: {
    background: lime,
    borderColor: lime,
    color: "#fff",
  },
  modalContent: {
    borderRadius: 12,
    overflow: "hidden",
  },
  modalImageWrapper: {
    position: "relative",
  },
  modalImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
  },
  modalBadge: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  modalBody: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 600,
    margin: 0,
    color: "#333",
  },
  modalText: {
    fontSize: 14,
    color: "#666",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  modalGridItem: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  modalLabel: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalValue: {
    fontSize: 14,
    fontWeight: 500,
    color: "#333",
    marginTop: 2,
  },
  modalPrice: {
    fontSize: 14,
    fontWeight: 600,
    color: lime,
    marginTop: 2,
  },
  modalAddress: {
    fontSize: 13,
    color: "#666",
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 12,
    color: "#333",
  },
  serviceItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
  },
  serviceName: {
    fontSize: 14,
    color: "#333",
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 500,
    color: lime,
  },
  modalActions: {
    display: "flex",
    marginTop: 8,
  },
  requestButton: {
    width: "100%",
    background: lime,
    borderColor: lime,
    color: "#fff",
    fontWeight: 500,
    height: 42,
    fontSize: 15,
  },
};
