import crypto from "crypto"

// gera código de 6 dígitos
export function generateOTP() {

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    return otp
}


export function hashOTP(otp: string) {

    return crypto
        .createHash("sha256") // algoritmo hash
        .update(otp)
        .digest("hex")
}