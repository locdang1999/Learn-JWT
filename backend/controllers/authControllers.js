const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const arrRefreshTokens = []; // Sau này lưu vào DB Redit

const authController = {
  // Register
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //Create new User
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });
      //Save yo DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Generate Access Token
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "60s", // Thời gian sống của 1 cái token với các đại lượng đo thời gian: s,m,h,d,y
      }
    );
  },

  //Generate Refresh Token
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: "30d", // Thời gian sống của 1 cái token với các đại lượng đo thời gian: s,m,h,d,y
      }
    );
  },

  // Login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("Wrong username!");
      }
      const validatePw = await bcrypt.compare(req.body.password, user.password);
      if (!validatePw) {
        res.status(404).json("Wrong password!");
      }
      if (user && validatePw) {
        // Đăng ký token JWT
        const accessToken = authController.generateAccessToken(user);

        // Refresh Token khi token hết hạn
        const refreshToken = authController.generateRefreshToken(user);

        arrRefreshTokens.push(refreshToken);
        //Save Token vào cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        const { password, ...others } = user._doc; //Loại bỏ pw ra khỏi user khi trả về
        res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Refresh Token
  requestRefreshToken: async (req, res) => {
    try {
      // Lấy refresh Token từ User
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json("You're not authenticated");
      }
      if (!arrRefreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh Token is not valid.");
      }
      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (err) {
          console.log(err);
        }

        arrRefreshTokens = arrRefreshTokens.filter(
          (itm) => itm !== refreshToken
        );

        // Create new access token, refresh token
        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);
        arrRefreshTokens.push(newRefreshToken);
        //Save Token vào cookie
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
      });
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Logout
  userLogout: async (req, res) => {
    arrRefreshTokens = arrRefreshTokens.filter((itm) => token !== req.cookies.refreshToken)
    res.clearCookie("refreshToken");
    res.status(200).json("Logged out successfully!");
  },
};

// Store Token
/**
 * 1. Local Storage: Dễ bị tấn công bởi XSS
 * 2. Cookies: Dễ bị tấn công bởi CSRF -> khắc phục bằng SameSite
 * 3. Redux store: để lưu AccessToken và HttpOnly Cookies -> Lưu RefeshToken
 * => Cách để khắc phục bị tấn công:
 * ===> BFF PATTERN (Backend For Fronend)
 */

module.exports = authController;
