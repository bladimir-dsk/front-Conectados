import React, { useRef, useState } from "react";
import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import {
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

// Datos de ejemplo
const mockOwnersData = [
  {
    key: "1",
    id: 1,
    name: "Ana López",
    email: "ana.lopez@example.com",
    phone: "9991234567",
    status: "Suspendido",
    registrationDate: "2024-03-12",
    properties: 0,
  },
  {
    key: "2",
    id: 2,
    name: "Carlos Méndez Ortega",
    email: "carlos.mendez@example.com",
    phone: "5567892345",
    status: "Verificado",
    registrationDate: "2024-05-20",
    properties: 3,
  },
  {
    key: "3",
    id: 3,
    name: "Ricardo Herrera Torres",
    email: "ricardo.h@gmail.com",
    phone: "3312349988",
    status: "Pendiente",
    registrationDate: "2024-02-02",
    properties: 1,
  },
  {
    key: "4",
    id: 4,
    name: "María García Pérez",
    email: "maria.garcia@example.com",
    phone: "9998765432",
    status: "Verificado",
    registrationDate: "2024-01-15",
    properties: 2,
  },
  {
    key: "5",
    id: 5,
    name: "Juan Ramírez López",
    email: "juan.ramirez@example.com",
    phone: "5551234567",
    status: "Pendiente",
    registrationDate: "2024-06-10",
    properties: 0,
  },
];

export default function OwnersScreen_Admin() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

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
          <Tooltip title="Editar" color="green">
            <Button
              type="link"
              icon={<EditOutlined />}
              style={{ color: "#52c41a" }}
              onClick={() => console.log("Editar", record)}
            />
          </Tooltip>
          <Tooltip title="Eliminar" color="red">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log("Eliminar", record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header con color */}
      <div className="bg-linear-to-r from-[#84cc16] to-[#65a30d] px-6 py-6 md:py-3 rounded-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2">
              <UserOutlined className="text-3xl text-[#111214]!" />
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

          {/* Un solo botón que cambia según el tamaño */}
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
          >
            <span className="hidden md:inline ml-2">Agregar</span>
          </Button>
        </div>
      </div>

      {/* Content pegado */}
      <div className="p-2">
        <div className="bg-white dark:bg-[#141414] rounded-md shadow-lg p-4 md:p-6 min-h-125">
          <Table
            columns={columns}
            dataSource={mockOwnersData}
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
    </div>
  );
}
