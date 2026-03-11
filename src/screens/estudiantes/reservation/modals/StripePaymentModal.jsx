import { useState, useEffect } from "react";
import { X, CreditCard, Lock, Calendar, MapPin, Building2, BedDouble, House, Clock } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../../../../api/axiosConfig";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
};

const TIPO_CONFIG = {
  ALOJAMIENTO_COMPLETO: { label: "Alojamiento Completo", icon: <Building2 size={12} />, bg: "bg-violet-100", text: "text-violet-700" },
  CUARTO: { label: "Cuarto", icon: <BedDouble size={12} />, bg: "bg-sky-100", text: "text-sky-700" },
  CAMA: { label: "Cama", icon: <House size={12} />, bg: "bg-orange-100", text: "text-orange-700" },
};

function TipoBadge({ tipo }) {
  const t = TIPO_CONFIG[tipo];
  if (!t) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${t.bg} ${t.text}`}>
      {t.icon}{t.label}
    </span>
  );
}

function CheckoutForm({ clientSecret, onSuccess, onCancel, reservation }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isDark = document.documentElement.classList.contains("dark");

  const monto = reservation?.totales?.monto_total;
  const alojamiento = reservation?.ubicacion?.alojamiento;
  const cuarto = reservation?.ubicacion?.cuarto;
  const nombreLugar = cuarto?.nombre || alojamiento?.nombre || "Alojamiento";
  const servicios = reservation?.servicios || [];
  const hayServicios = servicios.length > 0 && Number(reservation?.totales?.total_servicios) > 0;

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: elements.getElement(CardElement) } }
    );

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }
    if (paymentIntent.status === "succeeded") onSuccess();
  };

  return (
    <>
      {/* ── Body scrollable ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* Resumen de reservación */}
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <House size={16} className="text-lime-500 shrink-0" />
              <span className="font-bold text-gray-900 dark:text-white text-sm truncate">
                {nombreLugar}
              </span>
            </div>
            <TipoBadge tipo={reservation?.tipo_renta} />
          </div>

          {alojamiento && (
            <p className="flex items-center gap-1.5 text-xs text-gray-400">
              <MapPin size={11} className="shrink-0" />
              {alojamiento.nombre}{alojamiento.direccion ? ` · ${alojamiento.direccion}` : ""}
            </p>
          )}

          {/* Fechas */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-white dark:bg-zinc-700 rounded-lg p-2 text-center">
              <span className="flex items-center justify-center gap-1 text-gray-400 text-[10px] mb-1">
                <Calendar size={9} /> Entrada
              </span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {formatDate(reservation?.fecha_entrada)}
              </span>
            </div>
            <div className="bg-white dark:bg-zinc-700 rounded-lg p-2 text-center">
              <span className="flex items-center justify-center gap-1 text-gray-400 text-[10px] mb-1">
                <Clock size={9} /> Salida
              </span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {formatDate(reservation?.fecha_salida)}
              </span>
            </div>
            <div className="bg-lime-50 dark:bg-zinc-700 rounded-lg p-2 text-center">
              <span className="block text-lime-600 text-[10px] mb-1">Meses</span>
              <span className="block font-bold text-lime-700 text-lg leading-tight">
                {reservation?.meses_pagados}
              </span>
            </div>
          </div>
        </div>

        {/* Desglose de monto */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal alojamiento</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {formatCurrency(reservation?.totales?.subtotal_alojamiento)}
            </span>
          </div>
          {hayServicios && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total servicios</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {formatCurrency(reservation?.totales?.total_servicios)}
              </span>
            </div>
          )}
          <div className="border-t border-dashed border-gray-200 dark:border-zinc-700 pt-2 mt-1">
            <div className="flex items-center justify-between bg-linear-to-r from-lime-600 to-lime-700 text-white rounded-xl px-4 py-3">
              <span className="font-bold text-sm tracking-wide">TOTAL A PAGAR</span>
              <span className="font-extrabold text-xl">{formatCurrency(monto)}</span>
            </div>
          </div>
        </div>

        {/* Campo de tarjeta */}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Datos de tarjeta
          </label>
          <div className="border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-zinc-800 focus-within:border-lime-500 transition-colors">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "15px",
                    color: isDark ? "#f9fafb" : "#1f2937",
                    fontFamily: "inherit",
                    "::placeholder": { color: "#9ca3af" },
                  },
                  invalid: { color: "#ef4444" },
                },
                hidePostalCode: true,
              }}
            />
          </div>
          <div className="flex justify-center mt-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
            </span>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}
      </div>

      {/* ── Footer fijo ── */}
      <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 border border-gray-200 dark:border-zinc-600 hover:border-red-500 text-gray-500 hover:text-red-500! text-sm font-medium py-3 rounded-xl transition-colors disabled:opacity-50">
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !stripe}
          className="flex-1 flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-600 active:bg-lime-700 text-white text-sm font-bold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <CreditCard size={15} />
          )}
          {loading ? "Procesando..." : "Confirmar pago"}
        </button>
      </div>
    </>
  );
}

export default function StripePaymentModal({ open, onClose, reservation, onPaySuccess }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingSecret, setLoadingSecret] = useState(false);
  const [secretError, setSecretError] = useState(null);

  useEffect(() => {
    if (!open || !reservation) return;
    setClientSecret(null);
    setSecretError(null);
    setLoadingSecret(true);

    api
      .post(`/renta/${reservation.id_renta}/iniciar-pago`)
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch(() => setSecretError("No se pudo iniciar el pago. Intenta de nuevo."))
      .finally(() => setLoadingSecret(false));
  }, [open, reservation]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header fijo ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-700 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <CreditCard size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                  Pago con tarjeta
                </span>
                <span className="text-xs text-gray-400">
                  Reservación #{reservation?.id_renta}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          </div>

          {loadingSecret && (
            <div className="flex-1 flex justify-center items-center py-16">
              <div className="w-9 h-9 border-4 border-lime-200 border-t-lime-600 rounded-full animate-spin" />
            </div>
          )}

          {secretError && (
            <div className="flex-1 flex items-center px-6 py-8">
              <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-4 text-center">
                {secretError}
              </div>
            </div>
          )}

          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                monto={reservation?.totales?.monto_total}
                reservation={reservation}
                onSuccess={() => {
                  onClose();
                  onPaySuccess(reservation);
                }}
                onCancel={onClose}
              />
            </Elements>
          )}
        </div>
      </div>
    </>
  );
}