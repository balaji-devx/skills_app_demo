require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Add student form
app.get("/addStudent", (req, res) => {
  res.render("add");
});

app.post("/addStudent", async (req, res) => {
  let skills = req.body.skills || [];
  if (!Array.isArray(skills)) skills = [skills];

  await Student.create({
    roll: req.body.roll,
    name: req.body.name,
    guardianPhone: req.body.guardianPhone || null,
    skills
  });

  res.redirect("/all");
});

// Display a single student
app.get("/displayStudent/:roll", async (req, res) => {
  const student = await Student.findOne({ roll: req.params.roll });
  res.render("list", { students: student ? [student] : [] });
});

// Update student
app.get("/updateStudent/:roll", async (req, res) => {
  const student = await Student.findOne({ roll: req.params.roll });
  res.render("update", { student });
});

app.post("/updateStudent/:roll", async (req, res) => {
  let skills = req.body.skills || [];
  if (!Array.isArray(skills)) skills = [skills];

  await Student.updateOne(
    { roll: req.params.roll },
    {
      name: req.body.name,
      guardianPhone: req.body.guardianPhone || null,
      skills
    }
  );

  res.redirect("/displayStudent/" + req.params.roll);
});

// Delete student
app.post("/deleteStudent", async (req, res) => {
  await Student.deleteOne({ roll: req.body.roll });
  res.redirect("/all");
});

// Search by skill (pattern)
app.get("/skillStudent", async (req, res) => {
  const pattern = req.query.skill || "";
  const students = await Student.find({ skills: { $regex: pattern, $options: "i" } });
  res.render("skill", { students, pattern });
});

// Display all **day scholars**
app.get("/displayAll", async (req, res) => {
  const students = await Student.find({ guardianPhone: null });
  res.render("list", { students });
});

// Display ALL students (for checking)
app.get("/all", async (req, res) => {
  const students = await Student.find({});
  res.render("list", { students });
});

app.listen(process.env.PORT, () => console.log("Running..."));
