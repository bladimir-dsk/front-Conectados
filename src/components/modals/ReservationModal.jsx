import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, FileWarning, BedDouble, Layers,
  CheckCircle2, ImageOff, CalendarDays, Clock,
} from "lucide-react";
import { Spin, Alert, Empty, Select, DatePicker, ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import ServiceIconRenderer from "../icon/Serviceiconrenderer";

dayjs.locale("es");

const ESTATUS_OCULTO = ["INACTIVO", "PENDIENTE"];
const ESTATUS_DISABLED = ["OCUPADO", "MANTENIMIENTO"];

function StepDot({ step, current, label }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-1 min-w-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
        ${done || active ? "bg-lime-600 text-white" : "bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-zinc-500"}
        ${active ? "ring-4 ring-lime-100 dark:ring-lime-900/40" : ""}`}
      >
        {done ? <CheckCircle2 size={15} /> : step}
      </div>
      <span className={`text-xs font-medium whitespace-nowrap ${done || active ? "text-lime-600 dark:text-lime-400" : "text-gray-400 dark:text-zinc-500"}`}>
        {label}
      </span>
    </div>
  );
}

function StepLine({ done }) {
  return (
    <div className="flex-1 h-0.5 mx-1 mb-5 rounded-full" style={{ background: done ? "#16a34a" : "#e5e7eb" }} />
  );
}

const STEPS = [{ label: "Documentos" }, { label: "Detalles" }, { label: "Servicios" }, { label: "Resumen" }];

function StepDocuments({ hasDocuments }) {
  return (
    <div className="flex flex-col items-center text-center py-8 gap-4">
      {hasDocuments ? (
        <>
          <div className="w-16 h-16 rounded-full bg-lime-50 dark:bg-lime-900/20 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-lime-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Documentos verificados</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Tus documentos están aprobados. Puedes continuar con la reservación.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <FileWarning size={32} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Documentos requeridos</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Necesitas tener tus documentos aprobados para poder hacer una reservación.
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-lg px-4 py-3 text-sm max-w-xs">
            Dirígete a tu perfil y sube los documentos requeridos para continuar.
          </div>
        </>
      )}
    </div>
  );
}

function StepRentType({
  room, rentType, onRentTypeChange,
  selectedCuarto, onSelectedCuartoChange,
  selectedCama, onSelectedCamaChange,
  rentPeriod, onRentPeriodChange,
  fechaEntrada, onFechaEntradaChange,
}) {
  const isAlojamientoCompleto = room?.typeIncome === "ALOJAMIENTO_COMPLETO";

  useEffect(() => {
    if (isAlojamientoCompleto) {
      onRentTypeChange("ALOJAMIENTO_COMPLETO");
    } else {
      onRentTypeChange("ESPACIO");
    }
  }, [room?.typeIncome]);

  const cuartosVisibles = (room?.cuartos ?? []).filter(
    (c) => !ESTATUS_OCULTO.includes(c.estatus)
  );

  const camasDelCuarto = selectedCuarto
    ? (cuartosVisibles.find((c) => c.id_cuarto === selectedCuarto)?.camas ?? [])
      .filter((b) => !ESTATUS_OCULTO.includes(b.estatus))
    : [];

  const StatusBadge = ({ estatus }) => {
    if (estatus === "OCUPADO") return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 shrink-0">
        Ocupado
      </span>
    );
    if (estatus === "MANTENIMIENTO") return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 shrink-0">
        Mantenimiento
      </span>
    );
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 shrink-0">
        Disponible
      </span>
    );
  };

  return (
    <ConfigProvider locale={esES}>
      <div className="space-y-5">

        {/* Tipo de renta — solo muestra el botón correspondiente */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Tipo de renta
          </p>

          {isAlojamientoCompleto ? (
            // Solo opción: Alojamiento completo
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400">
              <Layers size={17} className="text-lime-600" />
              <span className="text-sm font-medium">Alojamiento completo</span>
            </div>
          ) : (
            // Solo opción: Por espacio
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400">
              <BedDouble size={17} className="text-lime-600" />
              <span className="text-sm font-medium">Por espacio</span>
            </div>
          )}
        </div>

        {/* Lista de cuartos (solo si ESPACIO) */}
        {!isAlojamientoCompleto && (
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Selecciona un cuarto
            </p>
            {cuartosVisibles.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No hay cuartos disponibles" />
            ) : (
              <div className="flex flex-col gap-3 max-h-44 overflow-y-auto pr-1">
                {cuartosVisibles.map((cuarto) => {
                  const disabled = ESTATUS_DISABLED.includes(cuarto.estatus);
                  const selected = selectedCuarto === cuarto.id_cuarto;
                  return (
                    <button
                      key={cuarto.id_cuarto}
                      disabled={disabled}
                      onClick={() => {
                        if (!disabled) {
                          onSelectedCuartoChange(selected ? null : cuarto.id_cuarto);
                          onSelectedCamaChange(null);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border-2 text-left transition-colors
                        ${disabled
                          ? "border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 cursor-not-allowed opacity-60"
                          : selected
                            ? "border-lime-500 bg-lime-50 dark:bg-lime-900/20"
                            : "border-gray-200 dark:border-zinc-700 hover:border-gray-300"}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <BedDouble size={14} className={selected && !disabled ? "text-lime-600" : "text-gray-400"} />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{cuarto.name}</span>
                        {cuarto.price > 0 && (
                          <span className="text-xs text-gray-400 shrink-0">· ${Number(cuarto.price).toLocaleString()}/mes</span>
                        )}
                      </div>
                      <StatusBadge estatus={cuarto.estatus} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Lista de camas (solo si hay cuarto seleccionado y tiene camas) */}
        {!isAlojamientoCompleto && selectedCuarto && camasDelCuarto.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Cama <span className="normal-case font-normal text-gray-400">(opcional)</span>
            </p>
            <div className="flex flex-col gap-3 max-h-36 overflow-y-auto pr-1">
              {camasDelCuarto.map((cama) => {
                const disabled = ESTATUS_DISABLED.includes(cama.estatus);
                const selected = selectedCama === cama.id_cama;
                return (
                  <button
                    key={cama.id_cama}
                    disabled={disabled}
                    onClick={() => {
                      if (!disabled) onSelectedCamaChange(selected ? null : cama.id_cama);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 text-left transition-colors
                      ${disabled
                        ? "border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 cursor-not-allowed opacity-60"
                        : selected
                          ? "border-lime-500 bg-lime-50 dark:bg-lime-900/20"
                          : "border-gray-200 dark:border-zinc-700 hover:border-gray-300"}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <BedDouble size={13} className={selected && !disabled ? "text-lime-600" : "text-gray-400"} />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{cama.name}</span>
                      {cama.price > 0 && (
                        <span className="text-xs text-gray-400 shrink-0">· ${Number(cama.price).toLocaleString()}/mes</span>
                      )}
                    </div>
                    <StatusBadge estatus={cama.estatus} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Periodo y fecha */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Clock size={11} /> Meses a pagar
            </p>
            <Select
              size="large"
              value={rentPeriod}
              onChange={onRentPeriodChange}
              className="w-full"
              options={Array.from({ length: 12 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1} ${i + 1 === 1 ? "mes" : "meses"}`,
              }))}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <CalendarDays size={11} /> Fecha de entrada
            </p>
            <DatePicker
              size="large"
              className="w-full"
              value={fechaEntrada}
              onChange={onFechaEntradaChange}
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              format="DD/MM/YYYY"
              placeholder="Seleccionar"
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

