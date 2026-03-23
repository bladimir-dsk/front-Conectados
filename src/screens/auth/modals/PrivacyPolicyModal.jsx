import { useEffect } from "react";
import { Button, Spin } from "antd";
import { X, ShieldCheck } from "lucide-react";
import { useApi } from "../../../hooks/useApi";

const PrivacyPolicyModal = ({ visible, onClose }) => {
    const {
        data: politicas,
        loading,
        fetchData,
    } = useApi("/politica", {}, false);

    useEffect(() => {
        if (visible) fetchData();
    }, [visible]);

    if (!visible) return null;

    const hasData = Array.isArray(politicas) && politicas.length > 0;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/90 z-50"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header fijo */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-700 shrink-0">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={20} className="text-lime-500" />
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                Políticas de privacidad de la plataforma de Conecta-DOS
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Body scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-5">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Spin tip="Cargando políticas..." />
                            </div>
                        ) : !hasData ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <ShieldCheck size={40} className="text-gray-300 dark:text-zinc-600" />
                                <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                                    No hay políticas de privacidad disponibles.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {politicas.map((politica) => (
                                    <div key={politica.id_politica}>
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                                            {politica.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                            {politica.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer fijo */}
                    <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-zinc-700 shrink-0 bg-gray-50 dark:bg-zinc-800/50">
                        <Button size="large" color="danger" variant="solid" onClick={onClose} className="px-8 rounded-lg">
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicyModal;