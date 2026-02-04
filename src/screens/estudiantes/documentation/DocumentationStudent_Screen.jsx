import React, { useState, useEffect } from "react";
import { Upload, Button, Card, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function DocumentationStudent_Screen() {
  const [ineFiles, setIneFiles] = useState([]);
  const [addressFile, setAddressFile] = useState([]);
  const [passportFile, setPassportFile] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const hasDocs = localStorage.getItem("hasDocuments") === "true";
    setSaved(hasDocs);
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
      notify(
        "error",
        "Límite alcanzado",
        `Solo se permiten ${limit} archivo${limit > 1 ? "s" : ""}`,
      );
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

  const saveFiles = () => {
    if (ineFiles.length !== 2 || addressFile.length !== 1) {
      notify(
        "error",
        "Documentación incompleta",
        "Debes subir ambos lados del INE y el comprobante de domicilio",
      );
      return;
    }

    localStorage.setItem("hasDocuments", "true");

    setSaved(true);
    notify(
      "success",
      "Archivos guardados correctamente",
      "La documentación fue registrada con éxito",
    );
  };

  const removeFile = (setter) => {
    setter([]);
    setSaved(false);
    localStorage.setItem("hasDocuments", "false");
  };

  const renderSaved = (files, setter) =>
    files.map((file) => (
      <div
        key={file.uid}
        className="flex items-center justify-between rounded-xl border px-4 py-3 mt-3 bg-white shadow-sm"
      >
        <span className="text-sm font-medium truncate">{file.name}</span>
        <Button danger type="link" onClick={() => removeFile(setter)}>
          Remover
        </Button>
      </div>
    ));

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Documentación del Estudiante</h2>

      <Card
        title="INE / Identificación Oficial"
        className="rounded-xl shadow-sm"
      >
        {!saved && (
          <Upload
            beforeUpload={(file) => validateFiles(file, 2, ineFiles.length)}
            fileList={ineFiles}
            onChange={({ fileList }) => setIneFiles(fileList.slice(0, 2))}
            maxCount={2}
          >
            <Button icon={<UploadOutlined />}>Subir INE (Ambos lados)</Button>
          </Upload>
        )}
        {saved && renderSaved(ineFiles, setIneFiles)}
      </Card>

      <Card title="Comprobante de Domicilio" className="rounded-xl shadow-sm">
        {!saved && (
          <Upload
            beforeUpload={(file) => validateFiles(file, 1, addressFile.length)}
            fileList={addressFile}
            onChange={({ fileList }) => setAddressFile(fileList.slice(0, 1))}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Subir Comprobante</Button>
          </Upload>
        )}
        {saved && renderSaved(addressFile, setAddressFile)}
      </Card>

      <Card title="Pasaporte (Opcional)" className="rounded-xl shadow-sm">
        {!saved && (
          <Upload
            beforeUpload={(file) => validateFiles(file, 1, passportFile.length)}
            fileList={passportFile}
            onChange={({ fileList }) => setPassportFile(fileList.slice(0, 1))}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Subir Pasaporte</Button>
          </Upload>
        )}
        {saved && renderSaved(passportFile, setPassportFile)}
      </Card>

      {!saved && (
        <div className="flex justify-end mt-[30px]">
          <Button
            size="large"
            onClick={saveFiles}
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
    </div>
  );
}
