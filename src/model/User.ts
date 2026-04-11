import mongoose, { Schema, Document } from "mongoose";

export interface IdUser extends Document {
    googleId: string;
    name: string;
    email: string;
    image?: string;
}

const UserSchema: Schema = new Schema(
    {
        googleId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String
        }
    });

export default mongoose.model<IdUser>("User", UserSchema);