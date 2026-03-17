import { useState } from 'react'
import { Button, Select, theme } from 'antd'
import {
    AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
    ResponsiveContainer,
} from 'recharts'
import {
    Home, User, GraduationCap, School, BarChart2,
    TriangleAlert, CheckCircle, FileText, AlertCircle,
} from 'lucide-react'

const KPI_DATA = [
    { label: 'Alojamientos', value: 48, delta: '↑ 4 nuevos este mes', trend: 'up', accent: '#3b82f6', Icon: Home },
    { label: 'Propietarios', value: 21, delta: '↑ 2 registrados', trend: 'up', accent: '#10b981', Icon: User },
    { label: 'Estudiantes', value: 134, delta: '↑ 18 este ciclo', trend: 'up', accent: '#f59e0b', Icon: GraduationCap },
    { label: 'Escuelas', value: 7, delta: '— Sin cambios', trend: 'neutral', accent: '#8b5cf6', Icon: School },
]

const RESERVACIONES_DATA = [
    { mes: 'Oct', reservaciones: 18, ingresos: 54000 },
    { mes: 'Nov', reservaciones: 24, ingresos: 72000 },
    { mes: 'Dic', reservaciones: 29, ingresos: 87000 },
    { mes: 'Ene', reservaciones: 35, ingresos: 105000 },
    { mes: 'Feb', reservaciones: 41, ingresos: 123000 },
    { mes: 'Mar', reservaciones: 47, ingresos: 141000 },
]

const ESTADOS_ALOJ = [
    { name: 'Ocupados', value: 38, color: '#10b981' },
    { name: 'Disponibles', value: 7, color: '#3b82f6' },
    { name: 'En revisión', value: 2, color: '#f59e0b' },
    { name: 'Inactivos', value: 1, color: '#ef4444' },
]

const ESCUELAS_ESTUDIANTES = [
    { escuela: 'UADY', estudiantes: 52 },
    { escuela: 'ITM', estudiantes: 28 },
    { escuela: 'TecNM', estudiantes: 21 },
    { escuela: 'CETYS', estudiantes: 18 },
    { escuela: 'UVM', estudiantes: 9 },
    { escuela: 'UNID', estudiantes: 7 },
    { escuela: 'UMAM', estudiantes: 6 },
    { escuela: 'Anáhuac', estudiantes: 5 },
    { escuela: 'UNAM Campus Mérida', estudiantes: 4 },
    { escuela: 'ITESM', estudiantes: 3 },
    { escuela: 'UPY', estudiantes: 3 },
    { escuela: 'CUT', estudiantes: 2 },
]
const MAX_ESTUDIANTES = Math.max(...ESCUELAS_ESTUDIANTES.map((e) => e.estudiantes))

const ACTIVIDAD = [
    { id: 1, Icon: CheckCircle, color: '#10b981', msg: 'Reservación confirmada — Aloj. #A-12 · Luis Medina', tiempo: 'Hace 15 min' },
    { id: 2, Icon: FileText, color: '#3b82f6', msg: 'Docs enviados — Carlos Poot requiere revisión', tiempo: 'Hace 42 min' },
    { id: 3, Icon: Home, color: '#8b5cf6', msg: 'Nuevo alojamiento — Prop. Jorge Dzul (Calle 60)', tiempo: 'Hace 2 horas' },
    { id: 4, Icon: AlertCircle, color: '#ef4444', msg: 'Pago vencido — Aloj. #B-07 · Reservación #R-334', tiempo: 'Ayer, 18:30' },
    { id: 5, Icon: GraduationCap, color: '#f59e0b', msg: 'Escuela TecNM Mérida agregada al catálogo', tiempo: 'Ayer, 11:00' },
]

