const express = require("express");
const sequelize = require("./src/config/db.config");
const { Class, Student } = require("./utils/association");
const dotenv = require("dotenv").config();
const classRoutes = require("./src/routes/class.routes");
const studentRoutes = require("./src/routes/student.routes");
const attendanceRoutes = require("./src/routes/attendance.routes");
const userRoutes = require("./src/routes/user.routes");
const errorHandler = require("./middleware/errorhandler");
const errorLogger = require("./middleware/errorLogger");
const requestLogger = require("./middleware/requestLogger");


const app = express();

app.use(express.json());

// loggers
app.use(requestLogger);
app.use(errorLogger);


app.use("/api/v1/class", classRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/auth", userRoutes)

// app.get('/',(req,res)=>{
//     res.status(200).json("hello mdf");
// })

app.use(errorHandler);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("db connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`app listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log({
      message: "failed to connect to database",
      error: error,
    });
  });
