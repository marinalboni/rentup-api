const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports.isAuthenticated = (req, res, next) => {
  const authorization = req.header("Authorization");

  if (authorization) {
    console.log( 'authorization original',authorization)
    const [type, token] = authorization.split(" ");
    console.log('authorization splited', authorization)

    if (type === "Bearer") {
      if (token) {
        let tokenDecode = decodeURI(token);
        console.log("token", token, "tokenDecode", tokenDecode);
        
        jwt.verify(tokenDecode, process.env.JWT_SECRET, (err, decodedToken) => {
          if (err) {
            next(err);
          } else {
            req.currentUser = decodedToken.id;
            next();
          }
        });
      } else {
        next(createError(401, "Token error"));
      }
    } else {
      next(createError(401, "Bearer error"));
    }
  } else {
    next(createError(401, "No auth"));
  }
};
