// src/pages/Tasks.tsx
import { useEffect, useState } from "react";
import API from "../services/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, Toaster } from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ title: "", description: "" });

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await API.post("/tasks", values);
        setTasks((prev) => [...prev, res.data]);
        resetForm();
      } catch (err) {
        console.error(err);
      }
    },
  });

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("Invalid task id");
      return;
    }
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Task deleted!");
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error("Failed to delete task!");
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditValues({ title: task.title, description: task.description || "" });
  };

  const handleSave = async (id: string) => {
    try {
      const res = await API.patch(`/tasks/${id}`, editValues);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? res.data : task))
      );
      setEditingId(null);
      toast.success("Task updated!");
    } catch (err) {
      console.error("Failed to edit task:", err);
      toast.error("Failed to update task!");
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "pending" | "in_progress" | "completed"
  ) => {
    try {
      const res = await API.patch(`/tasks/${id}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: res.data.status } : task
        )
      );
      toast.success("Status updated!");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status!");
    }
  };

  const getStatusColor = (status: "pending" | "in_progress" | "completed") => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "in_progress":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold text-center mb-10">Task Manager</h1>

        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded-xl p-6 mb-10 space-y-4"
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...formik.getFieldProps("title")}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-sm">{formik.errors.title}</p>
          )}

          <textarea
            placeholder="Description (optional)"
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            {...formik.getFieldProps("description")}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition-all"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Creating..." : "+ Add Task"}
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks found.</p>
        ) : (
          <ul className="space-y-6">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all flex flex-col space-y-4"
              >
                <div>
                  {editingId === task.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editValues.title}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            title: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded-md"
                      />
                      <textarea
                        value={editValues.description}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            description: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded-md"
                        rows={3}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSave(task.id)}
                          className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-4 py-1 rounded-md hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold">{task.title}</h2>
                      {task.description && (
                        <p className="text-gray-600 text-sm">
                          {task.description}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p
                    className={`text-sm font-semibold ${getStatusColor(
                      task.status
                    )}`}
                  >
                    Status:
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(
                          task.id,
                          e.target.value as Task["status"]
                        )
                      }
                      className="ml-2 border rounded-md text-xs p-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </p>

                  {editingId !== task.id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <Toaster />
      </div>
    </DashboardLayout>
  );
}
