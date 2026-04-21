import mongoose from "mongoose"

// schema da passkey
const PasskeySchema = new mongoose.Schema({
    credentialID: String,          // ID da credencial (base64)
    credentialPublicKey: String,   // chave pública (base64)
    counter: Number,               // anti replay
    transports: [String],           // ex: ["internal"],
    otpCode: String,        // hash do código (não salva texto puro)
    otpExpiresAt: Date,     // expiração
    otpAttempts: Number     // controle de tentativas
})

// schema do usuário
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    name: String,
    image: String,

    currentChallenge: String, //  importante pra segurança

    passkeys: [PasskeySchema] //  múltiplas credenciais
})

export default mongoose.models.User ||
    mongoose.model("User", UserSchema)