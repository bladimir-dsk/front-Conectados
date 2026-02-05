import {
  Button,
  Form,
  App,
  InputNumber,
  Table,
  Space,
  Tooltip,
  Empty,
  Tag,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import FormInput from "../../../../../components/inputs/FormInput";

const SpaceBedsModal_Admin = ({ visible, onClose, spaceData, onSaveBeds }) => {
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();
  const [beds, setBeds] = useState([]);
  const [editingBed, setEditingBed] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (visible && spaceData) {
      // Cargar camas existentes o inicializar vacío
      setBeds(spaceData.beds || []);
      form.resetFields();
      setEditingBed(null);
      setIsEditing(false);
    }
  }, [visible, spaceData, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEditing && editingBed) {
          // Editar cama existente
          setBeds((prev) =>
            prev.map((bed) =>
              bed.id === editingBed.id ? { ...bed, ...values } : bed,
            ),
          );
          message.success("Cama actualizada correctamente");
        } else {
          // Agregar nueva cama
          const newId =
            beds.length > 0 ? Math.max(...beds.map((b) => b.id)) + 1 : 1;
          setBeds((prev) => [
            ...prev,
            {
              id: newId,
              key: String(newId),
              ...values,
            },
          ]);
          message.success("Cama agregada correctamente");
        }
        form.resetFields();
        setEditingBed(null);
        setIsEditing(false);
      })
      .catch(() => {
        message.error("Por favor complete todos los campos requeridos");
      });
  };

  const handleEdit = (record) => {
    setEditingBed(record);
    setIsEditing(true);
    form.setFieldsValue({
      bedName: record.bedName,
      bedNumber: record.bedNumber,
      monthlyPrice: record.monthlyPrice,
    });
  };

  const handleDelete = (record) => {
    modal.confirm({
      title: "¿Estás seguro?",
      content: `Se eliminará la cama: ${record.bedName}`,
      okText: "Aceptar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: () => {
        setBeds((prev) => prev.filter((bed) => bed.id !== record.id));
        message.success("Cama eliminada correctamente");
      },
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingBed(null);
    setIsEditing(false);
  };

  const handleSaveAll = () => {
    // Guardar camas y cerrar modal
    onSaveBeds(spaceData.id, beds);
    message.success("Camas guardadas correctamente");
    onClose();
  };

  const columns = [
    {
      title: "Nombre de la cama",
      dataIndex: "bedName",
      key: "bedName",
    },
    {
      title: "Identificador",
      dataIndex: "bedNumber",
      key: "bedNumber",
      align: "center",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Precio mensual",
      dataIndex: "monthlyPrice",
      key: "monthlyPrice",
      align: "center",
      render: (price) => (
        <span className="font-semibold text-green-600">
          ${price?.toLocaleString("es-MX")}
        </span>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar" color="green">
            <Button
              type="link"
              icon={<EditOutlined />}
              style={{ color: "#52c41a" }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Eliminar" color="red">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center backdrop-blur-md justify-center p-4">
        <div
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gestionar camas
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {spaceData?.spaceName} - {spaceData?.spaceNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-lime-200! transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Formulario para agregar/editar */}
            <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {isEditing ? "Editar cama" : "Agregar nueva cama"}
              </h3>
              <Form form={form} layout="vertical" autoComplete="off">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FormInput
                    name="bedName"
                    label="Nombre de la cama"
                    placeholder="Ej: Cama King, Cama Individual"
                    rules={[
                      {
                        required: true,
                        message: "El nombre es requerido",
                      },
                    ]}
                  />

                  <FormInput
                    name="bedNumber"
                    label="Identificador"
                    placeholder="Ej: K-1, I-1, C-1"
                    rules={[
                      {
                        required: true,
                        message: "El identificador es requerido",
                      },
                    ]}
                  />

                  <Form.Item
                    name="monthlyPrice"
                    label="Precio mensual (MXN)"
                    rules={[
                      { required: true, message: "El precio es requerido" },
                    ]}
                  >
                    <InputNumber
                      size="large"
                      placeholder="3000"
                      style={{ width: "100%" }}
                      min={0}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </div>

                <div className="flex gap-2 justify-end mt-2">
                  {isEditing && (
                    <Button danger onClick={handleCancel}>
                      Cancelar
                    </Button>
                  )}
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleSubmit}
                  >
                    {isEditing ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </Form>
            </div>

            {/* Tabla de camas */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Camas registradas ({beds.length})
              </h3>
              <Table
                columns={columns}
                dataSource={beds}
                pagination={false}
                size="small"
                locale={{
                  emptyText: (
                    <Empty
                      description="No hay camas registradas. Agrega la primera arriba."
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ),
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-zinc-700">
            <Button size="middle" danger onClick={onClose}>
              Cerrar
            </Button>
            <Button
              size="middle"
              type="primary"
              onClick={handleSaveAll}
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpaceBedsModal_Admin;
