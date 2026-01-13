const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado con exito a MongoAtlas");
    } catch (error) {
        console.log("Fallo en la conexión con la BBDD de MongoAtlas");
    }
};

module.exports = { connectDB }