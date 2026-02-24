import React from "react";
import { Tag, Button } from "antd";
import { Heart, MapPin, Star, MapPin as MapPinIcon } from "lucide-react";
const IMAGE_URL = "https://s03.s3c.es/imag/_v0/1200x655/0/f/c/habitacion.jpg";
const RoomCard = ({
  room,
  isFav,
  onToggleFavorite,
  onViewDetails,
  onViewMap,
}) => {
  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg group">
      <img
        src={room.mainImage || IMAGE_URL}
        alt={room.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
        <Tag className="font-medium bg-white/20 backdrop-blur-sm border-0 text-white text-xs">
          Disponible
        </Tag>
        <button
          className={`bg-white/20 backdrop-blur-sm rounded-full p-1.5 cursor-pointer transition-colors ${
            isFav ? "text-red-400" : "text-white"
          }`}
          onClick={() => onToggleFavorite(room.id)}
          aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart size={16} fill={isFav ? "#ff4d4f" : "none"} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white mb-1">{room.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <MapPin size={12} className="text-gray-300" />
          <span className="text-gray-300 text-xs">{room.address}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400" fill="#fbbf24" />
            <span className="text-white font-medium text-sm">
              {room.rating?.toFixed(1) || "0.0"}
            </span>
            <span className="text-gray-300 text-xs">
              ({room.totalVotos ?? 0} {room.totalVotos === 1 ? "voto" : "votos"}
              )
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-white">${room.price}</span>
            <span className="text-gray-300 text-xs ml-1">/mes</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1 !bg-transparent !border-white font-medium hover:!bg-transparent !text-white h-10 text-sm"
            onClick={() => onViewDetails(room.id)}
          >
            Ver detalles
          </Button>
          <Button
            icon={<MapPinIcon size={14} />}
            className="flex-1 !bg-transparent !border-white font-medium hover:!bg-transparent !text-white h-10 text-sm"
            onClick={() => onViewMap(room.id)}
          >
            Mapa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
