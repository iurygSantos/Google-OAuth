import { verifyRegistrationResponse } from "@simplewebauthn/server"
import { getServerSession } from "next-auth"

const fakeDB: any = {
    users: []
}

export async function POST(req: Request) {

    await connectDB()

    const body = await req.json()

    const session = await getServerSession()

    const user = await User.findOne({ email: session?.user?.email })

    //  garante usuário autenticado

    // if (!session?.user?.email) {
    //     return new Response("Não autenticado", { status: 401 })
    // }

    if (!user) {
        return new Response("Usuário não encontrado", { status: 404 })
    }

    //  valida resposta WebAuthn
    const verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: user.challenge,
        expectedOrigin: "http://localhost:3000",
        expectedRPID: "localhost"
    })

    if (!verification.verified || !verification.registrationInfo) {
        return Response.json({ ok: false })
    }

    const { credentialPublicKey, credentialID, counter } =
        verification.registrationInfo

    //  salva corretamente
    user.passkeys.push({
        credentialID: Buffer.from(credentialID).toString("base64"),
        credentialPublicKey: Buffer.from(credentialPublicKey).toString("base64"),
        counter,
        transports: body.response.transports || []
    })

    user.currentChallenge = null
    await user.save()

    return Response.json({ ok: true })
}
