import express from 'express'
import dotenv from 'dotenv'
import connectDB from './src/utils/connectDB.js'
import CookieParser from 'cookie-parser'
import userRouter from './src/routes/user.route.js'
import path from 'path';

dotenv.config()
connectDB()
const app = express()


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.json())
app.use(CookieParser())
app.use('/api/v1/users', userRouter);
const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})