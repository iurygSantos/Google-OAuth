// importa mongoose
import mongoose from "mongoose"

// pega a URL do .env
const MONGODB_URI = process.env.MONGODB_URI!

// variável para evitar múltiplas conexões (Next.js reinicia muito)
let cached = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {

    // se já existe conexão, reutiliza
    if (cached.conn) return cached.conn

    // se não tem promessa ainda, cria
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        })
    }

    // aguarda conexão
    cached.conn = await cached.promise

    return cached.conn
}