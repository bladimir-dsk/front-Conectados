import React, { useRef, useState } from "react";
import { App, Button, Input, Space, Table, Tag, Tooltip } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { initialStudentsData } from "../StudentsData";
import StudentAdministrationModal_Admin from "./modals/StudentAdministrationModal_Admin";
import { UserRoundPen } from "lucide-react";
dayjs.locale("es");

export default function StudentsScreen_Admin() {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const { message, modal } = App.useApp();
    const [studentsData, setStudentsData] = useState(initialStudentsData);
    const [modalState, setModalState] = useState({ add: false, edit: false });
    const [selectedStudent, setSelectedStudent] = useState(null);

    const openModal = (type, student = null) => {
        setModalState({ add: false, edit: false, [type]: true });
        setSelectedStudent(student);
    };

    const closeModal = (type) => {
        setModalState((prev) => ({ ...prev, [type]: false }));
        setSelectedStudent(null);
    };

    const handleSaveStudent = (values) => {
        if (modalState.edit && selectedStudent) {
            setStudentsData((prev) =>
                prev.map((item) =>
                    item.id === selectedStudent.id ? { ...item, ...values } : item
                )
            );
            closeModal("edit");
        } else {
            const newId =
                studentsData.length > 0
                    ? Math.max(...studentsData.map((s) => s.id)) + 1
                    : 1;

            setStudentsData((prev) => [
                ...prev,
                {
                    key: String(newId),
                    id: newId,
                    studentId: newId,
                    ...values,
                    registrationDate: dayjs().format("YYYY-MM-DD"),
                    documents: [],
                },
            ]);
            closeModal("add");
        }
    };

    const handleDelete = (record) => {
        modal.confirm({
            title: "¿Estás seguro?",
            content: `Se eliminará el estudiante: ${record.name}`,
            okText: "Aceptar",
            okType: "danger",
            cancelText: "Cancelar",
            onOk: () => {
                setStudentsData((prev) => prev.filter((item) => item.id !== record.id));
                message.success("Estudiante eliminado correctamente");
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
            case "Activo":
                return "green";
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
                { text: "Activo", value: "Activo" },
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
            title: "Universidad",
            dataIndex: "university",
            key: "university",
            align: "center",
            filters: [{ text: "UADY", value: "UADY" }],
            onFilter: (value, record) => record.university === value,
        },
        {
            title: "# Documentos",
            dataIndex: "documents",
            key: "documents",
            align: "center",
            sorter: (a, b) => a.documents.length - b.documents.length,
            render: (documents) => (
                <Tag color={documents.length > 0 ? "blue" : "default"}>
                    {documents.length}
                </Tag>
            ),
        },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            width: 150,
            render: (_, record) => (
                <Space size="small">
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
                            <UserRoundPen className=" text-[#111214]!" size={35} />
                        </div>
                        <div className="space-y-0">
                            <h1 className="text-xl md:text-2xl font-bold text-[#111214] leading-tight">
                                Estudiantes
                            </h1>
                            <h1 className="text-gray-700 text-sm mt-0.5">
                                Administra y organiza los estudiantes registrados.
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
                <div className="bg-white dark:bg-[#141414] rounded-md shadow-lg p-4 md:p-6 min-h-125">
                    <Table
                        columns={columns}
                        dataSource={studentsData}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} estudiantes`,
                        }}
                        locale={{
                            emptyText:
                                'No hay estudiantes registrados aún. Dale en "Agregar" para crear uno.',
                        }}
                    />
                </div>
            </div>

            {/* Modal – Agregar */}
            <StudentAdministrationModal_Admin
                visible={modalState.add}
                onClose={() => closeModal("add")}
                onSave={handleSaveStudent}
                isEditing={false}
            />

            {/* Modal – Editar */}
            <StudentAdministrationModal_Admin
                visible={modalState.edit}
                onClose={() => closeModal("edit")}
                onSave={handleSaveStudent}
                editData={selectedStudent}
                isEditing={true}
            />
        </div>
    );
}