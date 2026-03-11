import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import { LOGO_BASE64 } from "../../../../assets/logoPDFBase64";

const LIME       = "#65a30d";
const LIME_LIGHT = "#ecfccb";
const LIME_DARK  = "#3f6212";
const GRAY_50    = "#f9fafb";
const GRAY_100   = "#f3f4f6";
const GRAY_200   = "#e5e7eb";
const GRAY_500   = "#6b7280";
const GRAY_700   = "#374151";
const GRAY_900   = "#111827";
const WHITE      = "#ffffff";

const styles = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        backgroundColor: WHITE,
        padding: 0,
    },
    header: {
        backgroundColor: LIME,
        paddingHorizontal: 36,
        paddingTop: 28,
        paddingBottom: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitle: {
        color: WHITE,
        fontSize: 20,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        color: "#d9f99d",
        fontSize: 9,
        marginTop: 3,
    },
    badgeEstado: {
        backgroundColor: WHITE,
        color: LIME_DARK,
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        letterSpacing: 0.5,
    },
    headerIdText: {
        color: "#d9f99d",
        fontSize: 8,
        marginTop: 4,
        textAlign: "right",
    },
    body: {
        paddingHorizontal: 36,
        paddingTop: 22,
        paddingBottom: 20,
    },
    emitidoText: {
        fontSize: 7,
        color: GRAY_500,
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: LIME,
        textTransform: "uppercase",
        letterSpacing: 1.2,
        marginBottom: 7,
        marginTop: 16,
    },
    card: {
        backgroundColor: GRAY_50,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: GRAY_200,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    cardRowLast: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardLabel: { fontSize: 8, color: GRAY_500, flex: 1 },
    cardValue: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: GRAY_900,
        flex: 2,
        textAlign: "right",
    },
    servicesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
        marginTop: 4,
    },
    serviceChip: {
        backgroundColor: LIME_LIGHT,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    serviceChipText: { fontSize: 7, color: LIME_DARK, fontFamily: "Helvetica-Bold" },
    serviceChipPrice: { fontSize: 7, color: LIME },
    tableHeader: {
        backgroundColor: LIME,
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 2,
    },
    tableHeaderText: {
        color: WHITE,
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        flex: 1,
    },
    tableRow: {
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: GRAY_100,
    },
    tableRowAlt: { backgroundColor: GRAY_50 },
    tableCell: { fontSize: 8, color: GRAY_700, flex: 1 },
    tableCellRight: { fontSize: 8, color: GRAY_700, flex: 1, textAlign: "right" },
    totalBlock: {
        backgroundColor: LIME,
        borderRadius: 10,
        paddingHorizontal: 18,
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
    },
    totalLabel: { color: WHITE, fontSize: 10, fontFamily: "Helvetica-Bold", letterSpacing: 0.5 },
    totalAmount: { color: WHITE, fontSize: 18, fontFamily: "Helvetica-Bold" },
    divider: { height: 1, backgroundColor: GRAY_200, marginVertical: 12 },
    footer: {
        backgroundColor: GRAY_100,
        paddingHorizontal: 36,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: GRAY_200,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerText: { fontSize: 7, color: GRAY_500 },
    footerBrand: { fontSize: 7, fontFamily: "Helvetica-Bold", color: LIME_DARK },
});

const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
    }).format(Number(amount) || 0);

const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const [year, month, day] = dateStr.split("-");
    const months = [
        "enero","febrero","marzo","abril","mayo","junio",
        "julio","agosto","septiembre","octubre","noviembre","diciembre",
    ];
    return `${day} de ${months[parseInt(month, 10) - 1]} de ${year}`;
};

const getTipoLabel = (tipo) => ({
    ALOJAMIENTO_COMPLETO: "Alojamiento Completo",
    CUARTO: "Cuarto",
    CAMA: "Cama",
}[tipo] || tipo);

