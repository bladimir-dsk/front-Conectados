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
    const { message } = App.useApp();
    const [modalState, setModalState] = useState({ add: false, edit: false });
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isChangingPage, setIsChangingPage] = useState(false);

    const [filtros, setFiltros] = useState({ name: "" });

    const [paginacion, setPaginacion] = useState({
        paginaActual: 1,
        limite: 10,
        totalRegistros: 0,
        totalPaginas: 0,
    });

    const construirURL = (pagina = 1) => {
        const params = new URLSearchParams();
        params.append("page", pagina.toString());
        params.append("limit", paginacion.limite.toString());
        if (filtros.name) params.append("name", filtros.name);
        return `/documentacion/grouped?${params.toString()}`;
    };

    const [endpointPaginacion, setEndpointPaginacion] = useState(() => construirURL(1));

    const {
        data: documentsResponse,
        loading: loadingDocuments,
        fetchData: fetchDocuments,
        deleteData: deleteDocument,
    } = useApi(endpointPaginacion, {}, false);

    useEffect(() => {
        const url = construirURL(paginacion.paginaActual);
        setEndpointPaginacion(url);
    }, [filtros, paginacion.paginaActual]);

    useEffect(() => {
        if (endpointPaginacion) {
            fetchDocuments();
        }
    }, [endpointPaginacion]);

    useEffect(() => {
        if (documentsResponse?.total !== undefined) {
            setPaginacion((prev) => ({
                ...prev,
                totalRegistros: documentsResponse.total,
                totalPaginas: Math.ceil(documentsResponse.total / prev.limite),
                paginaActual: documentsResponse.page,
            }));
            setIsChangingPage(false);
        }
    }, [documentsResponse]);

    const studentsData = (documentsResponse?.data || []).map((item) => ({
        key: item.user.email,
        studentId: item.user.id,
        email: item.user.email,
        name: item.user.name,
        code: item.user.code,
        phone: item.user.phone,
        documents: item.documentos.map((doc) => ({ key: doc.id_documentacion, ...doc })),
    }));

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

    const showDeleteConfirm = useDeleteConfirmation({ onDelete: deleteDocument });

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

    const handleViewDocument = (documentUrl) => window.open(documentUrl, "_blank");

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
        } catch {
            message.error("Error al descargar el documento");
        }
    };

    const handlePageChange = (page) => {
        setIsChangingPage(true);
        setPaginacion((prev) => ({ ...prev, paginaActual: page }));
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        const value = selectedKeys[0] || "";
        setFiltros((prev) => ({ ...prev, [dataIndex]: value }));
        setPaginacion((prev) => ({ ...prev, paginaActual: 1 }));
        setSearchText(value);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText("");
        setFiltros((prev) => ({ ...prev, [dataIndex]: "" }));
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
                if (open) setTimeout(() => searchInput.current?.select(), 100);
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
        const map = { aprobado: "green", pendiente: "orange", rechazado: "red" };
        return map[status] || "default";
    };

    const getStatusLabel = (status) => {
        const map = { aprobado: "Aprobado", pendiente: "Pendiente", rechazado: "Rechazado" };
        return map[status] || status;
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
            render: (obs) => obs || "-",
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

    const studentColumns = [
        {
            title: "Nombre del estudiante",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: false,
        },
        {
            title: "Correo",
            dataIndex: "email",
            key: "email",
            align: "center",
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
                        loading={loadingDocuments || isChangingPage}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            current: paginacion.paginaActual,
                            pageSize: paginacion.limite,
                            total: paginacion.totalRegistros,
                            showTotal: (total) => `Total ${total} estudiantes`,
                            showSizeChanger: false,
                            onChange: handlePageChange,
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