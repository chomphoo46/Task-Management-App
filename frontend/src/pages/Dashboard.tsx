// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
}

const COLORS = ["#6366f1", "#facc15", "#4ade80"];

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      setUsername(parsed?.name || "Guest");
    } catch {
      setUsername("Guest");
    }

    API.get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const summary = {
    pending: tasks.filter((t) => t.status === "pending"),
    inProgress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  const pieData = [
    { name: "In Progress", value: summary.inProgress.length },
    { name: "To-Do", value: summary.pending.length },
    { name: "Completed", value: summary.completed.length },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold">Hello, {username} 👋</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Pending",
              count: summary.pending.length,
              color: "bg-yellow-100",
              text: "text-yellow-600",
            },
            {
              label: "In Progress",
              count: summary.inProgress.length,
              color: "bg-blue-100",
              text: "text-blue-600",
            },
            {
              label: "Completed",
              count: summary.completed.length,
              color: "bg-green-100",
              text: "text-green-600",
            },
          ].map((box) => (
            <div
              className={`rounded-xl p-5 shadow-sm ${box.color}`}
              key={box.label}
            >
              <p className={`text-sm font-medium ${box.text}`}>
                {box.label} Tasks
              </p>
              <p className={`text-4xl font-bold ${box.text}`}>{box.count}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks by Status */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(summary).map(([status, list]) => (
              <div key={status}>
                <h3 className="text-xl font-semibold mb-2 capitalize">
                  {status.replace("inProgress", "In Progress")}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {list.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 shadow hover:shadow-md transition-all"
                    >
                      <h4 className="font-semibold text-gray-800">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-500">
                          {task.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h4 className="text-lg font-semibold mb-4">Task Activity</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
