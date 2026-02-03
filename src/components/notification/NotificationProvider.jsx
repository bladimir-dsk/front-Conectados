import React, { createContext, useContext } from "react";
import { notification } from "antd";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const notify = ({
    type = "info",
    title,
    description,
    duration = 4,
    placement = "topRight",
  }) => {
    api[type]({
      message: title,
      description,
      duration,
      placement,
    });
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification debe usarse dentro de NotificationProvider",
    );
  }
  return context;
};
