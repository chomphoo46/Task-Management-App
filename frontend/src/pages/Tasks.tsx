import { useEffect, useState } from "react";
import API from "../services/api";
import { useFormik } from "formik"; // ใช้จัดการฟอร์ม
import * as Yup from "yup"; // ใช้ validate ฟอร์ม
import { toast, Toaster } from "react-hot-toast"; // ใช้สำหรับแสดงข้อความแจ้งเตือน
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

  // ดึงข้อมูล tasks ทั้งหมดจาก backend
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err); // ถ้ามี error ให้ log ออกมา
    } finally {
      setLoading(false); // โหลดเสร็จแล้วไม่ว่าจะสำเร็จหรือ error
    }
  };

  // ดึงข้อมูลครั้งแรกตอน component โหลด
  useEffect(() => {
    fetchTasks();
  }, []);

  // ตั้งค่า Formik สำหรับสร้าง task ใหม่
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"), // กำหนดว่า title ต้องไม่ว่าง
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await API.post("/tasks", values);
        setTasks((prev) => [...prev, res.data]); // เพิ่ม task ใหม่เข้าใน state
        resetForm(); // เคลียร์ฟอร์มหลังจากเพิ่มเสร็จ
      } catch (err) {
        console.error(err);
      }
    },
  });

  // ลบ task ตาม id
  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("Invalid task id");
      return;
    }
    if (!confirm("Are you sure you want to delete this task?")) return; // ยืนยันก่อนลบ
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id)); // ลบ task ออกจาก state
      toast.success("Task deleted!"); // แจ้งเตือนลบสำเร็จ
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error("Failed to delete task!");
    }
  };

  // เริ่มแก้ไข task
  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditValues({ title: task.title, description: task.description || "" });
  };

  // บันทึกการแก้ไข task
  const handleSave = async (id: string) => {
    try {
      const res = await API.patch(`/tasks/${id}`, editValues);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? res.data : task))
      ); // แก้ไข task ใน state
      setEditingId(null); // ยกเลิกโหมดแก้ไข
      toast.success("Task updated!"); // แจ้งเตือนบันทึกสำเร็จ
    } catch (err) {
      console.error("Failed to edit task:", err);
      toast.error("Failed to update task!");
    }
  };

  // เปลี่ยนสถานะของ task (pending, in_progress, completed)
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

  // คืนสี text ตามสถานะของ task
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
    // ใช้ DashboardLayout ครอบทุกอย่าง
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* หัวข้อใหญ่ */}
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
          Task Manager
        </h1>

        {/* ฟอร์มสร้าง task */}
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 mb-12 space-y-6 border border-gray-200"
        >
          <input
            type="text"
            placeholder="Task Title"
            className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...formik.getFieldProps("title")}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-sm">{formik.errors.title}</p>
          )}

          <textarea
            placeholder="Description (optional)"
            className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            {...formik.getFieldProps("description")}
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Creating..." : "+ Add New Task"}
          </button>
        </form>

        {/* ส่วนแสดงรายการ tasks */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-400 text-center">No tasks found.</p>
        ) : (
          <ul className="space-y-8">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all border border-gray-200"
              >
                <div className="mb-6">
                  {editingId === task.id ? (
                    <div className="space-y-4">
                      {/* ฟอร์มแก้ไข */}
                      <input
                        type="text"
                        value={editValues.title}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            title: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <textarea
                        value={editValues.description}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            description: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={4}
                      />
                      {/* ปุ่ม save / cancel */}
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleSave(task.id)}
                          className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* แสดง task title / description */}
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {task.title}
                      </h2>
                      {task.description && (
                        <p className="text-gray-600 mt-2 text-base">
                          {task.description}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* สถานะและปุ่มแก้ไข/ลบ */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-semibold ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(
                          task.id,
                          e.target.value as Task["status"]
                        )
                      }
                      className="border border-gray-300 rounded-lg text-sm p-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* ปุ่มแก้ไข / ลบ */}
                  {editingId !== task.id && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(task)}
                        className="bg-yellow-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
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
        {/* กล่องแจ้งเตือนของ react-hot-toast */}
        <Toaster />
      </div>
    </DashboardLayout>
  );
}
