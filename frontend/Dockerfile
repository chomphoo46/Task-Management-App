# ใช้ Node.js เวอร์ชันล่าสุด
FROM node:20

# กำหนด working directory
WORKDIR /app

# Copy ไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# Copy โค้ดทั้งหมดของ frontend เข้าไป
COPY . .

# เปิดพอร์ต 5173 (vite default)
EXPOSE 5173

# คำสั่งตอน container รัน
CMD ["npm", "run", "dev", "--", "--host"]
