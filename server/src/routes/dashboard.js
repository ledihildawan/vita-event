import express from "express";

import { jwtDecode } from "jwt-decode";
import { EventModel } from "../models/Event.js";

import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  let userData = null;

  if (req.headers.authorization) {
    userData = jwtDecode(req.headers.authorization);
  }

  try {
    const data = {};
    const query = {};

    if (userData?.role === "Vendor") {
      query.vendor = userData.vendor._id;

      data.totalPendingEvents = await EventModel.countDocuments({ status: "Pending" });
    }

    if (userData?.role === "Company") {
      query.company = userData.company._id;

      data.totalPendingEvents = await EventModel.countDocuments({ ...query, status: "Pending" });
      data.totalEventsTheUserHas = await EventModel.countDocuments(query);
    }

    data.totalEvents = await EventModel.countDocuments();
    data.totalApprovedEvents = await EventModel.countDocuments({ ...query, status: "Approved" });
    data.totalRejectedEvents = await EventModel.countDocuments({ ...query, status: "Rejected" });

    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

export { router as dashboardRouter };
