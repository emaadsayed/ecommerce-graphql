import mongoose, { Document } from 'mongoose';

interface IUserModel extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    }
});

const User = mongoose.model<IUserModel>('User', UserSchema);
export default User;
