import { verifyAuthenticationResponse } from "@simplewebauthn/server"

const fakeDB: any = {
    users: []
}

export async function POST(req: Request) {

    await connectDB()

    const body = await req.json()

    const user = await User.findOne({
        "passkeys.credentialID": body.id
    })
    if (!user) {
        return new Response("Usuário não encontrado", { status: 404 })
    }

    const passkey = user.passkeys.find(
        pk => pk.credentialID === body.id
    )

    if (!passkey) {
        return new Response("Credencial não encontrada", { status: 404 })
    }

    const verification = await verifyAuthenticationResponse({
        response: body,

        expectedChallenge: user.currentChallenge,
        expectedOrigin: "http://localhost:3000",
        expectedRPID: "localhost",

        authenticator: {
            credentialID: Buffer.from(passkey.credentialID, "base64"),
            credentialPublicKey: Buffer.from(passkey.credentialPublicKey, "base64"),
            counter: passkey.counter
        }
    })


    if (verification.verified) {

        //  atualiza corretamente
        passkey.counter = verification.authenticationInfo.newCounter
        user.currentChallenge = null

        await user.save()

        return Response.json({
            ok: true,
            user: {
                id: user.id,
                email: user.email
            }
        })
    }


    return Response.json({ ok: false })
}
