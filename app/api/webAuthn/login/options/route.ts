import { generateAuthenticationOptions } from "@simplewebauthn/server"

const fakeDB: any = {
    users: []
}

export async function GET() {

    const user = fakeDB.users[0]

    if (!user) {
        return new Response("Usuário não registrado", { status: 404 })
    }

    const options = await generateAuthenticationOptions({
        rpID: "localhost",

        allowCredentials: user.passkeys.map(pk => ({
            id: pk.credentialID,
            type: "public-key"
        })),

        userVerification: "required"
    })

    user.currentChallenge = options.challenge

    return Response.json(options)
}