function PaymentReceiptDocument({ data }) {
    const { renta, id_pago, monto, estado, metodo_pago, transaccion_id } = data;
    const { ubicacion, servicios, totales, tipo_renta } = renta;

    const alojamiento    = ubicacion?.alojamiento;
    const cuarto         = ubicacion?.cuarto;
    const cama           = ubicacion?.cama;
    const tieneServicios = servicios?.length > 0;

    return (
        <Document title={`Comprobante de Pago #${id_pago}`}>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Image src={LOGO_BASE64} style={{ width: 130, height: 28, objectFit: "contain", marginBottom: 6 }} />
                        <Text style={styles.headerTitle}>Comprobante de Pago</Text>
                        <Text style={styles.headerSubtitle}>Plataforma de alojamiento estudiantil</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.badgeEstado}>{estado}</Text>
                        <Text style={styles.headerIdText}>Pago #{id_pago} · Reserva #{renta.id_renta}</Text>
                    </View>
                </View>

                {/* Body */}
                <View style={styles.body}>
                    <Text style={styles.emitidoText}>
                        Emitido el {formatDate(new Date().toISOString().slice(0, 10))}
                    </Text>

                    {/* Alojamiento */}
                    <Text style={styles.sectionTitle}>Información del alojamiento</Text>
                    <View style={styles.card}>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>Tipo de renta</Text>
                            <Text style={styles.cardValue}>{getTipoLabel(tipo_renta)}</Text>
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>Alojamiento</Text>
                            <Text style={styles.cardValue}>{alojamiento?.nombre || "—"}</Text>
                        </View>
                        {alojamiento?.direccion ? (
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Dirección</Text>
                                <Text style={styles.cardValue}>{alojamiento.direccion}</Text>
                            </View>
                        ) : null}
                        {cuarto ? (
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Cuarto</Text>
                                <Text style={styles.cardValue}>{cuarto.nombre}</Text>
                            </View>
                        ) : null}
                        {cama ? (
                            <View style={styles.cardRowLast}>
                                <Text style={styles.cardLabel}>Cama</Text>
                                <Text style={styles.cardValue}>{cama.nombre}</Text>
                            </View>
                        ) : null}
                    </View>

                    {/* Período */}
                    <Text style={styles.sectionTitle}>Período de la renta</Text>
                    <View style={styles.card}>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>Fecha de entrada</Text>
                            <Text style={styles.cardValue}>{formatDate(renta.fecha_entrada)}</Text>
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>Fecha de salida</Text>
                            <Text style={styles.cardValue}>{formatDate(renta.fecha_salida)}</Text>
                        </View>
                        <View style={styles.cardRowLast}>
                            <Text style={styles.cardLabel}>Meses pagados</Text>
                            <Text style={styles.cardValue}>{renta.meses_pagados} mes(es)</Text>
                        </View>
                    </View>

                    {/* Servicios */}
                    <Text style={styles.sectionTitle}>Servicios incluidos</Text>
                    {tieneServicios ? (
                        <View style={styles.servicesRow}>
                            {servicios.map((s) => (
                                <View key={s.id_renta_servicio} style={styles.serviceChip}>
                                    <Text style={styles.serviceChipText}>{s.nombre}</Text>
                                    {Number(s.precio) > 0 && (
                                        <Text style={styles.serviceChipPrice}>· {formatCurrency(s.precio)}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ fontSize: 8, color: GRAY_500, fontStyle: "italic" }}>
                            Sin servicios adicionales
                        </Text>
                    )}

                    {/* Desglose */}
                    <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Desglose de pago</Text>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Concepto</Text>
                        <Text style={[styles.tableHeaderText, { textAlign: "right" }]}>Monto</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Subtotal alojamiento</Text>
                        <Text style={styles.tableCellRight}>{formatCurrency(totales?.subtotal_alojamiento)}</Text>
                    </View>
                    <View style={[styles.tableRow, styles.tableRowAlt]}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Total servicios</Text>
                        <Text style={styles.tableCellRight}>
                            {Number(totales?.total_servicios) > 0
                                ? formatCurrency(totales.total_servicios)
                                : "No incluido"}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>
                            Precio mensual × {renta.meses_pagados} mes(es)
                        </Text>
                        <Text style={styles.tableCellRight}>{formatCurrency(renta.precio_mensual)}/mes</Text>
                    </View>

                    {/* Total */}
                    <View style={styles.totalBlock}>
                        <Text style={styles.totalLabel}>TOTAL PAGADO</Text>
                        <Text style={styles.totalAmount}>{formatCurrency(monto)}</Text>
                    </View>

                    {/* Método de pago */}
                    <View style={styles.divider} />
                    <View style={styles.card}>
                        <View style={{ flexDirection: "row", marginBottom: 5 }}>
                            <Text style={[styles.cardLabel, { flex: 1 }]}>Método de pago</Text>
                            <Text style={[styles.cardLabel, { flex: 2 }]}>ID de transacción</Text>
                            <Text style={[styles.cardLabel, { flex: 1, textAlign: "right" }]}>Referencia de pago</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                            <Text style={[styles.cardValue, { flex: 1, textAlign: "left", textTransform: "uppercase" }]}>
                                {metodo_pago || "—"}
                            </Text>
                            <Text style={[styles.cardValue, { flex: 2, textAlign: "left", fontSize: 7, letterSpacing: 0.2 }]}>
                                {transaccion_id || "—"}
                            </Text>
                            <Text style={[styles.cardValue, { flex: 1, textAlign: "right" }]}>
                                #{id_pago}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>Comprobante oficial. Consérvalo para cualquier aclaración.</Text>
                    <Text style={styles.footerBrand}>Conecta-DoS</Text>
                </View>
            </Page>
        </Document>
    );
}

export default PaymentReceiptDocument;