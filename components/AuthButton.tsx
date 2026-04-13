"use client"

import { signIn, signOut, useSession } from "next-auth/react"

// 🔹 Componente de login/logout
export default function AuthButton() {
    const { data: session } = useSession() // Pega sessão atual

    // 🔹 Se estiver logado
    if (session) {
        return (
            <div>
                <p>Logado como {session.user?.name}</p>

                <button onClick={() => signOut()}>
                    Sair
                </button>
            </div>
        )
    }

    // 🔹 Se NÃO estiver logado
    return (
        <button onClick={() => signIn("google")}>
            Login com Google
        </button>
    )
}