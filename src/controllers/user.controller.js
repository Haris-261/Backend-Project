import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import storeCookies from "../utils/storecookies.js";

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Credentials are required"
        });
    }

    try {
        const existinguser = await User.findOne({ email });

        if (existinguser) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User do not created"
            });
        }

        return res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const login = async(req , res) =>{
    const { email , password } = req.body;
    if (!email || !password){
        return res.status(400).json({
            message: "Email and Password are required"
        })
    } 
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message: "User not fount"
            })
        }
        const validpassword = await bcrypt.compare( password , user.password )
        if(!validpassword){
            return res.status(400).json({
                message:"Invalid Password"
            })
        }
        const payload = {
            userId : user._id,
            email : user.email,

        }
        storeCookies(res , payload)
         return res.status(200).json({
            success: true,
            message: "User LoggedIn Successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
const logout = async(req , res) =>{

    res.clearCookie("tokken", {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
       })

        res.json({
        success: true,
        message: "Logged out successfully"
    });
}

    

export {registerUser , login , logout}
