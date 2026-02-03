import { BrowserRouter } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider } from "./context/AuthProvider";
import ThemeProvider, { ThemeContext } from "./context/ThemeContext";
import RouteApp from "./routes/RouteApp";
import { ConfigProvider, theme, App as AntApp } from "antd";
import esES from 'antd/locale/es_ES';

function ThemeApp() {
  // Usar useContext para acceder a darkMode
  const { darkMode } = useContext(ThemeContext);

  return (
    <ConfigProvider 
      locale={esES}
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#84cc16',
          borderRadius: 6,
        },
      }}
    >
      <AntApp>
        <RouteApp />
      </AntApp>
    </ConfigProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ThemeApp />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;