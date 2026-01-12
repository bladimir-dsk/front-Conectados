import { Button, Card } from "antd";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ThemeProvider from "./context/ThemeContext";
import RouteApp from "./routes/RouteApp";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <RouteApp />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
