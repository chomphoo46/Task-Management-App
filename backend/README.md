# Task Management API (Backend)

Backend ของระบบ Task Management เขียนด้วย [Nest.js](https://nestjs.com/) ใช้ PostgreSQL เป็นฐานข้อมูล และจัดการด้วย Docker + Sequelize ORM

## 📦 Tech Stack

- [Nest.js](https://nestjs.com/)
- PostgreSQL (ผ่าน Docker)
- Sequelize (ORM)
- JWT Authentication
- Bcrypt (สำหรับ hash password)

---

## ⚙️ Project Structure


---

## 🚀 Getting Started

### 🔧 1. Clone & Install

```bash
cd taskmanagement--app/backend
npm install

🐘 2. Run PostgreSQL with Docker
docker compose up -d

🔒 3. สร้าง .env ไฟล์
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=task_management
JWT_SECRET=supersecretkey

🧑‍💻 4. Run Backend Server
npm run start:dev