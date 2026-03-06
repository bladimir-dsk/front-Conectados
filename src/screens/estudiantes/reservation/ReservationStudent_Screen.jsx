import { useState } from "react";
import { Tabs, Alert } from "antd";
import {
  CheckCircle,
  Clock,
  Calendar,
  CreditCard,
  Printer,
  Download,
  Ban,
  Clock4,
  MapPin,
  Wrench,
  Building2,
  BedDouble,
  House,
  XCircle,
} from "lucide-react";
import { useApi } from "../../../hooks/useApi";
import PaymentSuccessModal from "./modals/PaymentSuccessModal";
import api from "../../../api/axiosConfig";
import StripePaymentModal from "./modals/StripePaymentModal";

const STATUS_CONFIG = {
  PENDIENTE: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Pendientes",
    icon: <Clock4 size={11} />,
  },
  ACTIVA: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Aprobados",
    icon: <CheckCircle size={11} />,
  },
  FINALIZADA: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
    label: "Finalizadas",
    icon: <Download size={11} />,
  },
  CANCELADA: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
    label: "Canceladas",
    icon: <Ban size={11} />,
  },
};

const TIPO_CONFIG = {
  ALOJAMIENTO_COMPLETO: {
    label: "Alojamiento Completo",
    icon: <Building2 size={11} />,
    bg: "bg-violet-100",
    text: "text-violet-700",
  },
  CUARTO: {
    label: "Cuarto",
    icon: <BedDouble size={11} />,
    bg: "bg-sky-100",
    text: "text-sky-700",
  },
  CAMA: {
    label: "Cama",
    icon: <House size={11} />,
    bg: "bg-orange-100",
    text: "text-orange-700",
  },
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  const months = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
};

