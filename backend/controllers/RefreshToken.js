import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    // mengambil cookie refresh_token dari user
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.sendStatus(401);

    // mengecek apakah refreshToken terdaftar di refresh_token database
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);

    // verifikasi apakah refreshToken dari user sesuai dengan REFRESH_TOKEN_SECRET di environment
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decode) => {
      if (error) return res.sendStatus(403);
      const userId = user[0].id;
      const name = user[0].name;
      const email = user[0].email;
      const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "40s",
      });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};
