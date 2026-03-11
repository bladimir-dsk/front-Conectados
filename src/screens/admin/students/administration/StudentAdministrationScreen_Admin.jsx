import { useRef, useState, useEffect } from "react";
import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import {
    SearchOutlined,
    EditOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { App } from "antd";
import { School, UserRoundPen, X } from "lucide-react";
import AssignSchoolModal_Admin from "./modals/AssignSchoolModal_Admin";
import { useApi } from "../../../../hooks/useApi";
dayjs.locale("es");

export default function StudentsScreen_Admin() {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [assignModalVisible, setAssignModalVisible] = useState(false);

    const [filtros, setFiltros] = useState({
        name: "",
        id_school: undefined,
    });

    const [paginacion, setPaginacion] = useState({
        paginaActual: 1,
        limite: 10,
        totalRegistros: 0,
    });

    const construirURL = (pagina = 1) => {
        const params = new URLSearchParams();
        params.append("page", pagina.toString());
        params.append("limit", paginacion.limite.toString());
        if (filtros.name) params.append("name", filtros.name);
        if (filtros.id_school) params.append("id_school", filtros.id_school);
        return `/users/estudiantes?${params.toString()}`;
    };

    const [endpointPaginacion, setEndpointPaginacion] = useState(() => construirURL(1));

    const {
        data: studentsResponse,
        loading: loadingStudents,
        fetchData: fetchStudents,
    } = useApi(endpointPaginacion, {}, false);

    const { data: schoolsData } = useApi("/School", {}, true);

    const schoolFilters = (schoolsData || []).map((s) => ({
        text: s.name,
        value: s.id_school,
    }));

    useEffect(() => {
        setEndpointPaginacion(construirURL(paginacion.paginaActual));
    }, [filtros, paginacion.paginaActual]);

    useEffect(() => {
        if (endpointPaginacion) fetchStudents();
    }, [endpointPaginacion]);

    useEffect(() => {
        if (studentsResponse?.meta) {
            setPaginacion((prev) => ({
                ...prev,
                totalRegistros: studentsResponse.meta.total,
                paginaActual: studentsResponse.meta.page,
            }));
            setIsChangingPage(false);
        }
    }, [studentsResponse]);

    const studentsData = (studentsResponse?.data || []).map((s) => ({
        key: s.id,
        ...s,
    }));

    const handleGlobalSearch = (value, field) => {
        setFiltros((prev) => ({ ...prev, [field]: value }));
        setPaginacion((prev) => ({ ...prev, paginaActual: 1 }));
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        const value = selectedKeys[0] || "";
        handleGlobalSearch(value, dataIndex);
        setSearchText(value);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText("");
        handleGlobalSearch("", dataIndex);
    };

    const handleTableChange = (_, filters) => {
        const id_school = filters.school?.[0] ?? undefined;
        setFiltros((prev) => ({ ...prev, id_school }));
        setPaginacion((prev) => ({ ...prev, paginaActual: 1 }));
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder="Buscar..."
                    value={selectedKeys[0] || ""}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
        filterIcon: () => (
            <SearchOutlined style={{ color: filtros[dataIndex] ? "#0B733E" : undefined }} />
        ),
        filteredValue: filtros[dataIndex] ? [filtros[dataIndex]] : null,
        onFilter: () => true,
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) setTimeout(() => searchInput.current?.select?.(), 100);
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

    const getStatusColor = (status) =>
        status === "Activo" ? "green" : status === "Suspendido" ? "red" : "default";

    const columns = [
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Código",
            dataIndex: "code",
            key: "code",
            align: "center",
            render: (code) => <span className="font-mono text-xs">{code || "—"}</span>,
        },
        {
            title: "Correo",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Teléfono",
            dataIndex: "phone",
            key: "phone",
            align: "center",
            render: (phone) => phone || "—",
        },
        {
            title: "Escuela",
            key: "school",
            align: "center",
            filters: schoolFilters,
            filteredValue: filtros.id_school ? [filtros.id_school] : null,
            onFilter: () => true,
            render: (_, record) =>
                record.School ? (
                    <Tooltip title={`CCT: ${record.School.cct} · ${record.School.type}`}>
                        <span className="text-sm">{record.School.name}</span>
                    </Tooltip>
                ) : (
                    <Tag color="warning">Sin asignar</Tag>
                ),
        },
        {
            title: "Estado",
            dataIndex: "estatus",
            key: "estatus",
            align: "center",
            filters: [
                { text: "Activo", value: "Activo" },
                { text: "Suspendido", value: "Suspendido" },
            ],
            onFilter: (value, record) => record.estatus === value,
            render: (status) => (
                <Tag color={getStatusColor(status)} style={{ fontSize: "13px" }}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "# Docs",
            dataIndex: "documentaciones", 
            key: "documentaciones",
            align: "center",
            render: (docs) => (
                <Tag color={docs?.length > 0 ? "blue" : "default"}>
                    {docs?.length ?? 0}
                </Tag>
            ),
        },
        {
            title: "Registro",
            dataIndex: "createdAt",
            key: "createdAt",
            align: "center",
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            render: (date) => dayjs(date).locale("es").format("DD MMM YYYY"),
        },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            width: 80,
            render: (_, record) => (
                <Tooltip title="Asignar escuela" color="green">
                    <Button
                        type="link"
                        icon={<School size={16} />}
                        style={{ color: "#52c41a" }}
                        onClick={() => {
                            setSelectedStudent(record);
                            setAssignModalVisible(true);
                        }}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="bg-linear-to-r from-[#84cc16] to-[#65a30d] px-6 py-6 md:py-3 rounded-md">
                <div className="flex items-center gap-3">
                    <div className="p-2">
                        <UserRoundPen className="text-[#111214]!" size={35} />
                    </div>
                    <div className="space-y-0">
                        <h1 className="text-xl md:text-2xl font-bold text-[#111214] leading-tight">
                            Estudiantes
                        </h1>
                        <p className="text-gray-700 text-sm mt-0.5">
                            Administra y organiza los estudiantes registrados.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="p-2">
                <div className="bg-white dark:bg-[#141414] rounded-md shadow-lg p-4 md:p-6">
                    <Table
                        columns={columns}
                        onChange={handleTableChange}
                        dataSource={studentsData}
                        loading={loadingStudents || isChangingPage}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            current: paginacion.paginaActual,
                            pageSize: paginacion.limite,
                            total: paginacion.totalRegistros,
                            showTotal: (total) => `Total ${total} estudiantes`,
                            showSizeChanger: false,
                            onChange: (page) => {
                                setIsChangingPage(true);
                                setPaginacion((prev) => ({ ...prev, paginaActual: page }));
                            },
                        }}
                        locale={{
                            emptyText: loadingStudents
                                ? null
                                : (() => {
                                    const hayFiltros =
                                        filtros.name ||
                                        filtros.id_school;

                                    return hayFiltros
                                        ? "No se encontraron estudiantes con los filtros aplicados."
                                        : "No hay estudiantes registrados aún.";
                                })(),
                        }}
                    />
                </div>
            </div>

            {/* Modal – Asignar Escuela */}
            <AssignSchoolModal_Admin
                visible={assignModalVisible}
                onClose={() => {
                    setAssignModalVisible(false);
                    setSelectedStudent(null);
                }}
                student={selectedStudent}
                onSaved={fetchStudents}
            />
        </div>
    );
}