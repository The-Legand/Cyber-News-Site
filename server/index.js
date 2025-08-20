const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const forumRouter = require("./routes/forum");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users",usersRouter);
app.use("/api/auth",authRouter);
app.use("/api/forum",forumRouter);
app.use((err,req,res,next)=>{
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({error: err.message || "Internal Server Error"});
});
    

const PORT = process.env.PORT || 3001;

app.listen(PORT,()=>{
console.log(`server is running on port${PORT}`);


})