import { useState, useEffect } from "react";
import { Button, Table, Tag, DatePicker, Select } from "antd";
import { ShieldCheck, AlertTriangle, Bell, X, House } from "lucide-react";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useApi } from "../../../hooks/useApi";
import RentDetailModal_Owner from "../../propietarios/rents/modals/RentDetailModal_Owner";

dayjs.locale("es");

export default function RentsScreen_Admin() {
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [alertasModalVisible, setAlertasModalVisible] = useState(false);
    const [selectedRent, setSelectedRent] = useState(null);

    const [filtros, setFiltros] = useState({
        fechaDesde: null,
        fechaHasta: null,
        estado: null,
        estadoPago: null,
        tipo_renta: null,
    });

    const [paginacion, setPaginacion] = useState({
        paginaActual: 1,
        limite: 10,
        totalRegistros: 0,
        totalPaginas: 0,
    });

    // Construir URL — sin id de propietario, ve todas las rentas
    const construirURL = (pagina = paginacion.paginaActual) => {
        const params = new URLSearchParams();
        params.append("page", pagina.toString());
        params.append("limit", paginacion.limite.toString());
        if (filtros.fechaDesde) params.append("fechaDesde", filtros.fechaDesde);
        if (filtros.fechaHasta) params.append("fechaHasta", filtros.fechaHasta);
        if (filtros.estado) params.append("estado", filtros.estado);
        if (filtros.estadoPago) params.append("estadoPago", filtros.estadoPago);
        if (filtros.tipo_renta) params.append("tipo_renta", filtros.tipo_renta);
        return `/renta/control-financiero?${params.toString()}`;
    };

    const [endpoint, setEndpoint] = useState(construirURL());

    const { data: reporteData, loading: loadingRentas, fetchData: fetchRentas } =
        useApi(endpoint, {}, false);

    useEffect(() => {
        setEndpoint(construirURL(1));
        setPaginacion(prev => ({ ...prev, paginaActual: 1 }));
    }, [filtros]);

    useEffect(() => {
        if (reporteData?.paginacion) {
            setPaginacion(prev => ({
                ...prev,
                paginaActual: reporteData.paginacion.page,
                limite: reporteData.paginacion.limit,
                totalRegistros: reporteData.paginacion.total,
                totalPaginas: reporteData.paginacion.totalPages,
            }));
        }
    }, [reporteData]);

    // Handler para cambio de página
    const handlePageChange = (page) => {
        setPaginacion(prev => ({ ...prev, paginaActual: page }));
        setEndpoint(construirURL(page));
    };

    useEffect(() => {
        if (endpoint) fetchRentas();
    }, [endpoint]);

    const rentas = reporteData?.rentas || [];
    const resumen = reporteData?.resumen || {};
    const alertas = reporteData?.alertas?.rentas_proximas_a_vencer || [];

    const limpiarFiltros = () => setFiltros({ fechaDesde: null, fechaHasta: null, estado: null, estadoPago: null, tipo_renta: null });
    const hayFiltros = filtros.fechaDesde || filtros.fechaHasta || filtros.estado || filtros.estadoPago || filtros.tipo_renta;

    const formatPrice = (p) =>
        new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(Number(p || 0));

    const getEstadoRentaColor = (e) => ({ ACTIVA: "green", FINALIZADA: "blue", CANCELADA: "red", PENDIENTE: "gold" }[e] || "default");
    const getTipoRentaColor = (t) => ({ ALOJAMIENTO_COMPLETO: "purple", CUARTO: "cyan", CAMA: "geekblue", ESPACIO: "magenta" }[t] || "default");
    const getTipoRentaLabel = (t) => ({ ALOJAMIENTO_COMPLETO: "Alojamiento completo", CUARTO: "Cuarto", CAMA: "Cama", ESPACIO: "Espacio" }[t] || t);
    const getEstadoPagoColor = (e) => ({ COMPLETADO: "green", PENDIENTE: "gold", FALLIDO: "red", CANCELADO: "red", PROCESANDO: "blue" }[e] || "default");

    const resumenCards = [
        { label: "Total rentas", value: resumen.total_rentas, color: "text-gray-800 dark:text-gray-100" },
        { label: "Activas", value: resumen.activas, color: "text-green-600 dark:text-green-400" },
        { label: "Finalizadas", value: resumen.finalizadas, color: "text-blue-600 dark:text-blue-400" },
        { label: "Canceladas", value: resumen.canceladas, color: "text-red-600 dark:text-red-400" },
        { label: "Próx. a vencer", value: resumen.proximas_a_vencer, color: "text-amber-600 dark:text-amber-400" },
        { label: "Ingresos cobrados", value: formatPrice(resumen.ingresos_totales_cobrados), color: "text-lime-700 dark:text-lime-400" },
        { label: "Ing. alojamiento", value: formatPrice(resumen.ingresos_alojamiento), color: "text-lime-700 dark:text-lime-300" },
        { label: "Ing. servicios", value: formatPrice(resumen.ingresos_servicios_adicionales), color: "text-purple-600 dark:text-purple-400" },
        { label: "Pendiente cobrar", value: formatPrice(resumen.montos_pendientes_por_cobrar), color: "text-amber-600 dark:text-amber-400" },
    ];

    // Helper para derivar estado de pago
    const getEstadoPago = (financiero) => {
        if (!financiero) return null;
        if (financiero.pago_completado) return "COMPLETADO";
        if (financiero.pago_pendiente) return "PENDIENTE";
        if (financiero.pago_cancelado) return "CANCELADO";
        // Si tienes estos campos en el futuro:
        // if (financiero.pago_fallido)    return "FALLIDO";
        // if (financiero.pago_procesando) return "PROCESANDO";
        return null;
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id_renta",
            key: "id_renta",
            align: "center",
            width: 70,
            render: (id) => <span className="font-mono text-xs text-gray-400">#{id}</span>,
        },
        {
            title: "Cliente",
            key: "cliente",
            render: (_, r) => (
                <div className="flex flex-col">
                    <span className="font-medium text-sm text-gray-900 dark:text-white leading-tight">{r.cliente?.nombre}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{r.cliente?.email}</span>
                </div>
            ),
        },
        {
            title: "Alojamiento",
            key: "ubicacion",
            render: (_, r) => (
                <div>
                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200 leading-tight">{r.ubicacion?.nombre}</span>
                    {r.ubicacion?.detalle && <p className="text-xs text-gray-400 mt-0.5">{r.ubicacion.detalle}</p>}
                </div>
            ),
        },
        {
            title: "Tipo",
            dataIndex: "tipo_renta",
            key: "tipo_renta",
            align: "center",
            render: (t) => <Tag color={getTipoRentaColor(t)} style={{ fontSize: 11 }}>{getTipoRentaLabel(t)}</Tag>,
        },
        {
            title: "Estado",
            dataIndex: "estado_renta",
            key: "estado_renta",
            align: "center",
            render: (e) => <Tag color={getEstadoRentaColor(e)} style={{ fontSize: 11 }}>{e}</Tag>,
        },
        {
            title: "Entrada",
            key: "entrada",
            align: "center",
            render: (_, r) => (
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    {dayjs(r.fechas?.entrada).format("DD [de] MMMM, YYYY")}
                </span>
            ),
        },
        {
            title: "Salida",
            key: "salida",
            align: "center",
            render: (_, r) => (
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {dayjs(r.fechas?.salida).format("DD [de] MMMM, YYYY")}
                    </span>
                    {r.fechas?.vence_pronto && (
                        <span className="text-[11px] text-amber-500 font-semibold">{r.fechas.texto_estado}</span>
                    )}
                </div>
            ),
        },
        {
            title: "Total",
            key: "total",
            align: "center",
            render: (_, r) => (
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                    {formatPrice(r.financiero?.monto_total)}
                </span>
            ),
        },
        {
            title: "Pago",
            key: "pago",
            align: "center",
            render: (_, r) => {
                const estado = getEstadoPago(r.financiero);
                return estado
                    ? <Tag color={getEstadoPagoColor(estado)} style={{ fontSize: 11 }}>{estado}</Tag>
                    : <span className="text-gray-400">—</span>;
            },
        },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            width: 80,
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EyeOutlined style={{ color: "#1677ff" }} />}
                    onClick={() => { setSelectedRent(record); setDetailModalVisible(true); }}
                    title="Ver detalle"
                />
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="bg-linear-to-r from-[#84cc16] to-[#65a30d] px-6 py-6 md:py-3 rounded-md">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2">
                            <House className="text-[#111214]!" size={35} />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-[#111214] leading-tight">Control de rentas</h1>
                            <p className="text-gray-700 text-sm mt-0.5">Monitoreo global de todas las rentas registradas en la plataforma.</p>
                        </div>
                    </div>
                    {alertas.length > 0 && (
                        <Button
                            size="middle"
                            color="danger" variant="solid"
                            onClick={() => setAlertasModalVisible(true)}
                            icon={<Bell size={16} />}
                            className="flex items-center gap-1 font-semibold shadow"
                        >
                            <span className="hidden md:inline">{alertas.length} prox. a vencer</span>
                            <span className="md:hidden">{alertas.length}</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Resumen */}
            {Object.keys(resumen).length > 0 && (
                <div className="px-2 pt-4">
                    {/* Fila 1: contadores */}
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                        {resumenCards.slice(0, 5).map((c) => (
                            <div
                                key={c.label}
                                className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm"
                                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8px 12px", flex: "1 1 80px", minWidth: 80 }}
                            >
                                <span className={`font-bold text-lg ${c.color}`} style={{ lineHeight: 1.2 }}>{c.value}</span>
                                <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: 10, marginTop: 2, lineHeight: 1.3 }}>{c.label}</span>
                            </div>
                        ))}
                    </div>
                    {/* Fila 2: ingresos */}
                    <div style={{ display: "flex", gap: 8, marginTop: 8, overflowX: "auto", paddingBottom: 4 }}>
                        {resumenCards.slice(5).map((c) => (
                            <div
                                key={c.label}
                                className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm"
                                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8px 12px", flex: "1 1 100px", minWidth: 100 }}
                            >
                                <span className={`font-bold text-sm ${c.color}`} style={{ lineHeight: 1.2 }}>{c.value}</span>
                                <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: 10, marginTop: 2, lineHeight: 1.3 }}>{c.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="px-2 pt-4">
                <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm p-4">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 150px", minWidth: 130 }}>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Fecha desde</span>
                            <DatePicker
                                placeholder="Fecha inicio"
                                format="DD/MM/YYYY"
                                value={filtros.fechaDesde ? dayjs(filtros.fechaDesde) : null}
                                onChange={(d) => setFiltros((p) => ({ ...p, fechaDesde: d ? d.format("YYYY-MM-DD") : null }))}
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 150px", minWidth: 130 }}>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Fecha hasta</span>
                            <DatePicker
                                placeholder="Fecha fin"
                                format="DD/MM/YYYY"
                                value={filtros.fechaHasta ? dayjs(filtros.fechaHasta) : null}
                                onChange={(d) => setFiltros((p) => ({ ...p, fechaHasta: d ? d.format("YYYY-MM-DD") : null }))}
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 150px", minWidth: 130 }}>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Estado renta</span>
                            <Select
                                allowClear placeholder="Estado" value={filtros.estado}
                                style={{ width: "100%" }}
                                onChange={(v) => setFiltros((p) => ({ ...p, estado: v || null }))}
                                options={[
                                    { label: "Pendiente", value: "PENDIENTE" },
                                    { label: "Activa", value: "ACTIVA" },
                                    { label: "Finalizada", value: "FINALIZADA" },
                                    { label: "Cancelada", value: "CANCELADA" },
                                ]}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 150px", minWidth: 130 }}>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Estado pago</span>
                            <Select
                                allowClear placeholder="Pago" value={filtros.estadoPago}
                                style={{ width: "100%" }}
                                onChange={(v) => setFiltros((p) => ({ ...p, estadoPago: v || null }))}
                                options={[
                                    { label: "Pendiente", value: "PENDIENTE" },
                                    { label: "Completado", value: "COMPLETADO" },
                                    { label: "Fallido", value: "FALLIDO" },
                                    { label: "Cancelado", value: "CANCELADO" },
                                    { label: "Procesando", value: "PROCESANDO" },
                                ]}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 150px", minWidth: 130 }}>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tipo renta</span>
                            <Select
                                allowClear placeholder="Tipo" value={filtros.tipo_renta}
                                style={{ width: "100%" }}
                                onChange={(v) => setFiltros((p) => ({ ...p, tipo_renta: v || null }))}
                                options={[
                                    { label: "Alojamiento completo", value: "ALOJAMIENTO_COMPLETO" },
                                    { label: "Cama", value: "CAMA" },
                                    { label: "Cuarto", value: "CUARTO" },
                                    { label: "Espacio", value: "ESPACIO" },
                                ]}
                            />
                        </div>
                        {hayFiltros && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 120px", minWidth: 100, justifyContent: "flex-end" }}>
                                <span style={{ fontSize: 12, color: "transparent", userSelect: "none" }}>-</span>
                                <Button onClick={limpiarFiltros} style={{ width: "100%" }}>Limpiar</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="p-2 pt-3">
                <div className="bg-white dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-4 md:p-6">
                    <Table
                        columns={columns}
                        dataSource={rentas.map((r) => ({ key: r.id_renta, ...r }))}
                        loading={loadingRentas}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            current: paginacion.paginaActual,
                            pageSize: paginacion.limite,
                            total: paginacion.totalRegistros,
                            showTotal: (t) => `Total ${t} rentas`,
                            showSizeChanger: false,
                            onChange: handlePageChange,
                        }}
                        locale={{ emptyText: loadingRentas ? null : "No se encontraron rentas con los filtros aplicados." }}
                    />
                </div>
            </div>

            {/* Modal detalle */}
            <RentDetailModal_Owner
                visible={detailModalVisible}
                onClose={() => { setDetailModalVisible(false); setSelectedRent(null); }}
                data={selectedRent}
            />

            {/* Modal alertas próximas a vencer */}
            {alertasModalVisible && (
                <>
                    <div className="fixed inset-0 bg-black/90 z-50" onClick={() => setAlertasModalVisible(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
                            style={{ maxHeight: "90vh" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header fijo */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shrink-0">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={20} className="text-amber-500" />
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        Rentas próximas a vencer
                                    </span>
                                    {alertas.length > 0 && (
                                        <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                            {alertas.length}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setAlertasModalVisible(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    <X size={22} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Body con scroll */}
                            <div className="flex-1 overflow-y-auto p-5">
                                {alertas.length === 0 ? (
                                    <p className="text-center text-gray-400 py-10">Sin alertas activas.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {alertas.map((a) => (
                                            <div
                                                key={a.id_renta}
                                                className="flex items-start gap-4 p-4 bg-white dark:bg-zinc-950 border border-amber-200 dark:border-amber-700/50 rounded-xl"
                                            >
                                                <div className="shrink-0 w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                                                    <AlertTriangle size={18} className="text-amber-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
                                                        {a.cliente}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{a.email}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{a.ubicacion}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            Salida: <strong>{dayjs(a.fecha_salida).format("DD [de] MMMM, YYYY")}</strong>
                                                        </span>
                                                        <Tag color="red" style={{ fontSize: 11, margin: 0 }}>
                                                            {a.dias_restantes} día{a.dias_restantes !== 1 ? "s" : ""} restante{a.dias_restantes !== 1 ? "s" : ""}
                                                        </Tag>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer fijo */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 shrink-0">
                                <Button size="large" type="primary" danger onClick={() => setAlertasModalVisible(false)} className="px-8 rounded-lg">
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}