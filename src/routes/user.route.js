import router from "express";
import { getProfile, login, logout, registerUser, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import uploadAvatar from "../middlewares/cloudinary.js";


const userRouter = router()

userRouter.post('/register-user', registerUser)
userRouter.post('/login-user', login)
userRouter.get("/ping", (req, res) => {
    res.json({msg: "Server is working"})
})
userRouter.post('/logout-user', isAuthenticated , logout)
userRouter.get('/get-profile', isAuthenticated , getProfile)
userRouter.put('/update-profile', isAuthenticated , uploadAvatar.single("avatar"), updateProfile)
export default userRouter