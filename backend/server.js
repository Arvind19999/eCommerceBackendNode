const app = require("./app")
const dotenv = require("dotenv");

const connectDatabase = require("./config/database");


process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`)
    console.log("Shutting down server due to uncaught exceptions")
    process.exit(1)
})



// ⁡⁢⁢⁢𝗖𝗼𝗻𝗳𝗶𝗴 𝗰𝗼𝗻𝗳𝗶𝗴𝗿𝗮𝘁𝗶𝗼𝗻⁡
dotenv.config({path:"backend/config/config.env"});

// ⁡⁢⁢⁢𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝗼𝗻 𝘁𝗼 𝗱𝗮𝘁𝗮𝗯𝗮𝘀𝗲⁡
connectDatabase();


const server = app.listen(process.env.PORT,()=>{
    console.log(`Your server is working at http://localhost:${process.env.PORT}`)
})


// ⁡⁢⁢⁢𝗥𝗲𝘀𝗼𝗹𝘃𝗶𝗻𝗴 𝗨𝗻𝗵𝗮𝗻𝗱𝗹𝗲𝗱 𝗣𝗿𝗼𝗺𝗶𝘀𝗲 𝗥𝗲𝗷𝗲𝗰𝘁𝗶𝗼𝗻⁡
process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`)
    console.log("Shutting Down Server due to Unhandled Promise Rejection")

    server.close(()=>{
        process.exit(1);
    })
})