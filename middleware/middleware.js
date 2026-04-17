const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authheaders = req.headers["authorization"];
  console.log(authheaders);
  const token = authheaders && authheaders.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied.Token not provided.Please login",
    });
  }
  //decode the token
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_KEY);
    console.log(decodedTokenInfo);
    req.userInfo = decodedTokenInfo;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Access denied.Token not provided.Please login",
    });
  }
};

module.exports = authMiddleware;
