import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Card,
  Upload,
  Avatar,
  notification,
} from "antd";
import {
  User,
  Mail,
  Phone,
  MapPin,
  School,
  CloudUpload,
  Save,
  Fingerprint,
} from "lucide-react";

export default function ProfileStudent_Screen() {
  const [form] = Form.useForm();
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [avatar, setAvatar] = useState(null);

  const notify = (type, title, description) => {
    notification[type]({
      message: title,
      description,
      placement: "topRight",
    });
  };

  useEffect(() => {
    fetch("https://gaia.inegi.org.mx/wscatgeo/mgee/")
      .then((response) => response.json())
      .then((data) => {
        const estadosData = data.datos.map((estado) => ({
          label: estado.nom_agee,
          value: estado.cve_agee,
        }));
        setEstados(estadosData);

        const yucatan = estadosData.find(
          (estado) => estado.label === "Yucatán",
        );
        if (yucatan) {
          form.setFieldsValue({ estado: yucatan.value });
          onEstadoChange(yucatan.value);
        }
      });
  }, []);

  const onEstadoChange = (estado) => {
    form.resetFields(["municipio", "localidad"]);
    setMunicipios([]);
    setLocalidades([]);

    fetch(`https://gaia.inegi.org.mx/wscatgeo/mgem/${estado}`)
      .then((response) => response.json())
      .then((data) => {
        const municipiosData = data.datos.map((municipio) => ({
          label: municipio.nom_agem,
          value: municipio.cve_agem,
        }));
        setMunicipios(municipiosData);

        const ticul = municipiosData.find(
          (municipio) => municipio.label === "Ticul",
        );
        if (ticul) {
          form.setFieldsValue({ municipio: ticul.value });
          onMunicipioChange(ticul.value, estado);
        }
      });
  };

  const onMunicipioChange = (municipio, estadoParam) => {
    const estado = estadoParam || form.getFieldValue("estado");
    form.resetFields(["localidad"]);
    setLocalidades([]);

    fetch(
      `https://gaia.inegi.org.mx/wscatgeo/localidades/${estado}/${municipio}`,
    )
      .then((response) => response.json())
      .then((data) => {
        const localidadesData = data.datos.map((localidad) => ({
          label: localidad.nom_loc,
          value: localidad.cve_loc,
        }));
        setLocalidades(localidadesData);

        const ticulLoc = localidadesData.find(
          (localidad) => localidad.label === "Ticul",
        );
        if (ticulLoc) {
          form.setFieldsValue({ localidad: ticulLoc.value });
        }
      });
  };

  const beforeUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
    return false;
  };

  const onSave = () => {
    notify(
      "success",
      "Archivos guardados correctamente",
      "La documentación fue registrada con éxito",
    );
  };

  const initialValues = {
    nombre: "Karla Lizeth",
    paterno: "Dorantes",
    materno: "Tec",
    email: "karla@email.com",
    curp: "DOTK010101MYNRLR09",
    codigo: "+52",
    telefono: "9994238130",
    sexo: "Femenino",
    direccion: "Calle 35A x 22 y 22A Centro",
    cp: "97860",
    escuela: "Universidad Tecnológica del Sur",
    matricula: "UTS-2024-0098",
  };

  const sexoOptions = [
    { label: "Femenino", value: "Femenino" },
    { label: "Masculino", value: "Masculino" },
  ];

  return (
    <Card className="rounded-2xl p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Upload showUploadList={false} beforeUpload={beforeUpload}>
          <div className="relative cursor-pointer">
            <Avatar
              size={80}
              className="sm:w-[100px] sm:h-[100px]"
              src={avatar}
            />
            <div className="absolute bottom-0 right-0 bg-lime-500 p-1.5 rounded-full">
              <CloudUpload size={14} className="text-white" />
            </div>
          </div>
        </Upload>
        <div>
          <h2 className="text-lg font-semibold">Perfil del estudiante</h2>
          <p className="text-sm text-gray-500">Edita tu información personal</p>
        </div>
      </div>

      <Form layout="vertical" form={form} initialValues={initialValues}>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Nombre" name="nombre">
              <Input prefix={<User size={16} />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Apellido Paterno" name="paterno">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Apellido Materno" name="materno">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Email" name="email">
              <Input disabled prefix={<Mail size={16} />} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="CURP" name="curp">
              <Input prefix={<Fingerprint size={16} />} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Código" name="codigo">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={10}>
            <Form.Item label="Teléfono" name="telefono">
              <Input prefix={<Phone size={16} />} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Código Postal" name="cp">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Estado" name="estado">
              <Select options={estados} onChange={onEstadoChange} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Municipio" name="municipio">
              <Select
                options={municipios}
                onChange={(value) => onMunicipioChange(value)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Localidad" name="localidad">
              <Select options={localidades} />
            </Form.Item>
          </Col>

          <Col xs={24} md={16}>
            <Form.Item label="Dirección" name="direccion">
              <Input prefix={<MapPin size={16} />} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Sexo" name="sexo">
              <Select options={sexoOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Card className="mt-4 rounded-xl bg-gray-50">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <School size={18} />
            Información escolar
          </h3>
          <Row gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Form.Item label="Nombre de la escuela" name="escuela">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Matrícula" name="matricula">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <div className="flex justify-end mt-6">
          <Button
            type="primary"
            icon={<Save size={16} />}
            style={{
              backgroundColor: "#84cc16",
              borderColor: "#84cc16",
            }}
            className="hover:bg-lime-600 hover:border-lime-600 text-white w-full sm:w-auto"
            onClick={onSave}
          >
            Guardar cambios
          </Button>
        </div>
      </Form>
    </Card>
  );
}
