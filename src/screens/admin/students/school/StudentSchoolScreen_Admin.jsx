import { useRef, useState, useEffect } from "react";
import { Button, Input, Space, Table, Tag, notification } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { GraduationCap } from "lucide-react";
import SchoolModal_Admin from "./modals/SchoolModal_Admin";
import { useApi } from "../../../../hooks/useApi";
import { useDeleteConfirmation } from "../../../../hooks/useDeleteConfirmation";
dayjs.locale("es");

const LEVEL_COLOR = {
  Prescolar: "pink",
  Primaria: "blue",
  Secundaria: "cyan",
  Bachillerato: "orange",
  Universidad: "purple",
};

const TYPE_COLOR = {
  Publica: "green",
  Privada: "gold",
};

export default function StudentSchoolScreen_Admin() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [modalState, setModalState] = useState({ add: false, edit: false });
  const [selectedSchool, setSelectedSchool] = useState(null);

  const searchInput = useRef(null);
  const [, contextHolder] = notification.useNotification();

  const {
    data: schoolsData,
    loading: loadingSchools,
    fetchData: fetchSchools,
    deleteData: deleteSchool,
  } = useApi("/School", {}, true);

  const schools = Array.isArray(schoolsData) ? schoolsData : [];

  const openModal = (type, school = null) => {
    setSelectedSchool(school);
    setModalState((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setSelectedSchool(null);
    setModalState((prev) => ({ ...prev, [type]: false }));
  };

  const handleSave = async () => {
    await fetchSchools();
    closeModal("add");
    closeModal("edit");
  };

  const showDeleteConfirm = useDeleteConfirmation({
    onDelete: deleteSchool,
  });

  const handleDelete = (record) => {
    showDeleteConfirm({
      title: "¿Estás seguro de eliminar esta escuela?",
      itemName: record.name,
      entityName: "la escuela",
      recordId: record.id_school,
      successTitle: "Escuela eliminada",
      onSuccess: fetchSchools,
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0] || "");
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
          placeholder="Buscar..."
          value={selectedKeys[0] || ""}
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
          <Button type="link" size="small" onClick={() => close()}>
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#0B733E" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select?.());
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const dataSource = schools.map((item) => ({
    key: item.id_school,
    ...item,
  }));

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "CCT",
      dataIndex: "cct",
      key: "cct",
      ...getColumnSearchProps("cct"),
    },
    {
      title: "Nivel",
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (level) => (
        <Tag color={LEVEL_COLOR[level] || "default"}>{level}</Tag>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (type) => (
        <Tag color={TYPE_COLOR[type] || "default"}>
          {type === "Publica" ? "Pública" : type}
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
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#52c41a", fontSize: 16 }} />}
            onClick={() => openModal("edit", record)}
            title="Editar"
          />
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />}
            onClick={() => handleDelete(record)}
            title="Eliminar"
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}

      {/* Header */}
      <div className="bg-linear-to-r from-[#84cc16] to-[#65a30d] px-6 py-6 md:py-3 rounded-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2">
              <GraduationCap className="text-[#111214]!" size={35} />
            </div>
            <div className="space-y-0">
              <h1 className="text-xl md:text-2xl font-bold text-[#111214] leading-tight">
                Escuelas
              </h1>
              <p className="text-gray-700 text-sm mt-0.5">
                Administra y organiza las escuelas registradas.
              </p>
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
            dataSource={dataSource}
            loading={loadingSchools}
            scroll={{ x: "max-content" }}
            pagination={{
              showTotal: (total) => `Total ${total} escuelas`,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              defaultPageSize: 10,
            }}
            locale={{
              emptyText: loadingSchools
                ? null
                : 'No hay escuelas registradas aún. Dale en "Agregar" para crear una.',
            }}
          />
        </div>
      </div>

      {/* Modal – Agregar */}
      <SchoolModal_Admin
        visible={modalState.add}
        onClose={() => closeModal("add")}
        onSave={handleSave}
        isEditing={false}
      />

      {/* Modal – Editar */}
      <SchoolModal_Admin
        visible={modalState.edit}
        onClose={() => closeModal("edit")}
        onSave={handleSave}
        editData={selectedSchool}
        isEditing={true}
      />
    </div>
  );
}
