import React from 'react';
import { App } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const useCancelConfirmation = ({ onCancel, onSuccess, onError } = {}) => {
    const { modal, notification } = App.useApp();

    const showCancelConfirm = ({
        title = '¿Estás seguro de cancelar esta reservación?',
        content,
        successTitle = 'Reservación cancelada',
        successDescription = 'La reservación ha sido cancelada correctamente',
        errorTitle = 'Error al cancelar',
        errorDescription,
        recordId,
    }) => {
        modal.confirm({
            title,
            icon: React.createElement(ExclamationCircleOutlined),
            content: content || 'Esta acción no se podrá deshacer.',
            okText: 'Sí, cancelar',
            cancelText: 'No, regresar',
            okButtonProps: {
                danger: true,
            },
            cancelButtonProps: {
                type: 'default',
            },
            centered: true,
            onOk: async () => {
                try {
                    if (onCancel) {
                        await onCancel(recordId);
                    }

                    notification.success({
                        message: successTitle,
                        description: successDescription,
                        placement: 'topRight',
                    });

                    if (onSuccess) {
                        onSuccess();
                    }
                } catch (error) {
                    notification.error({
                        message: errorTitle,
                        description: errorDescription || error.message || 'No se pudo cancelar la reservación',
                        placement: 'topRight',
                    });

                    if (onError) {
                        onError(error);
                    }
                }
            },
        });
    };

    return showCancelConfirm;
};