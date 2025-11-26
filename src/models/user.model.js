import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true,
        trim: true
    },
    username : {
         type: String,
        required: true,
        unique: true
    },
    avatar:{
        type: String,
    },
    avatar_public_id:{
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    gender:{
         type: String,
         enum: ["male" , "female" , "other"],
        required: true,
    },
    dob:{
         type: Date,
        required: true,
    },

},
{
    timestamps : true,
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = mongoose.model("User", userSchema)

export default User