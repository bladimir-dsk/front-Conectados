import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";

const { Content } = Layout;

export default function StudentLayout() {
    const [selectedFilterKeys, setSelectedFilterKeys] = useState([]);

    return (
        <Layout className="h-screen overflow-hidden">
            <StudentNavbar
                selectedFilterKeys={selectedFilterKeys}
                setSelectedFilterKeys={setSelectedFilterKeys}
            />

            <Content
                className="p-2 md:p-3 bg-gray-100 dark:bg-zinc-800"
                style={{
                    marginTop: "64px",
                    paddingBottom: "env(safe-area-inset-bottom)",
                    height: "calc(100vh - 64px)",
                    overflow: "auto",
                }}>
                {/* Spacer para que el último contenido no quede bajo el bottom nav en mobile */}
                <div className="lg:hidden" aria-hidden="true" />
                <Outlet />
                <div className="lg:hidden" style={{ height: "64px" }} aria-hidden="true" />
            </Content>
        </Layout>
    );
}