import express from "express";
import { createServer } from "node:http"
import  mongoose  from "mongoose";
import cors from "cors";
import { connectToSocket } from "./Controllers/SocketManager.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js"
const app = express();
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb"}));
app.use(cookieParser());
app.set("port",process.env.port||8000);
app.use('/',userRouter);
const server = createServer(app);
const io = connectToSocket(server);
async function main() {
    await mongoose.connect("mongodb+srv://Sehez3010:3Tcy1Uh7KVF3lUUz@zoomclone.fswdm.mongodb.net/Zoom_Clone?retryWrites=true&w=majority&appName=ZoomClone")
    .then(()=>console.log("Connection Successful"))
    .catch((err)=>console.log(err));
    server.listen(app.get("port"),()=>{
        console.log(`Listening on port 8000`);
    })   
}
main();