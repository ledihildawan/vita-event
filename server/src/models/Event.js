import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const EventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    ref: "users",
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    enum: ["Pending", "Approved", "Rejected"],
    type: String,
    default: "Pending"
  },
  vendor: {
    ref: "Vendor",
    type: mongoose.Schema.Types.ObjectId,
  },
  company: {
    ref: "Company",
    type: mongoose.Schema.Types.ObjectId,
  },
  remarks: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  rejectedAt: {
    type: Date,
  },
  approvedAt: {
    type: Date,
  },
  isConfrimed: {
    type: Boolean,
  },
  confirmedDate: {
    type: Date,
  },
  proposedDate1: {
    type: Date,
    required: true,
  },
  proposedDate2: {
    type: Date,
    required: true,
  },
  proposedDate3: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

EventSchema.plugin(mongoosePaginate);

const EventModel = mongoose.model("Event", EventSchema);

export { EventModel };
