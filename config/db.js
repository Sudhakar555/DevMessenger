const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURL')




const connectionDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex:true});
        console.log("Mongo Connected Successfully!!")
    } catch (err) {
        console.log(err.message);
        process.exit(1)
    }
}

module.exports = connectionDB;