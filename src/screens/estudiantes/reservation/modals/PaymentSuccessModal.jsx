import { useEffect, useRef } from "react";
import { CheckCircle, X, Calendar, Home, Download } from "lucide-react";

export default function PaymentSuccessModal({ open, onClose, reservation }) {
    const overlayRef = useRef(null);

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open) return null;

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4"
            style={{ animation: "fadeIn 0.2s ease" }}
        >
            <div
                className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                style={{ animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
            >
                {/* Cierre */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Header verde */}
                <div className="bg-gradient-to-br from-lime-500 to-lime-600 px-8 pt-10 pb-8 flex flex-col items-center text-white">
                    {/* Icono animado */}
                    <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                                <CheckCircle size={32} className="text-lime-500" strokeWidth={2.5} />
                            </div>
                        </div>
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" style={{ animationDuration: "1.4s" }} />
                    </div>

                    <h2 className="text-2xl font-extrabold tracking-tight">¡Pago exitoso!</h2>
                    <p className="text-lime-100 text-sm mt-1">Tu reservación ha sido confirmada</p>
                </div>

                {/* Cuerpo */}
                <div className="px-8 py-6 space-y-4">
                    {reservation && (
                        <>
                            {/* Número de reservación */}
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-3">
                                <span className="text-sm text-gray-500">N° Reservación</span>
                                <span className="font-mono font-bold text-gray-800 dark:text-gray-100">
                                    #{reservation.id_renta}
                                </span>
                            </div>

                            {/* Lugar */}
                            {(reservation.ubicacion?.cuarto?.nombre || reservation.ubicacion?.alojamiento?.nombre) && (
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-3">
                                    <Home size={16} className="text-lime-500 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">Alojamiento</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                            {reservation.ubicacion?.cuarto?.nombre || reservation.ubicacion?.alojamiento?.nombre}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Fechas */}
                            {(reservation.fecha_entrada || reservation.fecha_salida) && (
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-3">
                                    <Calendar size={16} className="text-lime-500 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">Período</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                            {reservation.fecha_entrada} → {reservation.fecha_salida}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            {reservation.totales?.monto_total && (
                                <div className="flex items-center justify-between bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-700 rounded-xl px-4 py-3">
                                    <span className="text-sm font-semibold text-lime-700 dark:text-lime-400">Total pagado</span>
                                    <span className="text-xl font-extrabold text-lime-700 dark:text-lime-400">
                                        {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
                                            Number(reservation.totales.monto_total) || 0
                                        )}
                                    </span>
                                </div>
                            )}
                        </>
                    )}

                    {/* Mensaje genérico si no hay reservation */}
                    {!reservation && (
                        <p className="text-center text-gray-500 text-sm">
                            Tu pago fue procesado correctamente. Recibirás una confirmación pronto.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-bold py-3 rounded-xl transition-colors"
                    >
                        <CheckCircle size={15} /> Aceptar
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 border border-gray-200 hover:border-lime-500 hover:text-lime-600 text-gray-500 text-sm font-medium py-3 px-4 rounded-xl transition-colors"
                    >
                        <Download size={15} /> Comprobante
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
        </div>
    );
}