import { connectDB } from "../../../../lib/mongodb"
import { hashOTP } from "../../../../lib/otp"
import User from "../../../../models/User"


export async function POST(req: Request) {

    await connectDB()

    const { email, otp } = await req.json()

    const user = await User.findOne({ email })

    if (!user) {
        return Response.json({ ok: false })
    }

    if (user.otpAttempts >= 5) {
        return Response.json({ ok: false, error: "Muitas tentativas" })
    }

    if (new Date() > user.otpExpiresAt) {
        return Response.json({ ok: false, error: "Expirado" })
    }

    const hashed = hashOTP(otp)

    if (hashed !== user.otpCode) {

        user.otpAttempts += 1
        await user.save()

        return Response.json({ ok: false })
    }

    user.otpCode = null
    user.otpExpiresAt = null
    user.otpAttempts = 0

    await user.save()

    return Response.json({
        ok: true,
        user: {
            id: user._id,
            email: user.email
        }
    })
}