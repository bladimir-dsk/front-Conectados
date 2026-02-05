import { useRef, useState } from "react";
import { App, Button, Input, Space, Table, Tag, Tooltip } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import "dayjs/locale/es";
import OwnerModal_Admin from "./modals/OwnerModal_Admin";
import { initialOwnersData } from "./OwnersData";
import { CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
dayjs.locale("es");

export default function OwnersScreen_Admin() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { message, modal } = App.useApp();
  const [ownersData, setOwnersData] = useState(initialOwnersData);
  const [modalState, setModalState] = useState({ add: false, edit: false });
  const [selectedOwner, setSelectedOwner] = useState(null);
  const navigate = useNavigate();

  const openModal = (type, owner = null) => {
    setModalState({ add: false, edit: false, [type]: true });
    setSelectedOwner(owner);
  };

  const closeModal = (type) => {
    setModalState((prev) => ({ ...prev, [type]: false }));
    setSelectedOwner(null);
  };

  const handleViewProperties = (owner) => {
    navigate(`/admin/propietarios/${owner.id}/propiedades`, {
      state: { owner }
    });
  };

  const handleSaveOwner = (values) => {
    if (modalState.edit && selectedOwner) {
      setOwnersData((prev) =>
        prev.map((item) =>
          item.id === selectedOwner.id ? { ...item, ...values } : item
        )
      );
      closeModal("edit");
    } else {
      const newId =
        ownersData.length > 0
          ? Math.max(...ownersData.map((o) => o.id)) + 1
          : 1;

      setOwnersData((prev) => [
        ...prev,
        {
          key: String(newId),
          id: newId,
          ...values,
          registrationDate: dayjs().format("YYYY-MM-DD"),
          properties: 0,
        },
      ]);
      closeModal("add");
    }
  };

  const handleDelete = (record) => {
    modal.confirm({
      title: "¿Estás seguro?",
      content: `Se eliminará el propietario: ${record.name}`,
      okText: "Aceptar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: () => {
        setOwnersData((prev) => prev.filter((item) => item.id !== record.id));
        message.success("Propietario eliminado correctamente");
      },
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar...`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            className="btn-buscar"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            className="btn-limpiar"
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#9cd522" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#C7DC5B", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Verificado":
        return "green";
      case "Pendiente":
        return "orange";
      case "Suspendido":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      align: "center",
      filters: [
        { text: "Verificado", value: "Verificado" },
        { text: "Pendiente", value: "Pendiente" },
        { text: "Suspendido", value: "Suspendido" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: "13px" }}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Fecha de registro",
      dataIndex: "registrationDate",
      key: "registrationDate",
      align: "center",
      sorter: (a, b) =>
        dayjs(a.registrationDate).unix() - dayjs(b.registrationDate).unix(),
      render: (date) => dayjs(date).locale("es").format("DD MMM YYYY"),
    },
    {
      title: "# propiedades",
      dataIndex: "properties",
      key: "properties",
      align: "center",
      sorter: (a, b) => a.properties - b.properties,
      render: (properties) => (
        <Tag color={properties > 0 ? "blue" : "default"}>{properties}</Tag>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Propiedades" color="cyan">
            <Button
              type="link"
              icon={<HomeOutlined />}
              style={{ color: "#13c2c2" }}
              onClick={() => handleViewProperties(record)}
            />
          </Tooltip>
          <Tooltip title="Editar" color="green">
            <Button
              type="link"
              icon={<EditOutlined />}
              style={{ color: "#52c41a" }}
              onClick={() => openModal("edit", record)}
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

  return (
    <div>
      {/* Header */}
      <div className="bg-linear-to-r from-[#84cc16] to-[#65a30d] px-6 py-6 md:py-3 rounded-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2">
              <CircleUser className=" text-[#111214]!" size={35} />
            </div>
            <div className="space-y-0">
              <h1 className="text-xl md:text-2xl font-bold text-[#111214] leading-tight">
                Propietarios
              </h1>
              <h1 className="text-gray-700 text-sm mt-0.5">
                Administra y organiza los propietarios registrados.
              </h1>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className="h-11 rounded-lg shadow-lg w-11 md:w-auto p-0 md:px-4"
            style={{
              backgroundColor: "#C4D82E",
              borderColor: "#C4D82E",
              color: "#111214",
            }}
            onClick={() => openModal("add")}
          >
            <span className="hidden md:inline ml-2">Agregar</span>
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="p-2">
        <div className="bg-white dark:bg-[#141414] rounded-md shadow-lg p-4 md:p-6">
          <Table
            columns={columns}
            dataSource={ownersData}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} propietarios`,
            }}
            locale={{
              emptyText:
                'No hay propietarios registrados aún. Dale en "Agregar" para crear uno.',
            }}
          />
        </div>
      </div>

      {/* Modal – Agregar */}
      <OwnerModal_Admin
        visible={modalState.add}
        onClose={() => closeModal("add")}
        onSave={handleSaveOwner}
        isEditing={false}
      />

      {/* Modal – Editar */}
      <OwnerModal_Admin
        visible={modalState.edit}
        onClose={() => closeModal("edit")}
        onSave={handleSaveOwner}
        editData={selectedOwner}
        isEditing={true}
      />
    </div>
  );
}
