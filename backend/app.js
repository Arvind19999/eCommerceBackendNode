const express = require("express")
const cookieParser = require("cookie-parser")

const errorMiddleware = require("../backend/middleware/error");
const productRoutes = require("./routes/productRoute")
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes")


const app = express()
app.use(express.json())
app.use(cookieParser())

// 𝗥𝗼𝘂𝘁𝗲𝘀⁡
app.use("/api/v1",productRoutes);
app.use("/api/v1",userRoutes);
app.use("/api/v1",orderRoutes);

// ⁡⁢⁢⁢𝗘𝗿𝗿𝗼𝗿 𝗛𝗮𝗻𝗱𝗹𝗲𝗿 𝗠𝗶𝗱𝗱𝗹𝗲𝘄𝗮𝗿𝗲⁡
app.use(errorMiddleware)



module.exports = app;