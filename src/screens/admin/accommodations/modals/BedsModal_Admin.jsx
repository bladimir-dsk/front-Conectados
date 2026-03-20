import { useEffect, useState } from "react";
import { Button, Table, Tag, Space, Tooltip, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { X, BedDouble } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { useDeleteConfirmation } from "../../../../hooks/useDeleteConfirmation";
import BedFormModal_Admin from "./BedFormModal_Admin";

const getStatusColor = (status) => {
  const map = {
    ACTIVO: "green",
    INACTIVO: "red",
    OCUPADO: "blue",
    MANTENIMIENTO: "orange",
    PENDIENTE: "gold",
    LIMPIEZA: "purple",
  };
  return map[status] || "default";
};

const getStatusLabel = (status) => {
  const map = {
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
    OCUPADO: "Ocupado",
    MANTENIMIENTO: "Mantenimiento",
    PENDIENTE: "Pendiente",
    LIMPIEZA: "En limpieza",
  };
  return map[status] || status;
};

const formatPrice = (price) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price));

const BedsModal_Admin = ({ visible, onClose, room }) => {
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    limite: 10,
    totalRegistros: 0,
    totalPaginas: 0,
  });
  const [isChangingPage, setIsChangingPage] = useState(false);
  const [formModal, setFormModal] = useState({
    visible: false,
    editData: null,
  });

  const endpoint = room
    ? `/camas/cuarto/${room.id_cuarto}?page=${paginacion.paginaActual}&limit=${paginacion.limite}`
    : null;

  const { deleteData: deleteBed } = useApi("/camas", {}, false);

  const {
    data: bedsResponse,
    loading: loadingBeds,
    fetchData: fetchBeds,
  } = useApi(endpoint, {}, false);

  useEffect(() => {
    if (visible && endpoint) {
      fetchBeds();
    }
  }, [visible, endpoint]);

  useEffect(() => {
    if (bedsResponse?.meta) {
      setPaginacion((prev) => ({
        ...prev,
        totalRegistros: bedsResponse.meta.totalItems,
        totalPaginas: bedsResponse.meta.totalPages,
        paginaActual: bedsResponse.meta.currentPage,
      }));
      setIsChangingPage(false);
    }
  }, [bedsResponse]);

  useEffect(() => {
    if (!visible) {
      setPaginacion((prev) => ({ ...prev, paginaActual: 1 }));
      setFormModal({ visible: false, editData: null });
    }
  }, [visible]);

  const cuartoInfo = bedsResponse?.cuarto || room;
  const camas = bedsResponse?.camas || [];

  const handlePageChange = (page) => {
    setIsChangingPage(true);
    setPaginacion((prev) => ({ ...prev, paginaActual: page }));
  };

  const openFormModal = (editData = null) => {
    setFormModal({ visible: true, editData });
  };

  const closeFormModal = () => {
    setFormModal({ visible: false, editData: null });
  };

  const handleSaveBed = async () => {
    await fetchBeds();
    closeFormModal();
  };

  const showDeleteConfirm = useDeleteConfirmation({
    onDelete: async (id) => {
      await deleteBed(id);
      await fetchBeds();
    },
  });

  const handleDelete = (record) => {
    showDeleteConfirm({
      title: "¿Estás seguro de eliminar esta cama?",
      itemName: record.name,
      entityName: "la cama",
      recordId: record.id_cama,
      successTitle: "Cama eliminada",
    });
  };

  const dataSource = camas.map((item) => ({
    key: item.id_cama,
    ...item,
  }));

  const columns = [
    {
      title: "Identificación",
      dataIndex: "identification",
      key: "identification",
      width: 130,
      render: (text) => (
        <Tag color="blue" style={{ fontSize: "13px" }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      align: "center",
      width: 120,
      sorter: (a, b) => Number(a.price) - Number(b.price),
      render: (price) => formatPrice(price),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Estado",
      dataIndex: "estatus",
      key: "estatus",
      align: "center",
      width: 140,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: "13px" }}>
          {getStatusLabel(status)}
        </Tag>
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
              onClick={() => openFormModal(record)}
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
      <div className="fixed inset-0 bg-black/90 z-60 transition-opacity" />
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  Camas del cuarto
                </span>
                {cuartoInfo && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {cuartoInfo.name} — {cuartoInfo.identification}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose}>
              <X
                size={24}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Info del cuarto */}
            {cuartoInfo && (
              <div className="flex flex-wrap gap-3 mb-4 text-sm">
                <Tag color="blue">{cuartoInfo.identification}</Tag>
                <Tag color="cyan">
                  Precio cuarto: {formatPrice(cuartoInfo.price)}
                </Tag>
                <Tag color={getStatusColor(cuartoInfo.estatus)}>
                  {getStatusLabel(cuartoInfo.estatus)}
                </Tag>
              </div>
            )}

            {/* Botón agregar */}
            <div className="flex justify-end mb-3">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openFormModal(null)}
                style={{
                  backgroundColor: "#C4D82E",
                  borderColor: "#C4D82E",
                  color: "#111214",
                }}
              >
                Agregar
              </Button>
            </div>

            {/* Tabla */}
            <Table
              columns={columns}
              dataSource={dataSource}
              loading={loadingBeds || isChangingPage}
              scroll={{ x: "max-content" }}
              size="small"
              pagination={{
                current: paginacion.paginaActual,
                pageSize: paginacion.limite,
                total: paginacion.totalRegistros,
                showTotal: (total) => `Total ${total} camas`,
                showSizeChanger: false,
                onChange: handlePageChange,
              }}
              locale={{
                emptyText: () => {
                  if (loadingBeds) return null;
                  return 'No hay camas registradas. Dale en "Agregar cama" para crear una.';
                },
              }}
            />
          </div>
        </div>
      </div>
      <BedFormModal_Admin
        visible={formModal.visible}
        onClose={closeFormModal}
        onSave={handleSaveBed}
        editData={formModal.editData}
        idCuarto={room?.id_cuarto}
      />
      ,
    </>
  );
};

export default BedsModal_Admin;
