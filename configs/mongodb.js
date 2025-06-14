import mongoose from "mongoose";

async function connectToDataBase() {
  try {
    console.log(process.env.DB_URI);
    await mongoose.connect(process.env.DB_URI);
    console.log(`Connected To DataBase`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

export default connectToDataBase;
