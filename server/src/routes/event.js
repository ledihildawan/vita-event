import express from "express";

import { EventModel } from "../models/Event.js";

import { jwtDecode } from "jwt-decode";

import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.use(verifyToken)

router.get("/", async (req, res) => {
  try {
    let userData = null;

    if (req.headers.authorization) {
      userData = jwtDecode(req.headers.authorization);
    }

    const query = {};

    if (req.query.term) {
      query.name = { $regex: req.query.term, $options: 'i' };
    }

    if (req.query.status) {
      query.status = req.query.status;

      if (req.query.status !== 'Pending' && userData?.role === "Vendor") {
        query.vendor = userData.vendor._id;
      }
    }

    if (userData?.role === "Company") {
      query.company = userData.company._id;
    }

    const data = await EventModel.paginate(query, {
      page: req.query.page,
      sort: {
        createdAt: -1,
      },
      limit: req.query.limit,
      populate: [
        {
          path: "vendor",
          model: "Vendor",
          select: ["_id", "name"],
        },
        {
          path: "company",
          model: "Company",
          select: ["_id", "name"],
        },
      ],
    });

    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    let userData = null;

    if (req.headers.authorization) {
      userData = jwtDecode(req.headers.authorization);
    }

    const data = await EventModel.findOne({ _id: req.params.id }).populate(["vendor", "company"]);

    if (!data) {
      res.send(404);

      return;
    }

    if (userData?.company?._id !== data.company?._id && userData?.role === "Company") {
      res.send(403);

      return;
    }

    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.put("/:id/approve", async (req, res) => {
  try {
    let userData = null;

    if (req.headers.authorization) {
      userData = jwtDecode(req.headers.authorization);
    }

    if (userData.role !== "Vendor") {
      res.send(403);

      return;
    }

    const data = await EventModel.findOneAndUpdate({ _id: req.params.id }, {
      status: "Approved",
      vendor: req.body.vendor,
      approvedAt: new Date(),
      isConfrimed: true,
      confirmedDate: req.body.confirmedDate,
    }, { new: true });

    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id/reject", async (req, res) => {
  try {
    let userData = null;

    if (req.headers.authorization) {
      userData = jwtDecode(req.headers.authorization);
    }

    if (userData.role !== "Vendor") {
      res.send(403);

      return;
    }

    const data = await EventModel.findOneAndUpdate({ _id: req.params.id }, {
      status: "Rejected",
      vendor: req.body.vendor,
      remarks: req.body.remarks,
      rejectedAt: new Date(),
    }, { new: true });

    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    let userData = null;

    if (req.headers.authorization) {
      userData = jwtDecode(req.headers.authorization);
    }

    if (userData?.role === "Vendor") {
      res.send(403);

      return;
    }

    const newEvent = new EventModel({ ...req.body });

    await newEvent.save();

    res.send(newEvent);
  } catch (error) {
    res.status(500).send(error);
  }
});

export { router as eventRouter };
