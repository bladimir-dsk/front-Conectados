import {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer,
} from "react";
import { X, CreditCard, Calendar, Lock, Globe } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Form, Row, Col, Select } from "antd";
import { countries, getEmojiFlag } from "countries-list";
import api from "../../../../api/axiosConfig";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const { Option } = Select;

const countryOptions = Object.entries(countries).map(([code, countryData]) => ({
  value: countryData.name,
  label: `${getEmojiFlag(code)} ${countryData.name}`,
}));

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(amount) || 0);

const PaymentContext = createContext(null);

const usePaymentIntent = (open, reservation) => {
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
      .catch(() =>
        setSecretError("No se pudo iniciar el pago. Intenta de nuevo."),
      )
      .finally(() => setLoadingSecret(false));
  }, [open, reservation]);

  return { clientSecret, loadingSecret, secretError };
};

const paymentFormReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_CARD_BRAND":
      return { ...state, cardBrand: action.payload };
    case "SET_COUNTRY":
      return { ...state, country: action.payload };
    case "RESET":
      return {
        loading: false,
        error: null,
        cardBrand: null,
        country: "México",
      };
    default:
      return state;
  }
};

const usePaymentForm = (clientSecret, onSuccess) => {
  const stripe = useStripe();
  const elements = useElements();
  const [state, dispatch] = useReducer(paymentFormReducer, {
    loading: false,
    error: null,
    cardBrand: null,
    country: "México",
  });

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: "",
          },
        },
      });

    if (stripeError) {
      dispatch({ type: "SET_ERROR", payload: stripeError.message });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    if (paymentIntent.status === "succeeded") {
      onSuccess();
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return {
    ...state,
    setCardBrand: (brand) =>
      dispatch({ type: "SET_CARD_BRAND", payload: brand }),
    setCountry: (country) =>
      dispatch({ type: "SET_COUNTRY", payload: country }),
    handleSubmit,
  };
};

const CardNumberField = ({ onBrandChange }) => (
  <Form.Item
    label={
      <span className="flex items-center gap-2 text-black dark:text-white">
        <CreditCard size={16} />
        Número de tarjeta
      </span>
    }
    required
  >
    <div className="relative">
      <CardNumberElement
        onChange={(e) => onBrandChange(e.brand)}
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
          showIcon: true,
          disableLink: true,
        }}
        className="border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus-within:border-lime-500 transition-colors dark:bg-neutral-700 dark:border-neutral-700"
      />
    </div>
  </Form.Item>
);

const ExpiryField = () => (
  <Form.Item
    label={
      <span className="flex items-center gap-2 text-black dark:text-white">
        <Calendar size={16} />
        Fecha de caducidad
      </span>
    }
    required
  >
    <CardExpiryElement
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
      }}
      className="border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus-within:border-lime-500 transition-colors dark:bg-neutral-700 dark:border-neutral-700"
    />
  </Form.Item>
);

const CvcField = () => (
  <Form.Item
    label={
      <span className="flex items-center gap-2 text-black dark:text-white">
        <Lock size={16} />
        Código de seguridad
      </span>
    }
    required
  >
    <CardCvcElement
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
      }}
      className="border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus-within:border-lime-500 transition-colors dark:bg-neutral-700 dark:border-neutral-700"
    />
  </Form.Item>
);

const CountrySelectField = ({ value, onChange }) => (
  <Form.Item
    label={
      <span className="flex items-center gap-2 text-black dark:text-white">
        <Globe size={16} />
        País
      </span>
    }
    required
  >
    <Select
      showSearch
      value={value}
      onChange={onChange}
      className="w-full"
      size="large"
      filterOption={(input, option) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      }
    >
      {countryOptions.map((c) => (
        <Option key={c.value} value={c.value}>
          {c.label}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

const ReservationSummary = ({ reservation }) => (
  <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-3 mb-5">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-800 dark:text-white">
          Reservación #{reservation?.id_renta}
        </p>
        <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">
          {reservation?.ubicacion?.cuarto?.nombre ||
            reservation?.ubicacion?.alojamiento?.nombre ||
            "Alojamiento"}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-black dark:text-white">Total a pagar</p>
        <p className="text-lg font-extrabold text-lime-600">
          {formatCurrency(reservation?.totales?.monto_total)}
        </p>
      </div>
    </div>
  </div>
);

const ModalHeader = ({ onClose }) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-lime-500">
    <div className="flex items-center gap-2">
      <CreditCard size={18} className="text-white" />
      <span className="font-medium text-white">Proceder al pago</span>
    </div>
    <button onClick={onClose} className="text-white">
      <X size={20} />
    </button>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center py-10">
    <div className="w-8 h-8 border-4 border-lime-200 border-t-lime-600 rounded-full animate-spin" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
    {message}
  </div>
);

const PaymentFormFields = ({ onBrandChange, country, onCountryChange }) => (
  <Form layout="vertical" className="space-y-4">
    <CardNumberField onBrandChange={onBrandChange} />
    <Row gutter={16}>
      <Col span={12}>
        <ExpiryField />
      </Col>
      <Col span={12}>
        <CvcField />
      </Col>
    </Row>
    <CountrySelectField value={country} onChange={onCountryChange} />
  </Form>
);

const ActionButtons = ({ onCancel, onSubmit, loading, stripeReady }) => (
  <div className="flex gap-3 pt-1">
    <button
      onClick={onCancel}
      disabled={loading}
      className="flex-1 border border-gray-200 hover:border-gray-300 text-gray-500 text-sm font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
    >
      Cancelar
    </button>
    <button
      type="button"
      onClick={onSubmit}
      disabled={loading || !stripeReady}
      className="flex-1 flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-500 text-white text-sm font-bold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <CreditCard size={15} />
      )}
      {loading ? "Procesando..." : "Pagar"}
    </button>
  </div>
);

const PaymentFormContainer = ({ clientSecret, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const {
    loading,
    error,
    cardBrand,
    country,
    setCardBrand,
    setCountry,
    handleSubmit,
  } = usePaymentForm(clientSecret, onSuccess);

  return (
    <>
      <PaymentFormFields
        onBrandChange={setCardBrand}
        country={country}
        onCountryChange={setCountry}
      />
      {error && <ErrorMessage message={error} />}
      <ActionButtons
        onCancel={onCancel}
        onSubmit={handleSubmit}
        loading={loading}
        stripeReady={!!stripe}
      />
    </>
  );
};

const ModalContent = () => {
  const {
    clientSecret,
    loadingSecret,
    secretError,
    reservation,
    onClose,
    onPaySuccess,
  } = useContext(PaymentContext);

  return (
    <div className="px-6 py-5">
      <ReservationSummary reservation={reservation} />
      {loadingSecret && <LoadingSpinner />}
      {secretError && <ErrorMessage message={secretError} />}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentFormContainer
            clientSecret={clientSecret}
            onSuccess={() => {
              onClose();
              onPaySuccess(reservation);
            }}
            onCancel={onClose}
          />
        </Elements>
      )}
    </div>
  );
};

export default function StripeModal(props) {
  const { open, onClose, reservation, onPaySuccess } = props;
  const { clientSecret, loadingSecret, secretError } = usePaymentIntent(
    open,
    reservation,
  );

  if (!open) return null;

  return (
    <PaymentContext.Provider
      value={{
        clientSecret,
        loadingSecret,
        secretError,
        reservation,
        onClose,
        onPaySuccess,
      }}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
        <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          <ModalHeader onClose={onClose} />
          <ModalContent />
        </div>
      </div>
    </PaymentContext.Provider>
  );
}
