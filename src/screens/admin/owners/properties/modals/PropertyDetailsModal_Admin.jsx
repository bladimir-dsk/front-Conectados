import { Button, Tag } from "antd";
import { X, MapPin, Home, DollarSign, Calendar, User } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const PropertyDetailsModal_Admin = ({ visible, onClose, propertyData, ownerData }) => {
    if (!visible || !propertyData) return null;

    const getStatusColor = (status) => {
        return status === "Activo" ? "green" : "red";
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-50 transition-opacity backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-zinc-700">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {propertyData.propertyName}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Detalles de la propiedad
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Body con scroll */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                            {/* Columna izquierda - Imagen */}
                            <div>
                                {/* Imagen principal */}
                                <div className="relative bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                                    <img
                                        src={propertyData.image}
                                        alt={propertyData.propertyName}
                                        className="w-full h-96 object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/800x600?text=Sin+Imagen";
                                        }}
                                    />
                                    {/* Badge de estado */}
                                    <div className="absolute top-3 right-3">
                                        <Tag
                                            color={getStatusColor(propertyData.status)}
                                            className="text-sm font-semibold px-3 py-1"
                                        >
                                            {propertyData.status}
                                        </Tag>
                                    </div>
                                </div>

                                {/* Precio destacado */}
                                <div className="mt-4 p-4 bg-linear-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 rounded-lg border border-lime-200 dark:border-lime-800">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Precio desde
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={28} className="text-lime-600 dark:text-lime-400" />
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                            ${propertyData.priceFrom?.toLocaleString("es-MX")}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">MXN/mes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Columna derecha - Información */}
                            <div className="space-y-5">
                                {/* Descripción */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        Descripción
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {propertyData.description}
                                    </p>
                                </div>

                                {/* Propietario */}
                                <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User size={18} className="text-gray-500 dark:text-gray-400" />
                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Propietario
                                        </h3>
                                    </div>
                                    <p className="text-base font-medium text-gray-900 dark:text-white">
                                        {ownerData?.name || "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {ownerData?.email || ""}
                                    </p>
                                </div>

                                {/* Ubicación */}
                                <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin size={18} className="text-gray-500 dark:text-gray-400" />
                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Ubicación
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                                        {propertyData.address}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {propertyData.city}, {propertyData.state}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        CP: {propertyData.zipCode}
                                    </p>
                                </div>

                                {/* Características */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Características
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                Tipo de propiedad
                                            </p>
                                            <Tag color="blue" className="text-sm">
                                                {propertyData.propertyType}
                                            </Tag>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                Tipo de renta
                                            </p>
                                            <Tag
                                                color={propertyData.rentalType === "Completa" ? "purple" : "cyan"}
                                                className="text-sm"
                                            >
                                                {propertyData.rentalType}
                                            </Tag>
                                        </div>
                                    </div>
                                </div>

                                {/* Fecha de registro */}
                                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Fecha de registro
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {dayjs(propertyData.registrationDate).format("DD [de] MMMM, YYYY")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
                        <Button
                            size="large"
                            type="primary"
                            onClick={onClose}
                            className="px-8 rounded-lg"
                            style={{
                                backgroundColor: "#84cc16",
                                borderColor: "#84cc16",
                            }}
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PropertyDetailsModal_Admin;