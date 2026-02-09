import { useRef, useState, useEffect } from "react";
import { Button, Input, Space, Table, Tag, Tooltip, notification } from "antd";
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
import { CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/useApi";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
dayjs.locale("es");

export default function OwnersScreen_Admin() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [modalState, setModalState] = useState({ add: false, edit: false });
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [isChangingPage, setIsChangingPage] = useState(false);

  // Estado para filtros globales
  const [filtros, setFiltros] = useState({
    nombre: "",
    correo: "",
    direccion: "",
    estatus: [],
  });

  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    limite: 10,
    totalRegistros: 0,
    totalPaginas: 0,
  });

  const searchInput = useRef(null);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const construirURL = (pagina = 1) => {
    const params = new URLSearchParams();
    params.append("paginaActual", pagina.toString());
    params.append("limite", paginacion.limite.toString());

    // Filtros de búsqueda
    if (filtros.nombre) params.append("namePersonal", filtros.nombre);
    if (filtros.correo) params.append("emailPersonal", filtros.correo);
    if (filtros.estatus && filtros.estatus.length > 0) {
      params.append("estatus", filtros.estatus.join(","));
    }

    return `/propietarios?${params.toString()}`;
  };

  const [endpointPaginacion, setEndpointPaginacion] = useState(() =>
    construirURL(1)
  );

  const {
    data: ownersResponse,
    loading: loadingOwners,
    fetchData: fetchOwners,
    deleteData: deleteOwner,
  } = useApi(endpointPaginacion, {}, false);

  // Manejar búsqueda global
  const handleGlobalSearch = (value, field) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Resetear a página 1 cuando se filtra
    setPaginacion((prev) => ({
      ...prev,
      paginaActual: 1,
    }));
  };

  // useEffect que reacciona a cambios de filtros
  useEffect(() => {
    const url = construirURL(paginacion.paginaActual);
    setEndpointPaginacion(url);
  }, [filtros, paginacion.paginaActual, paginacion.limite]);

  useEffect(() => {
    if (endpointPaginacion) {
      fetchOwners();
    }
  }, [endpointPaginacion]);

  useEffect(() => {
    if (ownersResponse?.paginacion) {
      setPaginacion((prev) => ({
        ...prev,
        ...ownersResponse.paginacion,
      }));
      setIsChangingPage(false);
    }
  }, [ownersResponse]);

  const ownersData = ownersResponse?.data || [];

  const openModal = (type, owner = null) => {
    setModalState({ add: false, edit: false, [type]: true });
    setSelectedOwner(owner);
  };

  const closeModal = (type) => {
    setModalState((prev) => ({ ...prev, [type]: false }));
    setSelectedOwner(null);
  };

  const handleViewProperties = (owner) => {
    navigate(`/admin/propietarios/${owner.id_propietario}/propiedades`, {
      state: { owner },
    });
  };

  const handleSaveOwner = async () => {
    await fetchOwners();
    closeModal("add");
    closeModal("edit");
  };

  const showDeleteConfirm = useDeleteConfirmation({
    onDelete: deleteOwner,
  });

  const handleDelete = (record) => {
    showDeleteConfirm({
      title: "¿Estás seguro de eliminar este propietario?",
      itemName: `${record.namePersonal} ${record.lastName}`,
      entityName: "el propietario",
      recordId: record.id_propietario,
      successTitle: "Propietario eliminado",
      onSuccess: fetchOwners,
    });
  };

  // Manejar cambios en la tabla (filtros de estado)
  const handleTableChange = (pagination, filters, sorter) => {
    if (filters.estatus !== undefined) {
      const nuevosEstatus = filters.estatus || [];

      if (JSON.stringify(nuevosEstatus) !== JSON.stringify(filtros.estatus)) {
        setFiltros((prev) => ({
          ...prev,
          estatus: nuevosEstatus,
        }));

        setPaginacion((prev) => ({
          ...prev,
          paginaActual: 1,
        }));
      }
    }
  };

  // Función para cambiar de página
  const handlePageChange = (page) => {
    setIsChangingPage(true);
    setPaginacion((prev) => ({
      ...prev,
      paginaActual: page,
    }));
  };


  // Funciones de búsqueda con búsqueda global
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    const value = selectedKeys[0] || "";

    const filtroMap = {
      namePersonal: "nombre",
      emailPersonal: "correo",
    };

    const filtroKey = filtroMap[dataIndex];
    if (filtroKey) {
      handleGlobalSearch(value, filtroKey);
    }

    setSearchText(value);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
    setSearchText("");

    // Limpiar el filtro correspondiente
    const filtroMap = {
      namePersonal: "nombre",
      emailPersonal: "correo",
    };

    const filtroKey = filtroMap[dataIndex];
    if (filtroKey) {
      handleGlobalSearch("", filtroKey);
    }
  };

  const getColumnSearchProps = (dataIndex) => {
    const filtroMap = {
      namePersonal: "nombre",
      emailPersonal: "correo",
    };

    const filtroKey = filtroMap[dataIndex];

    return {
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
              onClick={() => clearFilters && handleReset(clearFilters, dataIndex)}
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
        <SearchOutlined
          style={{
            color:
              (filtroKey && filtros[filtroKey]) || searchedColumn === dataIndex
                ? "#0B733E"
                : undefined,
          }}
        />
      ),
      filteredValue: filtroKey && filtros[filtroKey] ? [filtros[filtroKey]] : null,
      onFilter: (value, record) => true,
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
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verificado":
        return "green";
      case "pendiente":
        return "orange";
      case "suspendido":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "verificado":
        return "Verificado";
      case "pendiente":
        return "Pendiente";
      case "suspendido":
        return "Suspendido";
      default:
        return status;
    }
  };

  const dataSource = ownersData.map((owner) => ({
    key: owner.id_propietario,
    ...owner,
  }));

  const columns = [
    {
      title: "Nombre",
      key: "name",
      ...getColumnSearchProps("namePersonal"),
      sorter: (a, b) => a.namePersonal.localeCompare(b.namePersonal),
      render: (_, record) => `${record.namePersonal} ${record.lastName}`,
    },
    {
      title: "Correo",
      dataIndex: "emailPersonal",
      key: "emailPersonal",
      ...getColumnSearchProps("emailPersonal"),
    },
    {
      title: "Teléfono",
      key: "phone",
      align: "center",
      render: (_, record) => `+${record.code} ${record.phone}`,
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "Estado",
      dataIndex: "estatus",
      key: "estatus",
      align: "center",
      filters: [
        { text: "Verificado", value: "verificado" },
        { text: "Pendiente", value: "pendiente" },
        { text: "Suspendido", value: "suspendido" },
      ],
      filteredValue:
        filtros.estatus && filtros.estatus.length > 0 ? filtros.estatus : null,
      onFilter: (value, record) => true,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: "13px" }}>
          {getStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: "Fecha de registro",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      sorter: (a, b) =>
        dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
      render: (date) => dayjs(date).locale("es").format("DD MMM YYYY"),
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
      {contextHolder}

      {/* Header */}
      <div className="bg-linear-to-r from-[#84cc16] to-[#65a30d] px-6 py-6 md:py-3 rounded-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2">
              <CircleUser className="text-[#111214]!" size={35} />
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
            dataSource={dataSource}
            loading={loadingOwners || isChangingPage}
            scroll={{ x: "max-content" }}
            onChange={handleTableChange}
            pagination={{
              current: paginacion.paginaActual,
              pageSize: paginacion.limite,
              total: paginacion.totalRegistros,
              showTotal: (total) => `Total ${total} propietarios`,
              showSizeChanger: false,
              onChange: handlePageChange,
            }}
            locale={{
              emptyText: () => {
                if (loadingOwners) return null;

                const hayFiltrosActivos =
                  filtros.nombre ||
                  filtros.correo ||
                  (filtros.estatus && filtros.estatus.length > 0);

                if (hayFiltrosActivos) {
                  return "No se encontraron propietarios con los filtros aplicados.";
                }

                return 'No hay propietarios registrados aún. Dale en "Agregar" para crear uno.';
              },
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