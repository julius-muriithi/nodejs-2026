const mongoose = require("mongoose");

const MongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connnection successful");
  } catch (error) {
    console.log(error, "Mongo connection failed");
    process.exit(1);
  }
};
module.exports = MongoConnection;
