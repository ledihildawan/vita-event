import mongoose from "mongoose";

const VendorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
  },
}, {
  timestamps: true,
});

const VendorModel = mongoose.model("Vendor", VendorSchema);

export { VendorModel };
