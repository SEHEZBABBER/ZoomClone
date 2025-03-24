import { Router } from "express";
import { userModel } from "../models/user_model.js";
import jwt from "jsonwebtoken";
const router = Router();
export const login = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing Credentials" });
  if (!email.includes("@"))
    return res.status(401).json({ message: "enter a valid email" });
  let check_user_exists = await userModel.findOne({ email: email });
  if (!check_user_exists)
    return res.status(400).json({ message: "user is not registerd" });
  let token = jwt.sign({username:check_user_exists.username,email:email}, "asdfasdfasdfasdfgagdfx", {
    expiresIn: "30h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ message: "login successful" });
};
export const register = async (req, res) => {
  let { username, password, email } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ message: "Missing Credentials" });
  if (!email.includes("@"))
    return res.status(401).json({ message: "enter a valid email" });
  let check_user_exists = await userModel.findOne({ email: email });
  if (check_user_exists)
    return res
      .status(400)
      .json({ message: "this user already exists please login" });
  let newUser = new userModel({
    username: username,
    email: email,
    password: password,
  });
  newUser.save();
  let token = jwt.sign(
    {
      username: username,
      email: email,
    },
    "asdfasdfasdfasdfgagdfx",
    { expiresIn: "30h" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ message: "user registerd successfully" });
};
