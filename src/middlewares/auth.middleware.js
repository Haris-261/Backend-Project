import jwt from "jsonwebtoken"

export const isAuthenticated = (req , res , next) =>{
    const token = req.cookies?.tokken
    if(!token){
        return res.status(400).json({
            success : false,
            message : "Login Required"
        })
    }
    try{
         const decoded =  jwt.verify(token , process.env.JWT_Secret)
         req.user = decoded;
         next();
        } catch (error) {
            return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}