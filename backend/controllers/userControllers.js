const User = require("../models/User");

const userController = {
  //Get all user
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (user) {
        res.status(200).json("Delete successfully");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