const ESTUDIANTES_DATA = [
    { key: 1, nombre: 'Ana García', escuela: 'UADY', docNombre: 'CFE_AnaGarcia.pdf', estado: 'Aprobado' },
    { key: 2, nombre: 'Luis Medina', escuela: 'ITM', docNombre: 'CURP_LuisMedina.pdf', estado: 'Pendiente' },
    { key: 3, nombre: 'Sofía Ek', escuela: 'UADY', docNombre: 'INE_SofiaEk.pdf', estado: 'Aprobado' },
    { key: 4, nombre: 'Carlos Poot', escuela: 'CETYS', docNombre: '—', estado: 'Pendiente' },
    { key: 5, nombre: 'Mariana López', escuela: 'TecNM', docNombre: 'CFE_MarianaLopez.pdf', estado: 'Aprobado' },
]

const PILL_CLS = {
    Completa: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    Parcial: 'bg-amber-500/15   text-amber-600   dark:text-amber-400',
    Faltante: 'bg-red-500/15     text-red-600     dark:text-red-400',
    Activa: 'bg-green-500/15    text-green-600    dark:text-green-400',
    Aprobado: 'bg-green-500/15    text-green-600    dark:text-green-400',
    Pendiente: 'bg-amber-500/15   text-amber-600   dark:text-amber-400',
}

