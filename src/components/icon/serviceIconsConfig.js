import { 
    Droplet, 
    Zap, 
    Wifi, 
    Flame, 
    Trash2, 
    Wind, 
    Phone, 
    Tv, 
    Shield, 
    Sparkles, 
    Leaf,
    Car,
    Users,
    Home
} from "lucide-react";

// Color único para todos los iconos de servicios
const SERVICE_ICON_COLOR = "#84cc16"; // Verde lime (puedes cambiarlo aquí)

export const SERVICE_ICONS_CONFIG = {
    water: { 
        icon: Droplet, 
        label: "Agua", 
        color: SERVICE_ICON_COLOR,
        value: "water"
    },
    electricity: { 
        icon: Zap, 
        label: "Luz/Electricidad", 
        color: SERVICE_ICON_COLOR,
        value: "electricity"
    },
    internet: { 
        icon: Wifi, 
        label: "Internet", 
        color: SERVICE_ICON_COLOR,
        value: "internet"
    },
    gas: { 
        icon: Flame, 
        label: "Gas", 
        color: SERVICE_ICON_COLOR,
        value: "gas"
    },
    trash: { 
        icon: Trash2, 
        label: "Recolección de basura", 
        color: SERVICE_ICON_COLOR,
        value: "trash"
    },
    airConditioning: { 
        icon: Wind, 
        label: "Aire acondicionado", 
        color: SERVICE_ICON_COLOR,
        value: "airConditioning"
    },
    phone: { 
        icon: Phone, 
        label: "Teléfono", 
        color: SERVICE_ICON_COLOR,
        value: "phone"
    },
    cable: { 
        icon: Tv, 
        label: "TV por cable", 
        color: SERVICE_ICON_COLOR,
        value: "cable"
    },
    security: { 
        icon: Shield, 
        label: "Seguridad", 
        color: SERVICE_ICON_COLOR,
        value: "security"
    },
    cleaning: { 
        icon: Sparkles, 
        label: "Limpieza", 
        color: SERVICE_ICON_COLOR,
        value: "cleaning"
    },
    gardening: { 
        icon: Leaf, 
        label: "Jardinería", 
        color: SERVICE_ICON_COLOR,
        value: "gardening"
    },
    parking: { 
        icon: Car, 
        label: "Estacionamiento", 
        color: SERVICE_ICON_COLOR,
        value: "parking"
    },
    maintenance: { 
        icon: Users, 
        label: "Mantenimiento", 
        color: SERVICE_ICON_COLOR,
        value: "maintenance"
    },
    amenities: { 
        icon: Home, 
        label: "Amenidades", 
        color: SERVICE_ICON_COLOR,
        value: "amenities"
    },
};

/**
 * Obtiene el componente de icono según la clave
 * @param {string} iconKey - Clave del icono
 * @returns {Object} - { icon: Component, color: string }
 */
export const getServiceIcon = (iconKey) => {
    const config = SERVICE_ICONS_CONFIG[iconKey];
    if (config) {
        return {
            icon: config.icon,
            color: config.color,
        };
    }
    // Icono por defecto si no existe
    return {
        icon: Home,
        color: SERVICE_ICON_COLOR,
    };
};

/**
 * Obtiene un array de opciones para el Select
 * @returns {Array} - Array de opciones con value, label, icon, color
 */
export const getServiceIconOptions = () => {
    return Object.entries(SERVICE_ICONS_CONFIG).map(([key, config]) => ({
        value: config.value,
        label: config.label,
        icon: config.icon,
        color: config.color,
    }));
};