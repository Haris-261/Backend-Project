import router from "express";
import { login, logout, registerUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const userRouter = router()

userRouter.post('/register-user', registerUser)
userRouter.post('/login-user', login)
userRouter.post('/logout-user', isAuthenticated , logout)
export default userRouter