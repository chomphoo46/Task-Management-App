import { useFormik } from "formik"; // ใช้จัดการฟอร์ม
import * as Yup from "yup"; // ใช้ validate ฟอร์ม
import API from "../services/api"; 
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ใช้สำหรับ decode JWT token หลัง login สำเร็จ
import { Mail, Lock } from "lucide-react"; 

interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export default function Login() {
  const navigate = useNavigate();

  // ใช้ useFormik เพื่อจัดการฟอร์มอย่างง่ายและปลอดภัย พร้อม validate
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"), // ตรวจรูปแบบ email
      password: Yup.string().min(6, "Min 6 chars").required("Required"), // password ต้องมีอย่างน้อย 6 ตัว
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await API.post("/auth/login", values);
        const token = res.data.token;
        const decoded = jwtDecode<DecodedToken>(token);

        // เก็บ token และข้อมูล user ลง localStorage
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({ name: decoded.name || "Guest" }) // กันกรณี name หาย
        );
        console.log(decoded);

        navigate("/dashboard");
      } catch {
        setErrors({ email: "Invalid email or password" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="h-screen w-full bg-cover bg-center flex items-center justify-center">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white/60 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md min-h-[550px] flex flex-col justify-center space-y-6"
      >
        {/* login */}
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Sign in
        </h1>
        <p className="text-center text-sm text-gray-600">
          Welcome To TaskManagement
        </p>

        {/* Email */}
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full pl-10 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...formik.getFieldProps("email")} // เชื่อม formik กับ input
          />
          <label
            htmlFor="email"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          {/*แสดง error ถ้ามี */}
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full pl-10 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...formik.getFieldProps("password")}
          />
          <label
            htmlFor="password"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* ปุ่ม Login */}
        <button
          type="submit"
          disabled={formik.isSubmitting} // กันกดรัวๆตอนกำลังส่ง form
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 font-semibold text-xl"
        >
          {formik.isSubmitting ? "Signing in..." : "Sign in"}{" "}
        </button>

        {/* ลิงก์ไป Register */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}
