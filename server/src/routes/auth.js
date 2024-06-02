import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import mongoose from "mongoose";

import { UserModel } from '../models/User.js';
import { VendorModel } from "../models/Vendor.js";
import { CompanyModel } from "../models/Company.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const userData = {
    ...req.body,
    _id: new mongoose.Types.ObjectId(),
  };

  try {
    const user = await UserModel.findOne({ username: userData.username });

    if (user) {
      return res.json({ message: "User already exists!" });
    }

    userData.password = await bcrypt.hash(userData.password, 10);

    if (userData.role === "Vendor") {
      const vendorId = new mongoose.Types.ObjectId();

      userData.vendor = vendorId;

      const newVendor = new VendorModel({ _id: vendorId, name: userData.vendorName, user: userData._id });

      await newVendor.save();
    }

    if (userData.role === "Company") {
      const companyId = new mongoose.Types.ObjectId();

      userData.company = companyId;

      const newCompany = new CompanyModel({ _id: companyId, name: userData.companyName, user: userData._id });

      await newCompany.save();
    }

    const newUser = new UserModel(userData);

    await newUser.save();

    res.json(req.body);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    let user = await UserModel
      .findOne({ username: req.body.username })
      .populate('vendor', ["_id", "name"])
      .populate('company', ["_id", "name"])
      .select([
        "-__v",
        "-createdAt",
        "-updatedAt",
      ]);

    if (!user) {
      res.json({ message: "User doesn't exists!" });

      return;
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      res.json({ message: "User or password is incorrect!" });

      return;
    }

    const { password, ...userData } = user.toObject();

    const token = jwt.sign(userData, "secret");

    res.send({
      ...userData,
      token
    });
  } catch (error) {
    res.status(500).send(error);
  }
})

export { router as authRouter };
