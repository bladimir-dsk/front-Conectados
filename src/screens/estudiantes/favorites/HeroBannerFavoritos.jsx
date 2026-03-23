import { Heart, Sparkles, HeartHandshake, BookMarked, Clock } from "lucide-react";

export default function HeroBannerFavoritos() {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-6 md:p-8">
      {/* Decoración fondo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-300/20 dark:bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-20 w-40 h-40 bg-pink-300/20 dark:bg-pink-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-4 right-8 opacity-[0.07]">
        <Heart size={120} className="text-rose-500 dark:text-rose-400" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-400/20 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-3 border border-rose-200 dark:border-rose-400/20">
          <Sparkles size={12} />
          Tus alojamientos guardados
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight mb-2">
          Tus favoritos,{" "}
          <span className="text-rose-500 dark:text-rose-400">siempre a la mano</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed max-w-sm">
          Aquí encontrarás todos los alojamientos que marcaste como favoritos. Compáralos y toma la mejor decisión.
        </p>
        <div className="flex flex-wrap gap-4 mt-4">
          {[
            { icon: <HeartHandshake size={14} className="text-rose-500 dark:text-rose-400" />, text: "Guardados por ti" },
            { icon: <BookMarked size={14} className="text-rose-500 dark:text-rose-400" />, text: "Fácil acceso" },
            { icon: <Clock size={14} className="text-rose-500 dark:text-rose-400" />, text: "Siempre disponibles" },
          ].map((item) => (
            <span
              key={item.text}
              className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-300 font-medium"
            >
              {item.icon}
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}