// ./model/db.js
import mongoose from "mongoose";

export default async function connectDB() {
    // Si Docker me da una URL, se usa. Si no, se usa mi local.
    const url = process.env.DB_URL || 'mongodb://localhost:27017/mercadona';

    try {
        await mongoose.connect(url);
        console.log(` Database connected to: ${url}`);
    } catch (err) {
        console.error(" Error conectando a la BD:", err.message);
        process.exit(1);
    }
    
    const dbConnection = mongoose.connection;
    
    // Listeners para ver si se cae la conexión luego
    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`);
    });
}