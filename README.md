# Backend Skill Checkpoint — Express Server

REST API หลังบ้านสำหรับเว็บไซต์ถาม-ตอบสไตล์ Quora สร้างด้วย Express และ PostgreSQL
ผู้ใช้งานสามารถตั้งคำถาม ตอบคำถาม ค้นหาคำถาม และโหวตทั้งคำถามและคำตอบได้

## Tech Stack

- Node.js + Express
- PostgreSQL (ผ่าน `pg`)
- dotenv สำหรับจัดการ environment variables

## โครงสร้างโปรเจกต์

```
app.mjs                     ← จุดเริ่ม server, mount routers, error handling
routers/
  questions.router.mjs      ← CRUD คำถาม + ค้นหาคำถาม
  answers.router.mjs        ← สร้าง/ดู/ลบคำตอบของคำถาม
utils/
  db.mjs                    ← PostgreSQL connection pool
db.sql                      ← Script สร้างตาราง + seed ข้อมูลตัวอย่าง
```

## การติดตั้ง

1. ติดตั้ง dependencies

   ```bash
   npm install
   ```

2. สร้างฐานข้อมูลใน PostgreSQL แล้วรัน `db.sql` เพื่อสร้างตารางและข้อมูลตัวอย่าง
   (ใช้ psql, pgAdmin หรือ client ใดก็ได้ที่รัน SQL ได้)

3. คัดลอก `.env.example` เป็น `.env` แล้วใส่ค่าการเชื่อมต่อฐานข้อมูลของตัวเอง

   ```
   PGUSER=postgres
   PGPASSWORD=your-db-password
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=backend_checkpoint_db
   ```

4. รัน server

   ```bash
   npm start
   ```

   Server จะรันที่ `http://localhost:4000`

## API Endpoints

### Questions

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/questions` | สร้างคำถามใหม่ (ต้องมี `title`, `description`, `category`) |
| GET | `/questions` | ดูคำถามทั้งหมด |
| GET | `/questions/search?title=&category=` | ค้นหาคำถามจากหัวข้อหรือหมวดหมู่ |
| GET | `/questions/:questionId` | ดูคำถามตาม id |
| PUT | `/questions/:questionId` | แก้ไขหัวข้อ/คำอธิบาย/หมวดหมู่ของคำถาม |
| DELETE | `/questions/:questionId` | ลบคำถาม (คำตอบที่ผูกกับคำถามนี้จะถูกลบตามไปด้วย) |

### Answers

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/questions/:questionId/answers` | สร้างคำตอบให้คำถาม (`content` ไม่เกิน 300 ตัวอักษร) |
| GET | `/questions/:questionId/answers` | ดูคำตอบทั้งหมดของคำถาม |
| DELETE | `/questions/:questionId/answers` | ลบคำตอบทั้งหมดของคำถาม |
