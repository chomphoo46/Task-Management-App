import { useFormik } from "formik"; 
import * as Yup from "yup"; 
import API from "../services/api"; 
import { useNavigate } from "react-router-dom"; 
import { Mail, Lock, User } from "lucide-react"; 

export default function Register() {
  const navigate = useNavigate(); 

  // ตั้งค่า Formik เพื่อจัดการข้อมูล form สมัครสมาชิก
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters") // ชื่อต้องอย่างน้อย 2 ตัว
        .required("Required"), // ห้ามเว้นว่าง
      email: Yup.string().email("Invalid email").required("Required"), // อีเมลต้องมีรูปแบบถูกต้อง
      password: Yup.string()
        .min(6, "Password must be at least 6 characters") // รหัสผ่านอย่างน้อย 6 ตัว
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match") // ต้องตรงกับ password
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await API.post("/auth/register", {
          name: values.name,
          email: values.email,
          password: values.password,
        });
        navigate("/"); 
      } catch {
        setErrors({ email: "Email already exists" }); // ถ้า email ซ้ำ แสดง error ที่ช่อง email
      } finally {
        setSubmitting(false); 
      }
    },
  });

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white/60 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md min-h-[600px] flex flex-col justify-center space-y-6"
      >
        {/* หัวข้อ */}
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Create an account
        </h1>
        <p className="text-center text-sm text-gray-600">
          Join us to access awesome features!
        </p>

        {/* ช่องกรอก Name */}
        <div className="relative">
          <label htmlFor="name" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="name"
            type="text"
            placeholder="Name"
            className="w-full pl-10 p-3 rounded-md bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...formik.getFieldProps("name")}
          />
          {/* แสดง error ถ้ามี */}
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
          )}
        </div>

        {/* ช่องกรอก Email */}
        <div className="relative">
          <label htmlFor="email" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full pl-10 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...formik.getFieldProps("email")}
          />
          {/* แสดง error ถ้ามี */}
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* ช่องกรอกรหัสผ่าน */}
        <div className="relative">
          <label htmlFor="password" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full pl-10 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...formik.getFieldProps("password")}
          />
          {/* แสดง error ถ้ามี */}
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* ช่องกรอกยืนยันรหัสผ่าน */}
        <div className="relative">
          <label htmlFor="confirmPassword" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="w-full pl-10 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...formik.getFieldProps("confirmPassword")}
          />
          {/* แสดง error ถ้ามี */}
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        {/* ปุ่ม Register */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-blue-600 text-white text-xl p-3 rounded-lg hover:bg-blue-800 font-semibold"
        >
          {formik.isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
