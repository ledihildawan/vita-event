import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    enum: ["Company", "Vendor"],
    type: String,
    required: true,
  },
  vendor: {
    ref: "Vendor",
    type: mongoose.Schema.Types.ObjectId,
  },
  company: {
    ref: "Company",
    type: mongoose.Schema.Types.ObjectId,
  },
}, {
  timestamps: true,
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel };
