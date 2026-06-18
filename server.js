require("dotenv").config();
const app=require('./Source/app');
const connectDB = require("./Source/config/db");

const PORT=process.env.PORT || 5000;

const startServer= async ()=>{
    try {
        await connectDB();
        console.log("Database Connected Successfully");
        

        const server= app.listen(PORT,()=>{
            console.log(`Server Running on port ${PORT}`);
            
        });
        server.on('error',(error)=>{
            console.log(`server failed to bind to port ${PORT}:`,error.message);
            process.exit(1);
            
        })
    
    } catch (error) {
        console.error("Failed to start server",error.message);
        process.exit(1)
    }
}
startServer();