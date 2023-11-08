const middlewareController = require("../controllers/middlewareControllers");
const userController = require("../controllers/userControllers");

const router = require("express").Router();

//Get all user
router.get("/", middlewareController.verifyToken, userController.getAllUsers);
router.delete(
  "/:id",
  middlewareController.verifyTokenAndAdminAuth,
  userController.deleteUser
);

module.exports = router;
