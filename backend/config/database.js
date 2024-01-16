const mongoose = require("mongoose");


const connectDatabase =()=>{
    mongoose.connect(process.env.MONGODB_URI,{ 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(con=>{
        console.log(`Successfully Connected to conbase host : ${con.connection.host} `)
    })
}


module.exports = connectDatabase;