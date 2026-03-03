import React, { useEffect, useState } from "react";
import { useApi } from "../../../hooks/useApi";
import api from "../../../api/axiosConfig";
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
  Edit,
} from "lucide-react";

export default function ProfileStudent_Screen() {
  const [form] = Form.useForm();
  const [estados, setEstados] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [hasPersonalInfo, setHasPersonalInfo] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [studentInfoId, setStudentInfoId] = useState(null);
  const [originalStudentInfo, setOriginalStudentInfo] = useState(null);

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");

        setUserId(data.id);

        form.setFieldsValue({
          nombre: data.name,
          paterno: data.firstName,
          materno: data.middleName,
          email: data.email,
          codigo: data.code,
          telefono: data.phone,
        });
      } catch (error) {
        notify(
          "error",
          "Error al cargar perfil",
          "No se pudo obtener la información del usuario",
        );
      }
    };

    fetchProfile();
  }, []);

  const fetchStudentInformation = async () => {
    try {
      const { data } = await api.get("/student-information");
      const direccion = data?.datosDireccion?.[0];

      if (!direccion) return;

      setStudentInfoId(direccion.id_student_information);

      setOriginalStudentInfo({
        curp: direccion.curp,
        genero: direccion.genero,
        estado: direccion.estado,
        localidad: direccion.localidad,
        codigoPostal: direccion.codigoPostal,
        direccion: direccion.direccion,
      });

      form.setFieldsValue({
        curp: direccion.curp,
        sexo: direccion.genero,
        estado: direccion.estado,
        localidad: direccion.localidad,
        codigoPostal: direccion.codigoPostal,
        direccion: direccion.direccion,
      });

      if (direccion.imgUrl) {
        setAvatar(direccion.imgUrl);
      }

      setHasPersonalInfo(true);
    } catch (error) {
      console.error("Error al obtener student-information", error);
    }
  };

  useEffect(() => {
    fetchStudentInformation();
  }, []);

  const createStudentInformation = async () => {
    const values = await form.validateFields([
      "curp",
      "sexo",
      "estado",
      "localidad",
      "codigoPostal",
      "direccion",
    ]);

    if (!avatarFile) {
      throw new Error("AVATAR_REQUIRED");
    }

    const formData = new FormData();
    formData.append("curp", values.curp);
    formData.append("genero", values.sexo);
    formData.append("estado", values.estado);
    formData.append("localidad", values.localidad);
    formData.append("codigoPostal", values.codigoPostal);
    formData.append("direccion", values.direccion);
    formData.append("file", avatarFile);

    await api.post("/student-information", formData);
  };

  const updateStudentInformation = async () => {
    const values = await form.validateFields([
      "curp",
      "sexo",
      "estado",
      "localidad",
      "codigoPostal",
      "direccion",
    ]);

    const hasChanges =
      values.curp !== originalStudentInfo.curp ||
      values.sexo !== originalStudentInfo.genero ||
      values.estado !== originalStudentInfo.estado ||
      values.localidad !== originalStudentInfo.localidad ||
      values.codigoPostal !== originalStudentInfo.codigoPostal ||
      values.direccion !== originalStudentInfo.direccion ||
      avatarFile;

    if (!hasChanges) {
      return;
    }

    const formData = new FormData();
    formData.append("curp", values.curp);
    formData.append("genero", values.sexo);
    formData.append("estado", values.estado);
    formData.append("localidad", values.localidad);
    formData.append("codigoPostal", values.codigoPostal);
    formData.append("direccion", values.direccion);

    if (avatarFile) {
      formData.append("file", avatarFile);
    }

    await api.patch(`/student-information/${studentInfoId}`, formData);
  };

  const onEstadoChange = () => {};

  const beforeUpload = (file) => {
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);

    return false;
  };

  const onSave = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.nombre,
        firstName: values.paterno,
        middleName: values.materno,
        email: values.email,
        code: values.codigo,
        phone: values.telefono,
      };

      await api.patch(`/auth/estudiante/${userId}`, payload);

      if (hasPersonalInfo && studentInfoId) {
        await updateStudentInformation();
      } else {
        await createStudentInformation();
      }

      await fetchStudentInformation();

      notify(
        "success",
        "Perfil actualizado",
        "Toda la información se guardó correctamente",
      );

      setIsEditing(false);
    } catch (error) {
      if (error.message === "AVATAR_REQUIRED") {
        notify(
          "warning",
          "Imagen requerida",
          "Debes subir una imagen de perfil",
        );
        return;
      }

      notify("error", "Error", "No se pudo guardar la información personal");
    }
  };

  const onEdit = () => {
    setIsEditing(true);
    notify("info", "Modo edición", "Ahora puedes modificar los campos");
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

      <Form layout="vertical" form={form}>
        <Card className="mb-6 rounded-xl bg-gray-50 p-4">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <User size={18} />
            Datos personales
          </h3>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Nombre" name="nombre">
                <Input prefix={<User size={16} />} disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Apellido Paterno" name="paterno">
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Apellido Materno" name="materno">
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Código" name="codigo">
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={10}>
              <Form.Item label="Teléfono" name="telefono">
                <Input prefix={<Phone size={16} />} disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Email" name="email">
                <Input disabled={!isEditing} prefix={<Mail size={16} />} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card className="mb-6 rounded-xl bg-gray-50 p-4">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Fingerprint size={18} />
            Información personal
          </h3>
          <Row gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="CURP"
                name="curp"
                rules={[
                  { required: true, message: "Este campo es obligatorio" },
                ]}
              >
                <Input
                  prefix={<Fingerprint size={16} />}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                label="Sexo"
                name="sexo"
                rules={[
                  { required: true, message: "Este campo es obligatorio" },
                ]}
              >
                <Select options={sexoOptions} disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                label="Estado"
                name="estado"
                rules={[
                  { required: true, message: "Este campo es obligatorio" },
                ]}
              >
                <Select
                  options={estados}
                  onChange={onEstadoChange}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                label="Localidad"
                name="localidad"
                rules={[
                  { required: true, message: "Este campo es obligatorio" },
                ]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Código Postal"
                name="codigoPostal"
                rules={[
                  { required: true, message: "Este campo es obligatorio" },
                ]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item
                label="Dirección"
                name="direccion"
                rules={[
                  { required: true, message: "Este campo es obligatorio" },
                ]}
              >
                <Input prefix={<MapPin size={16} />} disabled={!isEditing} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card className="mb-6 rounded-xl bg-gray-50 p-4">
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

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="default"
            icon={<Edit size={16} />}
            onClick={onEdit}
            className="w-full sm:w-auto"
            disabled={isEditing}
          >
            Editar
          </Button>
          <Button
            type="primary"
            icon={<Save size={16} />}
            style={{
              backgroundColor: "#84cc16",
              borderColor: "#84cc16",
            }}
            className="hover:bg-lime-600 hover:border-lime-600 text-white w-full sm:w-auto"
            onClick={onSave}
            disabled={!isEditing}
          >
            Guardar cambios
          </Button>
        </div>
      </Form>
    </Card>
  );
}
