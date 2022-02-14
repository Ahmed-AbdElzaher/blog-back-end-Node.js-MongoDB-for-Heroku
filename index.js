const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
// const multer = require('multer');
const req = require("express/lib/request");
const cors = require("cors");
var port = process.env.PORT || 5000;

dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("connected"))
  .catch(err => console.log(err));

// const storage = multer.diskStorage({
//     destination:(req,file,cb) => { // cb = callback
//         cb(null,"images")
//     },filename:(req,file,cb)=>{
//         cb(null,req.body.name);
//     }
// });

// const upload = multer({storage:storage});
// app.post("/api/upload",upload.single("file"),(req,res) => {
//     res.status(200).json("file has been uploaded")
// });

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.use("*", (req, res, next) => {
  res.status(404).end();
});

app.use((err, req, res, next) => {
  // error middleware
  res.status(422).end();
});

app.listen(process.env.PORT || 3000, () => {
  console.log("backend");
});
