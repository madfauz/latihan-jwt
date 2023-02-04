import Users from "../models/UserModel.js";
import bcyrpt from "bcrypt";
import jwt from "jsonwebtoken";

// mengambil seluruh data users di database
export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      // hanya menampilkan id, name, dan email tanpa adanya password dan refresh_token
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

// melakukan proses daftar untuk user baru
export const Register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ message: "Password tidak cocok" });
  const salt = await bcyrpt.genSalt();
  // membuat hash password dari password yang dikirim user
  const hashPassword = await bcyrpt.hash(password, salt);

  try {
    // membuat user baru untuk disimpan ke database tabel users
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({ message: "Register berhasil" });
  } catch (error) {
    console.log(error);
  }
};

// melakukan proses login dengan pengecekan email dan password
export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });

    // mengecek apakah password sesuai dengan yang tersimpan di database
    const match = await bcyrpt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ message: "Password salah" });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // memperbarui refresh token user, berdasarkan id
    await Users.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    // membuat httpOnly cookie ke user
    res.clearCookie("refreshToken");
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // mengirim access token ke user
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ message: "Email tidak ditemukan" });
  }
};

export const Logout = async (req, res) => {
  // mengambil cookie refresh_token dari user
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return res.sendStatus(204);

  // mengecek apakah refreshToken terdaftar di refresh_token database
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);

  const userId = user[0].id;
  await Users.update(
    {
      refresh_token: null,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refresh_token");
  return res.sendStatus(200);
};
