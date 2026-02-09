import React, { useState, useEffect } from "react";
import { Upload, Button, Card, notification, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function DocumentationStudent_Screen() {
  const [ineFrontFile, setIneFrontFile] = useState([]);
  const [ineBackFile, setIneBackFile] = useState([]);
  const [addressFile, setAddressFile] = useState([]);
  const [passportFile, setPassportFile] = useState([]);

  const [status, setStatus] = useState(null);
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/v1/documentacion/student")
      .then((res) => res.json())
      .then((data) => {
        if (data?.status) {
          setStatus(data.status);
          setObservation(data.observation || "");
        }
      })
      .catch(() => {
        setStatus(null);
      });
  }, []);

  const notify = (type, title, description) => {
    notification[type]({
      message: title,
      description,
      placement: "topRight",
    });
  };

  const validateFiles = (file, limit, currentLength) => {
    if (currentLength >= limit) {
      notify("error", "Límite alcanzado", `Solo se permite ${limit} archivo`);
      return Upload.LIST_IGNORE;
    }

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];

    if (!validTypes.includes(file.type)) {
      notify(
        "error",
        "Archivo incorrecto",
        "Solo se permiten archivos PNG, JPG o PDF",
      );
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const uploadDocumentation = async () => {
    if (
      ineFrontFile.length !== 1 ||
      ineBackFile.length !== 1 ||
      addressFile.length !== 1
    ) {
      notify(
        "error",
        "Documentación incompleta",
        "Debes subir INE delantera, INE trasera y comprobante",
      );
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("ineFront", ineFrontFile[0].originFileObj);
    formData.append("ineBack", ineBackFile[0].originFileObj);
    formData.append("address", addressFile[0].originFileObj);

    if (passportFile.length === 1) {
      formData.append("passport", passportFile[0].originFileObj);
    }

    try {
      await fetch("/api/v1/documentacion/upload", {
        method: "POST",
        body: formData,
      });

      setStatus("PENDIENTE");
      setObservation("");

      notify(
        "success",
        "Documentación enviada",
        "Tus documentos están en revisión",
      );
    } catch {
      notify("error", "Error", "No se pudo enviar la documentación");
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = () => {
    if (!status) return null;

    return (
      <div className="mb-6">
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold
            ${status === "PENDIENTE" && "bg-yellow-100 text-yellow-800"}
            ${status === "APROBADO" && "bg-green-100 text-green-800"}
            ${status === "RECHAZADO" && "bg-red-100 text-red-800"}
          `}
        >
          {status}
        </span>
      </div>
    );
  };

  return (
    <Spin spinning={loading}>
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Documentación del Estudiante</h2>

        {renderStatus()}

        <Card title="INE Delantera" className="rounded-xl shadow-sm">
          <Upload
            beforeUpload={(file) => validateFiles(file, 1, ineFrontFile.length)}
            fileList={ineFrontFile}
            onChange={({ fileList }) => setIneFrontFile(fileList.slice(0, 1))}
            maxCount={1}
            disabled={status === "APROBADO"}
          >
            <Button icon={<UploadOutlined />}>Subir INE Delantera</Button>
          </Upload>
        </Card>

        <Card title="INE Trasera" className="rounded-xl shadow-sm">
          <Upload
            beforeUpload={(file) => validateFiles(file, 1, ineBackFile.length)}
            fileList={ineBackFile}
            onChange={({ fileList }) => setIneBackFile(fileList.slice(0, 1))}
            maxCount={1}
            disabled={status === "APROBADO"}
          >
            <Button icon={<UploadOutlined />}>Subir INE Trasera</Button>
          </Upload>
        </Card>

        <Card title="Comprobante de Domicilio" className="rounded-xl shadow-sm">
          <Upload
            beforeUpload={(file) => validateFiles(file, 1, addressFile.length)}
            fileList={addressFile}
            onChange={({ fileList }) => setAddressFile(fileList.slice(0, 1))}
            maxCount={1}
            disabled={status === "APROBADO"}
          >
            <Button icon={<UploadOutlined />}>Subir Comprobante</Button>
          </Upload>
        </Card>

        <Card title="Pasaporte (Opcional)" className="rounded-xl shadow-sm">
          <Upload
            beforeUpload={(file) => validateFiles(file, 1, passportFile.length)}
            fileList={passportFile}
            onChange={({ fileList }) => setPassportFile(fileList.slice(0, 1))}
            maxCount={1}
            disabled={status === "APROBADO"}
          >
            <Button icon={<UploadOutlined />}>Subir Pasaporte</Button>
          </Upload>
        </Card>

        {status !== "APROBADO" && (
          <div className="flex justify-end mt-[30px]">
            <Button
              size="large"
              onClick={uploadDocumentation}
              style={{
                backgroundColor: "#84cc16",
                borderColor: "#84cc16",
                color: "#fff",
              }}
            >
              Subir archivos
            </Button>
          </div>
        )}

        {status === "RECHAZADO" && observation && (
          <div className="mt-2 text-sm text-red-600">
            <strong>Motivo del rechazo:</strong> {observation}
          </div>
        )}
      </div>
    </Spin>
  );
}
