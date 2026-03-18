import { useState, useMemo } from 'react'
import { Button, Select, Table, Tag, Tooltip, theme } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import {
    AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
    ResponsiveContainer,
} from 'recharts'
import {
    Home, User, GraduationCap, School,
} from 'lucide-react'
import { useApi } from '../../../hooks/useApi'
import { useNavigate } from 'react-router-dom'

const MES_ABBR = {
    Enero: 'Ene', Febrero: 'Feb', Marzo: 'Mar', Abril: 'Abr',
    Mayo: 'May', Junio: 'Jun', Julio: 'Jul', Agosto: 'Ago',
    Septiembre: 'Sep', Octubre: 'Oct', Noviembre: 'Nov', Diciembre: 'Dic',
}

const ESTATUS_CONFIG = {
    ACTIVO: { name: 'Disponibles', color: '#3b82f6' },
    OCUPADO: { name: 'Ocupados', color: '#10b981' },
    MANTENIMIENTO: { name: 'En revisión', color: '#f59e0b' },
    INACTIVO: { name: 'Inactivos', color: '#ef4444' },
}

const TYPE_DOC_LABEL = {
    ine_delantera: 'INE Delantera',
    ine_trasera: 'INE Trasera',
    cfe: 'CFE',
    pasaporte: 'Pasaporte',
    curp: 'CURP',
}

const resolveNuevos = (nuevosdelmes) => {
    if (nuevosdelmes === null || nuevosdelmes === undefined) return null
    if (typeof nuevosdelmes === 'object') return nuevosdelmes.total ?? 0
    return nuevosdelmes
}

const buildDelta = (nuevosdelmes) => {
    const n = resolveNuevos(nuevosdelmes)
    if (n === null) return { text: null, trend: 'neutral' }
    if (n === 0) return { text: 'Sin cambios', trend: 'neutral' }
    return { text: `↑ ${n} ${n === 1 ? 'nuevo' : 'nuevos'} este mes`, trend: 'up' }
}

const getStatusColor = (status) => {
    switch (status) {
        case 'aprobado': return 'green'
        case 'pendiente': return 'orange'
        case 'rechazado': return 'red'
        default: return 'default'
    }
}

const getStatusLabel = (status) => {
    switch (status) {
        case 'aprobado': return 'Aprobado'
        case 'pendiente': return 'Pendiente'
        case 'rechazado': return 'Rechazado'
        default: return status
    }
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
        <div className={`rounded-2xl p-5 bg-white dark:bg-zinc-900 ${className}`}>
            {(title || extra) && (
                <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex flex-col">
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
                <span key={i} style={{ color: p.stroke ?? p.fill }}>
                    {p.name}: {prefix}{p.value.toLocaleString()}
                </span>
            ))}
        </div>
    )
}

function KpiCard({ label, value, text, trend, accent, Icon, loading }) {
    return (
        <div className="relative overflow-hidden rounded-2xl p-4 pb-5 bg-white dark:bg-zinc-900">
            <div className="flex items-start justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}20` }}>
                    <Icon size={14} style={{ color: accent }} />
                </div>
            </div>
            {loading
                ? <div className="h-10 w-16 rounded-lg bg-gray-100 dark:bg-zinc-700 animate-pulse mb-1.5" />
                : <p className="text-4xl font-light tracking-tight text-gray-900 dark:text-white mb-1.5 leading-none">{value}</p>
            }
            {loading
                ? <div className="h-3 w-28 rounded bg-gray-100 dark:bg-zinc-700 animate-pulse" />
                : text === 'Sin cambios'
                    ? <span className="text-xs italic text-gray-400 dark:text-gray-500">{text}</span>
                    : text
                        ? <span className={`text-xs ${trend === 'up' ? 'text-emerald-500' : 'text-gray-400'}`}>{text}</span>
                        : null
            }
            <div className="absolute bottom-0 left-0 right-0 h-0.75" style={{ background: accent }} />
        </div>
    )
}

function ChartSkeleton({ height = 220 }) {
    return (
        <div className="w-full rounded-xl bg-gray-100 dark:bg-zinc-700 animate-pulse" style={{ height }} />
    )
}

