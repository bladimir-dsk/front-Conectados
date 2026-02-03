import React, { useRef, useState } from "react";
import { App, Button, Input, Space, Table, Tag, Tooltip } from "antd";
import {
    PlusOutlined,
    FileTextOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    DownloadOutlined,
    FileAddOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { initialStudentsData } from "../StudentsData";
import StudentDocumentationModal_Admin from "./modals/StudentDocumentationModal_Admin";
import { FileText } from "lucide-react";
dayjs.locale("es");

export default function StudentDocumentationScreen_Admin() {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const { message, modal } = App.useApp();
    const [documentsData, setDocumentsData] = useState(
        initialStudentsData
    );
    const [modalState, setModalState] = useState({ add: false, edit: false });
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const openModal = (type, document = null, student = null) => {
        setModalState({ add: false, edit: false, [type]: true });
        setSelectedDocument(document);
        setSelectedStudent(student);
    };

    const closeModal = (type) => {
        setModalState((prev) => ({ ...prev, [type]: false }));
        setSelectedDocument(null);
        setSelectedStudent(null);
    };

    const handleSaveDocument = (values) => {
        if (modalState.edit && selectedDocument && selectedStudent) {
            // Editar documento existente
            setDocumentsData((prev) =>
                prev.map((student) => {
                    if (student.studentId === selectedStudent.studentId) {
                        return {
                            ...student,
                            documents: student.documents.map((doc) =>
                                doc.id === selectedDocument.id
                                    ? {
                                        ...doc,
                                        ...values,
                                        reviewDate: dayjs().format("YYYY-MM-DD"),
                                    }
                                    : doc
                            ),
                        };
                    }
                    return student;
                })
            );
            message.success("Documento actualizado correctamente");
            closeModal("edit");
        } else if (selectedStudent) {
            // Agregar nuevo documento
            const newDocId =
                Math.max(
                    ...documentsData.flatMap((s) => s.documents.map((d) => d.id)),
                    0
                ) + 1;

            setDocumentsData((prev) =>
                prev.map((student) => {
                    if (student.studentId === selectedStudent.studentId) {
                        return {
                            ...student,
                            documents: [
                                ...student.documents,
                                {
                                    key: `${student.studentId}-${newDocId}`,
                                    id: newDocId,
                                    studentId: student.studentId,
                                    ...values,
                                    uploadDate: dayjs().format("YYYY-MM-DD"),
                                    reviewDate: null,
                                    reviewedBy: null,
                                },
                            ],
                        };
                    }
                    return student;
                })
            );
            message.success("Documento agregado correctamente");
            closeModal("add");
        }
    };

    const handleDelete = (record, student) => {
        modal.confirm({
            title: "¿Estás seguro?",
            content: `Se eliminará el documento: ${record.documentType}`,
            okText: "Aceptar",
            okType: "danger",
            cancelText: "Cancelar",
            onOk: () => {
                setDocumentsData((prev) =>
                    prev.map((s) => {
                        if (s.studentId === student.studentId) {
                            return {
                                ...s,
                                documents: s.documents.filter((doc) => doc.id !== record.id),
                            };
                        }
                        return s;
                    })
                );
                message.success("Documento eliminado correctamente");
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
            case "Aprobado":
                return "green";
            case "Pendiente":
                return "orange";
            case "Rechazado":
                return "red";
            default:
                return "default";
        }
    };

    // Columnas para documentos (expandible)
    const documentColumns = (student) => [
        {
            title: "Tipo de documento",
            dataIndex: "documentType",
            key: "documentType",
            align: "center",
        },
        {
            title: "Nombre del archivo",
            dataIndex: "fileName",
            key: "fileName",
            align: "center",
        },
        {
            title: "Tamaño",
            dataIndex: "fileSize",
            key: "fileSize",
            align: "center",
        },
        {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status) => (
                <Tag color={getStatusColor(status)} style={{ fontSize: "13px" }}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Fecha de carga",
            dataIndex: "uploadDate",
            key: "uploadDate",
            align: "center",
            render: (date) => dayjs(date).locale("es").format("DD MMM YYYY"),
        },
        {
            title: "Revisado por",
            dataIndex: "reviewedBy",
            key: "reviewedBy",
            align: "center",
            render: (reviewer) => reviewer || "-",
        },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            width: 180,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Ver documento" color="blue">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            style={{ color: "#1890ff" }}
                            onClick={() => console.log("Ver documento:", record.fileName)}
                        />
                    </Tooltip>
                    <Tooltip title="Descargar" color="cyan">
                        <Button
                            type="link"
                            icon={<DownloadOutlined />}
                            style={{ color: "#13c2c2" }}
                            onClick={() => console.log("Descargar:", record.fileName)}
                        />
                    </Tooltip>
                    <Tooltip title="Editar" color="green">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            style={{ color: "#52c41a" }}
                            onClick={() => openModal("edit", record, student)}
                        />
                    </Tooltip>
                    <Tooltip title="Eliminar" color="red">
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record, student)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // Columnas principales (estudiantes)
    const studentColumns = [
        {
            title: "Nombre del estudiante",
            key: "studentName",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => {
                const nameA = `${a.name} ${a.paternalLastName} ${a.maternalLastName}`;
                const nameB = `${b.name} ${b.paternalLastName} ${b.maternalLastName}`;
                return nameA.localeCompare(nameB);
            },
            render: (_, record) =>
                `${record.name} ${record.paternalLastName} ${record.maternalLastName}`,
        },
        {
            title: "Correo",
            dataIndex: "email",
            key: "email",
            align: "center",
            ...getColumnSearchProps("email"),
        },
        {
            title: "# Documentos",
            dataIndex: "documents",
            key: "documentsCount",
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
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Agregar documento" color="green">
                        <Button
                            type="link"
                            icon={<FileAddOutlined />}
                            style={{ color: "#52c41a" }}
                            onClick={() => openModal("add", null, record)}
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
                <div className="flex items-center gap-3 flex-1">
                    <div className="p-2">
                        <FileText size={35} className="text-[#111214]!" />
                    </div>
                    <div className="space-y-0">
                        <h1 className="text-xl md:text-2xl font-bold text-[#111214] leading-tight">
                            Documentación de estudiantes
                        </h1>
                        <h1 className="text-gray-700 text-sm mt-0.5">
                            Gestiona los documentos de cada estudiante registrado.
                        </h1>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="p-2">
                <div className="bg-white dark:bg-[#141414] rounded-md shadow-lg p-4 md:p-6 min-h-125">
                    <Table
                        columns={studentColumns}
                        dataSource={documentsData}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} estudiantes`,
                        }}
                        expandable={{
                            expandedRowRender: (record) => (
                                <div className="p-4 bg-lime-500/20 rounded">
                                    {/* <h4 className="text-base font-semibold mb-3 dark:text-white">
                                        Documentos de {record.studentName}
                                    </h4> */}
                                    <Table
                                        columns={documentColumns(record)}
                                        dataSource={record.documents}
                                        pagination={false}
                                        size="small"
                                        locale={{
                                            emptyText: "Este estudiante no tiene documentos cargados.",
                                        }}
                                    />
                                </div>
                            ),
                            rowExpandable: (record) => record.documents?.length >= 0,
                        }}
                        locale={{
                            emptyText: "No hay estudiantes registrados.",
                        }}
                    />
                </div>
            </div>

            {/* Modal – Agregar */}
            <StudentDocumentationModal_Admin
                visible={modalState.add}
                onClose={() => closeModal("add")}
                onSave={handleSaveDocument}
                studentData={selectedStudent}
                isEditing={false}
            />

            {/* Modal – Editar */}
            <StudentDocumentationModal_Admin
                visible={modalState.edit}
                onClose={() => closeModal("edit")}
                onSave={handleSaveDocument}
                studentData={selectedStudent}
                editData={selectedDocument}
                isEditing={true}
            />
        </div>
    );
}