import { getServerSession } from "next-auth"
import { generateRegistrationOptions } from "@simplewebauthn/server"
import { connectDB } from "../../../../lib/mongodb"
import User from "../../../../models/User"
// Simulação de banco
const fakeDB: any = {}

export async function GET() {

    await connectDB()

    const session = await getServerSession(authOptions) // Pega sessão atual

    const user = await User.findOne({ email: session?.user?.email })

    // // segurança: impede usuário não logado
    if (!session || !session.user) {
        return new Response("Não autenticado", { status: 401 })
    }

    // const user = fakeDB.users.find(u => u.email === session.user.email)

    if (!user) {
        return new Response("Usuário não encontrado", { status: 404 })
    }

    const userId = new TextEncoder().encode(user._id.toString())

    const options = await generateRegistrationOptions({
        rpName: "PBL Auth", // Nome da aplicação
        rpID: "localhost", // Domínio

        userID: userId,
        userName: user.email,

        attestationType: "none",

        authenticatorSelection: {
            authenticatorAttachment: "platform", // biometria local (FaceID, Windows Hello)
            userVerification: "required"
        }
    })

    // Salva challenge no "banco"
    user.currentChallenge = options.challenge
    await user.save()

    console.log(options)
    return Response.json(options)
}