import mongoose, { Document, Schema } from "mongoose";
import { compareValue } from "../utils/bcrypt";

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    profilePicture: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createAt: Date;
    updatesAt: Date;
    createWorkSpace: mongoose.Types.ObjectId | null;
    comparePassword: (value: string) => Promise<boolean>;
    omitPassword (): Omit<"UserDocuments", "password">;
}

const userSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: false,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
      password: { type: String, select: true },
      profilePicture: {
        type: String,
        default: null,
      },
      createWorkSpace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
      },
      isActive: { type: Boolean, default: true },
      lastLogin: { type: Date, default: null },
    },
    {
      timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if(this.isModified("password")) {
        if(this.password){
            this.password = await hashValue(this.password);
        }
    }
    next();
})

userSchema.methods.omitPassword = function (): Omit<Document, "password"> {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

userSchema.methods.comparePassword = async function (value: string) {
    return compareValue(value, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;

function hashValue(password: string): string | PromiseLike<string> {
    throw new Error("Function not implemented.");
}
