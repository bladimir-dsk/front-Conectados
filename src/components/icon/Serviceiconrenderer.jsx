import { getServiceIcon } from "./serviceIconsConfig";

const ServiceIconRenderer = ({ iconKey, size = 24, customColor = null }) => {
    const { icon: IconComponent, color } = getServiceIcon(iconKey);
    
    return (
        <div className="flex items-center justify-center">
            <IconComponent 
                size={size} 
                color={customColor || color} 
            />
        </div>
    );
};

export default ServiceIconRenderer;