function Pill({ label }) {
    return (
        <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${PILL_CLS[label] ?? 'bg-gray-500/15 text-gray-400'}`}>
            {label}
        </span>
    )
}

function SectionLabel({ children }) {
    return (
        <span className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {children}
        </span>
    )
}

function Panel({ title, subtitle, extra, children, className = '' }) {
    return (
        <div className={`rounded-2xl p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ${className}`}>
            {(title || extra) && (
                <div className="flex items-start justify-between mb-4 gap-2">
                    <div className='flex flex-col'>
                        {title && <span className="text-[15px] font-medium text-gray-900 dark:text-white">{title}</span>}
                        {subtitle && <span className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</span>}
                    </div>
                    {extra}
                </div>
            )}
            {children}
        </div>
    )
}

function CustomTooltip({ active, payload, label, prefix = '' }) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-3 py-2 text-sm bg-white dark:bg-zinc-900 border flex flex-col border-gray-200 dark:border-zinc-700 shadow-lg">
            <span className="font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</span>
            {payload.map((p, i) => (
                <span key={i} style={{ color: p.stroke }}>
                    {p.name}: {prefix}{p.value.toLocaleString()}
                </span>
            ))}
        </div>
    )
}

export default function DashboardScreen_Admin({ onNavigate }) {
    const { token } = theme.useToken()
    const isDark = token.colorBgBase === '#000000' || token.colorBgContainer === '#141414'

    const [metric, setMetric] = useState('reservaciones')

    const isIngresos = metric === 'ingresos'
    const lineColor = isIngresos ? '#10b981' : '#3b82f6'
    const dataKey = isIngresos ? 'ingresos' : 'reservaciones'
    const lineLabel = isIngresos ? 'Ingresos (MXN)' : 'Reservaciones'
    const prefix = isIngresos ? '$' : ''
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
    const tickColor = isDark ? '#6b7280' : '#9ca3af'
    const dotStroke = isDark ? '#18181b' : '#ffffff'

    return (
        <div className="flex flex-col gap-4 pb-6 w-full">

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Panel de administración</h1>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Conecta-DoS · Plataforma de alojamiento estudiantil</span>
                </div>
            </div>

            {/* Alert */}
            <div className="flex items-center gap-3 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 rounded-xl px-4 py-3">
                <TriangleAlert size={15} className="shrink-0 text-amber-500" />
                3 solicitudes de documentación pendientes de revisión · 2 reservaciones próximas a vencer esta semana
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {KPI_DATA.map(({ label, value, delta, trend, accent, Icon }) => (
                    <div
                        key={label}
                        className="relative overflow-hidden rounded-2xl p-4 pb-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</p>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${accent}20` }}>
                                <Icon size={14} style={{ color: accent }} />
                            </div>
                        </div>
                        <p className="text-4xl font-light tracking-tight text-gray-900 dark:text-white mb-1.5 leading-none">{value}</p>
                        <span className={`text-xs ${trend === 'up' ? 'text-emerald-500' : 'text-gray-400'}`}>{delta}</span>
                        <div className="absolute bottom-0 left-0 right-0 h-0.75" style={{ background: accent }} />
                    </div>
                ))}
            </div>

            {/* Visión general */}
            <SectionLabel>Visión general</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-3">

                {/* Área */}
                <Panel
                    title="Reservaciones mensuales"
                    subtitle="Últimos 6 meses"
                    extra={
                        <Select
                            value={metric}
                            onChange={(val) => setMetric(val)}
                            size="middle"
                            style={{ width: 160 }}
                            options={[
                                { value: 'reservaciones', label: 'Reservaciones' },
                                { value: 'ingresos', label: 'Ingresos MXN' },
                            ]}
                        />
                    }>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={RESERVACIONES_DATA} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
                            <RechartTooltip content={<CustomTooltip prefix={prefix} />} />
                            <Area
                                type="monotone" dataKey={dataKey} name={lineLabel}
                                stroke={lineColor} strokeWidth={2.5} fill="url(#aGrad)"
                                dot={{ r: 4, fill: lineColor, strokeWidth: 2, stroke: dotStroke }}
                                activeDot={{ r: 6 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Panel>

                {/* Donut */}
                <Panel title="Estados de alojamientos" subtitle="48 unidades en total">
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={ESTADOS_ALOJ} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={2} dataKey="value">
                                {ESTADOS_ALOJ.map((e) => <Cell key={e.name} fill={e.color} />)}
                            </Pie>
                            <RechartTooltip formatter={(v, n) => [`${v} unidades`, n]} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2 mt-3">
                        {ESTADOS_ALOJ.map((e) => (
                            <div key={e.name} className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: e.color }} />
                                    {e.name}
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">{e.value}</span>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>

            {/* Detalles */}
            <SectionLabel>Detalles</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                {/* Tabla */}
                <Panel
                    title="Documentación recientes de estudiantes"
                    subtitle="Últimos registros"
                    extra={<Button size="middle" onClick={() => onNavigate?.('estudiantes')}>Ver todos</Button>}>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-zinc-700">
                                {['Nombre', 'Escuela', 'Nombre doc', 'Estado'].map((h) => (
                                    <th key={h} className="text-left py-2.5 px-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ESTUDIANTES_DATA.map((row, i) => (
                                <tr
                                    key={row.key}
                                    className="border-b border-gray-100 dark:border-zinc-700 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{row.nombre}</td>
                                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400">{row.escuela}</td>
                                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400 truncate max-w-[160px]" title={row.docNombre}>
                                        {row.docNombre}
                                    </td>
                                    <td className="py-3 px-2"><Pill label={row.estado} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Panel>

                {/* Actividad */}
                <Panel title="Actividad reciente">
                    <div>
                        {ACTIVIDAD.map((a, i) => (
                            <div
                                key={a.id}
                                className={`flex items-start gap-3 py-3 ${i < ACTIVIDAD.length - 1 ? 'border-b border-gray-100 dark:border-zinc-700' : ''}`}>
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                    style={{ background: `${a.color}18`, border: `1px solid ${a.color}30` }}>
                                    <a.Icon size={14} style={{ color: a.color }} />
                                </div>
                                <div className="min-w-0 flex flex-col">
                                    <span className="text-sm text-gray-700 dark:text-gray-200 leading-snug">{a.msg}</span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{a.tiempo}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>

            {/* Estudiantes por escuela */}
            <Panel title="Estudiantes por escuela" subtitle="Procedencia de los estudiantes alojados">
                <div className={`flex flex-col gap-3 mt-1 ${ESCUELAS_ESTUDIANTES.length > 10 ? 'max-h-80 overflow-y-auto pr-5' : ''}`}>
                    {ESCUELAS_ESTUDIANTES.map((e) => {
                        const pct = Math.round((e.estudiantes / MAX_ESTUDIANTES) * 100)
                        return (
                            <div key={e.escuela}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{e.escuela}</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{e.estudiantes} estudiantes</span>
                                </div>
                                <div className="h-2 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Panel>
        </div>
    )
}