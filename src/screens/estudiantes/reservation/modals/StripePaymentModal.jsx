// components/modals/StripePaymentModal.jsx
import { useState, useEffect } from "react";
import { X, CreditCard, Lock } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../../../../api/axiosConfig";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ─── Formulario interno (necesita estar dentro de <Elements>) ───
function CheckoutForm({ clientSecret, onSuccess, onCancel, monto }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(amount) || 0);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <div className="space-y-5">
      {/* Monto */}
      <div className="bg-lime-50 border border-lime-200 rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-lime-700 font-semibold">
          Total a pagar
        </span>
        <span className="text-xl font-extrabold text-lime-700">
          {formatCurrency(monto)}
        </span>
      </div>

      {/* Campo de tarjeta */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Datos de tarjeta
        </label>
        <div className="border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus-within:border-lime-500 transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "15px",
                  color: "#1f2937",
                  fontFamily: "inherit",
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { color: "#ef4444" },
              },
              hidePostalCode: true,
            }}
          />
        </div>
        <p className="flex items-center gap-1 text-xs text-gray-400 mt-2">
          <Lock size={11} /> Pago seguro procesado por Stripe
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 border border-gray-200 hover:border-gray-300 text-gray-500 text-sm font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !stripe}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <CreditCard size={15} />
          )}
          {loading ? "Procesando..." : "Confirmar pago"}
        </button>
      </div>
    </div>
  );
}

// ─── Modal wrapper ───
export default function StripePaymentModal({
  open,
  onClose,
  reservation,
  onPaySuccess,
}) {
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingSecret, setLoadingSecret] = useState(false);
  const [secretError, setSecretError] = useState(null);

  // Pedir el clientSecret al backend al abrir el modal
  useEffect(() => {
    if (!open || !reservation) return;

    setClientSecret(null);
    setSecretError(null);
    setLoadingSecret(true);

    api
      .post(`/renta/${reservation.id_renta}/iniciar-pago`)
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch(() =>
        setSecretError("No se pudo iniciar el pago. Intenta de nuevo."),
      )
      .finally(() => setLoadingSecret(false));
  }, [open, reservation]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" />
            <span className="font-bold text-gray-800 dark:text-white">
              Pago con tarjeta
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Info reservación */}
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-3 mb-5">
            <p className="text-xs text-gray-400">
              Reservación #{reservation?.id_renta}
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">
              {reservation?.ubicacion?.cuarto?.nombre ||
                reservation?.ubicacion?.alojamiento?.nombre ||
                "Alojamiento"}
            </p>
          </div>

          {/* Estados del formulario */}
          {loadingSecret && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-lime-200 border-t-lime-600 rounded-full animate-spin" />
            </div>
          )}

          {secretError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {secretError}
            </div>
          )}

          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                monto={reservation?.totales?.monto_total}
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
    </div>
  );
}
