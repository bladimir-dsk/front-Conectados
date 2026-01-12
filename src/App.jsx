import { Button, Card } from "antd";

function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">
          Vite + React + Tailwind + AntD
        </h1>

        <Button type="primary" block>
          Botón Ant Design cambios
        </Button>
      </Card>
    </div>
  );
}

export default App;
