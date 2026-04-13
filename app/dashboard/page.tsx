import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

// Página protegida
export default async function Dashboard() {
    const session = await getServerSession()

    // Bloqueia acesso se não estiver logado
    if (!session) {
        redirect("/")
    }

    return <h1> Área protegida </h1>
}