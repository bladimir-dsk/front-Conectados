import React, { useState } from "react";
import {
  Card,
  Typography,
  Alert,
  Button,
  Divider,
  Checkbox,
  Radio,
  Space,
  Input,
  Row,
  Col,
  Tag,
  Drawer,
} from "antd";
import {
  XCircle,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  Download,
  Printer,
  CreditCard,
  Trash2,
} from "lucide-react";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function ReservationStudent_Screen() {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showCancelDrawer, setShowCancelDrawer] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [agreePolicy, setAgreePolicy] = useState(false);

  const cancelReasons = [
    "Cambio de planes",
    "Encontré mejor opción",
    "Problemas con el pago",
    "Error en la reserva",
    "Otro",
  ];

  const reservations = [
    {
      id: "394223134212",
      time: "12:49",
      date: "04/05/24",
      room: "Habitación 1 (2 espacios)",
      days: 2,
      price: 2445.6,
      tax: 440.21,
      serviceFee: 244.54,
      total: 3130.35,
      paymentMethod: "Stripe",
      status: "Por pagar",
      statusColor: "warning",
    },
    {
      id: "394223134213",
      time: "14:30",
      date: "05/05/24",
      room: "Habitación 2 (individual)",
      days: 3,
      price: 3200.0,
      tax: 576.0,
      serviceFee: 320.0,
      total: 4096.0,
      paymentMethod: "Stripe",
      status: "Por pagar",
      statusColor: "warning",
    },
    {
      id: "394223134214",
      time: "10:15",
      date: "03/05/24",
      room: "Habitación Suite Ejecutiva",
      days: 1,
      price: 1800.0,
      tax: 324.0,
      serviceFee: 180.0,
      total: 2304.0,
      paymentMethod: "Tarjeta de crédito",
      status: "Reservado",
      statusColor: "success",
    },
  ];

  const handleCancelClick = (reservation) => {
    setSelectedReservation(reservation);
    setShowCancelDrawer(true);
  };

  const handleConfirmCancel = () => {
    if (!agreePolicy) return;

    setShowCancelDrawer(false);
    setCancelReason("");
    setCustomReason("");
    setAgreePolicy(false);
    setSelectedReservation(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Mis Reservaciones
      </Title>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "16px",
        }}
      >
        {reservations.map((reservation, index) => (
          <Card key={index} style={{ height: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <img
                  src="/LogoPrincipal-Horizontal.webp"
                  alt="Conecta-DoS"
                  style={{ height: 32, marginBottom: 12 }}
                />
                <Row justify="space-between" style={{ fontSize: "14px" }}>
                  <Col>
                    <Text type="secondary">Operación:</Text>
                    <Text code style={{ marginLeft: 4 }}>
                      {reservation.id}
                    </Text>
                  </Col>
                  <Col>
                    <Space>
                      <Tag icon={<Calendar size={12} />} color="blue">
                        {reservation.date}
                      </Tag>
                      <Tag icon={<Clock size={12} />} color="purple">
                        {reservation.time}
                      </Tag>
                    </Space>
                  </Col>
                </Row>
              </div>

              <Text strong style={{ fontSize: "15px" }}>
                {reservation.room}
              </Text>

              <Divider style={{ margin: "12px 0" }} />

              <div style={{ marginBottom: "16px" }}>
                <Row justify="space-between" style={{ marginBottom: "8px" }}>
                  <Col>
                    <Text type="secondary">Cant. días:</Text>
                  </Col>
                  <Col>
                    <Text strong>{reservation.days} Días</Text>
                  </Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: "8px" }}>
                  <Col>
                    <Text type="secondary">Precio:</Text>
                  </Col>
                  <Col>
                    <Text>{formatCurrency(reservation.price)}</Text>
                  </Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: "8px" }}>
                  <Col>
                    <Text type="secondary">IGV 18%:</Text>
                  </Col>
                  <Col>
                    <Text>{formatCurrency(reservation.tax)}</Text>
                  </Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: "8px" }}>
                  <Col>
                    <Text type="secondary">Rec. Servicios:</Text>
                  </Col>
                  <Col>
                    <Text>{formatCurrency(reservation.serviceFee)}</Text>
                  </Col>
                </Row>
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: "16px" }}
              >
                <Col>
                  <Text strong>Tot. PAGO:</Text>
                  <Text strong style={{ marginLeft: "8px", fontSize: "16px" }}>
                    {formatCurrency(reservation.total)}
                  </Text>
                </Col>
                <Col>
                  <Tag
                    color={reservation.statusColor}
                    icon={
                      reservation.status === "Reservado" ? (
                        <CheckCircle size={12} />
                      ) : (
                        <XCircle size={12} />
                      )
                    }
                  >
                    {reservation.status}
                  </Tag>
                </Col>
              </Row>

              <Row justify="space-between" style={{ marginBottom: "16px" }}>
                <Col>
                  <Text type="secondary">Forma PAGO:</Text>
                  <Text style={{ marginLeft: "8px" }}>
                    {reservation.paymentMethod}
                  </Text>
                </Col>
              </Row>

              <Divider style={{ margin: "16px 0" }} />

              {reservation.status === "Por pagar" ? (
                <Row gutter={8}>
                  <Col span={12}>
                    <Button
                      icon={<CreditCard size={16} />}
                      block
                      type="primary"
                      style={{ fontSize: "13px", height: "40px" }}
                    >
                      Pagar
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      icon={<XCircle size={16} />}
                      block
                      danger
                      style={{ fontSize: "13px", height: "40px" }}
                      onClick={() => handleCancelClick(reservation)}
                    >
                      Cancelar
                    </Button>
                  </Col>
                </Row>
              ) : (
                <Row gutter={8}>
                  <Col span={12}>
                    <Button
                      icon={<Download size={16} />}
                      block
                      type="default"
                      style={{ fontSize: "13px", height: "40px" }}
                    >
                      Descargar
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      icon={<Printer size={16} />}
                      block
                      type="default"
                      style={{ fontSize: "13px", height: "40px" }}
                    >
                      Imprimir
                    </Button>
                  </Col>
                </Row>
              )}
            </Space>
          </Card>
        ))}
      </div>

      <Drawer
        title={
          <Space>
            <AlertCircle size={20} />
            <Text strong>¿Cancelar reserva?</Text>
          </Space>
        }
        placement="right"
        width={500}
        open={showCancelDrawer}
        onClose={() => setShowCancelDrawer(false)}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Space>
              <Button onClick={() => setShowCancelDrawer(false)}>Volver</Button>
              <Button
                type="primary"
                danger
                icon={<Trash2 size={16} />}
                onClick={handleConfirmCancel}
                disabled={!agreePolicy}
              >
                Confirmar Cancelación
              </Button>
            </Space>
          </div>
        }
      >
        {selectedReservation && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Paragraph style={{ fontSize: "16px", marginBottom: 24 }}>
              Te agradecemos que hayas leído correctamente nuestras políticas
              para cancelar tu reserva.
              <Text strong>
                Una vez aceptado y pagado, ya no se podrá cancelar la reserva
              </Text>
              , si no es el caso puedes hacerlo desde acá.
            </Paragraph>

            <Card
              title="Reserva seleccionada"
              size="small"
              style={{ marginBottom: 24, backgroundColor: "#fafafa" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong style={{ fontSize: "16px" }}>
                    {selectedReservation.room}{" "}
                    <Trash2 size={16} style={{ marginLeft: 8 }} />
                  </Text>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <div>
                  <Text strong style={{ display: "block", marginBottom: 4 }}>
                    ID de reserva:
                  </Text>
                  <Paragraph
                    type="secondary"
                    style={{ marginBottom: 8, fontSize: "14px" }}
                  >
                    (El proceso es automático, pero puede verificar para mayor
                    seguridad)
                  </Paragraph>
                  <Text
                    code
                    style={{
                      fontSize: "16px",
                      padding: "8px 16px",
                      backgroundColor: "#f5f5f5",
                      display: "block",
                    }}
                  >
                    {selectedReservation.id}
                  </Text>
                </div>

                <div style={{ marginTop: 16 }}>
                  <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Col>
                      <Text type="secondary">Total a reembolsar:</Text>
                    </Col>
                    <Col>
                      <Text strong>
                        {formatCurrency(selectedReservation.total)}
                      </Text>
                    </Col>
                  </Row>
                  <Row justify="space-between">
                    <Col>
                      <Text type="secondary">Estado:</Text>
                    </Col>
                    <Col>
                      <Tag color={selectedReservation.statusColor}>
                        {selectedReservation.status}
                      </Tag>
                    </Col>
                  </Row>
                </div>
              </Space>
            </Card>

            <div style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginBottom: 16 }}>
                Comentarios tu razón:
                <Text
                  type="secondary"
                  style={{
                    fontSize: "14px",
                    marginLeft: 8,
                    fontWeight: "normal",
                  }}
                >
                  (puedes omitir este proceso si gustas)
                </Text>
              </Title>

              <Radio.Group
                onChange={(e) => setCancelReason(e.target.value)}
                value={cancelReason}
                style={{ marginBottom: 16, width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {cancelReasons.map((reason) => (
                    <Radio
                      key={reason}
                      value={reason}
                      style={{ display: "block", marginBottom: 8 }}
                    >
                      {reason}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>

              {cancelReason === "Otro" && (
                <TextArea
                  placeholder="Describe tu razón..."
                  rows={3}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  style={{ marginTop: 8 }}
                />
              )}
            </div>

            <Checkbox
              checked={agreePolicy}
              onChange={(e) => setAgreePolicy(e.target.checked)}
              style={{ marginBottom: 24, display: "block" }}
            >
              He leído y acepto las políticas de cancelación
            </Checkbox>

            <Alert
              message="Importante"
              description="Recuerda que la cantidad de reservas es acumulable para promociones y programas de lealtad."
              type="info"
              showIcon
            />
          </Space>
        )}
      </Drawer>
    </div>
  );
}
