import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import { LOGO_BASE64 } from "../../../../assets/logoPDFBase64";

const LIME      = "#65a30d";
const LIME_DARK = "#3f6212";
const GRAY_50   = "#f9fafb";
const GRAY_100  = "#f3f4f6";
const GRAY_200  = "#e5e7eb";
const GRAY_400  = "#9ca3af";
const GRAY_500  = "#6b7280";
const GRAY_700  = "#374151";
const GRAY_900  = "#111827";
const WHITE     = "#ffffff";

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
        fontSize: 18,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        color: "#d9f99d",
        fontSize: 9,
        marginTop: 3,
    },
    headerBadge: {
        backgroundColor: WHITE,
        color: LIME_DARK,
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        letterSpacing: 0.5,
    },
    headerContractNo: {
        color: "#d9f99d",
        fontSize: 8,
        marginTop: 4,
        textAlign: "right",
    },
    body: {
        paddingHorizontal: 36,
        paddingTop: 20,
        paddingBottom: 20,
    },
    contractTitle: {
        fontSize: 13,
        fontFamily: "Helvetica-Bold",
        color: GRAY_900,
        textAlign: "center",
        marginBottom: 4,
        marginTop: 4,
    },
    contractSubtitle: {
        fontSize: 8,
        color: GRAY_500,
        textAlign: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: LIME,
        textTransform: "uppercase",
        letterSpacing: 1.2,
        marginBottom: 7,
        marginTop: 16,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#dcfce7",
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
        marginBottom: 5,
    },
    cardRowLast: {
        flexDirection: "row",
    },
    cardLabel: { fontSize: 8, color: GRAY_500, width: 140 },
    cardValue: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: GRAY_900,
        flex: 1,
    },
    grid2: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 8,
    },
    gridCell: {
        flex: 1,
        backgroundColor: GRAY_50,
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: GRAY_200,
    },
    gridCellLabel: { fontSize: 7, color: GRAY_500, marginBottom: 3 },
    gridCellValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: GRAY_900 },
    servicesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
        marginTop: 4,
    },
    serviceChip: {
        backgroundColor: "#f0fdf4",
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "#bbf7d0",
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    serviceChipText: { fontSize: 7, color: LIME_DARK, fontFamily: "Helvetica-Bold" },
    serviceChipPrice: { fontSize: 7, color: GRAY_500 },
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
    clauseContainer: { marginBottom: 10 },
    clauseTitle: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: GRAY_900,
        marginBottom: 3,
    },
    clauseText: {
        fontSize: 7.5,
        color: GRAY_700,
        lineHeight: 1.6,
    },
    clauseHighlight: {
        fontFamily: "Helvetica-Bold",
        color: GRAY_900,
    },
    legalNote: {
        backgroundColor: "#fefce8",
        borderRadius: 6,
        padding: 10,
        marginTop: 14,
        borderWidth: 1,
        borderColor: "#fef08a",
    },
    legalNoteText: {
        fontSize: 7,
        color: "#713f12",
        lineHeight: 1.5,
    },
    divider: { height: 1, backgroundColor: GRAY_200, marginVertical: 12 },
    signaturesRow: {
        flexDirection: "row",
        gap: 20,
        marginTop: 24,
    },
    signatureBox: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: GRAY_200,
        paddingTop: 8,
        alignItems: "center",
    },
    signatureLabel: { fontSize: 7, color: GRAY_500, marginBottom: 2 },
    signatureName: { fontSize: 8, fontFamily: "Helvetica-Bold", color: GRAY_900 },
    signatureRole: { fontSize: 7, color: GRAY_400, marginTop: 2 },
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

const getDescripcionUbicacion = (ubicacion) => {
    if (!ubicacion) return "Sin información";
    const { alojamiento, cuarto, cama } = ubicacion;
    const parts = [];
    if (alojamiento?.nombre) parts.push(alojamiento.nombre);
    if (cuarto?.nombre) parts.push(cuarto.nombre);
    if (cama?.nombre) parts.push(cama.nombre);
    return parts.join(" › ") || "Sin nombre";
};

