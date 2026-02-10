import React, { useEffect, useState, useMemo } from "react";
import { Upload, Button, Card, notification, Spin, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useApi } from "../../../hooks/useApi";
import { useNotification } from "../../../components/notification/NotificationProvider";

const DOCUMENT_TYPES = {
  INE_FRONT: "ine_delantera",
  INE_BACK: "ine_trasera",
  ADDRESS: "cfe",
  PASSPORT: "pasaporte",
};

// Configuración de cada tipo de documento
const DOCUMENT_CONFIG = {
  INE_FRONT: {
    title: "INE Delantera",
    required: true,
    buttonText: "Subir INE Delantera",
  },
  INE_BACK: {
    title: "INE Trasera",
    required: true,
    buttonText: "Subir INE Trasera",
  },
  ADDRESS: {
    title: "Comprobante de Domicilio (CFE)",
    required: true,
    buttonText: "Subir Comprobante",
  },
  PASSPORT: {
    title: "Pasaporte (Opcional)",
    required: false,
    buttonText: "Subir Pasaporte",
  },
};

export default function DocumentationStudent_Screen() {
  const { notify } = useNotification();
  // Estado para cada tipo de documento
  const [documents, setDocuments] = useState({
    INE_FRONT: { fileList: [], existingDoc: null },
    INE_BACK: { fileList: [], existingDoc: null },
    ADDRESS: { fileList: [], existingDoc: null },
    PASSPORT: { fileList: [], existingDoc: null },
  });

  const [status, setStatus] = useState(null);
  const [observation, setObservation] = useState("");
  const [uploading, setUploading] = useState(false);

  // Hooks de API
  const {
    data: documentsData,
    loading: loadingDocs,
    fetchData: fetchDocuments,
  } = useApi("/documentacion", {}, true);

  const { postData } = useApi("/documentacion/upload", {}, false);
  const { patchData } = useApi("/documentacion", {}, false);

  const validateFiles = (file) => {
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      notify({
        type: "error",
        title: "Archivo inválido",
        description: "Solo se permiten PNG, JPG o PDF",
      });
      return Upload.LIST_IGNORE;
    }

    if (file.size > maxSize) {
      notify({
        type: "error",
        title: "Archivo muy grande",
        description: "El tamaño máximo es 5MB",
      });
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  useEffect(() => {
    if (documentsData && Array.isArray(documentsData)) {
      const newDocuments = {
        INE_FRONT: { fileList: [], existingDoc: null },
        INE_BACK: { fileList: [], existingDoc: null },
        ADDRESS: { fileList: [], existingDoc: null },
        PASSPORT: { fileList: [], existingDoc: null },
      };

      documentsData.forEach((doc) => {
        const docTypeFromBackend = doc.type_document || doc.typeDocument;
        const docTypeKey = Object.keys(DOCUMENT_TYPES).find(
          (key) => DOCUMENT_TYPES[key] === docTypeFromBackend,
        );

        if (docTypeKey) {
          newDocuments[docTypeKey] = {
            fileList: [
              {
                uid: doc.id,
                name:
                  doc.name || doc.file_name || doc.fileName || "documento.pdf",
                status: "done",
                url:
                  doc.documentUrl ||
                  doc.document_url ||
                  doc.file_url ||
                  doc.fileUrl,
              },
            ],
            existingDoc: doc,
          };
        }
      });

      setDocuments(newDocuments);

      if (documentsData.length > 0) {
        setStatus(documentsData[0].status);
        setObservation(documentsData[0].observation || "");
      }
    }
  }, [documentsData]);

  const handleFileChange = (docType, { fileList }) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        fileList: fileList.slice(-1),
      },
    }));
  };

  const isFormComplete = useMemo(() => {
    return Object.entries(DOCUMENT_CONFIG).every(([type, config]) => {
      if (!config.required) return true;
      const doc = documents[type];
      return doc.fileList.length > 0;
    });
  }, [documents]);

  const hasChanges = useMemo(() => {
    return Object.entries(documents).some(([type, doc]) => {
      return (
        doc.fileList.length > 0 && doc.fileList[0].originFileObj !== undefined
      );
    });
  }, [documents]);

  const handleSubmit = async () => {
    if (!isFormComplete) {
      notify({
        type: "warning",
        title: "Formulario incompleto",
        description: "Completa todos los campos requeridos",
      });

      return;
    }

    setUploading(true);

    try {
      const promises = [];

      for (const [docTypeKey, doc] of Object.entries(documents)) {
        if (doc.fileList.length === 0) continue;

        const file = doc.fileList[0];

        if (file.originFileObj) {
          const formData = new FormData();
          formData.append("file", file.originFileObj);

          const typeDocumentValue = DOCUMENT_TYPES[docTypeKey];
          formData.append("typeDocument", typeDocumentValue);

          for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
            } else {
              console.log(`  ${key}: ${value}`);
            }
          }

          if (doc.existingDoc && doc.existingDoc.id) {
            promises.push(
              patchData(formData, doc.existingDoc.id).catch((err) => {
                notify({
                  type: "error",
                  title: "Error al actualizar documento",
                  description: "Ocurrió un error al actualizar el documento",
                });
                throw err;
              }),
            );
          } else {
            promises.push(
              postData(formData, false).catch((err) => {
                notify({
                  type: "error",
                  title: "Error al crear documento",
                  description: "Ocurrió un error al crear el documento",
                });
                throw err;
              }),
            );
          }
        }
      }

      if (promises.length === 0) {
        notify({
          type: "info",
          title: "Sin cambios",
          description: "No hay documentos nuevos para guardar",
        });
        return;
      }

      await Promise.all(promises);

      notify({
        type: "success",
        title: "Documentación guardada",
        description: "Tus documentos han sido actualizados correctamente",
      });

      await fetchDocuments();
    } catch (err) {
      notify({
        type: "error",
        title: "Error al guardar",
        description: err.message || "No se pudo guardar la documentación",
      });
    } finally {
      setUploading(false);
    }
  };

  const renderDocumentStatus = (docType) => {
    const doc = documents[docType];
    if (!doc.existingDoc || !doc.existingDoc.status) return null;

    const docStatus = doc.existingDoc.status;

    const statusConfig = {
      pendiente: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        text: "Pendiente",
      },

      aprobado: {
        color: "bg-green-50 text-green-700 border-green-200",
        text: "Aprobado",
      },

      rechazado: {
        color: "bg-red-50 text-red-700 border-red-200",
        text: "Rechazado",
      },
    };

    const config = statusConfig[docStatus] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      text: docStatus,
    };

    return (
      <span
        className={`px-3 py-1 rounded-md text-xs font-medium border ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const renderDocumentObservation = (docType) => {
    const doc = documents[docType];
    if (!doc.existingDoc || !doc.existingDoc.observation) return null;

    const docStatus = doc.existingDoc.status;
    const isRejected = docStatus === "rechazado";

    return (
      <Alert
        title={isRejected ? "Motivo del rechazo" : "Observación"}
        description={doc.existingDoc.observation}
        type={isRejected ? "error" : "warning"}
        // showIcon
        className="mt-2"
      // closable
      />
    );
  };

  return (
    <Spin spinning={loadingDocs || uploading}>
      <div className="space-y-6 mx-auto p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Documentación del estudiante
          </h2>
        </div>

        <div className="space-y-4">
          {Object.entries(DOCUMENT_CONFIG).map(([docType, config]) => (
            <div>
              <Card
                key={docType}
                title={
                  <div className="flex items-center justify-between">
                    <span>{config.title}</span>
                    {renderDocumentStatus(docType)}
                  </div>
                }
                className="shadow-sm"
              >
                <Upload
                  beforeUpload={validateFiles}
                  fileList={documents[docType].fileList}
                  onChange={(info) => handleFileChange(docType, info)}
                  maxCount={1}
                  accept=".png,.jpg,.jpeg,.pdf"
                >
                  <Button icon={<UploadOutlined />}>{config.buttonText}</Button>
                </Upload>
                {config.required && (
                  <p className="text-xs text-gray-500 mt-2">
                    * Campo obligatorio
                  </p>
                )}
                {renderDocumentObservation(docType)}
              </Card>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            size="large"
            onClick={() => fetchDocuments()}
            disabled={uploading}
          >
            Recargar
          </Button>
          <Button
            size="large"
            type="primary"
            disabled={!isFormComplete || !hasChanges}
            onClick={handleSubmit}
            loading={uploading}
            style={{
              backgroundColor:
                isFormComplete && hasChanges ? "#84cc16" : undefined,
            }}
          >
            {hasChanges ? "Guardar cambios" : "Guardar documentación"}
          </Button>
        </div>

        {!hasChanges && isFormComplete && (
          <Alert
            title="No hay cambios pendientes"
            description="Todos los documentos están guardados. Puedes actualizar cualquier archivo y guardar los cambios."
            type="info"
            showIcon
          />
        )}
      </div>
    </Spin>
  );
}