function StatusBadge({ estado }) {
  const s = STATUS_CONFIG[estado] || STATUS_CONFIG.PENDIENTE;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function TipoBadge({ tipo }) {
  const t = TIPO_CONFIG[tipo];
  if (!t) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${t.bg} ${t.text}`}
    >
      {t.icon}
      {t.label}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {value}
      </span>
    </div>
  );
}

function ReservationCard({ reservation, onPaySuccess }) {
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);
  const [stripeModalOpen, setStripeModalOpen] = useState(false);

  const { ubicacion, servicios, totales } = reservation;
  const alojamiento = ubicacion?.alojamiento;
  const cuarto = ubicacion?.cuarto;
  const nombreLugar = cuarto?.nombre || alojamiento?.nombre || "Sin nombre";

  const tieneServicios = servicios?.length > 0;
  const totalServicios = totales?.total_servicios;
  const hayMontoServicios =
    tieneServicios && Number(totalServicios) > 0;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md overflow-hidden flex flex-col transition-shadow hover:shadow-xl border border-gray-100 dark:border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between bg-lime-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-2">
          <img
            src="/LogoPrincipal-Horizontal.webp"
            alt="Conecta-DoS"
            className="h-6 object-contain"
          />
          <span className="text-xs text-gray-700 font-mono bg-white/80 px-2 py-0.5 rounded-md">
            #{reservation.id_renta}
          </span>
        </div>
        <StatusBadge estado={reservation.estado} />
      </div>

      {/* Nombre del lugar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start gap-2">
          <House size={18} className="text-lime-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 dark:text-white text-base leading-tight truncate">
              {nombreLugar}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <TipoBadge tipo={reservation.tipo_renta} />
              {alojamiento && (
                <span className="flex items-center gap-1 text-xs text-gray-400 truncate">
                  <MapPin size={11} className="shrink-0" />
                  <span className="truncate">
                    {alojamiento.nombre}
                    {alojamiento.direccion ? ` · ${alojamiento.direccion}` : ""}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2">
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-2.5 text-center">
          <span className="text-gray-400 text-xs flex items-center justify-center gap-1 mb-1">
            <Calendar size={10} /> Entrada
          </span>
          <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs leading-tight">
            {formatDate(reservation.fecha_entrada)}
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-2.5 text-center">
          <span className="text-gray-400 text-xs flex items-center justify-center gap-1 mb-1">
            <Clock size={10} /> Salida
          </span>
          <span className="block font-semibold text-gray-800 dark:text-gray-200 text-xs leading-tight">
            {formatDate(reservation.fecha_salida)}
          </span>
        </div>
        <div className="bg-lime-50 dark:bg-zinc-800 rounded-xl p-2.5 text-center">
          <span className="block text-lime-600 text-xs mb-1">Meses</span>
          <span className="block font-bold text-lime-700 text-xl leading-tight">
            {reservation.meses_pagados}
          </span>
        </div>
      </div>

      {/* Servicios — siempre mostrar la sección */}
      <div className="mx-4 mt-3">
        <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
          <Wrench size={12} /> Servicios incluidos
        </p>
        {tieneServicios ? (
          <div className="flex flex-wrap gap-1.5">
            {servicios.map((s) => (
              <span
                key={s.id_renta_servicio}
                className="bg-lime-100 dark:bg-lime-900/40 text-slate-700 dark:text-lime-300 text-xs font-medium px-2.5 py-1 rounded-lg"
              >
                {s.nombre}
                {Number(s.precio) > 0 && (
                  <span className="ml-1 text-slate-500 dark:text-lime-400/70">
                    {formatCurrency(s.precio)}
                  </span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">
            Esta reservación no incluye servicios adicionales
          </p>
        )}
      </div>

      {/* Totales */}
      <div className="mx-4 mt-4 flex-1">
        <div className="border-t border-dashed border-gray-200 dark:border-zinc-700 pt-3 space-y-0">
          <DetailRow
            label="Subtotal alojamiento"
            value={
              totales?.subtotal_alojamiento && Number(totales.subtotal_alojamiento) > 0
                ? formatCurrency(totales.subtotal_alojamiento)
                : "No incluido"
            }
          />
          {/* Solo mostrar fila de servicios si tiene servicios con monto */}
          {hayMontoServicios ? (
            <DetailRow
              label="Total servicios"
              value={formatCurrency(totalServicios)}
            />
          ) : (
            <DetailRow
              label="Total servicios"
              value="No incluido"
            />
          )}
          <DetailRow
            label="Precio mensual"
            value={`${formatCurrency(reservation.precio_mensual)}/mes`}
          />
        </div>

        <div className="flex items-center justify-between bg-gradient-to-r from-lime-600 to-lime-700 text-white rounded-xl px-4 py-3 mt-3">
          <span className="font-bold text-sm tracking-wide">TOTAL A PAGAR</span>
          <span className="font-extrabold text-xl">
            {formatCurrency(totales?.monto_total)}
          </span>
        </div>
      </div>

      {/* Error de pago */}
      {payError && (
        <div className="mx-4 mt-3">
          <Alert
            type="error"
            title={payError}
            showIcon
            className="rounded-xl text-sm"
          />
        </div>
      )}

      {/* ─── Acciones por estado ─── */}
      <div className="px-4 pb-4 pt-3 mt-auto">
        {reservation.estado === "PENDIENTE" && (
          <div className="flex gap-2">
            <button
              onClick={() => setStripeModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white! text-sm font-bold py-2.5 rounded-xl transition-colors"
            >
              <CreditCard size={15} />
              Pagar
            </button>
            <button
              disabled
              className="flex items-center justify-center gap-2 border border-red-200 text-red-400 cursor-not-allowed text-sm font-medium px-3 py-2.5 rounded-xl"
              title="Función próximamente"
            >
              <XCircle size={15} />
              Cancelar
            </button>
          </div>
        )}

        {/* ACTIVA: solo Descargar Comprobante */}
        {reservation.estado === "ACTIVA" && (
          <button className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-zinc-700 hover:border-lime-500 hover:text-lime-600! text-gray-600 dark:text-gray-400 text-sm font-medium py-2.5 rounded-xl transition-colors">
            <Printer size={15} />
            Descargar comprobante
          </button>
        )}

        {/* FINALIZADA: solo Descargar comprobante */}
        {reservation.estado === "FINALIZADA" && (
          <button className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-zinc-700 hover:border-lime-500 hover:text-lime-600 text-gray-600 dark:text-gray-400 text-sm font-medium py-2.5 rounded-xl transition-colors">
            <Download size={15} />
            Descargar comprobante
          </button>
        )}

        {/* CANCELADA: sin botón */}
        {reservation.estado === "CANCELADA" && (
          <div className="flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900/20 text-red-400 text-xs font-medium py-2.5 rounded-xl">
            <Ban size={13} />
            Reservación cancelada
          </div>
        )}
      </div>

      {/* Modal Stripe */}
      <StripePaymentModal
        open={stripeModalOpen}
        onClose={() => setStripeModalOpen(false)}
        reservation={reservation}
        onPaySuccess={(r) => {
          setStripeModalOpen(false);
          onPaySuccess(r);
        }}
      />
    </div>
  );
}

function TabContent({ estado, onPaySuccess }) {
  const { data, loading, error } = useApi(`/renta?estado=${estado}`, {}, true);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-lime-200 border-t-lime-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Error al cargar las reservaciones"
        description={error}
        showIcon
        className="rounded-xl"
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
        <House size={40} className="text-gray-300" />
        <p className="text-sm">
          No tienes reservaciones{" "}
          {STATUS_CONFIG[estado]?.label.toLowerCase()}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {data.map((r) => (
        <ReservationCard
          key={r.id_renta}
          reservation={r}
          onPaySuccess={onPaySuccess}
        />
      ))}
    </div>
  );
}

export default function ReservationStudent_Screen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [paidReservation, setPaidReservation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCloseModal = () => {
    setModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const handlePaySuccess = (reservation) => {
    setPaidReservation(reservation);
    setModalOpen(true);
  };

  const tabItems = [
    {
      key: "PENDIENTE",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <Clock4 size={13} />
          Pendientes
        </span>
      ),
      children: (
        <TabContent
          key={`PENDIENTE-${refreshKey}`}
          estado="PENDIENTE"
          onPaySuccess={handlePaySuccess}
        />
      ),
    },
    {
      key: "ACTIVA",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle size={13} />
          Aprobados
        </span>
      ),
      children: (
        <TabContent
          key={`ACTIVA-${refreshKey}`}
          estado="ACTIVA"
          onPaySuccess={handlePaySuccess}
        />
      ),
    },
    {
      key: "FINALIZADA",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <Download size={13} />
          Finalizadas
        </span>
      ),
      children: (
        <TabContent
          key={`FINALIZADA-${refreshKey}`}
          estado="FINALIZADA"
          onPaySuccess={handlePaySuccess}
        />
      ),
    },
    {
      key: "CANCELADA",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <Ban size={13} />
          Canceladas
        </span>
      ),
      children: (
        <TabContent
          key={`CANCELADA-${refreshKey}`}
          estado="CANCELADA"
          onPaySuccess={handlePaySuccess}
        />
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Mis reservaciones
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Consulta y gestiona todas tus reservaciones
        </p>
      </div>

      <Tabs defaultActiveKey="PENDIENTE" items={tabItems} />

      <PaymentSuccessModal
        open={modalOpen}
        onClose={handleCloseModal}
        reservation={paidReservation}
      />
    </div>
  );
}