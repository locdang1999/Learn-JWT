const jwt = require("jsonwebtoken");

const middlewareController = {
  // VerifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      //Bearer 2313
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authentication");
    }
  },

  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, ()=>{
        if(req.user.id == req.params.id || req.user.admin){
            next();
        }else{
            res.status(401).json("You're not allowed to delete other");
        }
    })
  },
};

module.exports = middlewareController;
