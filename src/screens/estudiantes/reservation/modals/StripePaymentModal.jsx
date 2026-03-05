import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { X, CreditCard, Lock } from "lucide-react";

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
    }).format(Number(amount) || 0);

function ModalBody({ pago, error }) {
    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Resumen del pago */}
            <div className="bg-gray-200 dark:bg-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400">
                        {pago.renta?.ubicacion?.alojamiento?.nombre || "Reservación"}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        #{pago.id_pago} · Reservación #{pago.renta?.id_renta}
                    </p>
                </div>
                <span className="text-xl font-extrabold text-lime-600 dark:text-lime-400">
                    {formatCurrency(pago.monto)}
                </span>
            </div>

            {/* Stripe PaymentElement */}
            <div>
                <PaymentElement options={{ layout: "tabs" }} />
            </div>

            {/* Error message
            {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                    {error}
                </p>
            )} */}

            {/* Seguridad */}
            <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <Lock size={11} /> Pago seguro procesado por Stripe
            </p>
        </div>
    );
}

function StripeModalContent({ pago, onSuccess, onClose }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (!stripe || !elements) return;
        setLoading(true);
        setError(null);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message);
            setLoading(false);
            return;
        }

        const { error: confirmError, paymentIntent } =
            await stripe.confirmPayment({
                elements,
                confirmParams: { return_url: window.location.href },
                redirect: "if_required",
            });

        if (confirmError) {
            setError(confirmError.message);
            setLoading(false);
            return;
        }

        if (
            paymentIntent.status === "succeeded" ||
            paymentIntent.status === "requires_capture"
        ) {
            onSuccess(pago);
        } else {
            setError(`Estado inesperado: ${paymentIntent.status}`);
        }

        setLoading(false);
    };

    return (
        <>
            {/* Body scrollable */}
            <ModalBody pago={pago} error={error} />

            {/* Footer fijo */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-zinc-700">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg border border-gray-200 dark:border-zinc-600 hover:border-red-500 hover:text-red-500! text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors disabled:opacity-50">
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !stripe || !elements}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-lime-500 hover:bg-lime-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors">
                    {loading ? (
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                        <CreditCard size={15} />
                    )}
                    {loading ? "Procesando..." : "Proceder pago"}
                </button>
            </div>
        </>
    );
}

function useIsDarkMode() {
    const [isDark, setIsDark] = useState(
        () => document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    return isDark;
}

export default function StripePaymentModal({ open, onClose, pago, onSuccess }) {
    const overlayRef = useRef(null);
    const isDark = useIsDarkMode();

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open || !pago) return null;

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    const elementsOptions = {
        clientSecret: pago.stripeClientSecret,
        appearance: isDark
            ? {
                  // ── Tema oscuro ──────────────────────────────────────────
                  theme: "night",
                  variables: {
                      colorPrimary: "#7ccf00",
                      colorBackground: "#27272a",   // zinc-800
                      colorSurface: "#3f3f46",      // zinc-700
                      colorText: "#f4f4f5",          // zinc-100
                      colorTextSecondary: "#a1a1aa", // zinc-400
                      colorTextPlaceholder: "#71717a", // zinc-500
                      colorIcon: "#a1a1aa",
                      colorIconHover: "#f4f4f5",
                      colorDanger: "#f87171",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      spacingUnit: "4px",
                  },
                  rules: {
                      ".Input": {
                          backgroundColor: "#3f3f46",
                          border: "1px solid #52525b",
                          color: "#f4f4f5",
                      },
                      ".Input:focus": {
                          border: "1px solid #7ccf00",
                          boxShadow: "0 0 0 2px rgba(22,163,74,0.25)",
                      },
                      ".Input::placeholder": {
                          color: "#71717a",
                      },
                      ".Label": {
                          color: "#a1a1aa",
                      },
                      ".Tab": {
                          backgroundColor: "#3f3f46",
                          border: "1px solid #52525b",
                          color: "#a1a1aa",
                      },
                      ".Tab:hover": {
                          backgroundColor: "#52525b",
                          color: "#f4f4f5",
                      },
                      ".Tab--selected": {
                          backgroundColor: "#27272a",
                          border: "1px solid #7ccf00",
                          color: "#f4f4f5",
                      },
                      ".TabIcon--selected": {
                          fill: "#7ccf00",
                      },
                      ".TabLabel--selected": {
                          color: "#f4f4f5",
                      },
                      ".Block": {
                          backgroundColor: "#3f3f46",
                          border: "1px solid #52525b",
                      },
                      ".CheckboxInput": {
                          backgroundColor: "#3f3f46",
                          border: "1px solid #52525b",
                      },
                      ".CheckboxInput--checked": {
                          backgroundColor: "#7ccf00",
                          border: "1px solid #7ccf00",
                      },
                  },
              }
            : {
                  theme: "stripe",
                  variables: {
                      colorPrimary: "#7ccf00",
                      colorBackground: "#ffffff",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                  },
              },
    };

    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                onClick={handleOverlayClick}
                className="fixed inset-0 bg-black/90 z-50 transition-opacity"
            />

            {/* Contenedor centrado */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}>
                    {/* Header fijo */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-lime-200 dark:bg-lime-900/30 flex items-center justify-center">
                                <CreditCard size={18} className="text-lime-600 dark:text-lime-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-semibold text-gray-900 dark:text-gray-50 leading-tight">
                                    Confirmar pago
                                </span>
                                <span className="text-xs text-gray-400 mt-0.5">
                                    Ingresa tu método de pago
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose}>
                            <X
                                size={22}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            />
                        </button>
                    </div>

                    {/* Stripe Elements + body scrollable + footer */}
                    <Elements stripe={stripePromise} options={elementsOptions}>
                        <StripeModalContent
                            pago={pago}
                            onSuccess={onSuccess}
                            onClose={onClose}
                        />
                    </Elements>
                </div>
            </div>
        </>
    );
}