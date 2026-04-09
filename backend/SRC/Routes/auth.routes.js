const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth.Controller');
const adminMiddleware = require('../Middleware/adminMiddleware');
const authMiddleware = require('../Middleware/authMiddleware');

router.post("/register", authController.Register);

router.post("/login", authController.Login);
router.post("/logout", authController.Logout);
router.get("/userdetail", authMiddleware, authController.userDetail);
router.get("/allusers", adminMiddleware, authController.getallUsers)
router.patch("/update-user", authMiddleware, authController.UpdateUSer); 
router.patch("/switchrole/:id",adminMiddleware,authController.SwitchRole);

module.exports = router;