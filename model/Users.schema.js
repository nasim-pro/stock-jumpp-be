import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        mobileNum: { type: String, required: false },
        email: { type: String, required: false },
        fcmToken: { type: String, required: false },
    },

    { timestamps: true }
);

export const Users = mongoose.model("Users", UsersSchema);
