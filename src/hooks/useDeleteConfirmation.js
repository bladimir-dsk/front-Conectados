import React from 'react';
import { App } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const useDeleteConfirmation = ({ onDelete, onSuccess, onError } = {}) => {
    const { modal, notification } = App.useApp();

    const showDeleteConfirm = ({
        title = '¿Estás seguro de eliminar este registro?',
        content,
        itemName = '',
        entityName = 'registro',
        recordId,
        successTitle = 'Registro eliminado',
        successDescription,
        errorTitle = 'Error al eliminar',
        errorDescription,
    }) => {
        modal.confirm({
            title,
            icon: React.createElement(ExclamationCircleOutlined),
            content: content || `Se eliminará ${entityName} "${itemName}" y esta acción no se podrá deshacer.`,
            okText: 'Aceptar',
            cancelText: 'Cancelar',
            cancelButtonProps: {
                type: 'default',
                danger: true,
            },
            centered: true,
            onOk: async () => {
                try {
                    if (onDelete) {
                        await onDelete(recordId);
                    }

                    notification.success({
                        title: successTitle,
                        description: successDescription || `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} "${itemName}" ha sido eliminado correctamente`,
                        placement: 'topRight',
                    });

                    if (onSuccess) {
                        onSuccess();
                    }
                } catch (error) {
                    notification.error({
                        title: errorTitle,
                        description: errorDescription || error.message || `No se pudo eliminar ${entityName}`,
                        placement: 'topRight',
                    });

                    if (onError) {
                        onError(error);
                    }
                }
            },
        });
    };

    return showDeleteConfirm;
};