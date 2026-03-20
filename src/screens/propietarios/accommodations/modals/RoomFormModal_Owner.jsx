import { Button, Form, Select, Input, InputNumber, App } from "antd";
import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import FormInput from "../../../../components/inputs/FormInput";

const { TextArea } = Input;

const STATUS_OPTIONS = [
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
  { value: "OCUPADO", label: "Ocupado" },
  { value: "MANTENIMIENTO", label: "Mantenimiento" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "LIMPIEZA", label: "Limpieza" },
];

const RoomFormModal_Owner = ({
  visible,
  onClose,
  onSave,
  editData = null,
  idAlojamiento,
}) => {
  const [form] = Form.useForm();
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [submittable, setSubmittable] = useState(false);

  const isEditing = !!editData;
  const { message } = App.useApp();

  const { postData: createRoom, loading: creating } = useApi(
    "/cuartos",
    {},
    false,
  );
  const { patchData: updateRoom, loading: updating } = useApi(
    "/cuartos",
    {},
    false,
  );

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        if (isEditing && editData) {
          const initialValues = {
            name: editData.name || "",
            price: editData.price != null ? Number(editData.price) : undefined,
            identification: editData.identification || "",
            description: editData.description || "",
            estatus: editData.estatus || "PENDIENTE",
          };
          form.setFieldsValue(initialValues);
          setInitialData(initialValues);
          setHasChanges(false);
        } else {
          form.resetFields();
          form.setFieldsValue({ estatus: "PENDIENTE" });
          setInitialData(null);
          setHasChanges(false);
        }
        validateSubmittable();
      });
    }
  }, [visible, editData]);

  const validateSubmittable = useCallback(() => {
    const values = form.getFieldsValue();
    const { name, price, identification, estatus } = values;
    const complete =
      name?.trim() &&
      price != null &&
      price > 0 &&
      identification?.trim() &&
      estatus;
    setSubmittable(!!complete);
  }, [form]);

  const checkForChanges = (changedValues, allValues) => {
    if (!isEditing || !initialData) {
      setHasChanges(true);
      validateSubmittable();
      return;
    }

    const hasChanged =
      allValues.name !== initialData.name ||
      allValues.price !== initialData.price ||
      allValues.identification !== initialData.identification ||
      allValues.description !== initialData.description ||
      allValues.estatus !== initialData.estatus;

    setHasChanges(hasChanged);
    validateSubmittable();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const dataToSend = {
        name: values.name,
        price: values.price,
        identification: values.identification,
        description: values.description || "",
        estatus: values.estatus,
        id_alojamiento: idAlojamiento,
      };

      if (isEditing) {
        await updateRoom(dataToSend, editData.id_cuarto);
        message.success("Cuarto actualizado correctamente");
      } else {
        await createRoom(dataToSend);
        message.success("Cuarto agregado correctamente");
      }

      form.resetFields();
      onSave();
    } catch (error) {
      if (error.errorFields) return;
      message.error(
        error.response?.data?.message ||
          error.message ||
          "No se pudo guardar el cuarto",
      );
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  if (!visible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/90 z-[60] transition-opacity"
        onClick={handleCancel}
      />

      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {isEditing ? "Editar cuarto" : "Agregar cuarto"}
            </h2>
            <button onClick={handleCancel}>
              <X
                size={24}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              onValuesChange={checkForChanges}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <FormInput
                  name="name"
                  label="Nombre del cuarto"
                  placeholder="Ej: Cuarto 1"
                  rules={[
                    { required: true, message: "El nombre es requerido" },
                    { min: 2, message: "Mínimo 2 caracteres" },
                  ]}
                />

                <FormInput
                  name="identification"
                  label="Identificación"
                  placeholder="Ej: C-1"
                  rules={[
                    {
                      required: true,
                      message: "La identificación es requerida",
                    },
                  ]}
                />

                <Form.Item
                  name="price"
                  label="Precio"
                  rules={[
                    { required: true, message: "El precio es requerido" },
                  ]}
                >
                  <InputNumber
                    placeholder="Ej: 1500"
                    size="large"
                    style={{ width: "100%" }}
                    min={0}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>

                <Form.Item
                  name="estatus"
                  label="Estado"
                  rules={[
                    { required: true, message: "El estado es requerido" },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Seleccione..."
                    options={STATUS_OPTIONS}
                    allowClear
                  />
                </Form.Item>

                <div className="md:col-span-2">
                  <Form.Item name="description" label="Descripción">
                    <TextArea
                      placeholder="Descripción del cuarto..."
                      rows={3}
                      size="large"
                    />
                  </Form.Item>
                </div>
              </div>

              {isEditing && !hasChanges && (
                <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  No hay cambios para guardar
                </div>
              )}
            </Form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t dark:border-zinc-700 border-gray-200">
            <Button onClick={handleCancel} size="large" type="primary" danger>
              Cancelar
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              size="large"
              loading={creating || updating}
              disabled={(isEditing && !hasChanges) || !submittable}
              className="bg-green-600 hover:bg-green-700"
            >
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomFormModal_Owner;
