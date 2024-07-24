import { Router } from "express";
const router = Router();
import { genSalt, hash, compare } from "bcrypt";
import axios from "axios";
import User from "../models/User.js";
// import { secretKey } from "../config/config.js";
import { tokenGenerator, verifyToken } from "../helper/authToken.js";

const signup = async ({ email, username, password, source }) => {
  try {
    console.log({ email, username, password });
    const salt = await genSalt(10);
    var hashedPassword = "";
    console.log(source);
    if(!email) throw Error("please enter your email ")
    if (!password && source === "form") {
      throw Error("please enter password");
    }
    if (source === "form") {
      hashedPassword = await hash(password, salt);
    }

    //     Hashing:

    // Hashing is a one-way process that transforms plain text (like a password) into a fixed-length string of characters.
    // A good hash function ensures that it's computationally infeasible to reverse the process and obtain the original password.
    // Common hash functions include bcrypt, SHA-256, and SHA-3.
    // Salting:

    // Salting involves adding a unique, random value (salt) to each password before hashing it.
    // The salt is then stored along with the hashed password in the database.
    // This prevents attackers from using precomputed tables (rainbow tables) to crack passwords since each password has a unique salt.

    // check if username exists
    // const Userexists= await User.exists({username:username});
    // if(Userexists){
    //     return res.status(400).send('Usser already exists.');
    // }
    // check if email exists
    const userEmail = await User.exists({ email: email });
    if (userEmail) {
      throw Error("Email already exists");
    }

    const user = new User({
      email,
      username,
      password: hashedPassword,
    });
    await user.save();
    var token = tokenGenerator(user);
    return { token, user };
  } catch (e) {
    console.log(e);
    throw Error(e.message);
  }
};
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { token, user } = await signup({ username, email, password ,source:"form" });
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    }); //set token in HTTPonly cookie ,
    // this cookie can not be read by javascript (so secure)and send with every request from frontend to backend.

    res.status(201).json({
      message: "User created successfully",
      username: user.username,
      email: user.email,
      id: user._id,
    });
  } catch (error) {
    console.log("errr", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

const login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email don't exists");
    }
   if(user.password===""){
    throw Error("Try Google Login....  ")
   }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Wrong password");
    }
    const token = tokenGenerator(user);
    return { token, user };
  } catch (e) {
    throw new Error(e.message);
  }
};
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await login({email, password});
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    }); //set token in HTTPonly cookie ,
    // this cookie can not be read by javascript (so secure)and send with every request from frontend to backend.

    res.status(200).json({
      messages: "Login sucessfully",
      username: user.username,
      email: user.email,
      id: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Middleware to verify JWT token

router.get("/protected", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "This is a protected route", user: req.user });
});

router.delete("/logout", (req, res) => {
  try {
    res.cookie(
      "userToken",
      "",
      { expires: new Date(0), httpOnly: true, secure: true, sameSite: "None" }
    );

    res.status(200).send({ message: "User Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    const sendUser = users.map(({ _id, email, username }) => ({
      _id,
      email,
      username,
    }));
    res.status(200).send(sendUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to fetch user" });
  }
});
router.post("/google", async (req, res) => {
  try {
    const access_token = req.body.access_token;
    const response =await  axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );

    const { email, given_name } = response?.data;
    const userEmail = await User.findOne({ email: email });
   
    if (userEmail) {
      const token = tokenGenerator(userEmail);
      res.cookie("userToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      }); 
      console.log(userEmail);
      res.status(200).json({
        messages: "Login sucessfully",
        username: userEmail.username,
        email: userEmail.email,
        id: userEmail._id,
      });
      
    }
    else{
       const {token ,user} = await signup({ email, username:given_name, password:"" , source : "google" });
       res.cookie("userToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      }); 
      res.status(200).json({
        messages: "Login sucessfully",
        username: user.username,
        email: user.email,
        id: user._id,
      });
    }

    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message|| "unable to Login using Google" });
  }
});
export default router;
