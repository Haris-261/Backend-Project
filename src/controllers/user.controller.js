import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import storeCookies from "../utils/storecookies.js";


const defaultAvatar = 'https://res.cloudinary.com/decrkgv6n/image/upload/v1764088202/default_nf4hhc.jpg'
const defaultAvatar_public_id = 'avatrs/default_nf4hhc'

const registerUser = async (req, res) => {
    const { name, email, password , username , dob , gender  } = req.body;

    if (!username ||!name || !email || !password || !dob || !gender) {
        return res.status(400).json({
            success: false,
            message: "Credentials are required"
        });
    }

    try {
        const existingemail = await User.findOne({ email });

        if (existingemail) {
            return res.status(400).json({
                success: false,
                message: "Email already taken"
            });
        }

        const existingUsername = await User.findOne({ username });
          if (existingUsername) {
          return res.status(400).json({ success: false, message: "Username already taken" });
        }
        
        let avatar = defaultAvatar;
        let avatar_public_id = defaultAvatar_public_id;

        if(req.file){
          avatar = req.file.path,
          avatar_public_id = req.file.filename
        }

        const user = await User.create({
            name,
            email,
            password,
            username,
            avatar,
            avatar_public_id,
            dob,
            gender,
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User do not registered"
            });
        }

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
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
                message: "User not found"
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

const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const formattedUser = {
      ...user._doc,
      dob: user.dob.toISOString().split("T")[0]
    };
    return res.status(200).json({ success: true, formattedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, username } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (req.body.email && req.body.email !== user.email) {
      return res.status(400).json({ success: false, message: "Email cannot be changed" });
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(400).json({ success: false, message: "Username already taken" });
      }
      user.username = username;
    }

    if (name) { user.name = name; }

    if (req.file) {
      if (user.avatar_public_id && user.avatar_public_id !== defaultAvatar_public_id) {
        try {
          await cloudinary.uploader.destroy(user.avatar_public_id)
         
        } catch (err) {}
      }
      user.avatar = req.file.path,
      user.avatar_public_id = req.file.filename 
      
    }

    await user.save();

    const updated = await User.findById(userId).select("-password -__v");
    return res.status(200).json({ success: true, message: "Profile updated", user: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export {registerUser , login , logout , getProfile , updateProfile}
