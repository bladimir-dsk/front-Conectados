import React, { useEffect, useMemo, useState } from "react";
import { Upload, Button, Card, notification, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET;

export default function DocumentationStudent_Screen() {
  const [ineFrontFile, setIneFrontFile] = useState([]);
  const [ineBackFile, setIneBackFile] = useState([]);
  const [addressFile, setAddressFile] = useState([]);
  const [passportFile, setPassportFile] = useState([]);

  const [status, setStatus] = useState(null);
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(false);

  const notify = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
    });
  };

  const isFormComplete = useMemo(
    () =>
      ineFrontFile.length === 1 &&
      ineBackFile.length === 1 &&
      addressFile.length === 1,
    [ineFrontFile, ineBackFile, addressFile],
  );

  const validateFiles = (file) => {
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];

    if (!validTypes.includes(file.type)) {
      notify("error", "Archivo inválido", "Solo PNG, JPG o PDF");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const mapFile = (doc) => ({
    uid: doc.id,
    name: doc.file_path.split("/").pop(),
    status: "done",
    url: supabase.storage.from(BUCKET).getPublicUrl(doc.file_path).data
      .publicUrl,
  });

  const loadDocumentation = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;
    if (!user) return;

    const { data: docs } = await supabase
      .from("student_documentation")
      .select("*")
      .eq("user_id", user.id);

    if (!docs || docs.length === 0) return;

    setStatus(docs[0].status);
    setObservation(docs[0].observation || "");

    setIneFrontFile(
      docs.filter((d) => d.type_document === "INE_FRONT").map(mapFile),
    );
    setIneBackFile(
      docs.filter((d) => d.type_document === "INE_BACK").map(mapFile),
    );
    setAddressFile(
      docs.filter((d) => d.type_document === "ADDRESS").map(mapFile),
    );
    setPassportFile(
      docs.filter((d) => d.type_document === "PASSPORT").map(mapFile),
    );
  };

  useEffect(() => {
    loadDocumentation();
  }, []);

  const uploadSingleFile = async (file, type, userId) => {
    const filePath = `${userId}/${type}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { error: dbError } = await supabase
      .from("student_documentation")
      .insert({
        user_id: userId,
        type_document: type,
        file_path: filePath,
        status: "PENDIENTE",
        observation: null,
      });

    if (dbError) throw dbError;
  };

  const uploadDocumentation = async () => {
    if (!isFormComplete) return;

    setLoading(true);

    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        notify("error", "Sesión expirada", "Inicia sesión nuevamente");
        return;
      }

      await supabase
        .from("student_documentation")
        .delete()
        .eq("user_id", user.id);

      await uploadSingleFile(
        ineFrontFile[0].originFileObj,
        "INE_FRONT",
        user.id,
      );
      await uploadSingleFile(ineBackFile[0].originFileObj, "INE_BACK", user.id);
      await uploadSingleFile(addressFile[0].originFileObj, "ADDRESS", user.id);

      if (passportFile.length === 1) {
        await uploadSingleFile(
          passportFile[0].originFileObj,
          "PASSPORT",
          user.id,
        );
      }

      setStatus("PENDIENTE");
      setObservation("");

      notify(
        "success",
        "Documentación enviada",
        "Tus documentos están en revisión",
      );

      await loadDocumentation();
    } catch (err) {
      console.error(err);
      notify("error", "Error", "No se pudo subir la documentación");
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = () => {
    if (!status) return null;

    const styles = {
      PENDIENTE: "bg-yellow-100 text-yellow-800",
      APROBADO: "bg-green-100 text-green-800",
      RECHAZADO: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-semibold ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <Spin spinning={loading}>
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Documentación del Estudiante</h2>

        {renderStatus()}

        <Card title="INE Delantera">
          <Upload
            beforeUpload={validateFiles}
            fileList={ineFrontFile}
            onChange={({ fileList }) => setIneFrontFile(fileList.slice(0, 1))}
            disabled={status === "APROBADO"}
          >
            <Button icon={<UploadOutlined />}>Subir INE Delantera</Button>
          </Upload>
        </Card>

        <Card title="INE Trasera">
          <Upload
            beforeUpload={validateFiles}
            fileList={ineBackFile}
            onChange={({ fileList }) => setIneBackFile(fileList.slice(0, 1))}
            disabled={status === "APROBADO"}
          >
            <Button icon={<UploadOutlined />}>Subir INE Trasera</Button>
          </Upload>
        </Card>

        <Card title="Comprobante de Domicilio">
          <Upload
            beforeUpload={validateFiles}
            fileList={addressFile}
            onChange={({ fileList }) => setAddressFile(fileList.slice(0, 1))}
            disabled={status === "APROBADO"}
          >
            <Button icon={<UploadOutlined />}>Subir Comprobante</Button>
          </Upload>
        </Card>

        <Card title="Pasaporte (Opcional)">
          <Upload
            beforeUpload={validateFiles}
            fileList={passportFile}
            onChange={({ fileList }) => setPassportFile(fileList.slice(0, 1))}
            disabled={status === "APROBADO"}
          >
            <Button icon={<UploadOutlined />}>Subir Pasaporte</Button>
          </Upload>
        </Card>

        {status !== "APROBADO" && (
          <div className="flex justify-end">
            <Button
              size="large"
              disabled={!isFormComplete}
              onClick={uploadDocumentation}
              style={{
                backgroundColor: isFormComplete ? "#84cc16" : "#d9f99d",
                color: "#fff",
              }}
            >
              Guardar documentación
            </Button>
          </div>
        )}

        {status === "RECHAZADO" && observation && (
          <p className="text-sm text-red-600">
            <strong>Motivo del rechazo:</strong> {observation}
          </p>
        )}
      </div>
    </Spin>
  );
}
