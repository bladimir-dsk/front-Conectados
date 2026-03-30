import {
  Droplets,
  Fan,
  ThermometerSnowflake,
  Flame,
  Zap,
  CookingPot,
  Refrigerator,
  Microwave,
  Utensils,
  Soup,
  BedDouble,
  Bath,
  Shirt,
  Waves,
  TreePine,
  Armchair,
  Car,
  PalmtreeIcon,
  KeyRound,
  Camera,
  FireExtinguisher,
  BriefcaseMedical,
  Dog,
  Laptop,
  Baby,
  Dumbbell,
  Tv2,
  Bike,
  PlugZap,
  Star,
  Coffee,
  Oven,
  Lock,
  AlertTriangle,
} from "lucide-react";

const SERVICE_ICON_COLOR = "#84cc16";

export const SERVICE_ICONS_CONFIG = {
  hotWater: {
    icon: Droplets,
    label: "Agua Caliente",
    color: SERVICE_ICON_COLOR,
    value: "hotWater",
  },
  airConditioning: {
    icon: Fan,
    label: "Aire Acondicionado",
    color: SERVICE_ICON_COLOR,
    value: "airConditioning",
  },
  heating: {
    icon: ThermometerSnowflake,
    label: "Calefacción",
    color: SERVICE_ICON_COLOR,
    value: "heating",
  },
  fireplace: {
    icon: Flame,
    label: "Chimenea",
    color: SERVICE_ICON_COLOR,
    value: "fireplace",
  },
  electricity: {
    icon: Zap,
    label: "Electricidad",
    color: SERVICE_ICON_COLOR,
    value: "electricity",
  },
  fullKitchen: {
    icon: CookingPot,
    label: "Cocina Completa",
    color: SERVICE_ICON_COLOR,
    value: "fullKitchen",
  },
  refrigerator: {
    icon: Refrigerator,
    label: "Refrigerador",
    color: SERVICE_ICON_COLOR,
    value: "refrigerator",
  },
  microwave: {
    icon: Microwave,
    label: "Microondas",
    color: SERVICE_ICON_COLOR,
    value: "microwave",
  },
  oven: {
    icon: Oven,
    label: "Horno",
    color: SERVICE_ICON_COLOR,
    value: "oven",
  },
  coffeeMaker: {
    icon: Coffee,
    label: "Cafetera",
    color: SERVICE_ICON_COLOR,
    value: "coffeeMaker",
  },
  dishwasher: {
    icon: Utensils,
    label: "Lavavajillas",
    color: SERVICE_ICON_COLOR,
    value: "dishwasher",
  },
  basicUtensils: {
    icon: Soup,
    label: "Utensilios Básicos",
    color: SERVICE_ICON_COLOR,
    value: "basicUtensils",
  },
  bedding: {
    icon: BedDouble,
    label: "Ropa de Cama",
    color: SERVICE_ICON_COLOR,
    value: "bedding",
  },
  towels: {
    icon: Bath,
    label: "Toallas",
    color: SERVICE_ICON_COLOR,
    value: "towels",
  },
  washer: {
    icon: Shirt,
    label: "Lavadora",
    color: SERVICE_ICON_COLOR,
    value: "washer",
  },
  dryer: {
    icon: Shirt,
    label: "Secadora",
    color: SERVICE_ICON_COLOR,
    value: "dryer",
  },
  iron: {
    icon: Shirt,
    label: "Plancha",
    color: SERVICE_ICON_COLOR,
    value: "iron",
  },
  pool: {
    icon: Waves,
    label: "Piscina",
    color: SERVICE_ICON_COLOR,
    value: "pool",
  },
  jacuzzi: {
    icon: Waves,
    label: "Jacuzzi",
    color: SERVICE_ICON_COLOR,
    value: "jacuzzi",
  },
  garden: {
    icon: TreePine,
    label: "Jardín o Patio",
    color: SERVICE_ICON_COLOR,
    value: "garden",
  },
  bbq: {
    icon: Flame,
    label: "Parrilla o BBQ",
    color: SERVICE_ICON_COLOR,
    value: "bbq",
  },
  terrace: {
    icon: Armchair,
    label: "Terraza o Balcón",
    color: SERVICE_ICON_COLOR,
    value: "terrace",
  },
  parking: {
    icon: Car,
    label: "Estacionamiento",
    color: SERVICE_ICON_COLOR,
    value: "parking",
  },
  seaView: {
    icon: Waves,
    label: "Vista al Mar",
    color: SERVICE_ICON_COLOR,
    value: "seaView",
  },
  selfCheckIn: {
    icon: KeyRound,
    label: "Llegada Autónoma",
    color: SERVICE_ICON_COLOR,
    value: "selfCheckIn",
  },
  smokeAlarm: {
    icon: AlertTriangle,
    label: "Alarma de Humo",
    color: SERVICE_ICON_COLOR,
    value: "smokeAlarm",
  },
  fireExtinguisher: {
    icon: FireExtinguisher,
    label: "Extintor",
    color: SERVICE_ICON_COLOR,
    value: "fireExtinguisher",
  },
  firstAidKit: {
    icon: BriefcaseMedical,
    label: "Botiquín",
    color: SERVICE_ICON_COLOR,
    value: "firstAidKit",
  },
  securityCamera: {
    icon: Camera,
    label: "Cámara de Seguridad",
    color: SERVICE_ICON_COLOR,
    value: "securityCamera",
  },
  petFriendly: {
    icon: Dog,
    label: "Pet Friendly",
    color: SERVICE_ICON_COLOR,
    value: "petFriendly",
  },
  workArea: {
    icon: Laptop,
    label: "Zona de Trabajo",
    color: SERVICE_ICON_COLOR,
    value: "workArea",
  },
  babyCrib: {
    icon: Baby,
    label: "Cuna para Bebés",
    color: SERVICE_ICON_COLOR,
    value: "babyCrib",
  },
  gym: {
    icon: Dumbbell,
    label: "Gimnasio",
    color: SERVICE_ICON_COLOR,
    value: "gym",
  },
  cableTv: {
    icon: Tv2,
    label: "TV por Cable",
    color: SERVICE_ICON_COLOR,
    value: "cableTv",
  },
  bicycles: {
    icon: Bike,
    label: "Bicicletas",
    color: SERVICE_ICON_COLOR,
    value: "bicycles",
  },
  evCharger: {
    icon: PlugZap,
    label: "Cargador Vehículo Eléctrico",
    color: SERVICE_ICON_COLOR,
    value: "evCharger",
  },
};

export const getServiceIcon = (iconKey) => {
  const config = SERVICE_ICONS_CONFIG[iconKey];
  if (config) {
    return {
      icon: config.icon,
      color: config.color,
    };
  }
  return {
    icon: Star,
    color: SERVICE_ICON_COLOR,
  };
};

export const getServiceIconOptions = () => {
  return Object.entries(SERVICE_ICONS_CONFIG).map(([key, config]) => ({
    value: config.value,
    label: config.label,
    icon: config.icon,
    color: config.color,
  }));
};
