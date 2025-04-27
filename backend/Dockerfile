FROM node:18

WORKDIR /app

# คัดลอกเฉพาะไฟล์ package.json และ package-lock.json ก่อน
COPY package*.json ./

# ติดตั้ง dependencies ใน container (จะได้ binary ตรงกับ container architecture)
RUN npm install

# คัดลอก source code ที่เหลือ
COPY . .

# build NestJS app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
