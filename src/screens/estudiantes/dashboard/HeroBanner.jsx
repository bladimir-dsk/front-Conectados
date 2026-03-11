import { Building2, Sparkles, BadgeCheck, CircleDollarSign, MapPin } from "lucide-react";

export default function HeroBanner() {
    return (
        <div className="relative overflow-hidden rounded-2xl mb-6 bg-linear-to-br from-lime-100 via-gray-200 to-emerald-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-6 md:p-8">
            {/* Decoración fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-300/20 dark:bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-20 w-40 h-40 bg-emerald-300/20 dark:bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-4 right-8 opacity-[0.07]">
                <Building2 size={120} className="text-lime-600 dark:text-lime-400" />
            </div>

            {/* Contenido */}
            <div className="relative z-10 max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-400/20 text-lime-700 dark:text-lime-400 text-xs font-semibold mb-3 border border-lime-200 dark:border-lime-400/20">
                    <Sparkles size={12} />
                    Encuentra tu lugar ideal
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight mb-2">
                    Tu hogar lejos <br className="hidden sm:block" />
                    <span className="text-lime-600 dark:text-lime-400">de casa</span> te espera
                </h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed max-w-sm">
                    Descubre alojamientos seguros, cómodos y accesibles pensados para estudiantes como tú. Sin complicaciones, sin sorpresas.
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                    {[
                        { icon: <BadgeCheck size={14} className="text-lime-600 dark:text-lime-400" />, text: "Verificados" },
                        { icon: <CircleDollarSign size={14} className="text-lime-600 dark:text-lime-400" />, text: "Mejor precio" },
                        { icon: <MapPin size={14} className="text-lime-600 dark:text-lime-400" />, text: "Ubicaciones clave" },
                    ].map((item) => (
                        <span key={item.text} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-300 font-medium">
                            {item.icon}
                            {item.text}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}