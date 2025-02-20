require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connection, client } = require("./DB/MongoDB");
const { ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
connection();

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-management-applicat-d6752.web.app",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());
//Middleware

//Custom Middleware
const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

//All Collection mealsCollection
const usersCollection = client.db("taskManagement").collection("users");
const taskCollection = client.db("taskManagement").collection("tasks");

//Create token use jwt
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ success: true });
});
app.post("/logout", async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ success: true });
});
//Create token use jwt

//Save user information
app.post("/users", async (req, res) => {
  const user = req.body;
  const existUsers = await usersCollection.findOne({ email: user.email });
  if (existUsers) {
    return res.send({ message: "User already exist" });
  }
  const result = await usersCollection.insertOne(user);
  res.send(result);
});

app.post("/tasks", async (req, res) => {
  const { title, description, status } = req.body;
  const newTask = {
    title,
    description,
    status,
    timestamp: new Date(),
  };
  const result = await taskCollection.insertOne(newTask);
  res.send(result);
});

app.get("/tasks", async (req, res) => {
  const tasks = await taskCollection.find().toArray();
  res.send(tasks);
});
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      title,
      description,
      status,
    },
  };
  const result = await taskCollection.updateOne(filter, updateDoc);
  res.send(result);
});
app.delete("/tasks/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const filter = { _id: new ObjectId(id) };
  const result = await taskCollection.deleteOne(filter);
  res.send(result);
});
app.get("/", (req, res) => {
  res.send("Hotel Management System");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
