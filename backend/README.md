# ระบบ Task Management (ฝั่ง Backend)

โปรเจกต์นี้เป็นส่วนของ **Backend** สำหรับระบบบริหารจัดการงาน (Task Management)  
พัฒนาด้วย **NestJS**, ใช้ฐานข้อมูล **PostgreSQL**, และรองรับการทำงานผ่าน **Docker**

---

## 🛠 เทคโนโลยีที่ใช้

- **NestJS** (Backend Framework)
- **PostgreSQL** (ฐานข้อมูล)
- **TypeORM** (Object Relational Mapping)
- **Docker & Docker Compose** (สำหรับการรันระบบแบบ container)
- **Jest** (สำหรับการเขียน Unit Test)

---

## 🚀 การเริ่มต้นใช้งาน

1. **Clone โปรเจกต์**

```bash
git clone https://github.com/Chomphoo46/taskmanagement-app.git
cd taskmanagement-app/backend
```

2. **สร้างไฟล์ .env**

   - Copy the .env.example file to .env.
   - Add the following environment variables in your .env file:

   ```
   DATABASE_HOST=db
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=task_management

   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Start the Database Container:**:
   - Before starting the container, ensure you set the database POSTGRES_USER and POSTGRES_PASSWORD in the [docker-compose.yml](./docker-compose.yml) file.
   - Then, run:
   ```bash
   docker compose up --build
   ```
   - จะทำการเปิด:
     - เซิร์ฟเวอร์ Backend (NestJS)
     - ฐานข้อมูล PostgreSQL
     - ระบบ Backend จะพร้อมใช้งานที่: http://localhost:3000

## 👨‍💻 ผู้พัฒนา

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/chomphoo46">
        <img src="https://avatars.githubusercontent.com/u/140147946?v=4" width="100px;" alt="chomphoo46"/>
        <br />
        <sub><b>Chomphoo Inchan</b></sub>
      </a>
      <br />
      <a title="Frontend Developer" href="https://github.com/chomphoo46">🎨</a>
    </td>
  </tr>
</table>
