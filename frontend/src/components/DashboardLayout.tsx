// src/components/DashboardLayout.tsx
import { Home, Folder, LogOut } from "lucide-react";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
  { name: "tasks", icon: <Folder size={18} />, path: "/tasks" }
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">TaskManagement</h1>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-md text-sm hover:bg-gray-100 ${
                  location.pathname === item.path
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : ""
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        {/* ด้านล่าง: Logout */}
        <div className="pt-4">
          <Link
            to="/logout"
             className="flex items-center gap-3 text-sm  text-back px-4 py-2 rounded hover:bg-gray-100 justify-center"
          >
            <LogOut size={18} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