export default function DashboardScreen_Admin() {
    const { token } = theme.useToken()
    const isDark = token.colorBgBase === '#000000' || token.colorBgContainer === '#141414'

    const [metric, setMetric] = useState('reservaciones')
    const navigate = useNavigate()

    /* ── APIs KPIs ── */
    const { data: dataAloj, loading: loadingAloj } = useApi('/alojamientos/count')
    const { data: dataProp, loading: loadingProp } = useApi('/propietarios/count')
    const { data: dataEst, loading: loadingEst } = useApi('/users/count')
    const { data: dataEsc, loading: loadingEsc } = useApi('/School/count')

    /* ── APIs gráficas ── */
    const { data: dataGanancias, loading: loadingGanancias } = useApi('/pago/ganancias-by-month')
    const { data: dataRentasMeses, loading: loadingRentasMeses } = useApi('/renta/count-rentas-by-month')
    const { data: dataEstados, loading: loadingEstados } = useApi('/alojamientos/alojamientos/estatus')

    /* ── API tabla documentos ── */
    const { data: dataDocumentos, loading: loadingDocumentos } = useApi('/documentacion/last-seven-files')

    const { data: dataEscuelasEstudiantes, loading: loadingEscuelasEstudiantes } = useApi('/users/count-by-school')

    /* ── chartData ── */
    const chartData = useMemo(() => {
        if (!dataGanancias || !dataRentasMeses) return []
        const gananciasByMonth = Object.fromEntries(
            dataGanancias.map((g) => [g.month, g.total ?? 0])
        )
        return dataRentasMeses.map((r) => ({
            mes: MES_ABBR[r.month] ?? r.month,
            reservaciones: (r.ACTIVA ?? 0) + (r.CANCELADA ?? 0) + (r.FINALIZADA ?? 0) + (r.PENDIENTE ?? 0),
            ingresos: gananciasByMonth[r.month] ?? 0,
        }))
    }, [dataGanancias, dataRentasMeses])

    /* ── estadosAloj ── */
    const estadosAloj = useMemo(() => {
        if (!dataEstados) return []
        return Object.values(dataEstados)
            .filter((e) => typeof e === 'object' && e.estatus)
            .map((e) => ({
                name: ESTATUS_CONFIG[e.estatus]?.name ?? e.estatus,
                color: ESTATUS_CONFIG[e.estatus]?.color ?? '#8b5cf6',
                value: e.total,
            }))
    }, [dataEstados])

    const totalAlojamientos = dataEstados?.totalGeneralAlojamientos ?? 0

    /* ── KPIs ── */
    const KPI_DATA = [
        { label: 'Alojamientos', value: dataAloj?.total ?? 0, ...buildDelta(dataAloj?.nuevosdelmes), accent: '#3b82f6', Icon: Home, loading: loadingAloj },
        { label: 'Propietarios', value: dataProp?.total ?? 0, ...buildDelta(dataProp?.nuevosdelmes), accent: '#10b981', Icon: User, loading: loadingProp },
        { label: 'Estudiantes', value: dataEst?.total ?? 0, ...buildDelta(dataEst?.nuevosdelmes), accent: '#f59e0b', Icon: GraduationCap, loading: loadingEst },
        { label: 'Escuelas', value: dataEsc?.total ?? 0, ...buildDelta(dataEsc?.nuevosdelmes), accent: '#8b5cf6', Icon: School, loading: loadingEsc },
    ]

    /* ── Config gráfica ── */
    const isIngresos = metric === 'ingresos'
    const lineColor = isIngresos ? '#10b981' : '#3b82f6'
    const dataKey = isIngresos ? 'ingresos' : 'reservaciones'
    const lineLabel = isIngresos ? 'Ingresos (MXN)' : 'Reservaciones'
    const prefix = isIngresos ? '$' : ''
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
    const tickColor = isDark ? '#6b7280' : '#9ca3af'
    const dotStroke = isDark ? '#18181b' : '#ffffff'
    const loadingChart = loadingGanancias || loadingRentasMeses

    const documentColumns = [
        {
            title: 'Nombre del documento',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render: (name) => (
                <Tooltip title={name}>
                    <span className="font-medium">{name}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Tipo',
            dataIndex: 'typeDocument',
            key: 'typeDocument',
            align: 'center',
            render: (type) => TYPE_DOC_LABEL[type] ?? type,
        },
        {
            title: 'Tamaño',
            dataIndex: 'size',
            key: 'size',
            align: 'center',
            render: (size) => size ? `${(size / (1024 * 1024)).toFixed(2)} MB` : 'N/A',
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                <Tag color={getStatusColor(status)} style={{ fontSize: 12 }}>
                    {getStatusLabel(status)}
                </Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Tooltip title="Ver documento" color="blue">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        style={{ color: '#1890ff' }}
                        onClick={() => window.open(record.documentUrl, '_blank')}
                    />
                </Tooltip>
            ),
        },
    ]

    const documentosData = (dataDocumentos?.documents ?? []).map((d) => ({
        ...d,
        key: d.id_documentacion,
    }))

    return (
        <div className="flex flex-col gap-4 pb-6 w-full">

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Panel de administración</h1>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Conecta-DoS · Plataforma de alojamiento estudiantil
                    </span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {KPI_DATA.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
            </div>

            {/* Visión general */}
            <SectionLabel>Visión general</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-3">

                {/* Gráfica de área */}
                <Panel
                    title="Reservaciones mensuales"
                    subtitle="Enero — Diciembre (año actual)"
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
                    }
                >
                    {loadingChart
                        ? <ChartSkeleton height={220} />
                        : (
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
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
                                        type="monotone"
                                        dataKey={dataKey}
                                        name={lineLabel}
                                        stroke={lineColor}
                                        strokeWidth={2.5}
                                        fill="url(#aGrad)"
                                        dot={{ r: 4, fill: lineColor, strokeWidth: 2, stroke: dotStroke }}
                                        activeDot={{ r: 6 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )
                    }
                </Panel>

                {/* Donut */}
                <Panel title="Estados de alojamientos" subtitle={`${totalAlojamientos} unidades en total`}>
                    {loadingEstados
                        ? <ChartSkeleton height={160} />
                        : (
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={estadosAloj}
                                        cx="50%" cy="50%"
                                        innerRadius={48} outerRadius={72}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {estadosAloj.map((e) => <Cell key={e.name} fill={e.color} />)}
                                    </Pie>
                                    <RechartTooltip formatter={(v, n) => [`${v} unidades`, n]} />
                                </PieChart>
                            </ResponsiveContainer>
                        )
                    }
                    <div className="flex flex-col gap-2 mt-3">
                        {loadingEstados
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="h-3 w-24 rounded bg-gray-100 dark:bg-zinc-700 animate-pulse" />
                                    <div className="h-3 w-6  rounded bg-gray-100 dark:bg-zinc-700 animate-pulse" />
                                </div>
                            ))
                            : estadosAloj.map((e) => (
                                <div key={e.name} className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: e.color }} />
                                        {e.name}
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{e.value}</span>
                                </div>
                            ))
                        }
                    </div>
                </Panel>
            </div>

            {/* Detalles */}
            <SectionLabel>Detalles</SectionLabel>

            {/* Tabla documentos Ant Design */}
            <Panel
                title="Documentación reciente de estudiantes"
                subtitle="Últimos 7 registros"
                extra={
                    <Button
                        size="middle"
                        onClick={() => navigate('/admin/estudiantes/documentacion')}
                    >
                        Ver todos
                    </Button>
                }
            >
                <Table
                    columns={documentColumns}
                    dataSource={documentosData}
                    loading={loadingDocumentos}
                    pagination={false}
                    size="small"
                    scroll={{ x: 'max-content' }}
                    locale={{ emptyText: 'Sin documentos recientes.' }}
                />
            </Panel>

            {/* Estudiantes por escuela */}
            <Panel title="Estudiantes por escuela" subtitle="Procedencia de los estudiantes alojados">
                {loadingEscuelasEstudiantes
                    ? (
                        <div className="flex flex-col gap-3 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-1.5">
                                        <div className="h-3 w-40 rounded bg-gray-100 dark:bg-zinc-700 animate-pulse" />
                                        <div className="h-3 w-16 rounded bg-gray-100 dark:bg-zinc-700 animate-pulse" />
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100 dark:bg-zinc-700 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (() => {
                        const lista = dataEscuelasEstudiantes ?? []
                        const maxVal = Math.max(...lista.map((e) => e.total), 1)
                        return (
                            <div className={`flex flex-col gap-3 mt-1 ${lista.length > 10 ? 'max-h-80 overflow-y-auto pr-5' : ''}`}>
                                {lista.length === 0
                                    ? <span className="text-sm text-gray-400 dark:text-gray-500">Sin datos disponibles.</span>
                                    : lista.map((e) => {
                                        const pct = Math.round((e.total / maxVal) * 100)
                                        return (
                                            <div key={e.school}>
                                                <div className="flex justify-between text-sm mb-1.5">
                                                    <span className="font-medium text-gray-800 dark:text-gray-200">{e.school}</span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {e.total} {e.total === 1 ? 'estudiante' : 'estudiantes'}
                                                    </span>
                                                </div>
                                                <div className="h-2 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })()
                }
            </Panel>
        </div>
    )
}