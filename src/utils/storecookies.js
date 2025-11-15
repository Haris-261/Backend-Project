import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

const storeCookies = (res , payload) => {
    const token = jwt.sign(payload, process.env.JWT_Secret , {expiresIn : "1d"}) 
    res.cookie("tokken" , token , {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
        maxAge : 24 * 60 * 60 * 1000
    })
}

export default storeCookies