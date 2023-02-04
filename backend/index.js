import express from "express";
import db from "./config/Database.js";
import Users from "./models/UserModel.js";
import router from "./route/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

try {
  // tes koneksi ke database
  await db.authenticate();
  console.log("Database is fetching");

  // mengecek apakah tabel users sudah dibuat, jika belum maka akan auto generate
  await Users.sync();
} catch (error) {
  console.error(error);
}

// agar API bisa diakses dari luar domain
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// untuk mengambil value dari cookienya
app.use(cookieParser());
// untuk menerima request body berupa json
app.use(express.json());
app.use(router);

app.listen(5000, () => {
  console.log("Server running in port 5000");
});
