import { connectDB } from "../../../../lib/mongodb"
import User from "../../../../models/User"
import { generateOTP, hashOTP } from "../../../../lib/otp"

export async function POST(req: Request) {

    await connectDB()

    const { email } = await req.json()

    const user = await User.findOne({ email })

    if (!user) {
        return Response.json({ ok: true })
        //  não revela se email existe
    }

    const otp = generateOTP()

    user.otpCode = hashOTP(otp)
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 min
    user.otpAttempts = 0

    await user.save()

    console.log("OTP:", otp) // depois trocar por envio real

    return Response.json({ ok: true })
}