function StepServices({ room, selectedServices, onSelectedServicesChange }) {
  const services = room?.services ?? [];

  const toggle = (id) => {
    onSelectedServicesChange((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span className="text-gray-400 dark:text-zinc-500 text-sm">No hay servicios disponibles</span>}
        />
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        Servicios adicionales
      </p>
      <div className="flex flex-col gap-3">
        {services.map((s) => {
          const checked = selectedServices.includes(s.id);
          const esGratis = Number(s.costo) === 0;
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors
                ${checked
                  ? "border-lime-500 bg-lime-50 dark:bg-lime-900/20"
                  : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                  ${checked ? "border-lime-500 bg-lime-500" : "border-gray-300 dark:border-zinc-600"}`}>
                  {checked && <CheckCircle2 size={12} className="text-white" />}
                </div>
                {s.icon && <ServiceIconRenderer iconKey={s.icon} size={18} />}
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-left">{s.name}</span>
              </div>
              {esGratis ? (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 shrink-0">
                  Gratuito
                </span>
              ) : (
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 shrink-0">
                  +${Number(s.costo).toLocaleString("es-MX")}
                  <span className="text-xs font-normal text-gray-400">/mes</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepSummary({ room, rentType, selectedCuarto, selectedCama, rentPeriod, fechaEntrada, selectedServices }) {
  const services = (room?.services ?? []).filter((s) => selectedServices.includes(s.id));

  const getBasePrice = () => {
    if (rentType === "ALOJAMIENTO_COMPLETO") return Number(room?.price ?? 0);
    if (selectedCama) {
      const cama = (room?.cuartos ?? []).flatMap((c) => c.camas ?? []).find((b) => b.id_cama === selectedCama);
      return Number(cama?.price ?? 0);
    }
    if (selectedCuarto) {
      const cuarto = (room?.cuartos ?? []).find((c) => c.id_cuarto === selectedCuarto);
      return Number(cuarto?.price ?? 0);
    }
    return Number(room?.price ?? 0);
  };

  const getSelectionLabel = () => {
    if (rentType === "ALOJAMIENTO_COMPLETO") return "Alojamiento completo";
    if (selectedCama) {
      const cama = (room?.cuartos ?? []).flatMap((c) => c.camas ?? []).find((b) => b.id_cama === selectedCama);
      return `Cama: ${cama?.name ?? "—"}`;
    }
    if (selectedCuarto) {
      const cuarto = (room?.cuartos ?? []).find((c) => c.id_cuarto === selectedCuarto);
      return `Cuarto: ${cuarto?.name ?? "—"}`;
    }
    return "—";
  };

  const basePrice = getBasePrice();
  const servicesCost = services.reduce((sum, s) => sum + Number(s.costo ?? 0), 0);
  const totalMensual = basePrice + servicesCost;
  const totalPeriodo = totalMensual * rentPeriod;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Resumen de reservación
      </p>

      {/* Info alojamiento */}
      <div className="flex gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
        <div className="w-16 h-14 rounded-lg overflow-hidden bg-gray-200 dark:bg-zinc-700 shrink-0">
          {room?.mainImage ? (
            <img src={room.mainImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff size={16} className="text-gray-400" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">{room?.name}</span>
          <span className="text-xs text-gray-400 mt-0.5 truncate">{room?.address}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getSelectionLabel()}</span>
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
          <span className="text-xs text-gray-400 mb-1 flex items-center gap-1"><CalendarDays size={11} /> Fecha de entrada</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {fechaEntrada ? dayjs(fechaEntrada).format("DD [de] MMM, YYYY") : "—"}
          </span>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
          <span className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock size={11} /> Duración</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {rentPeriod} {rentPeriod === 1 ? "mes" : "meses"}
          </span>
        </div>
      </div>

      {/* Desglose precios */}
      <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Renta base</span>
          <span>${basePrice.toLocaleString("es-MX")}/mes</span>
        </div>
        {services.map((s) => (
          <div key={s.id} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              {s.icon && <ServiceIconRenderer iconKey={s.icon} size={14} />}
              {s.name}
            </span>
            {Number(s.costo) === 0 ? (
              <span className="text-green-600 dark:text-green-400 text-xs font-semibold">Gratuito</span>
            ) : (
              <span>+${Number(s.costo).toLocaleString("es-MX")}/mes</span>
            )}
          </div>
        ))}
        <div className="border-t border-gray-200 dark:border-zinc-700 pt-2 space-y-1">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Total mensual</span>
            <span className="font-semibold">${totalMensual.toLocaleString("es-MX")} MXN</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white">
            <span>Total {rentPeriod} {rentPeriod === 1 ? "mes" : "meses"}</span>
            <span className="text-lime-600 dark:text-lime-400">${totalPeriodo.toLocaleString("es-MX")} MXN</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ open, onGoToReservas }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-[60]" />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-lime-50 dark:bg-lime-900/20 flex items-center justify-center mb-4">
            <CheckCircle2 size={36} className="text-lime-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Reservación enviada!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Tu solicitud fue registrada correctamente. Serás redirigido a{" "}
            <strong className="text-gray-700 dark:text-gray-300">Mis reservas</strong> para ver su estado.
          </p>
          <button
            onClick={onGoToReservas}
            className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Ir a Mis reservas
          </button>
        </div>
      </div>
    </>
  );
}

const ReservationModal = ({ open, onClose, room, hasDocuments }) => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { postData: createRenta, loading, error: apiError } = useApi("/renta", {}, false);

  const [step, setStep] = useState(1);
  const [rentType, setRentType] = useState("ALOJAMIENTO_COMPLETO");
  const [selectedCuarto, setSelectedCuarto] = useState(null);
  const [selectedCama, setSelectedCama] = useState(null);
  const [rentPeriod, setRentPeriod] = useState(1);
  const [fechaEntrada, setFechaEntrada] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset al abrir
  useEffect(() => {
    if (open) {
      setStep(1);
      setRentType("ALOJAMIENTO_COMPLETO");
      setSelectedCuarto(null);
      setSelectedCama(null);
      setRentPeriod(1);
      setFechaEntrada(null);
      setSelectedServices([]);
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape" && !success) onClose(); };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, success]);

  if (!open) return null;

  const canGoNext = () => {
    if (step === 1) return hasDocuments;
    if (step === 2) {
      if (!fechaEntrada || !rentPeriod) return false;
      if (rentType === "ESPACIO" && !selectedCuarto) return false;
      return true;
    }
    return true;
  };

  const handleConfirm = async () => {
    setError(null);
    try {
      const userId = Number(user?.id);

      const payload = {
        tipo_renta: rentType,
        fecha_entrada: dayjs(fechaEntrada).format("YYYY-MM-DD"),
        meses_a_pagar: rentPeriod,
        id_usuario: userId,
        serviciosSeleccionados: selectedServices,
      };

      if (rentType === "ALOJAMIENTO_COMPLETO") {
        payload.id_alojamiento = room?.id;
      } else if (selectedCama) {
        payload.tipo_renta = "CAMA";
        payload.id_cama = selectedCama;
      } else if (selectedCuarto) {
        payload.tipo_renta = "CUARTO";
        payload.id_cuarto = selectedCuarto;
      }

      await createRenta(payload, false);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? "Error al procesar la reservación");
    }
  };

  const handleNext = () => {
    if (step < STEPS.length) setStep((s) => s + 1);
    else handleConfirm();
  };

  const ok = canGoNext();

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50" onClick={() => !loading && onClose()} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-zinc-700 shrink-0">
            <div>
              <span className="text-xl font-medium text-gray-900 dark:text-white">Reservar alojamiento</span>
              {room?.name && (
                <h1 className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-xs">{room.name}</h1>
              )}
            </div>
            <button onClick={() => !loading && onClose()} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <X size={22} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center px-6 pt-4 pb-2 shrink-0">
            {STEPS.map((s, i) => (
              <div key={i} className="contents">
                <StepDot step={i + 1} current={step} label={s.label} />
                {i < STEPS.length - 1 && <StepLine done={step > i + 1} />}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <Spin size="large" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Procesando reservación...</p>
              </div>
            ) : (
              <>
                {(error || apiError) && (
                  <Alert
                    message={error || apiError}
                    type="error"
                    showIcon
                    className="mb-4"
                    closable
                    onClose={() => setError(null)}
                  />
                )}
                {step === 1 && <StepDocuments hasDocuments={hasDocuments} />}
                {step === 2 && (
                  <StepRentType
                    room={room}
                    rentType={rentType} onRentTypeChange={setRentType}
                    selectedCuarto={selectedCuarto} onSelectedCuartoChange={setSelectedCuarto}
                    selectedCama={selectedCama} onSelectedCamaChange={setSelectedCama}
                    rentPeriod={rentPeriod} onRentPeriodChange={setRentPeriod}
                    fechaEntrada={fechaEntrada} onFechaEntradaChange={setFechaEntrada}
                  />
                )}
                {step === 3 && (
                  <StepServices
                    room={room}
                    selectedServices={selectedServices}
                    onSelectedServicesChange={setSelectedServices}
                  />
                )}
                {step === 4 && (
                  <StepSummary
                    room={room}
                    rentType={rentType}
                    selectedCuarto={selectedCuarto}
                    selectedCama={selectedCama}
                    rentPeriod={rentPeriod}
                    fechaEntrada={fechaEntrada}
                    selectedServices={selectedServices}
                  />
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-200 dark:border-zinc-700 shrink-0 bg-gray-50 dark:bg-zinc-800/50">
            <button
              disabled={loading}
              onClick={step === 1 ? onClose : () => setStep((s) => s - 1)}
              className="px-5 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50">
              {step === 1 ? "Cancelar" : "Atrás"}
            </button>
            <button
              onClick={handleNext}
              disabled={!ok || loading}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors
                ${ok && !loading
                  ? "bg-lime-600 hover:bg-lime-700 active:bg-lime-800 text-white"
                  : "bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-zinc-500 cursor-not-allowed"}`}>
              {loading ? "Procesando..." : step === STEPS.length ? "Confirmar reservación" : "Continuar"}
            </button>
          </div>
        </div>
      </div>

      <SuccessModal open={success} onGoToReservas={() => { setSuccess(false); onClose(); navigate("/estudiante/reservas"); }} />
    </>
  );
};

export default ReservationModal;