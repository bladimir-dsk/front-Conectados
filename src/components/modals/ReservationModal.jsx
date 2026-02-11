import React, { useState } from "react";
import { Modal, Button, Divider, Steps, Tag, Alert } from "antd";
import {
  CheckCircle,
  X,
  Home,
  Bed,
  CalendarDays,
  Plus,
  Loader2,
} from "lucide-react";

const { Step } = Steps;

const ReservationModal = ({
  open,
  onClose,
  step = 1,
  onStepChange,
  room,
  hasDocuments,
  rentType = "completo",
  onRentTypeChange,
  selectedRooms = 1,
  onSelectedRoomsChange,
  selectedBed = "",
  onSelectedBedChange,
  rentPeriod = 12,
  onRentPeriodChange,
  selectedServices = [],
  onSelectedServicesChange,
  services = [],
  prices = { subtotal: 0, iva: 0, total: 0 },
  onSaveReservation,
  imageUrl = "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg",
  loading = false,
  error = null,
}) => {
  const [showExtraServices, setShowExtraServices] = useState(false);

  const handleServiceToggle = (serviceName) => {
    const newServices = selectedServices.includes(serviceName)
      ? selectedServices.filter((s) => s !== serviceName)
      : [...selectedServices, serviceName];
    onSelectedServicesChange(newServices);
  };

  const includedServices = services.filter((service) => service.price === 0);
  const extraServices = services.filter((service) => service.price > 0);

  const items = [
    { title: "Documentos", description: step > 1 ? "Completado" : "" },
    { title: "Reservación", description: step > 2 ? "Completado" : "" },
    { title: "Confirmación", description: step > 3 ? "Completado" : "" },
  ];

  const stepContents = [
    <div key="1" className="text-center py-0">
      {hasDocuments ? (
        <>
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Documentos completos
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Puedes continuar con tu reservación.
          </p>
          <Button
            type="default"
            className="!bg-lime-600 hover:!bg-lime-600 !border-lime-600 !text-white"
            onClick={() => onStepChange(2)}
            loading={loading}
            disabled={loading}
          >
            Continuar
          </Button>
        </>
      ) : (
        <>
          <X size={48} className="text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Documentos pendientes
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Debe subir sus documentos o no han sido aprobados.
          </p>
          <Button
            type="default"
            className="!bg-lime-600 hover:!bg-lime-600 !border-lime-600 !text-white"
            onClick={() => {
              window.location.href = "/estudiante/documentation";
            }}
          >
            Ir a Mi Documentación
          </Button>
        </>
      )}
    </div>,
    <div key="2" className="py-0">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Procesar reservación
        </h1>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3">
          <div className="w-20 h-20 flex-shrink-0">
            <img
              src={imageUrl}
              alt={room?.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div>
                <Tag color="blue" className="text-xs mb-1">
                  {room?.id
                    ? `AL-${room.id.toString().padStart(3, "0")}`
                    : "AL-001"}
                </Tag>
                <h3 className="font-semibold text-gray-800 truncate">
                  {room?.name || "Casa color roja"}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-lime-600">
                  ${room?.price || 0}
                  <span className="text-xs text-gray-500 ml-1">/noche</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 space-y-0.5">
              <div className="flex items-center gap-1">
                <Home size={12} />
                <span>
                  Tipo: {rentType === "completo" ? "Completo" : "Por espacio"}
                </span>
              </div>
              {rentType === "espacio" && (
                <>
                  <div className="flex items-center gap-1">
                    <Bed size={12} />
                    <span>Habitación: {selectedRooms}</span>
                  </div>
                  {selectedBed && (
                    <div className="flex items-center gap-1">
                      <Bed size={12} />
                      <span>Cama: {selectedBed}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex items-center gap-1">
                <CalendarDays size={12} />
                <span>Folio: F2G4DSF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2 text-sm">
            TIPO DE ALOJAMIENTO
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                key: "completo",
                label: "Completo",
                desc: "Toda la propiedad",
                icon: <Home size={16} className="text-lime-600" />,
              },
              {
                key: "espacio",
                label: "Por espacio",
                desc: "Habitación específica",
                icon: <Bed size={16} className="text-lime-600" />,
              },
            ].map((type) => (
              <div
                key={type.key}
                className={`p-3 border rounded-lg cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                  rentType === type.key
                    ? "border-lime-600 bg-lime-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onRentTypeChange(type.key)}
              >
                <div className="mb-2">{type.icon}</div>
                <div className="font-bold text-gray-800 text-sm">
                  {type.label}
                </div>
                <div className="text-xs text-gray-600 mt-1">{type.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {rentType === "espacio" && (
          <>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">
                Habitación
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                      selectedRooms === num
                        ? "border-lime-600 bg-lime-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => onSelectedRoomsChange(num)}
                  >
                    <div className="text-sm font-bold text-gray-800">{num}</div>
                    <div className="text-xs text-gray-600">
                      {num === 1 ? "Habitación" : "Habitaciones"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">
                Camas disponibles
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {["Cama 1", "Cama 2"].map((cama) => (
                  <div
                    key={cama}
                    className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                      selectedBed === cama
                        ? "border-lime-600 bg-lime-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => onSelectedBedChange(cama)}
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {cama}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <h4 className="font-medium text-gray-700 mb-2 text-sm">
            PLAZO DE RENTA
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { months: 12, price: 100, label: "12 Meses" },
              { months: 6, price: 200, label: "6 Meses" },
              { months: 3, price: 300, label: "3 Meses" },
            ].map((option) => (
              <div
                key={option.months}
                className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                  rentPeriod === option.months
                    ? "border-lime-600 bg-lime-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onRentPeriodChange(option.months)}
              >
                <div className="text-sm font-bold text-gray-800">
                  {option.months}
                </div>
                <div className="text-gray-500 text-xs mb-1">{option.label}</div>
                <div className="text-sm font-bold text-lime-600">
                  ${option.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {services.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2 text-sm">
              SERVICIOS ADICIONALES
            </h4>
            <div className="border border-gray-200 rounded-lg bg-white p-4 mb-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-lime-600" />
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      INCLUIDOS EN EL PRECIO
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {includedServices.slice(0, 4).map((service, index) => (
                        <div
                          key={service.id || index}
                          className="flex-1 min-w-[100px] flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md"
                        >
                          <div className="text-lime-600 mb-1">
                            {service.icon}
                          </div>
                          <span className="text-xs font-medium text-center">
                            {service.name}
                          </span>
                        </div>
                      ))}
                      {services.length > 4 && (
                        <button
                          className="w-12 flex items-center justify-center p-3 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
                          onClick={() =>
                            setShowExtraServices(!showExtraServices)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {showExtraServices && (
                    <div>
                      <Divider className="my-3" />
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        SERVICIOS PREMIUM
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {extraServices.map((service, index) => (
                          <div
                            key={service.id || index}
                            className={`p-3 border rounded-lg cursor-pointer transition-all flex flex-col items-center text-center ${
                              selectedServices.includes(service.name)
                                ? "border-lime-600 bg-lime-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleServiceToggle(service.name)}
                          >
                            <div className="text-lime-600 mb-2">
                              {service.icon}
                            </div>
                            <div className="text-xs font-medium text-gray-800 mb-1">
                              {service.name}
                            </div>
                            <div className="text-xs font-bold text-lime-600">
                              +${service.price}/mes
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Subtotal</span>
              <span className="font-bold text-gray-800 text-sm">
                ${prices.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">IVA (16%)</span>
              <span className="font-bold text-gray-800 text-sm">
                ${prices.iva.toFixed(2)}
              </span>
            </div>
            <Divider className="my-1" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-lg font-bold text-lime-600">
                ${prices.total.toFixed(2)} MXN
              </span>
            </div>
          </div>
        </div>

        <Button
          type="default"
          className="w-full !bg-lime-600 hover:!bg-lime-600 !border-lime-600 !text-white h-12 text-lg font-bold rounded-lg"
          onClick={() => onStepChange(3)}
          loading={loading}
          disabled={loading}
        >
          RESERVAR AHORA
        </Button>
      </div>
    </div>,
    <div key="3" className="text-center py-6">
      <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        ¡Reservación en proceso!
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        Tu reservación ha sido procesada exitosamente.
      </p>
      <Button
        type="default"
        className="!bg-lime-600 hover:!bg-lime-600 !border-lime-600 !text-white"
        onClick={() => {
          onSaveReservation();
          window.location.href = "/estudiante/reservas";
        }}
        loading={loading}
        disabled={loading}
      >
        Ir a Mis Reservaciones
      </Button>
    </div>,
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      closable={false}
      className="[&_.ant-modal-content]:rounded-xl [&_.ant-modal-body]:p-0"
    >
      <div className="absolute top-3 right-3 z-10">
        <Button
          type="text"
          icon={<X size={16} />}
          onClick={onClose}
          className="text-gray-500 hover:text-lime-600 w-6 h-6 flex items-center justify-center"
          aria-label="Cerrar"
          disabled={loading}
        />
      </div>

      <div className="pt-6">
        <Steps
          current={step - 1}
          items={items}
          className="mb-6 px-6"
          responsive={false}
          size="small"
          titlePlacement="vertical"
        />
        <Divider className="my-0" />
        <div className="px-3 py-0 max-h-[65vh] overflow-y-auto">
          {stepContents[step - 1]}
        </div>
      </div>
    </Modal>
  );
};

export default ReservationModal;
