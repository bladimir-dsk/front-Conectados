import React, { useRef, useState, useEffect } from "react";
import { App, Button, Input, Space, Table, Tag, Tooltip } from "antd";
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    DownloadOutlined,
    FileAddOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FileText } from "lucide-react";
import StudentDocumentationModal_Admin from "./modals/StudentDocumentationModal_Admin";
import { useApi } from "../../../../hooks/useApi";
import { useDeleteConfirmation } from "../../../../hooks/useDeleteConfirmation";

export default function StudentDocumentationScreen_Admin() {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const { message, modal } = App.useApp();
    const [modalState, setModalState] = useState({ add: false, edit: false });
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Consumir API
    const {
        data: documentsResponse,
        loading: loadingDocuments,
        fetchData: fetchDocuments,
        deleteData: deleteDocument,
    } = useApi("/documentacion", {}, true);

    const documentsData = documentsResponse || [];

    // Agrupar documentos por estudiante
    const groupedByStudent = documentsData.reduce((acc, doc) => {
        const email = doc.userEmail;
        if (!acc[email]) {
            acc[email] = {
                key: email,
                studentId: doc.user?.id,
                email: email,
                name: doc.user?.name || "N/A",
                code: doc.user?.code || "N/A",
                phone: doc.user?.phone || "N/A",
                documents: [],
            };
        }
        acc[email].documents.push({
            key: doc.id_documentacion,
            ...doc,
        });
        return acc;
    }, {});

    const studentsData = Object.values(groupedByStudent);

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

    const handleSaveDocument = async () => {
        await fetchDocuments();
        closeModal("add");  
        closeModal("edit");
    };

    const showDeleteConfirm = useDeleteConfirmation({
        onDelete: deleteDocument,
    });

    const handleDelete = (record) => {
        showDeleteConfirm({
            title: "¿Estás seguro de eliminar este documento?",
            itemName: record.name,
            entityName: "el documento",
            recordId: record.id_documentacion,
            successTitle: "Documento eliminado",
            onSuccess: fetchDocuments,
        });
    };

    const handleViewDocument = (documentUrl) => {
        window.open(documentUrl, "_blank");
    };

    const handleDownload = async (documentUrl, fileName) => {
        try {
            const response = await fetch(documentUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            message.error("Error al descargar el documento");
        }
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
            <SearchOutlined style={{ color: filtered ? "#0B733E" : undefined }} />
        ),
        onFilter: (value, record) => {
            const nestedValue = dataIndex.includes(".")
                ? dataIndex.split(".").reduce((obj, key) => obj?.[key], record)
                : record[dataIndex];
            return nestedValue
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase());
        },
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
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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
            case "aprobado":
                return "green";
            case "pendiente":
                return "orange";
            case "rechazado":
                return "red";
            default:
                return "default";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "aprobado":
                return "Aprobado";
            case "pendiente":
                return "Pendiente";
            case "rechazado":
                return "Rechazado";
            default:
                return status;
        }
    };

    const getDocumentTypeLabel = (type) => {
        const types = {
            ine_delantera: "INE (Delantera)",
            ine_trasera: "INE (Trasera)",
            pasaporte: "Pasaporte",
            cfe: "CFE",
        };
        return types[type] || type;
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "N/A";
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    // Columnas para documentos (tabla expandible)
    const documentColumns = [
        {
            title: "Tipo de documento",
            dataIndex: "typeDocument",
            key: "typeDocument",
            align: "center",
            render: (type) => getDocumentTypeLabel(type),
        },
        {
            title: "Nombre del archivo",
            dataIndex: "name",
            key: "name",
            align: "center",
        },
        {
            title: "Tamaño",
            dataIndex: "size",
            key: "size",
            align: "center",
            render: (size) => formatFileSize(size),
        },
        {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status) => (
                <Tag color={getStatusColor(status)} style={{ fontSize: "13px" }}>
                    {getStatusLabel(status)}
                </Tag>
            ),
        },
        {
            title: "Observación",
            dataIndex: "observation",
            key: "observation",
            align: "center",
            render: (observation) => observation || "-",
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
                            onClick={() => handleViewDocument(record.documentUrl)}
                        />
                    </Tooltip>
                    <Tooltip title="Descargar" color="cyan">
                        <Button
                            type="link"
                            icon={<DownloadOutlined />}
                            style={{ color: "#13c2c2" }}
                            onClick={() => handleDownload(record.documentUrl, record.name)}
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

    // Columnas principales (estudiantes)
    const studentColumns = [
        {
            title: "Nombre del estudiante",
            key: "studentName",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (_, record) => record.name,
        },
        {
            title: "Correo",
            dataIndex: "email",
            key: "email",
            align: "center",
            ...getColumnSearchProps("email"),
        },
        {
            title: "Teléfono",
            dataIndex: "phone",
            key: "phone",
            align: "center",
            render: (phone) => phone || "N/A",
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
            width: 100,
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
                <div className="bg-white dark:bg-[#141414] rounded-md shadow-lg p-4 md:p-6">
                    <Table
                        columns={studentColumns}
                        dataSource={studentsData}
                        loading={loadingDocuments}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} estudiantes`,
                            showSizeChanger: false,
                        }}
                        expandable={{
                            expandedRowRender: (record) => (
                                <div className="p-4 bg-lime-500/20 rounded">
                                    <Table
                                        columns={documentColumns}
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
                            emptyText: loadingDocuments
                                ? null
                                : "No hay estudiantes con documentos registrados.",
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
                editData={selectedDocument}
                isEditing={true}
            />
        </div>
    );
}