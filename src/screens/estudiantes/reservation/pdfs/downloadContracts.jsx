import { pdf } from "@react-pdf/renderer";
import PaymentReceiptDocument from "./PaymentReceiptPDF";
import RentalContractDocument from "./RentalContractPDF";
import api from "../../../../api/axiosConfig";

export async function downloadPaymentReceipt(idPago) {
    const { data } = await api.get(`/renta/pagos/${idPago}?estado=COMPLETADO`);

    const blob = await pdf(<PaymentReceiptDocument data={data} />).toBlob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `COMPROBANTE-PAGO-#${idPago}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
}

export async function downloadRentalContract(idPago) {
    const { data } = await api.get(`/renta/pagos/${idPago}?estado=COMPLETADO`);

    const blob = await pdf(<RentalContractDocument data={data} />).toBlob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `CONTRATO-RESERVACION-#${data.renta.id_renta}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
}