function RentalContractDocument({ data }) {
    const { renta, id_pago, monto, metodo_pago, transaccion_id } = data;
    const { ubicacion, servicios, totales, tipo_renta } = renta;

    const alojamiento    = ubicacion?.alojamiento;
    const cuarto         = ubicacion?.cuarto;
    const cama           = ubicacion?.cama;
    const tieneServicios = servicios?.length > 0;
    const fechaHoy       = formatDate(new Date().toISOString().slice(0, 10));

    return (
        <Document title={`Contrato de Reservación #${renta.id_renta}`}>

            {/* ══ PÁGINA 1 ══════════════════════════════════════════ */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Image src={LOGO_BASE64} style={{ width: 130, height: 28, objectFit: "contain", marginBottom: 6 }} />
                        <Text style={styles.headerTitle}>Contrato de Reservación</Text>
                        <Text style={styles.headerSubtitle}>Plataforma de alojamiento estudiantil</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.headerBadge}>{renta.estado}</Text>
                        <Text style={styles.headerContractNo}>Contrato #{renta.id_renta}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={styles.contractTitle}>CONTRATO DE ARRENDAMIENTO DE ALOJAMIENTO ESTUDIANTIL</Text>
                    <Text style={styles.contractSubtitle}>
                        Suscrito el {fechaHoy} a través de la plataforma digital Conecta-DoS
                    </Text>

                    {/* I. Identificación */}
                    <Text style={styles.sectionTitle}>I. Identificación del contrato</Text>
                    <View style={styles.grid2}>
                        <View style={styles.gridCell}>
                            <Text style={styles.gridCellLabel}>N° de contrato / reserva</Text>
                            <Text style={styles.gridCellValue}>#{renta.id_renta}</Text>
                        </View>
                        <View style={styles.gridCell}>
                            <Text style={styles.gridCellLabel}>Tipo de alojamiento</Text>
                            <Text style={styles.gridCellValue}>{getTipoLabel(tipo_renta)}</Text>
                        </View>
                    </View>
                    <View style={styles.grid2}>
                        <View style={styles.gridCell}>
                            <Text style={styles.gridCellLabel}>Fecha de entrada</Text>
                            <Text style={styles.gridCellValue}>{formatDate(renta.fecha_entrada)}</Text>
                        </View>
                        <View style={styles.gridCell}>
                            <Text style={styles.gridCellLabel}>Fecha de salida</Text>
                            <Text style={styles.gridCellValue}>{formatDate(renta.fecha_salida)}</Text>
                        </View>
                    </View>

                    {/* II. Inmueble */}
                    <Text style={styles.sectionTitle}>II. Descripción del inmueble</Text>
                    <View style={styles.card}>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>Nombre del alojamiento</Text>
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
                                <Text style={styles.cardLabel}>Cuarto asignado</Text>
                                <Text style={styles.cardValue}>{cuarto.nombre}</Text>
                            </View>
                        ) : null}
                        {cama ? (
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Cama asignada</Text>
                                <Text style={styles.cardValue}>{cama.nombre}</Text>
                            </View>
                        ) : null}
                        <View style={styles.cardRowLast}>
                            <Text style={styles.cardLabel}>Descripción completa</Text>
                            <Text style={styles.cardValue}>{getDescripcionUbicacion(ubicacion)}</Text>
                        </View>
                    </View>

                    {/* III. Servicios */}
                    <Text style={styles.sectionTitle}>III. Servicios incluidos</Text>
                    {tieneServicios ? (
                        <View style={styles.servicesRow}>
                            {servicios.map((s) => (
                                <View key={s.id_renta_servicio} style={styles.serviceChip}>
                                    <Text style={styles.serviceChipText}>{s.nombre}</Text>
                                    {Number(s.precio) > 0 ? (
                                        <Text style={styles.serviceChipPrice}>· {formatCurrency(s.precio)}</Text>
                                    ) : (
                                        <Text style={styles.serviceChipPrice}>· Incluido</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ fontSize: 8, color: GRAY_500, fontStyle: "italic" }}>
                            Este contrato no contempla servicios adicionales.
                        </Text>
                    )}

                    {/* IV. Condiciones económicas */}
                    <Text style={[styles.sectionTitle, { marginTop: 18 }]}>IV. Condiciones económicas</Text>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Concepto</Text>
                        <Text style={[styles.tableHeaderText, { textAlign: "right" }]}>Monto (MXN)</Text>
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
                                : "No aplica"}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>
                            Precio mensual × {renta.meses_pagados} mes(es)
                        </Text>
                        <Text style={styles.tableCellRight}>{formatCurrency(renta.precio_mensual)}/mes</Text>
                    </View>
                    <View style={styles.totalBlock}>
                        <Text style={styles.totalLabel}>TOTAL DEL CONTRATO</Text>
                        <Text style={styles.totalAmount}>{formatCurrency(totales?.monto_total)}</Text>
                    </View>

                    {/* Método de pago */}
                    <View style={[styles.card, { marginTop: 12 }]}>
                        <View style={{ flexDirection: "row", marginBottom: 5 }}>
                            <Text style={[styles.cardLabel, { width: "auto", flex: 1 }]}>Método de pago</Text>
                            <Text style={[styles.cardLabel, { width: "auto", flex: 2 }]}>ID de transacción</Text>
                            <Text style={[styles.cardLabel, { width: "auto", flex: 1, textAlign: "right" }]}>Referencia</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                            <Text style={[styles.cardValue, { flex: 1, textTransform: "uppercase" }]}>
                                {metodo_pago || "—"}
                            </Text>
                            <Text style={[styles.cardValue, { flex: 2, fontSize: 7, letterSpacing: 0.2 }]}>
                                {transaccion_id || "—"}
                            </Text>
                            <Text style={[styles.cardValue, { flex: 1, textAlign: "right" }]}>
                                #{id_pago}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>Contrato de arrendamiento · Conecta-DoS · Página 1</Text>
                    <Text style={styles.footerBrand}>Conecta-DoS</Text>
                </View>
            </Page>

            {/* ══ PÁGINA 2: CLÁUSULAS ══════════════════════════════ */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Image src={LOGO_BASE64} style={{ width: 100, height: 22, objectFit: "contain", marginBottom: 6 }} />
                        <Text style={styles.headerTitle}>Cláusulas y Condiciones</Text>
                        <Text style={styles.headerSubtitle}>Contrato de Reservación #{renta.id_renta}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.headerBadge}>Conecta-DoS</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>V. Cláusulas del contrato</Text>

                    <View style={styles.clauseContainer}>
                        <Text style={styles.clauseTitle}>CLÁUSULA PRIMERA – Objeto del contrato</Text>
                        <Text style={styles.clauseText}>
                            El presente contrato tiene por objeto el arrendamiento temporal de {getTipoLabel(tipo_renta).toLowerCase()}{" "}
                            ubicado en{" "}
                            <Text style={styles.clauseHighlight}>
                                {getDescripcionUbicacion(ubicacion)}
                                {alojamiento?.direccion ? `, ${alojamiento.direccion}` : ""}
                            </Text>,
                            por un período de <Text style={styles.clauseHighlight}>{renta.meses_pagados} mes(es)</Text>,
                            comprendido del <Text style={styles.clauseHighlight}>{formatDate(renta.fecha_entrada)}</Text>{" "}
                            al <Text style={styles.clauseHighlight}>{formatDate(renta.fecha_salida)}</Text>.
                        </Text>
                    </View>

                    <View style={styles.clauseContainer}>
                        <Text style={styles.clauseTitle}>CLÁUSULA SEGUNDA – Monto y forma de pago</Text>
                        <Text style={styles.clauseText}>
                            El arrendatario se compromete a pagar la cantidad de{" "}
                            <Text style={styles.clauseHighlight}>{formatCurrency(totales?.monto_total)} M.N.</Text>{" "}
                            como monto total del presente contrato. Dicho pago ha sido realizado mediante{" "}
                            <Text style={styles.clauseHighlight}>{metodo_pago?.toUpperCase()}</Text>{" "}
                            con número de transacción{" "}
                            <Text style={styles.clauseHighlight}>{transaccion_id || "N/A"}</Text>,
                            quedando saldada la totalidad del período contratado.
                        </Text>
                    </View>

                    <View style={styles.clauseContainer}>
                        <Text style={styles.clauseTitle}>CLÁUSULA TERCERA – Uso del inmueble</Text>
                        <Text style={styles.clauseText}>
                            El inmueble objeto de este contrato deberá ser utilizado única y exclusivamente como
                            alojamiento estudiantil. Queda prohibido el subarrendamiento total o parcial sin
                            autorización expresa del arrendador. El arrendatario se compromete a mantener el
                            inmueble en buen estado y a respetar el reglamento interno del alojamiento.
                        </Text>
                    </View>

                    <View style={styles.clauseContainer}>
                        <Text style={styles.clauseTitle}>CLÁUSULA CUARTA – Servicios incluidos</Text>
                        <Text style={styles.clauseText}>
                            {tieneServicios
                                ? `Los siguientes servicios están incluidos en el presente contrato: ${servicios
                                    .map((s) =>
                                        Number(s.precio) > 0
                                            ? `${s.nombre} (${formatCurrency(s.precio)})`
                                            : `${s.nombre} (incluido sin costo adicional)`
                                    )
                                    .join(", ")}. Cualquier servicio adicional no contemplado en este listado será responsabilidad del arrendatario.`
                                : "El presente contrato no contempla servicios adicionales. El arrendatario será responsable del pago de todos los servicios (agua, luz, internet, etc.) según corresponda."}
                        </Text>
                    </View>

                    <View style={styles.clauseContainer}>
                        <Text style={styles.clauseTitle}>CLÁUSULA QUINTA – Terminación anticipada</Text>
                        <Text style={styles.clauseText}>
                            En caso de que el arrendatario desee terminar el contrato antes de la fecha pactada,
                            deberá notificarlo con un mínimo de 15 días de anticipación a través de la plataforma
                            Conecta-DoS. Las condiciones de reembolso quedarán sujetas a la política vigente de
                            cancelación de la plataforma al momento de la solicitud.
                        </Text>
                    </View>

                    <View style={styles.clauseContainer}>
                        <Text style={styles.clauseTitle}>CLÁUSULA SEXTA – Responsabilidades</Text>
                        <Text style={styles.clauseText}>
                            El arrendatario se hace responsable de cualquier daño causado al inmueble o a los
                            muebles y enseres incluidos en el mismo durante el período de arrendamiento. El
                            arrendador garantiza que el inmueble se entregará en condiciones óptimas de
                            habitabilidad conforme a lo establecido en la plataforma.
                        </Text>
                    </View>

                    <View style={styles.clauseContainer}>
                        <Text style={styles.clauseTitle}>CLÁUSULA SÉPTIMA – Jurisdicción</Text>
                        <Text style={styles.clauseText}>
                            Para la interpretación y cumplimiento del presente contrato, las partes se someten
                            expresamente a las leyes aplicables de los Estados Unidos Mexicanos y a la
                            jurisdicción de los tribunales competentes, renunciando al fuero que pudiera
                            corresponderles por razón de su domicilio presente o futuro.
                        </Text>
                    </View>

                    <View style={styles.legalNote}>
                        <Text style={styles.legalNoteText}>
                            ⚠ AVISO LEGAL: Este documento constituye un contrato legalmente vinculante entre el
                            arrendatario y el propietario a través de la plataforma Conecta-DoS. Al haber realizado
                            el pago correspondiente, el arrendatario acepta todas las cláusulas y condiciones aquí
                            establecidas. Conserva este documento como evidencia del acuerdo.
                        </Text>
                    </View>

                    <View style={styles.divider} />
                    <Text style={{ fontSize: 8, color: GRAY_500, marginBottom: 10, textAlign: "center" }}>
                        Contrato generado digitalmente el {fechaHoy}
                    </Text>
                    <View style={styles.signaturesRow}>
                        <View style={styles.signatureBox}>
                            <Text style={styles.signatureLabel}>Arrendatario</Text>
                            <Text style={styles.signatureName}>____________________________</Text>
                            <Text style={styles.signatureRole}>Estudiante / Inquilino</Text>
                        </View>
                        <View style={styles.signatureBox}>
                            <Text style={styles.signatureLabel}>Propietario</Text>
                            <Text style={styles.signatureName}>____________________________</Text>
                            <Text style={styles.signatureRole}>{alojamiento?.nombre || "Propietario"}</Text>
                        </View>
                        <View style={styles.signatureBox}>
                            <Text style={styles.signatureLabel}>Plataforma</Text>
                            <Text style={styles.signatureName}>____________________________</Text>
                            <Text style={styles.signatureRole}>Conecta-DoS</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>Contrato de arrendamiento · Conecta-DoS · Página 2</Text>
                    <Text style={styles.footerBrand}>Conecta-DoS</Text>
                </View>
            </Page>
        </Document>
    );
}

export default RentalContractDocument;