import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type AppLayoutProps = {
    children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--on-surface)]">
            <Sidebar />

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-y-4 left-4 z-50 w-[280px] lg:hidden">
                    <Sidebar />
                </div>
            )}

            <div className="min-h-screen lg:pl-[312px]">
                <div className="px-4 py-4 sm:px-6 lg:px-6">
                    <Navbar
                        onMenuClick={() => setSidebarOpen((value) => !value)}
                    />

                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}
