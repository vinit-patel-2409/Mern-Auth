import jwt from "jsonwebtoken";
const userAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ success: false, message: "Unauthorized. Login again" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
    } else {
      return res.json({ success: false, message: "Unauthorized. Login again" });
    }
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "Unauthorized. Login again",
      error: error.message,
    });
  }
};
export default userAuth;
