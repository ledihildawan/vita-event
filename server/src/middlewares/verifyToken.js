import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    res.sendStatus(401);

    return;
  }

  jwt.verify(token, "secret", (err) => {
    if (err) {
      res.sendStatus(403);

      return;
    }

    next();
  });
}

export default verifyToken;
