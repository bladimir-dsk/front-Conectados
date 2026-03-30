import { Button, Tag } from "antd";
import {
  X,
  MapPin,
  User,
  Calendar,
  CreditCard,
  Home,
  AlertTriangle,
  Phone,
  Mail,
  Hash,
  Banknote,
  Wrench,
  CircleDollarSign,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const RentDetailModal_Owner = ({ visible, onClose, data }) => {
  if (!visible || !data) return null;

  const {
    cliente,
    ubicacion,
    fechas,
    financiero,
    estado_renta,
    tipo_renta,
    id_renta,
  } = data;

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(price || 0));

  const getEstadoRentaColor = (estado) => {
    const map = {
      ACTIVA: "green",
      FINALIZADA: "blue",
      CANCELADA: "red",
      PENDIENTE: "gold",
    };
    return map[estado] || "default";
  };

  const getTipoRentaColor = (tipo) => {
    const map = {
      ALOJAMIENTO_COMPLETO: "purple",
      CUARTO: "cyan",
      CAMA: "geekblue",
      ESPACIO: "magenta",
    };
    return map[tipo] || "default";
  };

  const getTipoRentaLabel = (tipo) => {
    const map = {
      ALOJAMIENTO_COMPLETO: "Alojamiento completo",
      CUARTO: "Cuarto",
      CAMA: "Cama",
      ESPACIO: "Espacio",
    };
    return map[tipo] || tipo;
  };

  const pagoInfo = financiero?.pago_completado || financiero?.pago_pendiente;
  const estadoPago = financiero?.pago_completado
    ? "COMPLETADO"
    : financiero?.pago_pendiente
      ? "PENDIENTE"
      : null;

  const getEstadoPagoColor = (estado) => {
    const map = {
      COMPLETADO: "green",
      PENDIENTE: "gold",
      FALLIDO: "red",
      CANCELADO: "default",
      PROCESANDO: "blue",
    };
    return map[estado] || "default";
  };

  const porcentajeDias = () => {
    if (!fechas?.entrada || !fechas?.salida) return 0;
    const total = dayjs(fechas.salida).diff(dayjs(fechas.entrada), "day");
    const restantes = fechas.dias_restantes || 0;
    const transcurridos = total - restantes;
    return Math.min(
      100,
      Math.max(0, Math.round((transcurridos / total) * 100)),
    );
  };

  const progreso = porcentajeDias();

  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "90vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── HEADER FIJO ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shrink-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Detalle de renta
                </span>
                <span className="font-mono text-sm text-gray-400 dark:text-gray-500">
                  #{id_renta}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <Tag
                  color={getEstadoRentaColor(estado_renta)}
                  style={{ fontSize: 12 }}
                >
                  {estado_renta}
                </Tag>
                <Tag
                  color={getTipoRentaColor(tipo_renta)}
                  style={{ fontSize: 12 }}
                >
                  {getTipoRentaLabel(tipo_renta)}
                </Tag>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* ── BODY CON SCROLL ── */}
          <div className="flex-1 overflow-y-auto">
            {/* Alerta vencimiento */}
            {fechas?.vence_pronto && (
              <div className="mx-5 mt-5 flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl">
                <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  {fechas.texto_estado}
                </span>
              </div>
            )}

            <div className="p-5 space-y-4">
              {/* ─ Grid: Cliente + Ubicación ─ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cliente */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900">
                    <User
                      size={15}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                      Cliente
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                      {cliente?.nombre}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Mail size={13} className="shrink-0" />
                      <span className="text-xs truncate">{cliente?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Phone size={13} className="shrink-0" />
                      <span className="text-xs">{cliente?.phone || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-900">
                    <MapPin
                      size={15}
                      className="text-orange-500 dark:text-orange-400"
                    />
                    <span className="text-xs font-semibold text-orange-600 dark:text-orange-300 uppercase tracking-wide">
                      Ubicación - tipo {ubicacion?.tipo}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                      {ubicacion?.nombre}
                    </p>
                    <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                      <Home size={13} className="shrink-0 mt-0.5" />
                      <span className="text-xs">{ubicacion?.direccion}</span>
                    </div>
                    {ubicacion?.detalle && (
                      <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                        <Hash size={13} className="shrink-0 mt-0.5" />
                        <span className="text-xs">{ubicacion.detalle}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ─ Fechas con barra de progreso ─ */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-900">
                  <Calendar
                    size={15}
                    className="text-purple-600 dark:text-purple-400"
                  />
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                    Fechas del contrato
                  </span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                        Entrada
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {dayjs(fechas?.entrada).format("DD MMM")}
                      </span>
                      <span className="text-xs text-gray-400">
                        {dayjs(fechas?.entrada).format("YYYY")}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                      <span className="text-[10px] text-purple-500 uppercase tracking-wide mb-1">
                        Duración
                      </span>
                      <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                        {fechas?.meses_contratados} mes
                        {fechas?.meses_contratados !== 1 ? "es" : ""}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                        Salida
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {dayjs(fechas?.salida).format("DD MMM")}
                      </span>
                      <span className="text-xs text-gray-400">
                        {dayjs(fechas?.salida).format("YYYY")}
                      </span>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-gray-400">
                        Progreso de la renta
                      </span>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {progreso}% transcurrido
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progreso}%`,
                          background: fechas?.vence_pronto
                            ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                            : "linear-gradient(90deg, #84cc16, #16a34a)",
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[11px] text-gray-400">
                        Registrada el{" "}
                        {dayjs(fechas?.registrada_el).format("DD/MM/YYYY")}
                      </span>
                      {fechas?.dias_restantes != null && (
                        <span
                          className={`text-[11px] font-semibold ${fechas.vence_pronto ? "text-amber-500" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          {fechas.dias_restantes} día(s) restantes
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ─ Financiero ─ */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-lime-50 dark:bg-lime-900/20 border-b border-lime-100 dark:border-lime-900">
                  <CircleDollarSign
                    size={15}
                    className="text-lime-600 dark:text-lime-400"
                  />
                  <span className="text-xs font-semibold text-lime-700 dark:text-lime-300 uppercase tracking-wide">
                    Resumen financiero
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <FinRow
                    label="Precio mensual"
                    value={formatPrice(financiero?.precio_mensual)}
                  />
                  <FinRow
                    label="Subtotal alojamiento"
                    value={formatPrice(financiero?.subtotal_alojamiento)}
                  />

                  {financiero?.servicios_adicionales?.length > 0 && (
                    <div className="pt-1">
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-2 flex items-center gap-1.5">
                        <Wrench size={12} /> Servicios adicionales
                      </p>
                      <div className="space-y-1.5">
                        {financiero.servicios_adicionales.map((srv, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg"
                          >
                            <span className="text-sm text-purple-800 dark:text-purple-300">
                              {srv.nombre}
                            </span>
                            <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                              {srv.precio === 0
                                ? "Incluido"
                                : formatPrice(srv.precio)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {financiero?.total_servicios > 0 && (
                    <FinRow
                      label="Total servicios"
                      value={formatPrice(financiero.total_servicios)}
                    />
                  )}

                  <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-zinc-700 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      Monto total
                    </span>
                    <span className="text-2xl font-extrabold text-lime-600 dark:text-lime-400">
                      {formatPrice(financiero?.monto_total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ─ Pago ─ */}
              {pagoInfo && (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-teal-50 dark:bg-teal-900/20 border-b border-teal-100 dark:border-teal-900">
                    <div className="flex items-center gap-2">
                      <CreditCard
                        size={15}
                        className="text-teal-600 dark:text-teal-400"
                      />
                      <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wide">
                        Información de pago
                      </span>
                    </div>
                    {estadoPago && (
                      <Tag
                        color={getEstadoPagoColor(estadoPago)}
                        style={{ fontSize: 11, margin: 0 }}
                      >
                        {estadoPago}
                      </Tag>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <FinRow label="ID Pago" value={`#${pagoInfo.id_pago}`} />
                    <FinRow
                      label="Monto pagado"
                      value={formatPrice(pagoInfo.monto)}
                    />
                    <FinRow
                      label="Método"
                      value={
                        <span className="capitalize inline-flex items-center gap-1.5">
                          <Banknote size={13} />
                          {pagoInfo.metodo}
                        </span>
                      }
                    />
                    <FinRow
                      label="Fecha de pago"
                      value={dayjs(pagoInfo.fecha_pago).format(
                        "DD [de] MMMM, YYYY — HH:mm",
                      )}
                    />
                    {pagoInfo.transaccion_id && (
                      <div className="pt-1">
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                          ID de transacción
                        </p>
                        <p className="font-mono text-[11px] text-gray-600 dark:text-gray-400 break-all bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-3 py-2 rounded-lg">
                          {pagoInfo.transaccion_id}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── FOOTER FIJO ── */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 shrink-0">
            <Button
              size="large"
              type="primary"
              danger
              onClick={onClose}
              className="px-8 rounded-lg"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const FinRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
      {value || "—"}
    </span>
  </div>
);

export default RentDetailModal_Owner;
