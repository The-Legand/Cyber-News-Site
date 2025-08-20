const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const usersRouter = require("../routes/users");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users",usersRouter);

app.get("/api/users", async (req,res)=>{
    try{
        const result = await db.query(
            "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC"
        )
        const users = result[0];
        res.json(users)
    }
    catch(err){
        console.error("Error fetching users: ", err);
        res.status(500).json({error: " Internal server error"
        });
    }
})

app.get("/api/users/:id", async (req,res)=>{
    try{
        const idParam = req.params.id;
        const id = Number(idParam);
        if(!Number.isInteger(id)|| id<=0){
            return res.status(400).json({error: "Invalid user id"});
        }

        const result = await db.query(
            "SELECT id, username, email, created_at FROM users WHERE id =?",
            [id]
        );

        const user = result[0];
        if(user.length ===0){
            return res.status(404).json({error:"User not found"});
        }
        res.json(user[0]);

    }
    catch (err) {
    console.error("Error fetching user by id:", err);
    res.status(500).json({ error: "Internal server error" }); // 500 = server-side failure
  }
    });

    app.post("/api/users", async (req,res)=>{
        try{
            const username = (req.body.username ||"").trim();
            const email = (req.body.email||"").trim().toLowerCase();
            const password = req.body.password || "";

            if(!username||!email||!password){
                return res.status(400).json({error:"username, email, and passwrod are required"});
            }

            if(username.length < 3){
                return res.status(400).json({error: "username must be at least 3 characters long"});
            }

            if(!email.includes("@")){
                return res.status(400).json({error: "invalid email"});

            }
            if(password.length<6){
                return res.status(400).json({error: "password must be at least 6 chars long"})
            }

            const checkResult = await db.query(
                "SELECT id FROM users WHERE email = ?",
                [email]
            )
            const existingRows = checkResult[0];
            if(existingRows.length>0){
                return res.status(409).json({error: "Email already in use"});
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password,saltRounds);

            const insertResult = await db.query(
                "INSERT INTO users (username, email, password, created_at) VALUES (?,?,?,NOW())",
                [username,email, passwordHash]
            );

            const okPacket = insertResult[0];
            const newUserId = okPacket.insertId;

            return res.status(201).json({
                message:"User created",
                id:newUserId,
                username: username,
                email: email,
                created_at: new Date().toISOString(),
            })
        }
        catch (err) {
    console.error("Error creating user:", err);
    // 500 = server-side failure (unexpected)
    return res.status(500).json({ error: "Internal server error" });
  }
    });
    

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
console.log(`server is running on port${PORT}`);


})