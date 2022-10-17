const router = require("express").Router();
const passport = require("passport");
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const propertyController = require("../controllers/property.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const SCOPES = ["profile", "email"];

//HOME
router.get("/", (req, res, next) => res.json({ ok: true }));

//AUTH
router.post("/register", authController.register);
router.get("/activate/:token", authController.activateAccount);
router.post("/login", authController.login);
router.get("/login/google", passport.authenticate("google-auth", { scope: SCOPES }));
router.get("/auth/google/callback", authController.loginGoogle);

//USER
router.get("/users/me", authMiddleware.isAuthenticated, userController.getCurrentUser);

//PROPERTIES
router.get("/property/:id", propertyController.getOneProperty);
router.get("/properties/:city", propertyController.getAllProperties);

module.exports = router;