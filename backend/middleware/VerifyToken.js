import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader && authorizationHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  // Verifikasi token yang user input dengan ACCESS_TOKEN_SECRET
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decode) => {
    if (error) return res.sendStatus(403);
    req.email = decode.email;
    next();
  });
};
