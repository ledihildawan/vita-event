import mongoose from "mongoose";

const CompanySchema = mongoose.Schema({
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

const CompanyModel = mongoose.model("Company", CompanySchema);

export { CompanyModel };
